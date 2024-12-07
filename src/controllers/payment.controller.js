// import { createPaymentIntent } from "../utils/stripe.js";

// create payment intent controller
const createPaymentIntent = (stripe) => async (request, reply) => {
  const exisitingCustomer = await stripe.customers.search({
    query: "name:'Example User' AND email:'example@gmail.com'",
  });
  console.log(exisitingCustomer);
  let customerId;
  if (exisitingCustomer.data.length === 0) {
    const customer = await stripe.customers.create({
      name: "Example User",
      email: "examplet@gmail.com",
    });
    customerId = customer?.id;
  }
  customerId = exisitingCustomer?.data[0]?.id;

  //   NOTE:=================================
  console.log(`Customer: ${customerId}`);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    customer: customerId,
  });
  console.log(`Client secret: ${paymentIntent.client_secret}`);
  const clientSecret = paymentIntent?.client_secret;
  reply.send({ clientSecret });
};

export { createPaymentIntent };
