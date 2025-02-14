import { render, screen, fireEvent } from "@testing-library/react";
import QuantityControls from "../QuantityControls";
import { describe, expect, test, vi } from "vitest";

describe("QuantityControls Component", () => {
  test("renders initial quantity correctly", () => {
    render(
      <QuantityControls
        quantity={5}
        onIncrease={vi.fn()}
        onDecrease={vi.fn()}
      />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("calls onIncrease when + button is clicked", () => {
    const onIncreaseMock = vi.fn();
    render(
      <QuantityControls
        quantity={1}
        onIncrease={onIncreaseMock}
        onDecrease={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("+"));
    expect(onIncreaseMock).toHaveBeenCalledTimes(1);
  });

  test("calls onDecrease when - button is clicked", () => {
    const onDecreaseMock = vi.fn();
    render(
      <QuantityControls
        quantity={1}
        onIncrease={vi.fn()}
        onDecrease={onDecreaseMock}
      />
    );

    fireEvent.click(screen.getByText("-"));
    expect(onDecreaseMock).toHaveBeenCalledTimes(1);
  });

  test("does not call onDecrease if quantity is 0", () => {
    const onDecreaseMock = vi.fn();
    render(
      <QuantityControls
        quantity={0}
        onIncrease={vi.fn()}
        onDecrease={onDecreaseMock}
      />
    );

    fireEvent.click(screen.getByText("-"));
    expect(onDecreaseMock).not.toHaveBeenCalled();
  });
});
