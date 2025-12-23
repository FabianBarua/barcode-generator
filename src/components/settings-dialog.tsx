import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useBarcodeStore } from "@/store/barcode-store";
import { Moon, Sun, Upload, Download, Settings } from "lucide-react";
import { useRef } from "react";

export function SettingsDialog() {
  const { theme, setTheme } = useTheme();
  const exportBarcodes = useBarcodeStore((state) => state.exportBarcodes);
  const importBarcodes = useBarcodeStore((state) => state.importBarcodes);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportBarcodes();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        importBarcodes(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure application preferences and manage data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <div className="flex gap-2">
               <Button 
                 variant={theme === "light" ? "default" : "outline"} 
                 size="icon"
                 onClick={() => setTheme("light")}
               >
                 <Sun className="h-4 w-4" />
               </Button>
               <Button 
                 variant={theme === "dark" ? "default" : "outline"} 
                 size="icon"
                 onClick={() => setTheme("dark")}
               >
                 <Moon className="h-4 w-4" />
               </Button>
            </div>
          </div>
          
          <div className="space-y-2">
             <Label>Data Management</Label>
             <div className="flex gap-2">
                <Button onClick={handleExport} className="w-full">
                   <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                   <Upload className="mr-2 h-4 w-4" /> Import Data
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImport}
                />
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
