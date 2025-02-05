import LoginForm from "./components/LoginForm/LoginForm";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </>
  );
}

export default App;
