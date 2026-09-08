import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-GL", "title": "Ledger & Period Close", "area": "Finance / Support", "batch": "B18-B21", "description": "Ledger & Period Close workflow with server-authoritative scope, state, version, approval and audit."};

export default function FIN_GL() {
  return <ModulePage screen={screen} />;
}
