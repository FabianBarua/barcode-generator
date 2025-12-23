export interface BarcodeConfig {
  format: "EAN13";
  width: number;
  height: number;
  displayValue: boolean;
  font: string;
  textAlign: "left" | "center" | "right";
  textPosition: "top" | "bottom";
  textMargin: number;
  fontSize: number;
  background: string;
  lineColor: string;
  margin: number;
}

export interface BarcodeItem {
  id: string;
  code: string;
  name: string;
  createdAt: number;
  config: BarcodeConfig;
}

export const DEFAULT_CONFIG: BarcodeConfig = {
  format: "EAN13",
  width: 2,
  height: 100,
  displayValue: true,
  font: "monospace",
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
};
