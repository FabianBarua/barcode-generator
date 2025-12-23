import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBarcodes } from "@/hooks/use-barcodes";
import { Trash2, Edit, Search } from "lucide-react";
import type { BarcodeItem } from "@/types";
import Barcode from "react-barcode";
import { useState } from "react";

interface BarcodeLibraryProps {
  onLoad: (item: BarcodeItem) => void;
}

export function BarcodeLibrary({ onLoad }: BarcodeLibraryProps) {
  const { barcodes, deleteBarcode } = useBarcodes();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredBarcodes = barcodes.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.includes(search)
  );

  const handleLoad = (item: BarcodeItem) => {
    onLoad(item);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Library ({barcodes.length})</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Saved Barcodes</SheetTitle>
          <SheetDescription>
            Manage your saved EAN-13 barcodes.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search barcodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] mt-4 pr-4">
          <div className="flex flex-col gap-4">
            {filteredBarcodes.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {barcodes.length === 0 ? "No saved barcodes yet." : "No matching barcodes found."}
              </p>
            )}
            {filteredBarcodes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 border p-4 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLoad(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteBarcode(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-white p-2 rounded flex justify-center overflow-hidden">
                   <Barcode 
                     value={item.code}
                     {...item.config}
                     height={50} // Preview height
                     width={1.5} // Preview width
                   />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
