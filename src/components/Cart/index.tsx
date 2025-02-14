import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { useCart } from "../../context/CartContext";
import { Product } from "../../context/CartContext/actions";
import ProductCard from "../ProductCard";
import ConfirmOrderModal from "../ConfirmOrderModal";

const Cart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const { state, dispatch } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cart");
      const data = await response.data;
      setProducts(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
      if (typeof error === "string") {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    setIsModalOpen(false);
  };

  const handleReorder = () => {
    setOrderConfirmed(false);
    dispatch({ type: "clear-cart" });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (orderConfirmed) {
    return (
      <>
        <h1>Order Confirmed!</h1>
        <p>Total price: {state.totalPrice}</p>
        <button onClick={handleReorder}>Reorder</button>
      </>
    );
  }

  return (
    <>
      {products.map((product) => {
        const inCart = state.products.find((p) => p.id === product.id);

        return (
          <ProductCard product={product} key={product.id} inCart={inCart} />
        );
      })}
      <h4>Total price: {state.totalPrice}</h4>
      <button
        disabled={state.totalPrice == 0}
        onClick={() => setIsModalOpen(true)}
      >
        Confirm Order
      </button>
      <ConfirmOrderModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
};

export default Cart;
