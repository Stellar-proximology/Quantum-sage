import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Waves, Play, Pause, Download } from "lucide-react";
import type { CymaticsPattern } from "@shared/schema";

export default function Cymatics() {
  const [frequency, setFrequency] = useState(432);
  const [text, setText] = useState("");
  const [waveform, setWaveform] = useState<"sine" | "square" | "triangle" | "sawtooth">("sine");
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawPattern = (time: number) => {
      ctx.fillStyle = "hsl(var(--background))";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2 - 20;

      // Draw concentric circles based on frequency
      const numCircles = Math.floor(frequency / 50);
      for (let i = 0; i < numCircles; i++) {
        const radius = (maxRadius / numCircles) * (i + 1);
        const angle = (time * frequency) / 1000 + i;
        const opacity = 0.2 + 0.3 * Math.sin(angle);

        ctx.strokeStyle = `hsla(var(--primary), ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw radial lines
      const numLines = 12;
      for (let i = 0; i < numLines; i++) {
        const angle = ((Math.PI * 2) / numLines) * i + time / 1000;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);

        ctx.strokeStyle = "hsla(var(--chart-1), 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw nodal points based on frequency harmonics
      const numNodes = Math.floor((frequency / 100) * 8);
      for (let i = 0; i < numNodes; i++) {
        const angle = ((Math.PI * 2) / numNodes) * i;
        const r = maxRadius * 0.7 * (1 + 0.2 * Math.sin(time / 500 + i));
        const x = centerX + r * Math.cos(angle + time / 2000);
        const y = centerY + r * Math.sin(angle + time / 2000);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, "hsla(var(--chart-2), 0.8)");
        gradient.addColorStop(1, "hsla(var(--chart-2), 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw waveform visualization
      ctx.strokeStyle = "hsla(var(--chart-3), 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        let y;
        const t = (x / width) * Math.PI * 4 + time / 200;
        
        switch (waveform) {
          case "square":
            y = Math.sin(t) > 0 ? -30 : 30;
            break;
          case "triangle":
            y = (2 / Math.PI) * Math.asin(Math.sin(t)) * 30;
            break;
          case "sawtooth":
            y = ((t % (2 * Math.PI)) / Math.PI - 1) * 30;
            break;
          default: // sine
            y = Math.sin(t) * 30;
        }

        if (x === 0) {
          ctx.moveTo(x, centerY + y);
        } else {
          ctx.lineTo(x, centerY + y);
        }
      }
      ctx.stroke();

      // Draw text if present
      if (text) {
        ctx.font = "bold 24px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "hsla(var(--foreground), 0.1)";
        ctx.fillText(text, centerX, centerY);
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(drawPattern);
      }
    };

    if (isPlaying) {
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        drawPattern(currentTime - startTime);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      drawPattern(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, waveform, isPlaying, text]);

  return (
    <div className="container mx-auto max-w-7xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-foreground">Cymatics Visualizer</h1>
        <p className="text-muted-foreground">
          Visualize sound frequencies, resonance patterns, and sacred geometry
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Frequency Controls</CardTitle>
              <CardDescription>Adjust sound parameters to see pattern changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="frequency">
                  Frequency: {frequency} Hz
                </Label>
                <Slider
                  id="frequency"
                  min={20}
                  max={880}
                  step={1}
                  value={[frequency]}
                  onValueChange={(value) => setFrequency(value[0])}
                  data-testid="slider-frequency"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFrequency(432)}
                    data-testid="button-freq-432"
                  >
                    432 Hz
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setFrequency(528)}>
                    528 Hz
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setFrequency(639)}>
                    639 Hz
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setFrequency(741)}>
                    741 Hz
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waveform">Waveform</Label>
                <Select value={waveform} onValueChange={(v: any) => setWaveform(v)}>
                  <SelectTrigger id="waveform" data-testid="select-waveform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sine">Sine Wave</SelectItem>
                    <SelectItem value="square">Square Wave</SelectItem>
                    <SelectItem value="triangle">Triangle Wave</SelectItem>
                    <SelectItem value="sawtooth">Sawtooth Wave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Resonant Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter words to visualize..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-20"
                  data-testid="input-resonant-text"
                />
                <p className="text-xs text-muted-foreground">
                  Words will be displayed with the resonance pattern
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant={isPlaying ? "secondary" : "default"}
                  className="flex-1"
                  data-testid="button-toggle-animation"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Animate
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" data-testid="button-download-pattern">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solfeggio Frequencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>396 Hz</span>
                <span className="text-muted-foreground">Liberation from Fear</span>
              </div>
              <div className="flex justify-between">
                <span>417 Hz</span>
                <span className="text-muted-foreground">Undoing Situations</span>
              </div>
              <div className="flex justify-between">
                <span>528 Hz</span>
                <span className="text-muted-foreground">Transformation & Miracles</span>
              </div>
              <div className="flex justify-between">
                <span>639 Hz</span>
                <span className="text-muted-foreground">Connecting Relationships</span>
              </div>
              <div className="flex justify-between">
                <span>741 Hz</span>
                <span className="text-muted-foreground">Awakening Intuition</span>
              </div>
              <div className="flex justify-between">
                <span>852 Hz</span>
                <span className="text-muted-foreground">Returning to Spirit</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-serif">Resonance Pattern</CardTitle>
              <CardDescription>
                Geometric visualization of sound frequency {frequency} Hz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-card rounded-lg border flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={800}
                  className="w-full h-full"
                  data-testid="canvas-cymatics"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
