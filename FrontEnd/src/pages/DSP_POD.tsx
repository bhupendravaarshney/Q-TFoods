import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "DSP-POD", "title": "Delivery / POD", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Delivery / POD workflow with server-authoritative scope, state, version, approval and audit."};

export default function DSP_POD() {
  return <ModulePage screen={screen} />;
}
