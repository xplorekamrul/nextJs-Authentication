export function normalizePhoneNumber(phone: string, country: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Country code mappings
  const countryCodes: { [key: string]: string } = {
    US: "+1",
    CA: "+1",
    GB: "+44",
    IN: "+91",
    AU: "+61",
    DE: "+49",
    FR: "+33",
    BD: "+880",
    // Add more countries as needed
  }

  const countryCode = countryCodes[country.toUpperCase()] || "+1"

  // If phone already starts with country code, return as is
  if (digits.startsWith(countryCode.replace("+", ""))) {
    return "+" + digits
  }

  // Add country code
  return countryCode + digits
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic validation for international phone numbers
  const phoneRegex = /^\+[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}
