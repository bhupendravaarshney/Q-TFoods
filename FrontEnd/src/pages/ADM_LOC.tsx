import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-LOC", "title": "Locations & Hierarchy", "area": "Foundation / Admin", "batch": "B04", "description": "Locations & Hierarchy workflow with server-authoritative scope, state, version, approval and audit."};

export default function ADM_LOC() {
  return <ModulePage screen={screen} />;
}
