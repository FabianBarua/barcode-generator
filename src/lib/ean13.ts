export const BRAZIL_PREFIXES = ["789", "790"];

export const COUNTRY_PREFIXES = [
  { label: "Brazil (789)", value: "789" },
  { label: "Brazil (790)", value: "790" },
  { label: "USA (000-139)", value: "050" }, // Using a sample valid prefix
  { label: "Argentina (779)", value: "779" },
  { label: "China (690-699)", value: "690" },
  { label: "Germany (400-440)", value: "400" },
  { label: "Japan (450-459)", value: "450" },
  { label: "Russia (460-469)", value: "460" },
  { label: "UK (500-509)", value: "500" },
];

export function calculateChecksum(digits: string): number {
  if (digits.length !== 12) {
    throw new Error("Input must be 12 digits to calculate checksum for EAN-13");
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      sum += digit * 1;
    } else {
      sum += digit * 3;
    }
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

export function validateEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  const digits = code.slice(0, 12);
  const checksum = parseInt(code[12], 10);
  return calculateChecksum(digits) === checksum;
}

export function generateEAN13(prefix: string = "789"): string {
  // Ensure prefix is valid digits
  if (!/^\d+$/.test(prefix)) {
    prefix = "789";
  }
  
  // We need 12 digits total before checksum.
  // Prefix length varies.
  const remainingLength = 12 - prefix.length;
  if (remainingLength < 0) {
     // If prefix is too long, truncate
     prefix = prefix.slice(0, 12);
  }
  
  let randomPart = "";
  for (let i = 0; i < (12 - prefix.length); i++) {
    randomPart += Math.floor(Math.random() * 10).toString();
  }
  
  const codeWithoutChecksum = prefix + randomPart;
  const checksum = calculateChecksum(codeWithoutChecksum);
  
  return codeWithoutChecksum + checksum;
}
