<?php

namespace App\Modules\Foundation\Http\Controllers;

use App\Modules\Foundation\Application\DeviceSessionService;
use App\Modules\Foundation\Application\MfaService;
use App\Modules\Foundation\Application\SessionService;
use App\Modules\Foundation\Domain\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class AuthController
{
    public function __construct(
        private readonly SessionService $sessions,
        private readonly DeviceSessionService $deviceSessions,
        private readonly MfaService $mfa,
    ) {}

    public function csrf(Request $request): JsonResponse
    {
        $request->session()->regenerateToken();

        return response()->json(['data' => ['csrf_token' => csrf_token()]]);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = mb_strtolower(trim($credentials['email']));
        $user = User::query()->where('email', $email)->where('status', 'ACTIVE')->first();
        if (! $user || ! Hash::check($credentials['password'], $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['The supplied credentials are invalid.'],
            ]);
        }

        if ($user->email_verified_at === null) {
            return response()->json(['error' => [
                'code' => 'EMAIL_VERIFICATION_REQUIRED',
                'message' => 'Verify this email address before signing in.',
            ]], 403);
        }

        if ($user->mfa_enabled_at !== null) {
            Auth::logout();
            $challengeId = (string) Str::uuid();
            $expiresAt = now()->addMinutes(max(1, (int) config('qtfoods.identity.mfa_challenge_minutes', 5)));
            $request->session()->put('identity.mfa_challenge', [
                'id' => $challengeId,
                'user_id' => (string) $user->id,
                'expires_at' => $expiresAt->timestamp,
                'attempts' => 0,
            ]);

            return response()->json(['data' => [
                'mfa_required' => true,
                'challenge_id' => $challengeId,
                'expires_at' => $expiresAt->toISOString(),
            ]], 202);
        }

        return $this->completeLogin($user, $request);
    }

    public function mfaChallenge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challenge_id' => ['required', 'uuid'],
            'code' => ['required', 'string', 'max:32'],
        ]);
        $challenge = $request->session()->get('identity.mfa_challenge');
        if (! is_array($challenge)
            || ($challenge['id'] ?? null) !== $validated['challenge_id']
            || ! is_int($challenge['expires_at'] ?? null)
            || $challenge['expires_at'] < now()->timestamp
            || (int) ($challenge['attempts'] ?? 0) >= 5) {
            $request->session()->forget('identity.mfa_challenge');
            throw ValidationException::withMessages([
                'code' => ['The MFA challenge is invalid or expired. Sign in again.'],
            ]);
        }

        $user = User::query()
            ->where('id', $challenge['user_id'] ?? null)
            ->where('status', 'ACTIVE')
            ->whereNotNull('email_verified_at')
            ->whereNotNull('mfa_enabled_at')
            ->first();
        $method = $user ? $this->mfa->verifyLoginCode($user, $validated['code']) : null;
        if (! $user || ! $method) {
            $attempts = (int) ($challenge['attempts'] ?? 0) + 1;
            if ($attempts >= 5) {
                $request->session()->forget('identity.mfa_challenge');
            } else {
                $challenge['attempts'] = $attempts;
                $request->session()->put('identity.mfa_challenge', $challenge);
            }
            throw ValidationException::withMessages([
                'code' => ['Enter a valid authenticator or unused recovery code.'],
            ]);
        }

        $request->session()->forget('identity.mfa_challenge');

        return $this->completeLogin($user, $request, $method);
    }

    private function completeLogin(User $user, Request $request, ?string $mfaMethod = null): JsonResponse
    {
        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->forget(['erp.company_id', 'erp.plant_id']);
        $deviceId = $this->deviceSessions->start($user, $request);
        DB::table('users')->where('id', $user->id)->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'updated_at' => now(),
        ]);
        $user->refresh();

        $payload = $this->sessions->payload($user, $request);
        $payload['authentication'] = [
            'device_session_id' => $deviceId,
            'mfa_method' => $mfaMethod,
        ];

        return response()->json(['data' => $payload]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json(['data' => $this->sessions->payload($user, $request)]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->deviceSessions->revokeCurrent($user, $request);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['data' => ['logged_out' => true]]);
    }
}
