import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BarcodeItem } from '@/types';
import { toast } from 'sonner';

interface BarcodeStore {
  barcodes: BarcodeItem[];
  addBarcode: (item: BarcodeItem) => void;
  updateBarcode: (id: string, data: Partial<BarcodeItem>) => void;
  deleteBarcode: (id: string) => void;
  importBarcodes: (json: string) => boolean;
  exportBarcodes: () => string;
}

export const useBarcodeStore = create<BarcodeStore>()(
  persist(
    (set, get) => ({
      barcodes: [],
      
      addBarcode: (item) => {
        set((state) => ({
          barcodes: [item, ...state.barcodes],
        }));
        toast.success("Barcode saved successfully");
      },
      
      updateBarcode: (id, data) => {
        set((state) => ({
          barcodes: state.barcodes.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }));
        toast.success("Barcode updated");
      },
      
      deleteBarcode: (id) => {
        set((state) => ({
          barcodes: state.barcodes.filter((b) => b.id !== id),
        }));
        toast.success("Barcode deleted");
      },
      
      importBarcodes: (json) => {
        try {
          const parsed = JSON.parse(json);
          if (!Array.isArray(parsed)) throw new Error("Invalid format");
          
          const uniqueMap = new Map();
          get().barcodes.forEach(b => uniqueMap.set(b.id, b));
          parsed.forEach((b: BarcodeItem) => uniqueMap.set(b.id, b));
          
          const newBarcodes = Array.from(uniqueMap.values()).sort(
            (a, b) => b.createdAt - a.createdAt
          );
          
          set({ barcodes: newBarcodes });
          toast.success("Barcodes imported successfully");
          return true;
        } catch (e) {
          toast.error("Failed to import: Invalid JSON");
          return false;
        }
      },
      
      exportBarcodes: () => {
        return JSON.stringify(get().barcodes, null, 2);
      },
    }),
    {
      name: 'saved-barcodes',
    }
  )
);
