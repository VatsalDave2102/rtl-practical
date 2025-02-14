import React from "react";

interface QuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onDecrease,
  onIncrease,
}) => {
  return (
    <div>
      <button onClick={onDecrease} disabled={quantity <= 0}>
        -
      </button>
      <span>{quantity}</span>
      <button onClick={onIncrease}>+</button>
    </div>
  );
};

export default QuantityControls;
