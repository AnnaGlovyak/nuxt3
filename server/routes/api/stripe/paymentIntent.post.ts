import stripe from "./stripe";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 97 * 100,
    currency: "usd",
    metadata: {
      email,
    },
  });

  return paymentIntent.client_secret;
});
