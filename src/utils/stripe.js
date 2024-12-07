// export const createPaymentIntent = async (
//   stripe,
//   { amount, currency, customerId },
// ) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency: currency || "usd",
//     automatic_payment_methods: { enabled: true },
//     customer: customerId,
//     off_session: true,
//   });
//   console.log(`Client secret: ${paymentIntent.client_secret}`);
//   return paymentIntent.client_secret;
// };

// export const createPaymentIntent = async (stripe, data) => {
//   const existingUser = await stripe.customers.search({
//     query: `name:'${data.name}' AND email:'${data.email}'`,
//   });
//   let customerId;
//   if (existingUser?.data?.length === 0) {
//     const customer = await stripe.customers.create({
//       name: data.name,
//       email: data.email,
//     });
//     customerId = customer?.id;
//   } else {
//     customerId = existingUser?.data[0].id;
//   }
//   //   const paymentIntent = await stripe.paymentIntents.create({
//   //     amount: data.amount,
//   //     currency: data.currency || "usd",
//   //     payment_method_types: ["card"],
//   //     customer: customerId,
//   //   });
//   return {
//     stripeCustomerId: customerId,
//     clientSecret: paymentIntent?.client_secret,
//     paymentIntentId: paymentIntent?.id,
//   };
// };

export const createCheckoutSession = async (stripe, data) => {
  const existingUser = await stripe.customers.search({
    query: `name:'${data.name}' AND email:'${data.email}'`,
  });
  let customerId;
  if (existingUser?.data?.length === 0) {
    const customer = await stripe.customers.create({
      name: data.name,
      email: data.email,
    });
    customerId = customer?.id;
  } else {
    customerId = existingUser?.data[0].id;
  }
  const session = await stripe.checkout.sessions.create({
    mode: "setup",
    currency: "usd",
    customer: customerId || "",
    success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    stripeCustomerId: customerId,
    stripeSessionId: session?.id,
    saveCardUrl: session?.url,
  };
};

export const createPaymentIntent = async (stripe, data) => {
  const { setup_intent } = await stripe.checkout.sessions.retrieve(
    data.stripeSessionId,
  );
  const { payment_method, customer } = await stripe.setupIntents.retrieve(
    setup_intent,
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data?.amount,
    currency: "usd",
    customer,
    payment_method,
    confirm: true,
    return_url: "http://localhost:5173",
  });
  //   console.log(paymentIntent);
  return paymentIntent;
};
