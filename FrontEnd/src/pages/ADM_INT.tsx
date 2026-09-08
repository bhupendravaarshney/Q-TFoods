import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-INT", "title": "Integrations", "area": "Foundation / Admin", "batch": "B04", "description": "Integration endpoints, outbox events, acknowledgements, retries and quarantine."};

export default function ADM_INT() {
  return <ModulePage screen={screen} />;
}
