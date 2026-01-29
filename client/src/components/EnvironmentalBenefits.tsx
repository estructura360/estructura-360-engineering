import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Leaf, Factory, Layers, Truck, ThermometerSun, Volume2, Recycle, Trash2, Building } from "lucide-react";

interface EnvironmentalBenefit {
  id: number;
  title: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  iconColor: string;
  description: string;
  details: string[];
}

const environmentalBenefitsData: EnvironmentalBenefit[] = [
  {
    id: 1,
    title: "Menor Consumo de Materiales",
    icon: Factory,
    color: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "Reduce significativamente el volumen de concreto y acero:",
    details: [
      "Menores emisiones de CO₂ del cemento y acero",
      "Menor extracción de materias primas",
      "Hasta 30% menos concreto vs tradicional"
    ]
  },
  {
    id: 2,
    title: "Eficiencia en el Uso de Recursos",
    icon: Layers,
    color: "from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    description: "El EPS optimiza el diseño sin comprometer resistencia:",
    details: [
      "Cubrir claros mayores con menos material",
      "Diseño estructural optimizado",
      "Mayor eficiencia del sistema completo"
    ]
  },
  {
    id: 3,
    title: "Menor Huella de Transporte",
    icon: Truck,
    color: "from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    description: "El EPS es muy ligero, reduciendo impacto:",
    details: [
      "Menor consumo de combustible",
      "Menos emisiones en logística",
      "Más material por viaje"
    ]
  },
  {
    id: 4,
    title: "Aislamiento Térmico",
    icon: ThermometerSun,
    color: "from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
    description: "Excelente aislante térmico de por vida:",
    details: [
      "Reduce climatización artificial",
      "Menor consumo energético del edificio",
      "Menor impacto ambiental a largo plazo"
    ]
  },
  {
    id: 5,
    title: "Aislamiento Acústico",
    icon: Volume2,
    color: "from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    iconColor: "text-teal-600 dark:text-teal-400",
    description: "Mejora el confort acústico interior:",
    details: [
      "Menos soluciones adicionales",
      "Mayor confort habitacional",
      "Cumple normas acústicas"
    ]
  },
  {
    id: 6,
    title: "Potencial de Reciclaje",
    icon: Recycle,
    color: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "El EPS es 100% reciclable:",
    details: [
      "Reincorporable a procesos industriales",
      "Reutilizable como agregado ligero",
      "Ciclo de vida circular"
    ]
  },
  {
    id: 7,
    title: "Menor Generación de Residuos",
    icon: Trash2,
    color: "from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    description: "Piezas fabricadas a medida:",
    details: [
      "Reducción de desperdicios en obra",
      "Obra más limpia",
      "Menos costos de desecho"
    ]
  },
  {
    id: 8,
    title: "Mayor Eficiencia Estructural",
    icon: Building,
    color: "from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    iconColor: "text-rose-600 dark:text-rose-400",
    description: "Menor peso propio de la losa:",
    details: [
      "Cimentaciones más pequeñas",
      "Menos acero estructural",
      "Efecto ambiental positivo total"
    ]
  }
];

interface EnvironmentalBenefitsProps {
  variant?: "full" | "compact" | "mini";
  showTitle?: boolean;
  maxItems?: number;
  className?: string;
}

export function EnvironmentalBenefits({ 
  variant = "compact", 
  showTitle = true,
  maxItems,
  className = ""
}: EnvironmentalBenefitsProps) {
  const items = maxItems ? environmentalBenefitsData.slice(0, maxItems) : environmentalBenefitsData;

  if (variant === "mini") {
    return (
      <div className={`space-y-3 ${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-sm text-primary">Beneficios Ambientales</h4>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {items.map((benefit) => (
            <div 
              key={benefit.id}
              className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br ${benefit.color} border ${benefit.borderColor}`}
              data-testid={`env-benefit-mini-${benefit.id}`}
            >
              <benefit.icon className={`h-4 w-4 ${benefit.iconColor} shrink-0`} />
              <span className="text-xs font-medium truncate">{benefit.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <Leaf className="h-3 w-3 mr-1" />
              Construcción Sostenible
            </Badge>
          </div>
          <CardTitle className="text-lg">8 Beneficios Ambientales del Sistema V&B</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((benefit) => (
              <div 
                key={benefit.id}
                className={`flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br ${benefit.color} border ${benefit.borderColor}`}
                data-testid={`env-benefit-compact-${benefit.id}`}
              >
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
                    <benefit.icon className={`h-4 w-4 ${benefit.iconColor}`} />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{benefit.id}. {benefit.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            <Leaf className="h-3 w-3 mr-1" />
            Construcción Sostenible
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-3">
            8 Beneficios Ambientales del Sistema V&B
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            El sistema de Vigueta y Bovedilla con EPS representa una construcción responsable con el medio ambiente.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {items.map((benefit) => (
          <div 
            key={benefit.id}
            className={`flex gap-4 p-5 rounded-2xl bg-gradient-to-br ${benefit.color} border ${benefit.borderColor}`}
            data-testid={`env-benefit-full-${benefit.id}`}
          >
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm">
                <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-primary">{benefit.id}. {benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
              <ul className="space-y-1">
                {benefit.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { environmentalBenefitsData };
export type { EnvironmentalBenefit };
