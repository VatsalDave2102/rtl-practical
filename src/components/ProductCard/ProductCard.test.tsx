import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { useCart } from "../../context/CartContext";
import { render, screen } from "@testing-library/react";
import ProductCard from ".";
import userEvent from "@testing-library/user-event";

vi.mock("../../context/CartContext", () => ({ useCart: vi.fn() }));

describe("ProductCard Component", () => {
  const mockDispatch = vi.fn();
  const mockProduct = {
    id: "1",
    name: "Product A",
    description: "Product A description",
    price: 100,
    quantity: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders product details", () => {
    (useCart as Mock).mockReturnValue({ dispatch: mockDispatch });

    render(<ProductCard product={mockProduct} inCart={undefined} />);

    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Price: 100")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to cart" })
    ).toBeInTheDocument();
  });

  test("displays tooltip with product description when hovering tooltip", async () => {
    (useCart as Mock).mockReturnValue({ dispatch: mockDispatch });
    render(<ProductCard product={mockProduct} inCart={undefined} />);
    const user = userEvent.setup();

    const productName = screen.getByText("Product A");

    await user.hover(productName);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Product A description");
  });

  test('add product to cart when clicking "Add to cart" button', async () => {
    (useCart as Mock).mockReturnValue({ dispatch: mockDispatch });
    render(<ProductCard product={mockProduct} inCart={undefined} />);
    const user = userEvent.setup();

    const addToCartButton = screen.getByRole("button", {
      name: "Add to cart",
    });

    await user.click(addToCartButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "add-product",
      payload: mockProduct,
    });
  });

  test("renders quantity controls when product is in cart", async () => {
    (useCart as Mock).mockReturnValue({ dispatch: mockDispatch });
    render(
      <ProductCard
        product={mockProduct}
        inCart={{ ...mockProduct, quantity: 2 }}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "-" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  test("updates quantity when clicking '+' and '-'", async () => {
    (useCart as Mock).mockReturnValue({ dispatch: mockDispatch });
    render(
      <ProductCard
        product={mockProduct}
        inCart={{ ...mockProduct, quantity: 2 }}
      />
    );
    const user = userEvent.setup();

    const addButton = screen.getByRole("button", { name: "+" });
    const minusButton = screen.getByRole("button", { name: "-" });
    await user.click(addButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "update-quantity",
      payload: { id: "1", quantity: 3 },
    });

    await user.click(minusButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "update-quantity",
      payload: { id: "1", quantity: 1 },
    });
  });
});
