require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  console.log('→ create-payment-intent body:', req.body);
  try {
    const { amount = 1099, currency = 'usd' } = req.body;
    // automatic_payment_methods accepts cards (including Apple Pay) for you
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });
    console.log('← client_secret:', paymentIntent.client_secret);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('‼️ Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
