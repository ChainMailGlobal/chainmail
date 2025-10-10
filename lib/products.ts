export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

// Source of truth for all subscription plans
export const PRODUCTS: Product[] = [
  {
    id: "hero",
    name: "Hero Plan",
    description:
      "Zero to Hero journey starts here - Essential compliance features for single location (up to 10 users)",
    priceInCents: 0, // Free
  },
  {
    id: "hero-plus",
    name: "Hero+ Plan",
    description: "Enhanced workflow automation for growing teams - Up to 100 users",
    priceInCents: 4900, // $49/month
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "Multi-location management with advanced features - Up to 500 clients",
    priceInCents: 14900, // $149/month
  },
  {
    id: "pro-plus",
    name: "Pro+ Plan",
    description: "Multi-location enterprise solution - Up to 1,000 users",
    priceInCents: 29900, // $299/month
  },
]
