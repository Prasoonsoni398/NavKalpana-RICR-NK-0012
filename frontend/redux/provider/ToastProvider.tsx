"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        className: "",
        style: {
          borderRadius: "12px",
          background: "var(--toast-bg)",
          color: "var(--toast-color)",
        },
      }}
    />
  );
}