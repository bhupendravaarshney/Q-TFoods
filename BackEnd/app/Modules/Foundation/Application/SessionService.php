<?php

namespace App\Modules\Foundation\Application;

use App\Modules\Foundation\Domain\User;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class SessionService
{
    public function payload(User $user, Request $request): array
    {
        $contexts = $this->contexts($user);
        $selectedContext = $this->selectedContext($request, $contexts);
        $access = $this->access($user, $selectedContext);

        return [
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'roles' => $access['roles'],
            'allowed_screens' => $access['screens'],
            'allowed_actions' => $access['actions'],
            'contexts' => $contexts->values()->all(),
            'selected_context' => $selectedContext,
        ];
    }

    public function selectContext(User $user, Request $request, string $companyId, ?string $plantId): array
    {
        $context = $this->contexts($user)->first(
            fn (array $candidate) => $candidate['company_id'] === $companyId
                && $candidate['plant_id'] === $plantId
        );

        if (! $context) {
            throw ValidationException::withMessages([
                'context' => ['You are not authorised for the selected company and plant.'],
            ]);
        }

        $request->session()->put([
            'erp.company_id' => $companyId,
            'erp.plant_id' => $plantId,
        ]);

        return $this->payload($user, $request);
    }

    public function hasSelectedContext(User $user, Request $request): bool
    {
        return $this->currentContext($user, $request) !== null;
    }

    public function currentContext(User $user, Request $request): ?array
    {
        return $this->selectedContext($request, $this->contexts($user));
    }

    public function canViewScreen(User $user, Request $request, string $screenCode): bool
    {
        $context = $this->selectedContext($request, $this->contexts($user));

        return $context !== null
            && in_array($screenCode, $this->access($user, $context)['screens'], true);
    }

    public function can(User $user, Request $request, string $permission): bool
    {
        $context = $this->currentContext($user, $request);

        return $context !== null
            && in_array($permission, $this->access($user, $context)['permissions'], true);
    }

    private function contexts(User $user): Collection
    {
        return $this->activeAssignments($user)
            ->join('companies as c', 'c.id', '=', 'ra.company_id')
            ->leftJoin('plants as p', 'p.id', '=', 'ra.plant_id')
            ->where('c.status', 'ACTIVE')
            ->where(fn (Builder $q) => $q->whereNull('p.id')->orWhere('p.status', 'ACTIVE'))
            ->select([
                'c.id as company_id',
                'c.display_name as company_name',
                'p.id as plant_id',
                'p.name as plant_name',
            ])
            ->distinct()
            ->get()
            ->map(fn ($row) => [
                'company_id' => (string) $row->company_id,
                'company_name' => $row->company_name,
                'plant_id' => $row->plant_id !== null ? (string) $row->plant_id : null,
                'plant_name' => $row->plant_name,
            ]);
    }

    private function selectedContext(Request $request, Collection $contexts): ?array
    {
        $companyId = $request->session()->get('erp.company_id');
        $plantId = $request->session()->get('erp.plant_id');

        if (! is_string($companyId)) {
            return null;
        }

        $context = $contexts->first(
            fn (array $candidate) => $candidate['company_id'] === $companyId
                && $candidate['plant_id'] === $plantId
        );

        if (! $context) {
            $request->session()->forget(['erp.company_id', 'erp.plant_id']);
        }

        return $context ?: null;
    }

    private function access(User $user, ?array $context): array
    {
        $query = $this->activeAssignments($user)
            ->join('roles as r', 'r.id', '=', 'ra.role_id')
            ->join('role_permissions as rp', 'rp.role_id', '=', 'r.id')
            ->join('permissions as p', 'p.id', '=', 'rp.permission_id');

        if ($context) {
            $query
                ->where(fn (Builder $q) => $q
                    ->whereNull('ra.company_id')
                    ->orWhere('ra.company_id', $context['company_id']))
                ->where(fn (Builder $q) => $q
                    ->whereNull('ra.plant_id')
                    ->orWhere('ra.plant_id', $context['plant_id']));
        }

        $rows = $query->select(['r.code as role_code', 'p.code as permission_code'])->distinct()->get();

        $permissions = $rows->pluck('permission_code')->unique()->sort()->values();

        $screens = $permissions
            ->filter(fn (string $permission) => str_starts_with($permission, 'SCREEN:') && str_ends_with($permission, ':VIEW'))
            ->map(fn (string $permission) => substr($permission, 7, -5))
            ->unique()
            ->sort()
            ->values()
            ->all();

        $actions = $permissions
            ->filter(fn (string $permission) => str_starts_with($permission, 'ACTION:'))
            ->values()
            ->all();

        return [
            'roles' => $rows->pluck('role_code')->unique()->sort()->values()->all(),
            'screens' => $screens,
            'actions' => $actions,
            'permissions' => $permissions->all(),
        ];
    }

    private function activeAssignments(User $user): Builder
    {
        return DB::table('role_assignments as ra')
            ->where('ra.user_id', $user->id)
            ->where('ra.is_active', true)
            ->where(fn (Builder $q) => $q->whereNull('ra.effective_from')->orWhere('ra.effective_from', '<=', now()))
            ->where(fn (Builder $q) => $q->whereNull('ra.effective_to')->orWhere('ra.effective_to', '>', now()));
    }
}
