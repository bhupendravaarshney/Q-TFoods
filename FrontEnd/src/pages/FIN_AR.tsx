import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-AR", "title": "Receivables", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Receivables workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_AR() {
  return <ModulePage screen={screen} />;
}
