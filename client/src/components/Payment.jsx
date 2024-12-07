import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

function Payment(props) {
  const { stripePromise } = props;
  const [clientSecret, setClientSecret] = useState(
    "pi_3QQSAdI3FiokkL4O1AjuLNr7_secret_UES2KIQ48YwumzIExu5t6RkAP",
  );

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:8000/api/v1/p/create-payment-intent")
      .then((res) => res.json())
      .then(({ clientSecret }) => setClientSecret(clientSecret));
  }, []);

  return (
    <>
      <h1>Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
