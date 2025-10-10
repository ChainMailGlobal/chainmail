"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function startCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Free plan doesn't need checkout
  if (product.priceInCents === 0) {
    throw new Error("Free plan does not require checkout")
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mailboxhero.pro"}/signup?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    customerEmail: session.customer_details?.email,
    customerName: session.customer_details?.name,
    subscriptionId: session.subscription,
    status: session.status,
  }
}
