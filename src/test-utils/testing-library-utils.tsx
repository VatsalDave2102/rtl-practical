import { render, RenderOptions } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

const renderWithAuthContext = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, { wrapper: AuthProvider, ...options });
};

const renderWithCartContext = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: CartProvider, ...options });

export * from "@testing-library/react";
export { renderWithAuthContext, renderWithCartContext };
