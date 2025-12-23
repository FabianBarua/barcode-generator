import { useState, useRef, useEffect } from "react";
import Barcode from "react-barcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { generateEAN13, validateEAN13, calculateChecksum } from "@/lib/ean13";
import { useBarcodeStore } from "@/store/barcode-store";
import { type BarcodeConfig, DEFAULT_CONFIG, type BarcodeItem, type BarcodeFormat } from "@/types";
import { Download, Save, RefreshCw, Settings2, Plus, Copy } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COUNTRY_PREFIXES } from "@/lib/ean13";

interface BarcodeGeneratorProps {
  initialItem?: BarcodeItem | null;
}

export function BarcodeGenerator({ initialItem }: BarcodeGeneratorProps) {
  const addBarcode = useBarcodeStore((state) => state.addBarcode);
  const updateBarcode = useBarcodeStore((state) => state.updateBarcode);
  
  // Load persisted format or use default
  const getInitialConfig = (): BarcodeConfig => {
    if (initialItem?.config) return initialItem.config;
    
    const savedFormat = localStorage.getItem("barcode-format");
    if (savedFormat) {
      return { ...DEFAULT_CONFIG, format: savedFormat as BarcodeFormat };
    }
    return DEFAULT_CONFIG;
  };
  
  const [code, setCode] = useState(initialItem?.code || "SAMPLE123");
  const [config, setConfig] = useState<BarcodeConfig>(getInitialConfig());
  const [showConfig, setShowConfig] = useState(!!initialItem);
  const [editingId, setEditingId] = useState<string | null>(initialItem?.id || null);
  const [selectedPrefix, setSelectedPrefix] = useState("789");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [barcodeName, setBarcodeName] = useState("");
  const barcodeRef = useRef<HTMLDivElement>(null);

  // Persist format to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("barcode-format", config.format);
  }, [config.format]);

  // Reset when initialItem changes
  useEffect(() => {
    if (initialItem) {
      setCode(initialItem.code);
      setConfig(initialItem.config);
      setEditingId(initialItem.id);
      setShowConfig(true);
      setBarcodeName(initialItem.name);
    }
  }, [initialItem]);

  // Update code when format changes to a compatible value
  useEffect(() => {
    // Don't auto-change if editing or if code is already valid for format
    if (editingId) return;
    
    if (config.format === "EAN13" && !validateEAN13(code)) {
      setCode(generateEAN13(selectedPrefix));
    } else if (config.format === "EAN8" && (code.length !== 8 || !/^\d{8}$/.test(code))) {
      setCode(Math.random().toString().slice(2, 9) + "0");
    } else if (config.format === "UPC" && (code.length !== 12 || !/^\d{12}$/.test(code))) {
      setCode(Math.random().toString().slice(2, 13) + "0");
    } else if (["CODE128", "CODE39", "codabar"].includes(config.format) && /^\d{8,13}$/.test(code)) {
      // If switching from numeric format to text format, provide a text example
      setCode("SAMPLE" + Math.floor(Math.random() * 1000));
    }
  }, [config.format]);

  const handleGenerate = () => {
    if (config.format === "EAN13") {
      setCode(generateEAN13(selectedPrefix));
    } else if (config.format === "EAN8") {
      setCode(Math.random().toString().slice(2, 9) + "0");
    } else {
      setCode("SAMPLE" + Math.floor(Math.random() * 10000));
    }
    setEditingId(null);
    setBarcodeName("");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (config.format === "EAN13" || config.format === "EAN8" || config.format === "UPC") {
      setCode(val.replace(/\D/g, "").slice(0, config.format === "EAN13" ? 13 : config.format === "EAN8" ? 8 : 12));
    } else {
      setCode(val.slice(0, 80));
    }
  };

  const isValid = config.format === "EAN13" ? validateEAN13(code) : code.length > 0;

  const handleSave = () => {
    if (!isValid) {
      toast.error("Invalid barcode");
      return;
    }
    
    if (editingId) {
      updateBarcode(editingId, {
        code,
        config,
        // We could allow updating name here too if we wanted, 
        // but for now let's keep it simple or maybe add a rename feature later.
        // Actually, let's update the name if it's in the state? 
        // But we only set it on initial load. 
        // Let's just save config/code for edit mode for now as per request "al guardar un barcode poder ponerle nombre" (usually implies new).
      });
      toast.success("Barcode updated");
    } else {
      setBarcodeName(`${config.format} ${code}`);
      setSaveDialogOpen(true);
    }
  };

  const confirmSave = () => {
    const newId = crypto.randomUUID();
    addBarcode({
      id: newId,
      code,
      name: barcodeName || `${config.format} ${code}`,
      createdAt: Date.now(),
      config,
    });
    setSaveDialogOpen(false);
    toast.success(`"${barcodeName || code}" saved to library`);
    
    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Generate new barcode after saving
    handleGenerate();
    setEditingId(null);
    setBarcodeName("");
  };

  const handleNew = () => {
    setCode("SAMPLE123");
    setConfig(DEFAULT_CONFIG);
    setEditingId(null);
    setShowConfig(false);
    setBarcodeName("");
  };

  const handleCopySvg = async () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    try {
      await navigator.clipboard.writeText(svgData);
      toast.success("SVG copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy SVG");
    }
  };

  const handleDownload = () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${config.format}-${code}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto p-4 w-full">
       {/* Generator Controls */}
       <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 items-end">
             <div className="grid w-full gap-1.5">
                <div className="flex gap-2">
                  <Select 
                    value={config.format} 
                    onValueChange={(v: BarcodeFormat) => setConfig({...config, format: v})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CODE128">Code 128</SelectItem>
                      <SelectItem value="CODE39">Code 39</SelectItem>
                      <SelectItem value="EAN13">EAN-13</SelectItem>
                      <SelectItem value="EAN8">EAN-8</SelectItem>
                      <SelectItem value="UPC">UPC</SelectItem>
                      <SelectItem value="ITF14">ITF-14</SelectItem>
                      <SelectItem value="MSI">MSI</SelectItem>
                      <SelectItem value="pharmacode">Pharmacode</SelectItem>
                      <SelectItem value="codabar">Codabar</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.format === "EAN13" && (
                    <Select value={selectedPrefix} onValueChange={setSelectedPrefix}>
                      <SelectTrigger className="w-[100px]" title="Country prefix">
                        <SelectValue placeholder="Prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_PREFIXES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Input 
                    id="code" 
                    value={code} 
                    onChange={handleCodeChange} 
                    className="text-lg font-mono tracking-widest flex-1"
                    placeholder={config.format === "CODE128" || config.format === "CODE39" ? "Enter text or numbers" : "Enter code"}
                  />
                </div>
             </div>
             
             <div className="flex gap-2">
               <Button onClick={handleGenerate} variant="outline" size="icon" title="Generate Random">
                  <RefreshCw className="h-4 w-4" />
               </Button>
               {editingId && (
                 <Button onClick={handleNew} variant="outline" size="icon" title="New">
                    <Plus className="h-4 w-4" />
                 </Button>
               )}
             </div>
          </div>
          
          {config.format === "EAN13" && !isValid && code.length === 13 && (
             <p className="text-destructive text-sm">Invalid Checksum. Expected: {calculateChecksum(code.slice(0,12))}</p>
          )}
       </div>

       {/* Preview */}
       <Card className="overflow-hidden flex justify-center items-center p-8 bg-white dark:bg-zinc-900 transition-colors border-2 border-dashed min-h-[200px]">
          <div ref={barcodeRef} className="bg-white p-4 rounded-xl">
             <Barcode 
               value={code || "SAMPLE"}
               format={config.format}
               width={config.width}
               height={config.height}
               displayValue={config.displayValue}
               font={config.font}
               textAlign={config.textAlign}
               textPosition={config.textPosition}
               textMargin={config.textMargin}
               fontSize={config.fontSize}
               background={config.background}
               lineColor={config.lineColor}
               margin={config.margin}
             />
          </div>
       </Card>

       {/* Actions */}
       <div className="flex gap-2 justify-center flex-wrap">
          <Button onClick={() => setShowConfig(!showConfig)} variant="outline">
             <Settings2 className="mr-2 h-4 w-4" /> Customize
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
             <Save className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Save"}
          </Button>
          <Button onClick={handleDownload} variant="secondary" disabled={!isValid}>
             <Download className="mr-2 h-4 w-4" /> Download SVG
          </Button>
          <Button onClick={handleCopySvg} variant="outline" disabled={!isValid} title="Copy SVG Code">
             <Copy className="h-4 w-4" />
          </Button>
       </div>

       {/* Customization Panel */}
       {showConfig && (
         <Card>
           <CardContent className="pt-6 grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <Label>Width</Label>
                       <span className="text-xs text-muted-foreground">{config.width}</span>
                    </div>
                    <Slider 
                      value={[config.width]} 
                      min={1} max={4} step={0.5}
                      onValueChange={([v]: number[]) => setConfig({...config, width: v})} 
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <Label>Height</Label>
                       <span className="text-xs text-muted-foreground">{config.height}</span>
                    </div>
                    <Slider 
                      value={[config.height]} 
                      min={30} max={200} step={5}
                      onValueChange={([v]: number[]) => setConfig({...config, height: v})} 
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <Label>Font Size</Label>
                       <span className="text-xs text-muted-foreground">{config.fontSize}</span>
                    </div>
                    <Slider 
                      value={[config.fontSize]} 
                      min={10} max={40} step={1}
                      onValueChange={([v]: number[]) => setConfig({...config, fontSize: v})} 
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <Label>Margin</Label>
                       <span className="text-xs text-muted-foreground">{config.margin}</span>
                    </div>
                    <Slider 
                      value={[config.margin]} 
                      min={0} max={50} step={1}
                      onValueChange={([v]: number[]) => setConfig({...config, margin: v})} 
                    />
                 </div>
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                 <Label>Display Value</Label>
                 <Switch 
                   checked={config.displayValue} 
                   onCheckedChange={(c: boolean) => setConfig({...config, displayValue: c})} 
                 />
              </div>
           </CardContent>
         </Card>
       )}

       <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Barcode</DialogTitle>
            <DialogDescription>
              Give a name to your barcode to identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={barcodeName}
                onChange={(e) => setBarcodeName(e.target.value)}
                className="col-span-3"
                placeholder="My Product"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
