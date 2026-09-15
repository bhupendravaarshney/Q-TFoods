import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectName = 'qtfoods-erp-e2e';
const composeFile = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../BackEnd/docker-compose.e2e.yml'
);

function compose(args: string[], capture = false): string {
  return execFileSync(
    'docker',
    ['compose', '--project-name', projectName, '--file', composeFile, ...args],
    {
      encoding: 'utf8',
      stdio: capture ? 'pipe' : 'inherit',
    }
  ) ?? '';
}

export function stopE2EStack(): void {
  compose(['down', '--volumes', '--remove-orphans']);
}

export async function startE2EStack(): Promise<void> {
  stopE2EStack();

  try {
    compose(['up', '--detach', '--build', '--force-recreate', '--remove-orphans']);
    await waitForHealth();
  } catch (error) {
    try {
      process.stderr.write('\nE2E Compose service state:\n');
      process.stderr.write(compose(['ps', '--all'], true));
      process.stderr.write('\nE2E Compose service logs:\n');
      process.stderr.write(compose(['logs', '--no-color'], true));
    } finally {
      stopE2EStack();
    }
    throw error;
  }
}

async function waitForHealth(): Promise<void> {
  const deadline = Date.now() + 180_000;
  let lastError = 'service did not respond';

  while (Date.now() < deadline) {
    try {
      const response = await fetch('http://127.0.0.1:18000/api/health');
      if (response.ok) {
        const body = await response.json() as { status?: string };
        if (body.status === 'ok') return;
      }
      lastError = 'HTTP ' + response.status;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 1_000));
  }

  throw new Error('E2E backend did not become healthy: ' + lastError);
}
