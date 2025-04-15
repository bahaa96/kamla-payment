function renderNewApplicationPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const newApplicationRoute = urlParams.get("new_application");

  if (newApplicationRoute !== "true") {
    return;
  }

  document.body.innerHTML += `
  <div id="typeform-embed" style="height: 500px; width: 100%"></div>
  `;

  window.addEventListener("DOMContentLoaded", function () {
    const typeformEmbed = document.getElementById("typeform-embed");
    const typeformUrl = "https://uxs4313vxah.typeform.com/to/LtDCBOX6";

    window.tf.createWidget(typeformEmbed, typeformUrl, {
      hideHeaders: true,
      hideFooter: true,
      autoFocus: true,
      opacity: 1,
      onSubmit: function (event) {
        // Trigger on form submission
        console.log("Form submitted!", event);
        // Add your custom actions here
        alert("Thank you for your submission!");

        // You can redirect or perform other actions
        // window.location.href = '/thank-you-page';
      },
    });
  });
}

renderNewApplicationPage();
