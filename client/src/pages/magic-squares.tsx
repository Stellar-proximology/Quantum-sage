import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Grid3x3, Loader2, Download, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MagicSquare } from "@shared/schema";

const dimensionSchema = z.object({
  dimension: z.coerce.number().int().min(3, "Minimum dimension is 3").max(9, "Maximum dimension is 9"),
});

type DimensionForm = z.infer<typeof dimensionSchema>;

export default function MagicSquares() {
  const [square, setSquare] = useState<MagicSquare | null>(null);
  const { toast } = useToast();

  const form = useForm<DimensionForm>({
    resolver: zodResolver(dimensionSchema),
    defaultValues: {
      dimension: 3,
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { dimension: number }) => {
      return apiRequest("POST", "/api/magic-squares/generate", data);
    },
    onSuccess: (data: MagicSquare) => {
      setSquare(data);
      toast({
        title: "Magic square generated",
        description: `${data.dimension}×${data.dimension} square with magic constant ${data.magicConstant}`,
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Could not generate magic square",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DimensionForm) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-foreground">Magic Squares</h1>
        <p className="text-muted-foreground">
          Generate mathematical matrices with mystical properties and perfect balance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Square Parameters</CardTitle>
              <CardDescription>Configure the magic square dimension</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="dimension"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimension (3-9)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={3}
                            max={9}
                            data-testid="input-dimension"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Size of the square (e.g., 3 = 3×3 grid)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full"
                    data-testid="button-generate-square"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Grid3x3 className="h-4 w-4 mr-2" />
                        Generate Magic Square
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-semibold text-sm">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("dimension", 3);
                      generateMutation.mutate({ dimension: 3 });
                    }}
                    data-testid="button-preset-3"
                  >
                    3×3 (Saturn)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("dimension", 4);
                      generateMutation.mutate({ dimension: 4 });
                    }}
                    data-testid="button-preset-4"
                  >
                    4×4 (Jupiter)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("dimension", 5);
                      generateMutation.mutate({ dimension: 5 });
                    }}
                    data-testid="button-preset-5"
                  >
                    5×5 (Mars)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("dimension", 6);
                      generateMutation.mutate({ dimension: 6 });
                    }}
                    data-testid="button-preset-6"
                  >
                    6×6 (Sun)
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h4 className="font-semibold text-sm">About Magic Squares</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A magic square is a grid where each row, column, and diagonal sums to the same
                  constant. Used in mathematics, mysticism, and sacred geometry since ancient times.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {square ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="font-serif">
                      {square.dimension}×{square.dimension} Magic Square
                    </CardTitle>
                    <CardDescription>Magic constant: {square.magicConstant}</CardDescription>
                  </div>
                  <Button variant="outline" size="icon" data-testid="button-download-square">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/20 p-8">
                    <div
                      className="grid gap-2 mx-auto max-w-xl"
                      style={{
                        gridTemplateColumns: `repeat(${square.dimension}, minmax(0, 1fr))`,
                      }}
                    >
                      {square.matrix.map((row, i) =>
                        row.map((cell, j) => (
                          <div
                            key={`${i}-${j}`}
                            className="aspect-square flex items-center justify-center bg-card border-2 border-primary/30 rounded-md hover-elevate"
                            data-testid={`cell-${i}-${j}`}
                          >
                            <span className="text-2xl font-bold font-mono">{cell}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {square.properties.isPerfect ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                      Perfect Square
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    All rows, columns, and both diagonals sum to {square.magicConstant}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {square.properties.isSemiMagic ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                      Semi-Magic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Rows and columns sum to the magic constant
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {square.properties.isPandiagonal ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                      Pandiagonal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    All broken diagonals also sum to the magic constant
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mathematical Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono text-primary">
                        {square.magicConstant}
                      </p>
                      <p className="text-xs text-muted-foreground">Magic Constant</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono text-chart-2">
                        {square.dimension}²
                      </p>
                      <p className="text-xs text-muted-foreground">Total Cells</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono text-chart-3">
                        {1}-{square.dimension * square.dimension}
                      </p>
                      <p className="text-xs text-muted-foreground">Number Range</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono text-chart-4">
                        {square.dimension * 2 + 2}
                      </p>
                      <p className="text-xs text-muted-foreground">Magic Lines</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm leading-relaxed">
                      Formula for magic constant: <span className="font-mono bg-muted px-2 py-1 rounded">
                        M = n(n² + 1) / 2
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Grid3x3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="font-semibold text-lg">No square generated yet</h3>
                  <p className="text-muted-foreground">
                    Choose a dimension and generate a magic square to explore its mathematical
                    properties
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
