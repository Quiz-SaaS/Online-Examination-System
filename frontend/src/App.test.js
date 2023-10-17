import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

it("renders without crashing", () => {
  const root = document.createElement("div");
  createRoot(root).render(<App />);
  createRoot(root).unmount();
});
