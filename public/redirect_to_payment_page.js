
const PAYMENT_API_URL =
  "https://kamla-payment.vercel.app/api/payment-intention";

function renderRedirectToPaymentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectToPayment = urlParams.get("redirect_to_payment");

  if (redirectToPayment !== "true") {
    return;
  }

  var LogoImage = `
  <div style="aspect-ratio: 4.575875486381323 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 38px); position: relative; width: 174px;">
  <img 
    decoding="async"
    sizes="174px"
    srcset="https://framerusercontent.com/images/5wLIOveWu1wJuhKtpmhh22WSQoI.png?scale-down-to=512 512w,https://framerusercontent.com/images/5wLIOveWu1wJuhKtpmhh22WSQoI.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/5wLIOveWu1wJuhKtpmhh22WSQoI.png 1176w" src="https://framerusercontent.com/images/5wLIOveWu1wJuhKtpmhh22WSQoI.png" 
    alt="Kamla Logo"
    style="display: block; width: 100%; height: 100%; border-radius: inherit; object-position: center center; object-fit: cover; "
  >
  </div>
`;

  var RedirectingMessage = `
  <div style="display: flex; justify-content: center; align-items: center; gap: 32px;">
  <h2 style="color:#b9218b; font-size: 24px; font-weight: 700;">
    Redirecting to payment page 
    </h2>
    <div class="loader"></div>
`;

  document.body.innerHTML = `
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; gap: 50px; background-color: #F3DCF8;">
    ${LogoImage}
    ${RedirectingMessage}
  </div>
`;

  const PRICE_PER_ITEM = 600;
  const QUANTITY = 1;
  const TOTAL_PRICE = PRICE_PER_ITEM * QUANTITY;
  const PRODUCT_NAME = "Online Consultation";
  const PRODUCT_DESCRIPTION = "Online Consultation (30 minutes call)";
  const PAYMENT_REDIRECTION_URL = "";

  const payload = {
    orderDetails: {
      delivery_needed: false,
      amount: TOTAL_PRICE * 100,
      currency: "EGP",
      items: [
        {
          name: PRODUCT_NAME,
          quantity: QUANTITY,
          amount: PRICE_PER_ITEM * 100,
          description: PRODUCT_DESCRIPTION,
        },
      ],
    },
    billingData: {
      first_name: "Ahmed",
      last_name: "Bahaadine",
      email: "customer@example.com",
      phone_number: "+201555550425",

      // city: "N/A",
      // street: "N/A",
      // building: "N/A",
      // floor: "N/A",
      // apartment: "N/A",
      // state: "N/A",
    },
  };

  fetch(PAYMENT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.href = data.data.iframeUrl;
    });
}
renderRedirectToPaymentPage();
