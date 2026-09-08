import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INB-GRN", "title": "GRN / Receipt", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "GRN / Receipt workflow with server-authoritative scope, state, version, approval and audit."};

export default function INB_GRN() {
  return <ModulePage screen={screen} />;
}
