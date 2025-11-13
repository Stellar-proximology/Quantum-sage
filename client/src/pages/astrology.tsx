import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Circle, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AstrologyChart } from "@shared/schema";

const birthDataSchema = z.object({
  date: z.string().min(1, "Birth date is required"),
  time: z.string().min(1, "Birth time is required"),
  location: z.string().min(1, "Birth location is required"),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

export default function Astrology() {
  const [chart, setChart] = useState<AstrologyChart | null>(null);
  const { toast } = useToast();

  const form = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      date: "",
      time: "",
      location: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: BirthDataForm) => {
      return apiRequest("POST", "/api/astrology/generate", data);
    },
    onSuccess: (data: AstrologyChart) => {
      setChart(data);
      toast({
        title: "Chart generated",
        description: "Your natal chart has been created",
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Could not generate chart. Check your birth data.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BirthDataForm) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="container mx-auto max-w-7xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-foreground">Astrology Chart</h1>
        <p className="text-muted-foreground">
          Generate natal charts with planetary positions, houses, and aspects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Birth Data</CardTitle>
              <CardDescription>Enter your birth information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input type="date" data-testid="input-astro-birth-date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Time</FormLabel>
                        <FormControl>
                          <Input type="time" data-testid="input-astro-birth-time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Location</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="City, Country"
                            data-testid="input-astro-birth-location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full"
                    data-testid="button-generate-astro-chart"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 mr-2" />
                        Generate Chart
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {chart ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="font-serif">Natal Chart</CardTitle>
                    <CardDescription>
                      {chart.birthData.date} at {chart.birthData.time} in {chart.birthData.location}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon" data-testid="button-download-astro-chart">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/20 flex items-center justify-center relative">
                    <svg viewBox="0 0 500 500" className="w-full h-full p-4">
                      {/* Outer circle */}
                      <circle
                        cx="250"
                        cy="250"
                        r="200"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      
                      {/* Inner circle */}
                      <circle
                        cx="250"
                        cy="250"
                        r="150"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1"
                        opacity="0.5"
                      />

                      {/* House divisions (12 sections) */}
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i * 30 - 90) * (Math.PI / 180);
                        const x1 = 250 + 150 * Math.cos(angle);
                        const y1 = 250 + 150 * Math.sin(angle);
                        const x2 = 250 + 200 * Math.cos(angle);
                        const y2 = 250 + 200 * Math.sin(angle);
                        return (
                          <g key={i}>
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="hsl(var(--border))"
                              strokeWidth="1"
                            />
                            <text
                              x={250 + 175 * Math.cos(angle + (15 * Math.PI / 180))}
                              y={250 + 175 * Math.sin(angle + (15 * Math.PI / 180))}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="12"
                              fill="hsl(var(--muted-foreground))"
                            >
                              {i + 1}
                            </text>
                          </g>
                        );
                      })}

                      {/* Zodiac symbols in outer ring */}
                      {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map(
                        (symbol, i) => {
                          const angle = (i * 30 - 75) * (Math.PI / 180);
                          const x = 250 + 220 * Math.cos(angle);
                          const y = 250 + 220 * Math.sin(angle);
                          return (
                            <text
                              key={i}
                              x={x}
                              y={y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="20"
                              fill="hsl(var(--primary))"
                              fontWeight="bold"
                            >
                              {symbol}
                            </text>
                          );
                        }
                      )}

                      {/* Planet symbols (simplified) */}
                      <circle cx="250" cy="150" r="8" fill="hsl(var(--chart-1))" />
                      <text
                        x="250"
                        y="152"
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="bold"
                      >
                        ☉
                      </text>

                      <circle cx="320" cy="180" r="8" fill="hsl(var(--chart-2))" />
                      <text
                        x="320"
                        y="182"
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="bold"
                      >
                        ☾
                      </text>

                      <circle cx="370" cy="250" r="8" fill="hsl(var(--chart-3))" />
                      <text
                        x="370"
                        y="252"
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="bold"
                      >
                        ♀
                      </text>
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Planetary Positions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chart.planets.map((planet, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                          data-testid={`planet-${planet.name.toLowerCase()}`}
                        >
                          <span className="font-medium">{planet.name}</span>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{planet.sign}</Badge>
                            <span className="text-muted-foreground font-mono">
                              {planet.degree.toFixed(2)}°
                            </span>
                            <span className="text-muted-foreground">House {planet.house}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Major Aspects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chart.aspects.map((aspect, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                          data-testid={`aspect-${idx}`}
                        >
                          <span className="font-medium">
                            {aspect.planet1} {aspect.type} {aspect.planet2}
                          </span>
                          <span className="text-muted-foreground font-mono">
                            {aspect.angle.toFixed(1)}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Circle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="font-semibold text-lg">No chart generated yet</h3>
                  <p className="text-muted-foreground">
                    Enter your birth data to generate a natal chart with planetary positions and
                    aspects
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
