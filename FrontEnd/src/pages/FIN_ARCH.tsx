import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-ARCH", "title": "Bill archive", "area": "Finance Supplement", "batch": "Supplement", "description": "Bill Archive workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_ARCH() {
  return <ModulePage screen={screen} />;
}
