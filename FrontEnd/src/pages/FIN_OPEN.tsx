import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-OPEN", "title": "Opening reconciliation", "area": "Finance Supplement", "batch": "Supplement", "description": "Opening Reconciliation workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_OPEN() {
  return <ModulePage screen={screen} />;
}
