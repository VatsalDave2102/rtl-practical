import { createContext, useContext, useReducer } from "react";
import { Action, Dispatch, Product } from "./actions";

type State = { products: Product[]; totalPrice: number };
type CartProviderProps = { children: React.ReactNode };

const initialState: State = { products: [], totalPrice: 0 };

const CartContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const cartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "add-product": {
      const existingProduct = state.products.find(
        (p) => p.id === action.payload.id
      );
      if (existingProduct) {
        return {
          ...state,
          products: state.products.map((p) =>
            p.id === action.payload.id ? { ...p, quantity: p.quantity + 1 } : p
          ),
          totalPrice: state.totalPrice + action.payload.price,
        };
      }
      return {
        ...state,
        products: [...state.products, { ...action.payload, quantity: 1 }],
        totalPrice: state.totalPrice + action.payload.price,
      };
    }
    case "update-quantity": {
      return {
        ...state,
        products: state.products
          .map((p) =>
            p.id === action.payload.id
              ? { ...p, quantity: action.payload.quantity }
              : p
          )
          .filter((p) => p.quantity > 0),
        totalPrice: state.products.reduce(
          (total, p) =>
            p.id === action.payload.id
              ? total + p.price * action.payload.quantity
              : total + p.price * p.quantity,
          0
        ),
      };
    }
    case "clear-cart": {
      return initialState;
    }
    default:
      return state;
  }
};

const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = { state, dispatch };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used withing a provider");
  }

  return context;
};

export { CartProvider, useCart };
