import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "PUR-RFQ", "title": "RFQ & Comparison", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "RFQ & Comparison workflow with server-authoritative scope, state, version, approval and audit."};

export default function PUR_RFQ() {
  return <ModulePage screen={screen} />;
}
