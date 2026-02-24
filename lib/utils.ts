export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 07 or 01, replace with 254
  if (cleaned.startsWith('07')) {
    return '2547' + cleaned.slice(2);
  }
  if (cleaned.startsWith('01')) {
    return '2541' + cleaned.slice(2);
  }
  
  // If it starts with 254, return as is (if valid length)
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return cleaned;
  }
  
  // If it's just 7XXXXXXXX or 1XXXXXXXX
  if (cleaned.length === 9) {
    return '254' + cleaned;
  }
  
  return cleaned;
}

export function isValidPhone(phone: string): boolean {
  const formatted = formatPhone(phone);
  return /^254[17]\d{8}$/.test(formatted);
}
