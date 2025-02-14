import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import userEvent from "@testing-library/user-event";
import Cart from ".";
import { server } from "../../mocks/server";
import {
  renderWithCartContext,
  screen,
  waitFor,
} from "../../test-utils/testing-library-utils";

describe("Cart component", () => {
  test("renders loading state", async () => {
    renderWithCartContext(<Cart />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  test("display products after successful API call", async () => {
    renderWithCartContext(<Cart />);

    const productA = await screen.findByRole("heading", { name: "Product A" });
    const productB = await screen.findByRole("heading", { name: "Product B" });
    const totalPrice = await screen.findByText("Total price: 0");

    expect(productA).toBeInTheDocument();
    expect(productB).toBeInTheDocument();
    expect(totalPrice).toBeInTheDocument();
  });

  test("handles API error", async () => {
    server.use(
      http.get("/api/cart", () => {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      })
    );

    renderWithCartContext(<Cart />);

    const error = await screen.findByText("Error: Server Error");
    expect(error).toBeInTheDocument();
  });

  test("disables confirm order button when total price is 0", async () => {
    renderWithCartContext(<Cart />);

    const confirmButton = await screen.findByRole("button", {
      name: "Confirm Order",
    });

    expect(confirmButton).toBeDisabled();
  });

  test("opens confirm order modal when confirm order button is clicked", async () => {
    renderWithCartContext(<Cart />);
    const user = userEvent.setup();

    const addToCartButtons = await screen.findAllByRole("button", {
      name: "Add to cart",
    });

    // fill the cart
    await user.click(addToCartButtons[0]);
    await user.click(addToCartButtons[1]);

    const totalPrice = await screen.findByText("Total price: 300");
    expect(totalPrice).toBeInTheDocument();

    const confirmButton = await screen.findByRole("button", {
      name: "Confirm Order",
    });

    await user.click(confirmButton);
    expect(
      screen.getByRole("heading", { name: /confirm order/i })
    ).toBeInTheDocument();
  });

  test("confirms order and show success message", async () => {
    renderWithCartContext(<Cart />);
    const user = userEvent.setup();

    const addToCartButtons = await screen.findAllByRole("button", {
      name: "Add to cart",
    });

    // fill the cart
    await user.click(addToCartButtons[0]);
    await user.click(addToCartButtons[1]);

    const confirmButton = await screen.findByRole("button", {
      name: "Confirm Order",
    });

    await user.click(confirmButton);

    const tncCheckbox = await screen.findByRole("checkbox", {
      name: "I agree to the Terms and Conditions",
    });
    const submitButton = await screen.findByRole("button", {
      name: "Confirm",
    });

    expect(tncCheckbox).not.toBeChecked();
    expect(submitButton).toBeDisabled();

    await user.click(tncCheckbox);

    expect(tncCheckbox).toBeChecked();
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    const successMessage = await screen.findByRole("heading", {
      name: "Order Confirmed!",
    });
    const totalPrice = await screen.findByText("Total price: 300");

    expect(successMessage).toBeInTheDocument();
    expect(totalPrice).toBeInTheDocument();
  });

  test("reorders and clears cart when clicking reorder", async () => {
    renderWithCartContext(<Cart />);
    const user = userEvent.setup();

    const addToCartButtons = await screen.findAllByRole("button", {
      name: "Add to cart",
    });

    // fill the cart
    await user.click(addToCartButtons[0]);
    await user.click(addToCartButtons[1]);

    const confirmButton = await screen.findByRole("button", {
      name: "Confirm Order",
    });
    await userEvent.click(confirmButton);

    const tncCheckbox = await screen.findByRole("checkbox", {
      name: "I agree to the Terms and Conditions",
    });
    const submitButton = await screen.findByRole("button", {
      name: "Confirm",
    });

    expect(tncCheckbox).not.toBeChecked();
    expect(submitButton).toBeDisabled();

    await user.click(tncCheckbox);

    expect(tncCheckbox).toBeChecked();
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    const reorderButton = screen.getByRole("button", { name: "Reorder" });

    expect(reorderButton).toBeInTheDocument();
    await user.click(reorderButton);

    // expect(mockDispatch).toHaveBeenCalledWith({ type: "clear-cart" });
  });
});
