function renderPaymentStatusPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get("payment_status");

  if (!paymentStatus) {
    return;
  }

  if (paymentStatus == "success") {
    var SuccessImage = `
      <div style="aspect-ratio: 4.575875486381323 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 38px); position: relative; width: 174px;">
      <img 
        decoding="async"
        sizes="174px"
        srcset="https://funtura.in/tvm/wp-content/themes/funtura/assets/images/success.svg"
        alt="Payment Success Image"
        style="display: block; width: 100%; height: 100%; border-radius: inherit; object-position: center center; object-fit: cover; "
      >
      </div>
    `;

    var successMessage = `
      <div style="display: flex; justify-content: center; align-items: center; gap: 32px;">
      <h2 style="color:#b9218b; font-size: 24px; font-weight: 700;">
        Payment Success
        </h2>
    `;

    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; gap: 50px; background-color: #F3DCF8;">
        ${SuccessImage}
        ${successMessage}
      </div>
    `;
  } else {
    var ErrorImage = `
      <div style="aspect-ratio: 4.575875486381323 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 38px); position: relative; width: 174px;">
      <img 
        decoding="async"
        sizes="174px"
        srcset="https://www.freeiconspng.com/uploads/high-resolution-photo-of-the-red-exclamation-point-error-23.png"
        alt="Payment Error Image"
        style="display: block; width: 100%; height: 100%; border-radius: inherit; object-position: center center; object-fit: cover; "
      >
      </div>
    `;

    var errorMessage = `
      <div style="display: flex; justify-content: center; align-items: center; gap: 32px;">
      <h2 style="color:#b9218b; font-size: 24px; font-weight: 700;">
        Payment Failed
        </h2>
    `;

    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; gap: 50px; background-color: #F3DCF8;">
        ${ErrorImage}
        ${errorMessage}
      </div>
    `;
  }
}
renderPaymentStatusPage();
