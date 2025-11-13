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
import { Hexagon, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { HumanDesignChart } from "@shared/schema";

const birthDataSchema = z.object({
  date: z.string().min(1, "Birth date is required"),
  time: z.string().min(1, "Birth time is required"),
  location: z.string().min(1, "Birth location is required"),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

export default function HumanDesign() {
  const [chart, setChart] = useState<HumanDesignChart | null>(null);
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
      return apiRequest("POST", "/api/human-design/generate", data);
    },
    onSuccess: (data: HumanDesignChart) => {
      setChart(data);
      toast({
        title: "Chart generated",
        description: "Your human design bodygraph has been created",
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

  const centerNames = {
    head: "Head",
    ajna: "Ajna",
    throat: "Throat",
    g: "G Center",
    heart: "Heart/Ego",
    sacral: "Sacral",
    solarPlexus: "Solar Plexus",
    spleen: "Spleen",
    root: "Root",
  };

  return (
    <div className="container mx-auto max-w-7xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-foreground">Human Design</h1>
        <p className="text-muted-foreground">
          Generate your bodygraph showing centers, gates, channels, type, and profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Birth Data</CardTitle>
              <CardDescription>Enter your birth information to generate your chart</CardDescription>
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
                          <Input type="date" data-testid="input-birth-date" {...field} />
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
                          <Input type="time" data-testid="input-birth-time" {...field} />
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
                            data-testid="input-birth-location"
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
                    data-testid="button-generate-chart"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Hexagon className="h-4 w-4 mr-2" />
                        Generate Bodygraph
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
                    <CardTitle className="font-serif">Your Human Design</CardTitle>
                    <CardDescription>
                      {chart.birthData.date} at {chart.birthData.time} in {chart.birthData.location}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon" data-testid="button-download-chart">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Type</Label>
                      <Badge variant="default" className="text-base px-4 py-1">
                        {chart.type}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Profile</Label>
                      <Badge variant="secondary" className="text-base px-4 py-1">
                        {chart.profile}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Authority</Label>
                      <p className="font-medium">{chart.authority}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Strategy</Label>
                      <p className="font-medium">{chart.strategy}</p>
                    </div>
                  </div>

                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/20 flex items-center justify-center relative overflow-hidden">
                    <svg viewBox="0 0 400 600" className="w-full h-full p-8">
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Head Center */}
                      <polygon
                        points="200,50 180,80 220,80"
                        fill={chart.centers.head ? "hsl(var(--chart-1))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.head ? "0.8" : "0.3"}
                      />
                      <text x="200" y="65" textAnchor="middle" fontSize="10" fill="currentColor">
                        Head
                      </text>

                      {/* Ajna Center */}
                      <polygon
                        points="200,90 180,120 220,120"
                        fill={chart.centers.ajna ? "hsl(var(--chart-2))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.ajna ? "0.8" : "0.3"}
                      />
                      <text x="200" y="105" textAnchor="middle" fontSize="10" fill="currentColor">
                        Ajna
                      </text>

                      {/* Throat Center */}
                      <rect
                        x="175"
                        y="130"
                        width="50"
                        height="40"
                        fill={chart.centers.throat ? "hsl(var(--chart-3))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.throat ? "0.8" : "0.3"}
                      />
                      <text x="200" y="152" textAnchor="middle" fontSize="10" fill="currentColor">
                        Throat
                      </text>

                      {/* G Center */}
                      <circle
                        cx="200"
                        cy="230"
                        r="30"
                        fill={chart.centers.g ? "hsl(var(--chart-4))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.g ? "0.8" : "0.3"}
                      />
                      <text x="200" y="235" textAnchor="middle" fontSize="10" fill="currentColor">
                        G
                      </text>

                      {/* Heart/Ego */}
                      <rect
                        x="240"
                        y="200"
                        width="50"
                        height="40"
                        fill={chart.centers.heart ? "hsl(var(--chart-5))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.heart ? "0.8" : "0.3"}
                      />
                      <text x="265" y="222" textAnchor="middle" fontSize="9" fill="currentColor">
                        Heart
                      </text>

                      {/* Sacral */}
                      <rect
                        x="175"
                        y="280"
                        width="50"
                        height="60"
                        rx="5"
                        fill={chart.centers.sacral ? "hsl(var(--chart-1))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.sacral ? "0.8" : "0.3"}
                      />
                      <text x="200" y="312" textAnchor="middle" fontSize="10" fill="currentColor">
                        Sacral
                      </text>

                      {/* Solar Plexus */}
                      <polygon
                        points="140,280 110,310 110,340 140,370"
                        fill={chart.centers.solarPlexus ? "hsl(var(--chart-2))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.solarPlexus ? "0.8" : "0.3"}
                      />
                      <text x="125" y="325" textAnchor="middle" fontSize="9" fill="currentColor">
                        Solar
                      </text>

                      {/* Spleen */}
                      <polygon
                        points="90,200 60,230 90,260"
                        fill={chart.centers.spleen ? "hsl(var(--chart-3))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.spleen ? "0.8" : "0.3"}
                      />
                      <text x="75" y="232" textAnchor="middle" fontSize="9" fill="currentColor">
                        Spleen
                      </text>

                      {/* Root */}
                      <rect
                        x="175"
                        y="400"
                        width="50"
                        height="40"
                        fill={chart.centers.root ? "hsl(var(--chart-4))" : "none"}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity={chart.centers.root ? "0.8" : "0.3"}
                      />
                      <text x="200" y="422" textAnchor="middle" fontSize="10" fill="currentColor">
                        Root
                      </text>

                      {/* Connecting lines (simplified) */}
                      <line
                        x1="200"
                        y1="80"
                        x2="200"
                        y2="90"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                      <line
                        x1="200"
                        y1="120"
                        x2="200"
                        y2="130"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                      <line
                        x1="200"
                        y1="170"
                        x2="200"
                        y2="200"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                      <line
                        x1="200"
                        y1="260"
                        x2="200"
                        y2="280"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                      <line
                        x1="200"
                        y1="340"
                        x2="200"
                        y2="400"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Defined Centers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(chart.centers) as Array<keyof typeof chart.centers>).map(
                        (center) =>
                          chart.centers[center] && (
                            <Badge key={center} variant="default" data-testid={`badge-center-${center}`}>
                              {centerNames[center]}
                            </Badge>
                          )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Gates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {chart.gates.map((gate) => (
                        <Badge key={gate} variant="secondary" className="font-mono">
                          {gate}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Channels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {chart.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="font-mono">
                          Channel {channel}
                        </Badge>
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
                    <Hexagon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">No chart generated yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter your birth data on the left to generate your human design bodygraph with
                    centers, gates, and channels
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
