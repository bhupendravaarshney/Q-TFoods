import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "FIN-SIM", "title": "Simulation workspace", "area": "Finance Supplement", "batch": "Supplement", "description": "Completely isolated training/simulation data with zero live posting."};

export default function FIN_SIM() {
  return <ModulePage screen={screen} />;
}
