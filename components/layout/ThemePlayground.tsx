"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

// --------------------------------------
// Demo theme list (brand palettes)
// You must define matching CSS vars in globals.css as shown below.
// --------------------------------------
const THEMES = [
  { id: "default", label: "Default" },
  { id: "ocean", label: "Ocean" },
  { id: "grape", label: "Grape" },
  { id: "sunset", label: "Sunset" },
  { id: "emerald", label: "Emerald" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// Persist selected brand (separate from light/dark)
const BRAND_KEY = "ui.brand";

export default function ThemePlayground() {
  const [brand, setBrand] = React.useState<ThemeId>(() => {
    if (typeof window === "undefined") return "default";
    return (localStorage.getItem(BRAND_KEY) as ThemeId) || "default";
  });

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", brand);
    try {
      localStorage.setItem(BRAND_KEY, brand);
    } catch {}
  }, [brand]);

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Theme Demos</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Switch brand palettes. Light/Dark still follows the{" "}
            <code>dark</code> class; this just changes <code>data-theme</code>.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Brand selector */}
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <Button
                key={t.id}
                variant={brand === t.id ? "secondary" : "outline"}
                onClick={() => setBrand(t.id)}
                className="gap-2"
              >
                {brand === t.id && <Check className="h-4 w-4" />} {t.label}
              </Button>
            ))}
          </div>

          <Separator />

          {/* Live preview */}
          <div className="grid gap-4 md:grid-cols-2">
            <PaletteSwatches />
            <UiPreview />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-full border"
        style={{
          backgroundColor: `var(${varName})`,
          borderColor: `var(--border)`,
        }}
      />
      <div className="text-sm">
        <div className="font-medium">{name}</div>
        <div className="text-muted-foreground text-xs">{varName}</div>
      </div>
    </div>
  );
}

function PaletteSwatches() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Swatch name="Primary" varName="--primary" />
          <Swatch name="Primary FG" varName="--primary-foreground" />
          <Swatch name="Accent" varName="--accent" />
          <Swatch name="Accent FG" varName="--accent-foreground" />
          <Swatch name="Muted" varName="--muted" />
          <Swatch name="Muted FG" varName="--muted-foreground" />
          <Swatch name="Border" varName="--border" />
          <Swatch name="Ring" varName="--ring" />
          <Swatch name="Background" varName="--background" />
          <Swatch name="Foreground" varName="--foreground" />
          <Swatch name="Card" varName="--card" />
          <Swatch name="Card FG" varName="--card-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function UiPreview() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">UI Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Badge>Badge</Badge>
        </div>
        <Input placeholder="Input" className="max-w-xs" />
        <Tabs defaultValue="one" className="w-full max-w-md">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
            <TabsTrigger value="three">Three</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/*
🔧 ADD THESE THEME VARIANTS TO app/globals.css (or a CSS module at :root)

@layer base {
  /* Default already defined in :root and .dark. Below are brand overrides. *\
  :root[data-theme="ocean"] {
    --primary: 199 89% 48%;
    --primary-foreground: 210 40% 98%;
    --accent: 199 89% 92%;
    --accent-foreground: 222 47% 11%;
    --ring: 199 89% 48%;
  }
  .dark[data-theme="ocean"] {
    --primary: 199 89% 60%;
    --primary-foreground: 222 47% 5%;
    --accent: 199 60% 22%;
    --accent-foreground: 210 40% 98%;
    --ring: 199 89% 60%;
  }

  :root[data-theme="grape"] {
    --primary: 270 91% 65%;
    --primary-foreground: 210 40% 98%;
    --accent: 270 100% 95%;
    --accent-foreground: 256 34% 20%;
    --ring: 270 91% 65%;
  }
  .dark[data-theme="grape"] {
    --primary: 270 91% 72%;
    --primary-foreground: 222 47% 6%;
    --accent: 270 34% 22%;
    --accent-foreground: 210 40% 98%;
    --ring: 270 91% 72%;
  }

  :root[data-theme="sunset"] {
    --primary: 24 95% 53%;
    --primary-foreground: 210 40% 98%;
    --accent: 24 95% 90%;
    --accent-foreground: 24 80% 20%;
    --ring: 24 95% 53%;
  }
  .dark[data-theme="sunset"] {
    --primary: 24 95% 62%;
    --primary-foreground: 222 47% 6%;
    --accent: 24 45% 22%;
    --accent-foreground: 210 40% 98%;
    --ring: 24 95% 62%;
  }

  :root[data-theme="emerald"] {
    --primary: 152 76% 40%;
    --primary-foreground: 210 40% 98%;
    --accent: 152 58% 92%;
    --accent-foreground: 156 33% 16%;
    --ring: 152 76% 40%;
  }
  .dark[data-theme="emerald"] {
    --primary: 152 65% 46%;
    --primary-foreground: 222 47% 6%;
    --accent: 152 34% 22%;
    --accent-foreground: 210 40% 98%;
    --ring: 152 65% 46%;
  }
}
*/
