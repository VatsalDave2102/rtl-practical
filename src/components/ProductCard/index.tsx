import React from "react";
import { Product } from "../../context/CartContext/actions";
import { useCart } from "../../context/CartContext";
import Tooltip from "../Tooltip";
import QuantityControls from "../QuantityControls";

interface ProductCardProps {
  product: Product;
  inCart: Product | undefined;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, inCart }) => {
  const { dispatch } = useCart();
  const handleAddToCart = (product: Product) => {
    dispatch({ type: "add-product", payload: product });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "update-quantity", payload: { id, quantity } });
  };
  return (
    <div key={product.id}>
      <Tooltip content={product.description}>
        <h3>{product.name}</h3>
      </Tooltip>
      <p>Price: {product.price}</p>

      {inCart ? (
        <QuantityControls
          quantity={inCart.quantity}
          onDecrease={() =>
            handleUpdateQuantity(product.id, inCart.quantity - 1)
          }
          onIncrease={() =>
            handleUpdateQuantity(product.id, inCart.quantity + 1)
          }
        />
      ) : (
        <button onClick={() => handleAddToCart(product)}>Add to cart</button>
      )}
    </div>
  );
};

export default ProductCard;
