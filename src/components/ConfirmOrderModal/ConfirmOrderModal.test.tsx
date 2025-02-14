import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmOrderModal from "../ConfirmOrderModal";
import { describe, expect, test, vi } from "vitest";

describe("ConfirmOrderModal", () => {
  test("should render when isOpen is true", () => {
    render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: /confirm order/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/continue with the current order/i)
    ).toBeInTheDocument();
  });

  test("should not render when isOpen is false", () => {
    render(
      <ConfirmOrderModal
        isOpen={false}
        setIsOpen={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("heading", { name: /confirm order/i })
    ).not.toBeInTheDocument();
  });

  test("should close modal when clicking 'Cancel'", async () => {
    const setIsOpenMock = vi.fn();
    render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={setIsOpenMock}
        onConfirm={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });

  test("should keep 'Confirm' button disabled if checkbox is unchecked", () => {
    render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  test("should enable 'Confirm' button when checkbox is checked", async () => {
    render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    const confirmButton = screen.getByRole("button", { name: /confirm/i });

    await userEvent.click(checkbox);
    expect(confirmButton).toBeEnabled();
  });

  test("should call 'onConfirm' when clicking 'Confirm' button", async () => {
    const onConfirmMock = vi.fn();
    render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={vi.fn()}
        onConfirm={onConfirmMock}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    const confirmButton = screen.getByRole("button", { name: /confirm/i });

    await userEvent.click(checkbox);
    await userEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test("should reset checkbox state after confirming", async () => {
    const onConfirmMock = vi.fn();
    const { unmount } = render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={vi.fn()}
        onConfirm={onConfirmMock}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    const confirmButton = screen.getByRole("button", { name: /confirm/i });

    await userEvent.click(checkbox);
    await userEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);

    unmount();
    render(
      <ConfirmOrderModal
        isOpen={true}
        setIsOpen={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});
