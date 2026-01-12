// Layout Planner for Beam & Vault Slab Systems
// Calculates optimal distribution of joists (viguetas) and vaults (bovedillas)

// Standard joist lengths available (in meters)
const STANDARD_LENGTHS = [3, 4, 5, 6];

// Standard spacing between joists (center to center) in meters
const JOIST_SPACING = 0.75; // 75cm typical

// Vault dimensions (standard bovedilla)
const VAULT_WIDTH = 0.60; // 60cm between joists
const VAULT_LENGTH = 0.25; // 25cm along joist direction

export interface LayoutResult {
  orientation: 'horizontal' | 'vertical';
  joistCount: number;
  joistLength: number;
  selectedBeamLength: number;
  joists: JoistInfo[];
  vaultsPerBay: number;
  totalVaults: number;
  waste: number;
  wastePercentage: number;
  recommendations: string[];
}

export interface JoistInfo {
  x: number;
  y: number;
  length: number;
  cutLength: number;
  isEdge: boolean;
}

interface OrientationAnalysis {
  joistCount: number;
  joistLength: number;
  selectedBeamLength: number;
  waste: number;
  wastePercentage: number;
}

function analyzeOrientation(joistDirection: number, perpendicular: number): OrientationAnalysis {
  // Joists run along joistDirection, spaced along perpendicular
  const joistCount = Math.ceil(perpendicular / JOIST_SPACING) + 1;
  const joistLength = joistDirection;
  
  // Find best fitting standard length
  const selectedBeamLength = STANDARD_LENGTHS.find(len => len >= joistLength) || 
    STANDARD_LENGTHS[STANDARD_LENGTHS.length - 1];
  
  // Calculate waste per joist
  const wastePerJoist = Math.max(0, selectedBeamLength - joistLength);
  const totalWaste = wastePerJoist * joistCount;
  const totalMaterial = selectedBeamLength * joistCount;
  const wastePercentage = totalMaterial > 0 ? (totalWaste / totalMaterial) * 100 : 0;
  
  return {
    joistCount,
    joistLength,
    selectedBeamLength,
    waste: totalWaste,
    wastePercentage
  };
}

export function calculateLayout(length: number, width: number): LayoutResult {
  // Analyze both orientations
  const horizontalAnalysis = analyzeOrientation(length, width); // Joists run along length
  const verticalAnalysis = analyzeOrientation(width, length); // Joists run along width
  
  // Choose orientation with less waste
  const useHorizontal = horizontalAnalysis.wastePercentage <= verticalAnalysis.wastePercentage;
  const analysis = useHorizontal ? horizontalAnalysis : verticalAnalysis;
  const orientation = useHorizontal ? 'horizontal' : 'vertical';
  
  // Generate joist positions
  const perpendicular = useHorizontal ? width : length;
  const joists: JoistInfo[] = [];
  
  for (let i = 0; i < analysis.joistCount; i++) {
    const position = i * JOIST_SPACING;
    joists.push({
      x: useHorizontal ? 0 : position,
      y: useHorizontal ? position : 0,
      length: analysis.joistLength,
      cutLength: analysis.selectedBeamLength - analysis.joistLength,
      isEdge: i === 0 || i === analysis.joistCount - 1
    });
  }
  
  // Calculate vaults
  const baysCount = analysis.joistCount - 1;
  const joistDirectionLength = analysis.joistLength;
  const vaultsPerBay = Math.floor(joistDirectionLength / VAULT_LENGTH);
  const totalVaults = baysCount * vaultsPerBay;
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (analysis.wastePercentage > 15) {
    recommendations.push(`Considere ajustar dimensiones para reducir desperdicio (${analysis.wastePercentage.toFixed(1)}%)`);
  }
  
  if (analysis.joistLength > 6) {
    recommendations.push("Para claros mayores a 6m, considere apoyos intermedios o viguetas pretensadas especiales");
  }
  
  if (analysis.joistLength < 3) {
    recommendations.push("Claro muy corto. Verifique si conviene usar panel estructural en lugar de vigueta/bovedilla");
  }
  
  const alternativeAnalysis = useHorizontal ? verticalAnalysis : horizontalAnalysis;
  if (Math.abs(analysis.wastePercentage - alternativeAnalysis.wastePercentage) < 2) {
    recommendations.push("Ambas orientaciones son similares en eficiencia");
  }
  
  return {
    orientation,
    joistCount: analysis.joistCount,
    joistLength: analysis.joistLength,
    selectedBeamLength: analysis.selectedBeamLength,
    joists,
    vaultsPerBay,
    totalVaults,
    waste: analysis.waste,
    wastePercentage: analysis.wastePercentage,
    recommendations
  };
}
