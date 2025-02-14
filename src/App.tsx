import Cart from "./components/Cart";
import LoginForm from "./components/LoginForm";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
      <CartProvider>
        <Cart />
      </CartProvider>
    </>
  );
}

export default App;
