import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Hexagon,
  Sparkles,
  Circle,
  Waves,
  Grid3x3,
  Library,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

const tools = [
  {
    title: "AI Chat",
    description: "Ask questions about esoteric concepts and get insights from your document library",
    icon: MessageSquare,
    url: "/chat",
    color: "text-chart-1",
  },
  {
    title: "Document Library",
    description: "Upload and manage your PDFs on human design, I Ching, quantum mechanics, and more",
    icon: Library,
    url: "/documents",
    color: "text-chart-2",
  },
  {
    title: "Human Design",
    description: "Generate bodygraph charts showing centers, gates, channels, and your unique design",
    icon: Hexagon,
    url: "/human-design",
    color: "text-chart-3",
  },
  {
    title: "I Ching",
    description: "Cast hexagrams, explore changing lines, and receive ancient wisdom",
    icon: Sparkles,
    url: "/iching",
    color: "text-chart-4",
  },
  {
    title: "Astrology",
    description: "Create natal charts with planetary positions, houses, and aspects",
    icon: Circle,
    url: "/astrology",
    color: "text-chart-5",
  },
  {
    title: "Cymatics",
    description: "Visualize sound frequencies, resonance patterns, and sacred geometry",
    icon: Waves,
    url: "/cymatics",
    color: "text-chart-1",
  },
  {
    title: "Magic Squares",
    description: "Generate mathematical matrices with mystical properties and patterns",
    icon: Grid3x3,
    url: "/magic-squares",
    color: "text-chart-2",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl p-8 space-y-8">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-foreground tracking-tight">
          Esoteric Knowledge System
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A comprehensive platform integrating human design astrology, I Ching divination,
          quantum mechanics, and AI-powered analysis. Upload your books, generate visualizations,
          and explore the interconnected wisdom of ancient and modern sciences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="hover-elevate transition-all duration-200" data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="space-y-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-md bg-muted ${tool.color}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif">{tool.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={tool.url}>
                <Button variant="ghost" className="w-full justify-between" data-testid={`button-open-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  Open Tool
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-serif">Getting Started</CardTitle>
          <CardDescription>
            Begin your journey by uploading reference materials or exploring the analysis tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">1. Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Add your PDFs on human design, I Ching, Gene Keys, quantum mechanics, and related topics
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">2. Ask Questions</h3>
              <p className="text-sm text-muted-foreground">
                Use the AI chat to explore concepts and get insights based on your library
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">3. Generate Charts</h3>
              <p className="text-sm text-muted-foreground">
                Create visualizations for human design, astrology, I Ching readings, and more
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">4. Synthesize Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Let AI connect concepts across different systems and find solutions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
