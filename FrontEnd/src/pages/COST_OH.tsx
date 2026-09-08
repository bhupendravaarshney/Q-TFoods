import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "COST-OH", "title": "Overheads", "area": "Finance / Support", "batch": "B18-B21", "description": "Overheads workflow with server-authoritative scope, state, version, approval and audit."};

export default function COST_OH() {
  return <ModulePage screen={screen} />;
}
