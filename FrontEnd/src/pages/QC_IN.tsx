import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "QC-IN", "title": "Incoming QC", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Incoming QC workflow with server-authoritative scope, state, version, approval and audit."};

export default function QC_IN() {
  return <ModulePage screen={screen} />;
}
