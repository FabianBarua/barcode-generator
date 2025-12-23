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
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useBarcodeStore } from "@/store/barcode-store";
import { Moon, Sun, Upload, Download, Settings, FileJson, Database, Palette } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export function SettingsDialog() {
  const { theme, setTheme } = useTheme();
  const exportBarcodes = useBarcodeStore((state) => state.exportBarcodes);
  const importBarcodes = useBarcodeStore((state) => state.importBarcodes);
  const barcodes = useBarcodeStore((state) => state.barcodes);
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
    URL.revokeObjectURL(url);
    toast.success("Backup exported successfully");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Customize your experience and manage your data
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 ">
          {/* Theme Section */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Appearance</Label>
            </div>
            <div className="flex items-center justify-between pl-6">
              <span className="text-sm text-muted-foreground">Choose your theme</span>
              <div className="flex gap-2">
                <Button 
                  variant={theme === "light" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="w-20"
                >
                  <Sun className="mr-1 h-4 w-4" />
                  Light
                </Button>
                <Button 
                  variant={theme === "dark" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="w-20"
                >
                  <Moon className="mr-1 h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Data Management Section */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Data Management</Label>
            </div>
            <div className="pl-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Stored Barcodes</p>
                  <p className="text-xs text-muted-foreground">{barcodes.length} barcode{barcodes.length !== 1 ? 's' : ''} saved</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleExport} variant="outline" className="flex-1" disabled={barcodes.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImport}
                />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                <FileJson className="inline h-3 w-3 mr-1" />
                Backup your barcodes as JSON
              </p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
