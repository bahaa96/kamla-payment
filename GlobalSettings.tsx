import { addPropertyControls, ControlType } from "framer";
import React, { useEffect } from "react";

// Declare global extension to Window interface
declare global {
  interface Window {
    GlobalSettings: any;
  }
}

export function GlobalSettings(props) {
  // This component doesn't render anything but exposes controls
  useEffect(() => {
    localStorage.setItem("framerSettings", JSON.stringify(props));
  }, [props]);

  if (typeof window !== "undefined") {
    window.GlobalSettings = props;
  }
  return <></>;
}

addPropertyControls(GlobalSettings, {
  consultationCost: {
    type: ControlType.Number,
    title: "Consultation Cost",
    defaultValue: 600,
  },
  redirectToPaymentMessage: {
    type: ControlType.String,
    title: "Redirect to Payment Message",
    defaultValue: "Redirecting to payment...",
  },
  successMessage: {
    type: ControlType.String,
    title: "Success Message",
    defaultValue:
      "Thank you {customerName} We look forward to chatting to you soon!",
  },
  successImage: {
    type: ControlType.Image,
    title: "Success Image",
    defaultValue:
      "https://funtura.in/tvm/wp-content/themes/funtura/assets/images/success.svg",
  },
  errorMessage: {
    type: ControlType.String,
    title: "Error Message",
    defaultValue: "An error occurred. Please try again.",
  },
  errorImage: {
    type: ControlType.Image,
    title: "Error Image",
    defaultValue:
      "https://funtura.in/tvm/wp-content/themes/funtura/assets/images/error.svg",
  },
});
