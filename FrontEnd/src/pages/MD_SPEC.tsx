import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "MD-SPEC", "title": "Quality Standards", "area": "Manufacturing / Quality", "batch": "B08-B12", "description": "Quality Standards workflow with server-authoritative scope, state, version, approval and audit."};

export default function MD_SPEC() {
  return <ModulePage screen={screen} />;
}
