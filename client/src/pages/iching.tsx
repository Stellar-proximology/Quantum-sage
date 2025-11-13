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
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { IChingReading } from "@shared/schema";

const questionSchema = z.object({
  question: z.string().min(1, "Please enter a question to focus your reading"),
});

type QuestionForm = z.infer<typeof questionSchema>;

export default function IChing() {
  const [reading, setReading] = useState<IChingReading | null>(null);
  const { toast } = useToast();

  const form = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
    },
  });

  const castMutation = useMutation({
    mutationFn: async (data: QuestionForm) => {
      return apiRequest("POST", "/api/iching/cast", data);
    },
    onSuccess: (data: IChingReading) => {
      setReading(data);
      toast({
        title: "Hexagram cast",
        description: "Your I Ching reading is ready",
      });
    },
    onError: () => {
      toast({
        title: "Casting failed",
        description: "Could not generate I Ching reading",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuestionForm) => {
    castMutation.mutate(data);
  };

  const renderHexagram = (hexagramNumber: number, isChanging: boolean = false) => {
    const lines = [
      [1, 1, 1], // Placeholder - would be calculated based on hexagram number
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
    ];

    return (
      <div className="space-y-2">
        {lines.reverse().map((line, idx) => (
          <div key={idx} className="flex justify-center gap-2">
            {line[0] === 1 ? (
              <div className="h-3 w-full bg-foreground rounded" />
            ) : (
              <>
                <div className="h-3 flex-1 bg-foreground rounded" />
                <div className="h-3 w-4" />
                <div className="h-3 flex-1 bg-foreground rounded" />
              </>
            )}
          </div>
        ))}
        <p className="text-center text-sm font-semibold mt-4">
          Hexagram {hexagramNumber}
          {isChanging && <Badge className="ml-2">Primary</Badge>}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-foreground">I Ching Oracle</h1>
        <p className="text-muted-foreground">
          Cast hexagrams and receive guidance from the ancient Book of Changes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Your Question</CardTitle>
              <CardDescription>
                Focus your intention and ask a clear question
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What do I need to know about..."
                            className="min-h-32"
                            data-testid="input-question"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={castMutation.isPending}
                    className="w-full"
                    data-testid="button-cast-hexagram"
                  >
                    {castMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Casting...
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        Cast Hexagram
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="pt-4 border-t space-y-2">
                <h4 className="font-semibold text-sm">About I Ching</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The I Ching (易經) or Yijing is an ancient Chinese divination text. Each
                  hexagram consists of six lines (yin or yang), representing a specific life
                  situation and its transformation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {reading ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Your Reading</CardTitle>
                  <CardDescription className="italic">{reading.question}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-center">Primary Hexagram</h3>
                      <div className="bg-muted rounded-lg p-6">
                        {renderHexagram(reading.primaryHexagram, true)}
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-sm text-muted-foreground">Upper Trigram</p>
                        <Badge variant="secondary">{reading.trigrams.upper}</Badge>
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-sm text-muted-foreground">Lower Trigram</p>
                        <Badge variant="secondary">{reading.trigrams.lower}</Badge>
                      </div>
                    </div>

                    {reading.relatingHexagram && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-center">Relating Hexagram</h3>
                        <div className="bg-muted rounded-lg p-6">
                          {renderHexagram(reading.relatingHexagram)}
                        </div>
                        <div className="text-center">
                          <Badge variant="outline">Future Tendency</Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {reading.changingLines.length > 0 && (
                    <div className="space-y-2">
                      <Label>Changing Lines</Label>
                      <div className="flex flex-wrap gap-2">
                        {reading.changingLines.map((line) => (
                          <Badge key={line} className="font-mono">
                            Line {line}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        These lines are in transition, indicating areas of change and focus
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap">{reading.interpretation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="font-semibold text-lg">No reading cast yet</h3>
                  <p className="text-muted-foreground">
                    Enter your question and cast the hexagram to receive guidance from the I Ching
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
