export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type AddProduct = {
  type: "add-product";
  payload: Product;
};
type UpdateQuantity = {
  type: "update-quantity";
  payload: { id: string; quantity: number };
};
type ClearCart = { type: "clear-cart" };

export type Action = AddProduct | UpdateQuantity | ClearCart;
export type Dispatch = (action: Action) => void;
