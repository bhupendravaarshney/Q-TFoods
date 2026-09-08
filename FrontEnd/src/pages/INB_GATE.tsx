import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INB-GATE", "title": "Gate Entry", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Gate Entry workflow with server-authoritative scope, state, version, approval and audit."};

export default function INB_GATE() {
  return <ModulePage screen={screen} />;
}
