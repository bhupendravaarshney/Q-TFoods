import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-ADJ", "title": "Finance adjustments", "area": "Finance Supplement", "batch": "Supplement", "description": "Finance Adjustments workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_ADJ() {
  return <ModulePage screen={screen} />;
}
