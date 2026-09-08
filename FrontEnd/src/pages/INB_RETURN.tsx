import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INB-RETURN", "title": "Supplier Returns", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Supplier Returns workflow with server-authoritative scope, state, version, approval and audit."};

export default function INB_RETURN() {
  return <ModulePage screen={screen} />;
}
