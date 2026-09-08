import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "RET-CASE", "title": "Returns & Claims", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Returns & Claims workflow with server-authoritative scope, state, version, approval and audit."};

export default function RET_CASE() {
  return <ModulePage screen={screen} />;
}
