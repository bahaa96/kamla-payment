const PAYMENT_API_URL =
  "https://kamla-payment.vercel.app/api/payment-intention";
const FIREBASE_API_URL = "https://kamla-payment.vercel.app/api/get-submission";

async function renderRedirectToPaymentPage() {
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

  let customerData;
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  // Fetch customer data from Firebase with maximum 5 attempts
  while (
    (!customerData || !customerData.fullName || !customerData.phoneNumber) &&
    attempts < MAX_ATTEMPTS
  ) {
    attempts++;
    console.log(`Attempt ${attempts} of ${MAX_ATTEMPTS}`);

    const customerDataResponse = await fetch(
      `${FIREBASE_API_URL}?id=${responseId}`
    );
    if (!customerDataResponse.ok) {
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error("Failed to fetch customer data after maximum attempts");
      }
      console.error("Failed to fetch customer data, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
      continue;
    }

    customerData = await customerDataResponse.json();
    if (!customerData || !customerData.fullName || !customerData.phoneNumber) {
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error("Invalid customer data after maximum attempts");
      }
      console.error("Invalid customer data, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
    }
  }

  if (!customerData || !customerData.fullName || !customerData.phoneNumber) {
    throw new Error("Could not retrieve valid customer data after 5 attempts");
  }

  const customerName = customerData.fullName;
  const phoneNumber = customerData.phoneNumber;
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

  try {
    const paymentResponse = await fetch(PAYMENT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!paymentResponse.ok) {
      throw new Error("Failed to process payment");
    }
    const paymentData = await paymentResponse.json();
    window.location.href = paymentData.data.iframeUrl;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("content-container").innerHTML = ErrorMessage;
    document.getElementById("error-message").innerText =
      error.message || "An error occurred. Please try again.";
  }
}

renderRedirectToPaymentPage();
