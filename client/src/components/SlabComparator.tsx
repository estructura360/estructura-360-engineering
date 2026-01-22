import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingDown, DollarSign, Droplets, Box, Layers, ArrowRight, CheckCircle2, Package } from "lucide-react";

interface MaterialInputs {
  sandPriceM3: number;
  gravelPriceM3: number;
  cementPriceBag: number;
  slabLength: number;
  slabWidth: number;
  compressionLayer: number;
}

interface SlabResults {
  traditional: {
    volumeM3: number;
    cement: { bags: number; cost: number };
    sand: { m3: number; buckets: number; cost: number };
    gravel: { m3: number; buckets: number; cost: number };
    water: { m3: number; buckets: number };
    totalCost: number;
  };
  viguetaBovedilla: {
    volumeM3: number;
    cement: { bags: number; cost: number };
    sand: { m3: number; buckets: number; cost: number };
    gravel: { m3: number; buckets: number; cost: number };
    water: { m3: number; buckets: number };
    totalCost: number;
    bovedillaCount: number;
    viguetaCount: number;
  };
  savings: {
    concreteM3: number;
    concretePct: number;
    costSaved: number;
    costPct: number;
  };
}

const MATERIAL_COEFFICIENTS = {
  cement: 8.16,
  sand: 0.55,
  gravel: 0.65,
  water: 0.24,
  bucketsPerM3: 52.63,
};

const BOVEDILLA = {
  length: 1.22,
  width: 0.63,
  axisDistance: 0.70,
  height: 0.12,
};

const TRADITIONAL_THICKNESS = 0.12;

export function SlabComparator() {
  const [inputs, setInputs] = useState<MaterialInputs>({
    sandPriceM3: 350,
    gravelPriceM3: 450,
    cementPriceBag: 180,
    slabLength: 6,
    slabWidth: 4,
    compressionLayer: 5,
  });

  const [results, setResults] = useState<SlabResults | null>(null);

  const handleInputChange = (field: keyof MaterialInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateSlabs = () => {
    const area = inputs.slabLength * inputs.slabWidth;
    const compressionM = inputs.compressionLayer / 100;

    const traditionalVolume = area * TRADITIONAL_THICKNESS;

    const numViguetas = Math.floor(inputs.slabWidth / BOVEDILLA.axisDistance) + 1;
    const bovedillasPerRow = Math.floor(inputs.slabLength / BOVEDILLA.length);
    const numRows = numViguetas - 1;
    const totalBovedillas = bovedillasPerRow * numRows;

    const bovedillaVoidVolume = totalBovedillas * BOVEDILLA.length * BOVEDILLA.width * BOVEDILLA.height;
    
    const totalSlabVolume = area * (compressionM + BOVEDILLA.height);
    const vbVolume = totalSlabVolume - bovedillaVoidVolume;

    const calcMaterials = (volumeM3: number) => {
      const cement = volumeM3 * MATERIAL_COEFFICIENTS.cement;
      const sand = volumeM3 * MATERIAL_COEFFICIENTS.sand;
      const gravel = volumeM3 * MATERIAL_COEFFICIENTS.gravel;
      const water = volumeM3 * MATERIAL_COEFFICIENTS.water;

      const BUCKETS_PER_M3 = 52.63;

      return {
        cement: {
          bags: Math.ceil(cement),
          cost: Math.ceil(cement) * inputs.cementPriceBag
        },
        sand: {
          m3: parseFloat(sand.toFixed(3)),
          buckets: Math.ceil(sand * BUCKETS_PER_M3),
          cost: sand * inputs.sandPriceM3
        },
        gravel: {
          m3: parseFloat(gravel.toFixed(3)),
          buckets: Math.ceil(gravel * BUCKETS_PER_M3),
          cost: gravel * inputs.gravelPriceM3
        },
        water: {
          m3: parseFloat(water.toFixed(3)),
          buckets: Math.ceil(water * BUCKETS_PER_M3)
        }
      };
    };

    const traditionalMaterials = calcMaterials(traditionalVolume);
    const vbMaterials = calcMaterials(vbVolume);

    const traditionalCost = traditionalMaterials.cement.cost + traditionalMaterials.sand.cost + traditionalMaterials.gravel.cost;
    const vbCost = vbMaterials.cement.cost + vbMaterials.sand.cost + vbMaterials.gravel.cost;

    const concreteSaved = traditionalVolume - vbVolume;
    const costSaved = traditionalCost - vbCost;

    setResults({
      traditional: {
        volumeM3: parseFloat(traditionalVolume.toFixed(3)),
        ...traditionalMaterials,
        totalCost: traditionalCost
      },
      viguetaBovedilla: {
        volumeM3: parseFloat(vbVolume.toFixed(3)),
        ...vbMaterials,
        totalCost: vbCost,
        bovedillaCount: totalBovedillas,
        viguetaCount: numViguetas
      },
      savings: {
        concreteM3: parseFloat(concreteSaved.toFixed(3)),
        concretePct: parseFloat(((concreteSaved / traditionalVolume) * 100).toFixed(1)),
        costSaved: parseFloat(costSaved.toFixed(2)),
        costPct: parseFloat(((costSaved / traditionalCost) * 100).toFixed(1))
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-accent to-primary w-full" />
        <CardHeader className="bg-muted/10">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6 text-accent" />
            Comparador de Losas
          </CardTitle>
          <CardDescription>
            Compara Losa Tradicional vs Losa Vigueta y Bovedilla de Poliestireno (f'c 250 con 2% desperdicio)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="grid gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Precios de Materiales
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sandPrice">Arena ($/m³)</Label>
                  <div className="relative">
                    <Input
                      id="sandPrice"
                      type="number"
                      value={inputs.sandPriceM3}
                      onChange={(e) => handleInputChange('sandPriceM3', e.target.value)}
                      className="h-12 text-lg pl-8"
                      data-testid="input-sand-price"
                    />
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gravelPrice">Grava ($/m³)</Label>
                  <div className="relative">
                    <Input
                      id="gravelPrice"
                      type="number"
                      value={inputs.gravelPriceM3}
                      onChange={(e) => handleInputChange('gravelPriceM3', e.target.value)}
                      className="h-12 text-lg pl-8"
                      data-testid="input-gravel-price"
                    />
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cementPrice">Cemento ($/bulto 50kg)</Label>
                  <div className="relative">
                    <Input
                      id="cementPrice"
                      type="number"
                      value={inputs.cementPriceBag}
                      onChange={(e) => handleInputChange('cementPriceBag', e.target.value)}
                      className="h-12 text-lg pl-8"
                      data-testid="input-cement-price"
                    />
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" />
                Dimensiones de la Losa
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slabLength">Largo (m)</Label>
                  <div className="relative">
                    <Input
                      id="slabLength"
                      type="number"
                      step="0.1"
                      value={inputs.slabLength}
                      onChange={(e) => handleInputChange('slabLength', e.target.value)}
                      className="h-12 text-lg"
                      data-testid="input-comparator-length"
                    />
                    <span className="absolute right-3 top-3 text-muted-foreground">m</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slabWidth">Ancho (m)</Label>
                  <div className="relative">
                    <Input
                      id="slabWidth"
                      type="number"
                      step="0.1"
                      value={inputs.slabWidth}
                      onChange={(e) => handleInputChange('slabWidth', e.target.value)}
                      className="h-12 text-lg"
                      data-testid="input-comparator-width"
                    />
                    <span className="absolute right-3 top-3 text-muted-foreground">m</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compression">Capa de Compresión (cm)</Label>
                  <div className="relative">
                    <Input
                      id="compression"
                      type="number"
                      value={inputs.compressionLayer}
                      onChange={(e) => handleInputChange('compressionLayer', e.target.value)}
                      className="h-12 text-lg"
                      data-testid="input-compression"
                    />
                    <span className="absolute right-3 top-3 text-muted-foreground">cm</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Bovedilla de poliestireno: 1.22m × 0.63m | Distancia entre ejes: 70cm | Losa tradicional: 12cm espesor
              </p>
            </div>
          </div>

          <Button onClick={calculateSlabs} size="lg" className="w-full sm:w-auto" data-testid="button-calculate-comparison">
            <Calculator className="mr-2 h-5 w-5" />
            Calcular y Comparar
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ahorro en Concreto</p>
                    <p className="text-2xl font-bold text-green-600">{results.savings.concretePct}%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{results.savings.concreteM3} m³ menos</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ahorro en Costo</p>
                    <p className="text-2xl font-bold text-accent">${results.savings.costSaved.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{results.savings.costPct}% menos en materiales</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sistema V&B</p>
                    <p className="text-2xl font-bold text-primary">{results.viguetaBovedilla.viguetaCount} viguetas</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{results.viguetaBovedilla.bovedillaCount} bovedillas</p>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg">Tabla Comparativa de Materiales</CardTitle>
              <CardDescription>Cantidades en m³, botes de 19L y costos estimados</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="text-left p-4 font-semibold">Material</th>
                      <th className="text-center p-4 font-semibold" colSpan={3}>
                        <Badge variant="outline" className="bg-gray-100">Losa Tradicional (12cm)</Badge>
                      </th>
                      <th className="text-center p-4 font-semibold" colSpan={3}>
                        <Badge className="bg-accent text-white">Vigueta y Bovedilla</Badge>
                      </th>
                    </tr>
                    <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                      <th className="text-left p-3"></th>
                      <th className="text-center p-3">Cantidad</th>
                      <th className="text-center p-3">Botes 19L</th>
                      <th className="text-center p-3">Costo</th>
                      <th className="text-center p-3">Cantidad</th>
                      <th className="text-center p-3">Botes 19L</th>
                      <th className="text-center p-3">Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Box className="h-4 w-4 text-gray-500" />
                        Volumen Total
                      </td>
                      <td className="text-center p-4">{results.traditional.volumeM3} m³</td>
                      <td className="text-center p-4 text-muted-foreground">{Math.ceil(results.traditional.volumeM3 * MATERIAL_COEFFICIENTS.bucketsPerM3)}</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4 font-semibold text-accent">{results.viguetaBovedilla.volumeM3} m³</td>
                      <td className="text-center p-4 text-muted-foreground">{Math.ceil(results.viguetaBovedilla.volumeM3 * MATERIAL_COEFFICIENTS.bucketsPerM3)}</td>
                      <td className="text-center p-4">-</td>
                    </tr>
                    <tr className="border-b bg-muted/5">
                      <td className="p-4 font-medium">Cemento (bultos 50kg)</td>
                      <td className="text-center p-4">{results.traditional.cement.bags}</td>
                      <td className="text-center p-4 text-muted-foreground">-</td>
                      <td className="text-center p-4">${results.traditional.cement.cost.toLocaleString()}</td>
                      <td className="text-center p-4 font-semibold text-accent">{results.viguetaBovedilla.cement.bags}</td>
                      <td className="text-center p-4 text-muted-foreground">-</td>
                      <td className="text-center p-4">${results.viguetaBovedilla.cement.cost.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Arena (m³)</td>
                      <td className="text-center p-4">{results.traditional.sand.m3}</td>
                      <td className="text-center p-4 text-muted-foreground">{results.traditional.sand.buckets}</td>
                      <td className="text-center p-4">${results.traditional.sand.cost.toLocaleString()}</td>
                      <td className="text-center p-4 font-semibold text-accent">{results.viguetaBovedilla.sand.m3}</td>
                      <td className="text-center p-4 text-muted-foreground">{results.viguetaBovedilla.sand.buckets}</td>
                      <td className="text-center p-4">${results.viguetaBovedilla.sand.cost.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b bg-muted/5">
                      <td className="p-4 font-medium">Grava (m³)</td>
                      <td className="text-center p-4">{results.traditional.gravel.m3}</td>
                      <td className="text-center p-4 text-muted-foreground">{results.traditional.gravel.buckets}</td>
                      <td className="text-center p-4">${results.traditional.gravel.cost.toLocaleString()}</td>
                      <td className="text-center p-4 font-semibold text-accent">{results.viguetaBovedilla.gravel.m3}</td>
                      <td className="text-center p-4 text-muted-foreground">{results.viguetaBovedilla.gravel.buckets}</td>
                      <td className="text-center p-4">${results.viguetaBovedilla.gravel.cost.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Agua (m³)
                      </td>
                      <td className="text-center p-4">{results.traditional.water.m3}</td>
                      <td className="text-center p-4 text-muted-foreground">{results.traditional.water.buckets}</td>
                      <td className="text-center p-4 text-muted-foreground">-</td>
                      <td className="text-center p-4">{results.viguetaBovedilla.water.m3}</td>
                      <td className="text-center p-4 text-muted-foreground">{results.viguetaBovedilla.water.buckets}</td>
                      <td className="text-center p-4 text-muted-foreground">-</td>
                    </tr>
                    <tr className="bg-primary/5 font-bold">
                      <td className="p-4">TOTAL</td>
                      <td className="text-center p-4" colSpan={2}>{results.traditional.volumeM3} m³</td>
                      <td className="text-center p-4 text-lg">${results.traditional.totalCost.toLocaleString()}</td>
                      <td className="text-center p-4 text-accent" colSpan={2}>{results.viguetaBovedilla.volumeM3} m³</td>
                      <td className="text-center p-4 text-lg text-accent">${results.viguetaBovedilla.totalCost.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Plano de Distribución - Sistema Vigueta y Bovedilla</CardTitle>
              <CardDescription>Esquema de planta con viguetas cada 70cm y bovedillas de 1.22 × 0.63 m</CardDescription>
            </CardHeader>
            <CardContent>
              <SlabPlanSVG 
                length={inputs.slabLength} 
                width={inputs.slabWidth} 
                viguetaCount={results.viguetaBovedilla.viguetaCount}
                bovedillaCount={results.viguetaBovedilla.bovedillaCount}
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Resumen de Ahorro con Sistema Vigueta y Bovedilla
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-accent">{results.savings.concretePct}%</p>
                  <p className="text-sm text-muted-foreground">Menos concreto</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">${results.savings.costSaved.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ahorro en materiales</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{results.savings.concreteM3} m³</p>
                  <p className="text-sm text-muted-foreground">Concreto ahorrado</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">~45%</p>
                  <p className="text-sm text-muted-foreground">Menos peso estructural</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-accent" />
                  Ventajas adicionales del sistema V&B
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Menor carga a la estructura
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Mayor aislamiento térmico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Instalación más rápida
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Menor uso de cimbra
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function SlabPlanSVG({ length, width, viguetaCount, bovedillaCount }: { 
  length: number; 
  width: number; 
  viguetaCount: number;
  bovedillaCount: number;
}) {
  const scale = 50;
  const padding = 40;
  const svgWidth = length * scale + padding * 2;
  const svgHeight = width * scale + padding * 2;

  const viguetaSpacing = (width * scale) / (viguetaCount - 1);
  const bovedillaWidth = 0.63 * scale;
  const bovedillaLength = 1.22 * scale;

  const bovedillasPerRow = Math.floor((length * scale) / bovedillaLength);
  const numRows = viguetaCount - 1;

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-xl p-4">
      <svg 
        width={Math.max(svgWidth, 400)} 
        height={Math.max(svgHeight, 300)} 
        viewBox={`0 0 ${Math.max(svgWidth, 400)} ${Math.max(svgHeight, 300)}`}
        className="mx-auto"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.5"/>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="#0f172a"/>
        <rect x={padding} y={padding} width={length * scale} height={width * scale} fill="url(#grid)" stroke="#475569" strokeWidth="2"/>

        {Array.from({ length: numRows }).map((_, rowIndex) => {
          const y = padding + rowIndex * viguetaSpacing + viguetaSpacing / 2 - bovedillaWidth / 2;
          return Array.from({ length: bovedillasPerRow }).map((_, colIndex) => {
            const x = padding + colIndex * bovedillaLength;
            return (
              <g key={`bovedilla-${rowIndex}-${colIndex}`}>
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={bovedillaLength - 4}
                  height={bovedillaWidth - 4}
                  fill="#f97316"
                  fillOpacity="0.3"
                  stroke="#f97316"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x={x + bovedillaLength / 2}
                  y={y + bovedillaWidth / 2 + 3}
                  textAnchor="middle"
                  fill="#f97316"
                  fontSize="8"
                  fontWeight="bold"
                >
                  B
                </text>
              </g>
            );
          });
        })}

        {Array.from({ length: viguetaCount }).map((_, index) => {
          const y = padding + index * viguetaSpacing;
          return (
            <g key={`vigueta-${index}`}>
              <line
                x1={padding}
                y1={y}
                x2={padding + length * scale}
                y2={y}
                stroke="#22d3ee"
                strokeWidth="4"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fill="#22d3ee"
                fontSize="10"
              >
                V{index + 1}
              </text>
            </g>
          );
        })}

        <text x={padding + (length * scale) / 2} y={padding - 15} textAnchor="middle" fill="#94a3b8" fontSize="12">
          {length}m
        </text>
        <text x={padding - 25} y={padding + (width * scale) / 2} textAnchor="middle" fill="#94a3b8" fontSize="12" transform={`rotate(-90 ${padding - 25} ${padding + (width * scale) / 2})`}>
          {width}m
        </text>

        <g transform={`translate(${padding}, ${padding + width * scale + 20})`}>
          <rect x="0" y="0" width="15" height="10" fill="#22d3ee" />
          <text x="20" y="9" fill="#94a3b8" fontSize="10">Vigueta (cada 70cm)</text>
          
          <rect x="120" y="0" width="15" height="10" fill="#f97316" fillOpacity="0.3" stroke="#f97316" />
          <text x="140" y="9" fill="#94a3b8" fontSize="10">Bovedilla (1.22 × 0.63m)</text>
        </g>
      </svg>
    </div>
  );
}
