import { ThemeProvider } from "@/components/theme-provider";
import { BarcodeGenerator } from "@/components/barcode-generator-v2";
import { BarcodeLibrary } from "@/components/barcode-library";
import { SettingsDialog } from "@/components/settings-dialog";
import { Toaster } from "@/components/ui/sonner";
import type { BarcodeItem } from "@/types";
import { useState } from "react";

function App() {
  const [currentItem, setCurrentItem] = useState<BarcodeItem | null>(null);
  const [generatorKey, setGeneratorKey] = useState(0);

  const handleLoadItem = (item: BarcodeItem) => {
    setCurrentItem(item);
    setGeneratorKey((prev) => prev + 1);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <h1 className="text-xl font-bold tracking-tight">EAN-13 Generator</h1>
          </div>
          <div className="flex items-center gap-2">
             <BarcodeLibrary onLoad={handleLoadItem} />
             <SettingsDialog />
          </div>
        </header>
        
        <main className="flex-1 flex flex-col justify-center p-4">
           <BarcodeGenerator key={generatorKey} initialItem={currentItem} />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
