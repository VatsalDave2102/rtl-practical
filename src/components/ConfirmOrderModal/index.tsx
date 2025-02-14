import React, { useState } from "react";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../Modal";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}
const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
}) => {
  const [tnc, setTnc] = useState(false);

  const handleConfirm = () => {
    setTnc(false);
    onConfirm();
  };

  return (
    <Modal size="medium" open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <ModalHeader>Confirm Order</ModalHeader>
      <ModalContent>
        <p>Continue with the current order?</p>
        <form>
          <label>
            <input type="checkbox" onChange={() => setTnc(!tnc)} />I agree to
            the Terms and Conditions
          </label>
        </form>
      </ModalContent>
      <ModalFooter>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
        <button disabled={!tnc} onClick={handleConfirm}>
          Confirm
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmOrderModal;
