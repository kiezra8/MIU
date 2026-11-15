// Formatting utilities for MIU (Made In Uganda)

export function formatUGX(amount: number): string {
  if (isNaN(amount)) return "UGX 0";
  return `UGX ${Math.round(amount).toLocaleString("en-UG")}`;
}

export function calculateDiscountPercentage(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatUgandanPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("256")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0")) {
    return `+256${cleaned.slice(1)}`;
  }
  return `+256${cleaned}`;
}
