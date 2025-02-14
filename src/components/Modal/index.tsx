import React from "react";
import { Dialog } from "radix-ui";

import "./Modal.css";

interface ModalProps extends Dialog.DialogProps {
  size?: "small" | "medium" | "large";
  description?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  size = "medium",
  description,
  children,
  ...props
}) => {
  const className = `modal ${size}`;
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="backdrop" />
        <Dialog.Content className={className}>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button className="close-button" aria-label="Close">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Title className="modal-header">{children}</Dialog.Title>;
};
export const ModalDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Dialog.Description className="modal-description">
      {children}
    </Dialog.Description>
  );
};

export const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-footer">{children}</div>;
};

export const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-content">{children}</div>;
};
