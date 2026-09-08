import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "PUR-REQ", "title": "Purchase Requisitions", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Purchase Requisitions workflow with server-authoritative scope, state, version, approval and audit."};

export default function PUR_REQ() {
  return <ModulePage screen={screen} />;
}
