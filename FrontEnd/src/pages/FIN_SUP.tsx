import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-SUP", "title": "Audit/support", "area": "Finance Supplement", "batch": "Supplement", "description": "Finance Audit / Support workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_SUP() {
  return <ModulePage screen={screen} />;
}
