import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-LEGACY", "title": "Historical import centre", "area": "Finance Supplement", "batch": "Supplement", "description": "Staged historical bill import with mapping, validation and reconciliation."};

export default function FIN_LEGACY() {
  return <ModulePage screen={screen} />;
}
