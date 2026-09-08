import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "PRO-LOSS", "title": "Yield / Loss / Rework", "area": "Manufacturing / Quality", "batch": "B08-B12", "description": "Yield / Loss / Rework workflow with server-authoritative scope, state, version, approval and audit."};

export default function PRO_LOSS() {
  return <ModulePage screen={screen} />;
}
