import { stopE2EStack } from './support/compose';

export default function globalTeardown(): void {
  stopE2EStack();
}
