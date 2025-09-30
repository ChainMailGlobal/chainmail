export const formFieldGuidance: Record<
  string,
  {
    description: string
    importance: string
    commonMistakes: string[]
    example: string
  }
> = {
  firstName: {
    description: "Enter your legal first name exactly as it appears on your government-issued ID.",
    importance: "This must match your identification document for USPS verification and compliance.",
    commonMistakes: [
      "Using nicknames instead of legal names",
      "Including middle names in the first name field",
      "Misspelling or using abbreviations",
    ],
    example: "John",
  },
  lastName: {
    description: "Enter your legal last name (surname/family name) exactly as shown on your ID.",
    importance: "Required for identity verification and must match your government-issued identification.",
    commonMistakes: [
      "Omitting suffixes (Jr., Sr., III)",
      "Using maiden names when ID shows married name",
      "Including titles (Dr., Mr., Mrs.)",
    ],
    example: "Smith",
  },
  dateOfBirth: {
    description: "Enter your date of birth in MM/DD/YYYY format as shown on your identification.",
    importance: "Used to verify your identity and ensure you meet age requirements for CMRA services.",
    commonMistakes: [
      "Using incorrect date format",
      "Transposing month and day",
      "Entering current date instead of birth date",
    ],
    example: "01/15/1985",
  },
  email: {
    description: "Provide a valid email address where you can receive important notifications and documents.",
    importance: "Used for sending Form 1583 copies, verification codes, and service updates.",
    commonMistakes: [
      "Typos in email address",
      "Using temporary or disposable email addresses",
      "Providing email you don't regularly check",
    ],
    example: "john.smith@example.com",
  },
  phone: {
    description: "Enter your primary phone number including area code for contact and verification purposes.",
    importance: "Required for identity verification, appointment scheduling, and urgent notifications.",
    commonMistakes: ["Forgetting area code", "Using disconnected numbers", "Providing numbers you can't answer"],
    example: "(555) 123-4567",
  },
  streetAddress: {
    description: "Enter your complete residential street address including apartment or unit number.",
    importance: "Must match the address on your proof of address document for USPS compliance.",
    commonMistakes: [
      "Using PO Box instead of physical address",
      "Omitting apartment/unit numbers",
      "Using business address instead of residential",
    ],
    example: "123 Main Street, Apt 4B",
  },
  city: {
    description: "Enter the city name for your residential address.",
    importance: "Must match your proof of address document exactly.",
    commonMistakes: [
      "Using abbreviations",
      "Misspelling city names",
      "Using neighborhood names instead of official city",
    ],
    example: "San Francisco",
  },
  state: {
    description: "Select your state from the dropdown or enter the two-letter state code.",
    importance: "Required for address verification and jurisdiction compliance.",
    commonMistakes: [
      "Selecting wrong state",
      "Using full state name instead of abbreviation",
      "Confusing similar state codes",
    ],
    example: "CA",
  },
  zipCode: {
    description: "Enter your 5-digit ZIP code or 9-digit ZIP+4 code.",
    importance: "Must match your proof of address for USPS verification.",
    commonMistakes: ["Using wrong ZIP code", "Omitting leading zeros", "Using ZIP code from old address"],
    example: "94102",
  },
  idType: {
    description: "Select the type of government-issued photo ID you're providing for verification.",
    importance: "Determines what information will be verified and must be a valid, unexpired document.",
    commonMistakes: ["Selecting wrong ID type", "Using expired documents", "Providing non-government issued IDs"],
    example: "Driver's License",
  },
  idNumber: {
    description: "Enter the identification number exactly as shown on your government-issued ID.",
    importance: "Used for identity verification and must match your physical ID document.",
    commonMistakes: ["Transposing numbers", "Including dashes or spaces when not present", "Using partial numbers"],
    example: "D1234567",
  },
  idIssuingState: {
    description: "Enter the state that issued your identification document.",
    importance: "Required for verification and must match the issuing authority on your ID.",
    commonMistakes: [
      "Using current residence state instead of issuing state",
      "Confusing state abbreviations",
      "Using country for passports",
    ],
    example: "CA",
  },
  idExpirationDate: {
    description: "Enter the expiration date shown on your ID in MM/DD/YYYY format.",
    importance: "Your ID must be current and not expired for USPS acceptance.",
    commonMistakes: ["Using issue date instead of expiration", "Incorrect date format", "Providing expired IDs"],
    example: "12/31/2028",
  },
}

export function getFieldGuidance(fieldName: string): string {
  const guidance = formFieldGuidance[fieldName]
  if (!guidance) {
    return `Please enter your ${fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}.`
  }

  return `${guidance.description}\n\n**Why it matters:** ${guidance.importance}\n\n**Common mistakes:**\n${guidance.commonMistakes.map((m) => `• ${m}`).join("\n")}\n\n**Example:** ${guidance.example}`
}
