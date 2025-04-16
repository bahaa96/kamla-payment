function renderNewApplicationPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const newApplicationRoute = urlParams.get("new_application");

  if (newApplicationRoute !== "true") {
    return;
  }

  document.body.innerHTML = `
  <div id="typeform-embed" style="height: 100vh; width: 100vw; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000;"></div>
  `;

  window.addEventListener("DOMContentLoaded", function () {
    const typeformEmbedElement = document.getElementById("typeform-embed");
    const typeformUrl = "https://uxs4313vxah.typeform.com/to/LtDCBOX6";

    window.typeformEmbed.makeWidget(typeformEmbedElement, typeformUrl, {
      hideHeaders: true,
      hideFooter: true,
      autoFocus: true,
      opacity: 1,

      onSubmit: function (event) {
        // Trigger on form submission
        console.log("Form submitted!", event);

        // You can redirect or perform other actions
        window.location.href =
          "/?redirect_to_payment=true&response_id=" + event.response_id;
      },
    });
  });
}

renderNewApplicationPage();
