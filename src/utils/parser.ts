export const extractQuantity = (text: string): number | null => {
  if (!text) return null;
  
  // Simple regex to find the first sequence of digits
  // Works for MVP cases like "I need 200 bags" or "50"
  const match = text.match(/\b(\d+)\b/);
  
  if (match) {
    const qty = parseInt(match[1], 10);
    if (qty > 0) return qty;
  }
  
  return null;
};
