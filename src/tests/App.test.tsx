import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
test("render App", () => {
  render(<App />);
  const header = screen.getByRole("heading", { name: "Vite + React" });
  expect(header).toBeInTheDocument();
});
