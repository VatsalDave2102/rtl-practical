import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { Modal, ModalContent } from ".";

describe("Modal component", () => {
  // renders modal when open is true
  test("renders modal when open is true", () => {
    render(<Modal open={true}>Modal content</Modal>);

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  // does not render modal when open is false
  test("does not render modal when open is false", () => {
    render(<Modal open={false}>Modal content</Modal>);

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  // renders modal with correct size classes
  test("renders modal with correct size classes", () => {
    render(
      <Modal open={true} size="small">
        Modal content
      </Modal>
    );
  });
  // closes when clicking on close button
  test("closes when clicking on close button", async () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onOpenChange={handleClose}>
        Modal content
      </Modal>
    );
    const user = userEvent.setup();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledWith(false);
  });

  // does not close when clicking inside the modal
  test("does not close when clicking inside the modal", async () => {
    const handleClose = vi.fn();

    render(
      <Modal open size="medium" onOpenChange={handleClose}>
        <ModalContent>
          <button>Stay Open</button>
        </ModalContent>
      </Modal>
    );

    const user = userEvent.setup();

    const modalContent = screen.getByText("Stay Open");
    await user.click(modalContent);

    expect(handleClose).not.toHaveBeenCalled();
  });
});
