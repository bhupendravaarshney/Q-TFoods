import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INV-COUNT", "title": "Stock Counts", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Stock Counts workflow with server-authoritative scope, state, version, approval and audit."};

export default function INV_COUNT() {
  return <ModulePage screen={screen} />;
}
