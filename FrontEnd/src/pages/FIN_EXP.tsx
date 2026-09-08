import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-EXP", "title": "Expenses", "area": "Finance / Support", "batch": "B18-B21", "description": "Expenses workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_EXP() {
  return <ModulePage screen={screen} />;
}
