import Stripe from "stripe";
const config = useRuntimeConfig();
const stripe = Stripe(config.stripeSecret);

export default stripe;
