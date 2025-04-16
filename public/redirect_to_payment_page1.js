const PAYMENT_API_URL =
  "https://kamla-payment.vercel.app/api/payment-intention";
const FIREBASE_API_URL = "https://kamla-payment.vercel.app/api/get-submission";

function renderRedirectToPaymentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectToPayment = urlParams.get("redirect_to_payment");
  const responseId = urlParams.get("response_id");

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

  var LoadingMessage = `
  <div style="display: flex; justify-content: center; align-items: center; gap: 32px;">
    <h2 style="color:#b9218b; font-size: 24px; font-weight: 700;">
      Redirecting to payment page 
    </h2>
    <div class="loader"></div>
  </div>
`;

  var ErrorMessage = `
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 16px;">
    <h2 style="color:#b9218b; font-size: 24px; font-weight: 700;">
      Error
    </h2>
    <p style="color:#333; font-size: 18px;" id="error-message">
      An error occurred while processing your payment.
    </p>
  </div>
`;

  document.body.innerHTML = `
  <style>
    .loader {
      border: 5px solid #f3f3f3;
      border-radius: 50%;
      border-top: 5px solid #b9218b;
      width: 30px;
      height: 30px;
      animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; gap: 50px; background-color: #F3DCF8;">
    ${LogoImage}
    <div id="content-container">
      ${LoadingMessage}
    </div>
  </div>
`;

  if (!responseId) {
    document.getElementById("content-container").innerHTML = ErrorMessage;
    document.getElementById("error-message").innerText =
      "Missing response ID. Please try again.";
    return;
  }

  const PRICE_PER_ITEM = 600;
  const QUANTITY = 1;
  const TOTAL_PRICE = PRICE_PER_ITEM * QUANTITY;
  const PRODUCT_NAME = "Online Consultation";
  const PRODUCT_DESCRIPTION = "Online Consultation (30 minutes call)";

  // Fetch customer data from Firebase
  fetch(`${FIREBASE_API_URL}?id=${responseId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.fullName || !data.phoneNumber) {
        throw new Error("Invalid customer data");
      }

      const customerName = data.fullName;
      const phoneNumber = data.phoneNumber;

      const customerFirstName = customerName.split(" ")[0];
      const customerLastName = customerName.split(" ").slice(1).join(" ") || ""; // Handle single name or multiple last names

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
          first_name: customerFirstName,
          last_name: customerLastName,
          email: data.email || "customer@example.com",
          phone_number: phoneNumber,
        },
      };

      return fetch(PAYMENT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to process payment");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = data.data.iframeUrl;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("content-container").innerHTML = ErrorMessage;
      document.getElementById("error-message").innerText =
        error.message || "An error occurred. Please try again.";
    });
}
renderRedirectToPaymentPage();
