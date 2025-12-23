import { useState, useEffect } from "react";
import type { BarcodeItem } from "@/types";
import { toast } from "sonner";

const STORAGE_KEY = "saved-barcodes";

export function useBarcodes() {
  const [barcodes, setBarcodes] = useState<BarcodeItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBarcodes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse barcodes", e);
      }
    }
  }, []);

  const saveToStorage = (items: BarcodeItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setBarcodes(items);
  };

  const addBarcode = (item: BarcodeItem) => {
    const newBarcodes = [item, ...barcodes];
    saveToStorage(newBarcodes);
    toast.success("Barcode saved successfully");
  };

  const updateBarcode = (id: string, data: Partial<BarcodeItem>) => {
    const newBarcodes = barcodes.map((b) =>
      b.id === id ? { ...b, ...data } : b
    );
    saveToStorage(newBarcodes);
    toast.success("Barcode updated");
  };

  const deleteBarcode = (id: string) => {
    const newBarcodes = barcodes.filter((b) => b.id !== id);
    saveToStorage(newBarcodes);
    toast.success("Barcode deleted");
  };

  const importBarcodes = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) throw new Error("Invalid format");
      
      const uniqueMap = new Map();
      barcodes.forEach(b => uniqueMap.set(b.id, b));
      parsed.forEach((b: BarcodeItem) => uniqueMap.set(b.id, b));
      
      const newBarcodes = Array.from(uniqueMap.values()).sort((a, b) => b.createdAt - a.createdAt);
      
      saveToStorage(newBarcodes);
      toast.success("Barcodes imported successfully");
      return true;
    } catch (e) {
      toast.error("Failed to import: Invalid JSON");
      return false;
    }
  };

  const exportBarcodes = () => {
    return JSON.stringify(barcodes, null, 2);
  };

  return {
    barcodes,
    addBarcode,
    updateBarcode,
    deleteBarcode,
    importBarcodes,
    exportBarcodes,
  };
}
