import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log(
  "Stripe key loaded:",
  stripeKey ? `YES (starts with ${stripeKey.substring(0, 12)})` : "NO - undefined"
);

export const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      })
    : null;

export const stripe = stripeKey ? new Stripe(stripeKey) : null;
