export function normalizeKenyanPhone(phone: string) {
  let value = phone.replace(/\s+/g, "");

  if (value.startsWith("+254")) {
    value = value.substring(1);
  }

  if (value.startsWith("07")) {
    value = "254" + value.substring(1);
  }

  if (value.startsWith("01")) {
    value = "254" + value.substring(1);
  }

  if (!/^254[17]\d{8}$/.test(value)) {
    throw new Error("Invalid Kenyan phone number");
  }

  return value;
}