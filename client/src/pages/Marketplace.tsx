import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Phone, ExternalLink, Factory } from "lucide-react";

const providers = [
  { name: "Planta Vigueta Central", city: "Ciudad de México", distance: "5.2 km", phone: "555-0123" },
  { name: "Paneles del Norte", city: "Monterrey", distance: "12.8 km", phone: "812-4567" },
  { name: "Sistemas Constructivos GDL", city: "Guadalajara", distance: "8.5 km", phone: "333-7890" },
  { name: "Materiales Ligeros del Sureste", city: "Mérida", distance: "15.1 km", phone: "999-3210" },
];

export default function MarketplacePage() {
  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Marketplace Estructura 360</h1>
          <p className="text-muted-foreground mt-2">Encuentra plantas de vigueta y panel estructural autorizadas cerca de tu obra.</p>
        </div>

        <Card className="border-primary/10 shadow-lg bg-primary text-primary-foreground">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-primary-foreground/50" />
                <Input 
                  placeholder="Buscar por ciudad o código postal..." 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                />
              </div>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8">
                <MapPin className="mr-2 h-5 w-5" />
                Usar mi ubicación
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Card key={provider.name} className="hover-elevate transition-all duration-300 border-primary/10">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/5 rounded-xl">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <CardDescription>{provider.city}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Distancia estimada:</span>
                  <span className="font-bold text-accent">{provider.distance}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Llamar
                  </Button>
                  <Button size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Pedir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
