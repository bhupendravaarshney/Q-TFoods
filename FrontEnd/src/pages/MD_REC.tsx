import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "MD-REC", "title": "Recipes / BOM", "area": "Manufacturing / Quality", "batch": "B08-B12", "description": "Recipes / BOM workflow with server-authoritative scope, state, version, approval and audit."};

export default function MD_REC() {
  return <ModulePage screen={screen} />;
}
