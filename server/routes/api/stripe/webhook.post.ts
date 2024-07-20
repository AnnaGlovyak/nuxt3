import stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PaymentIntent = {
  id: string;
};

const STRIPE_WEBHOOK_SECRET = useRuntimeConfig().stripeWebhookSecret;

export default defineEventHandler(async (event) => {
  const signature = getHeader(event, "stripe-signature");
  const body = await readRawBody(event);
  // Verify stripe signature
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 400,
      statusMessage: "invalid signature",
    });
  }

  if (stripeEvent.type === "payment_intent.succeeded") {
    await handlePaymentIntentSucceeded(stripeEvent.data.object);
  } else if (stripeEvent.type === "payment_intent.payment_failed") {
    await handlePaymentIntentFailed(stripeEvent.data.object);
  }

  async function handlePaymentIntentSucceeded(paymentIntent: PaymentIntent) {
    // Verify the related course purchase
    try {
      await prisma.coursePurchase.update({
        where: {
          paymentId: paymentIntent.id,
        },
        data: {
          verified: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: "Error verifying purchase",
      });
    }
  }

  async function handlePaymentIntentFailed(paymentIntent: PaymentIntent) {
    // Clean up the course purchase
    try {
      await prisma.coursePurchase.delete({
        where: {
          paymentId: paymentIntent.id,
        },
      });
    } catch (error) {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: "Error removing purchase",
      });
    }
  }

  return 200;
});
