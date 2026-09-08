import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "PUR-PO", "title": "Purchase Orders", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Purchase Orders workflow with server-authoritative scope, state, version, approval and audit."};

export default function PUR_PO() {
  return <ModulePage screen={screen} />;
}
