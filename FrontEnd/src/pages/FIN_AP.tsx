import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-AP", "title": "Payables", "area": "Finance / Support", "batch": "B18-B21", "description": "Payables workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_AP() {
  return <ModulePage screen={screen} />;
}
