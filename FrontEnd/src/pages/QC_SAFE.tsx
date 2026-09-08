import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "QC-SAFE", "title": "Safety / Deviations", "area": "Manufacturing / Quality", "batch": "B08-B12", "description": "Safety / Deviations workflow with server-authoritative scope, state, version, approval and audit."};

export default function QC_SAFE() {
  return <ModulePage screen={screen} />;
}
