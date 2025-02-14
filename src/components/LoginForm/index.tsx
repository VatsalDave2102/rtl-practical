import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type FormState = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });

  const { state, dispatch } = useAuth();

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    if (response.ok) {
      dispatch({ type: "login", payload: formState });
    } else {
      setError("Invalid credentials");
    }
  };

  if (state.isAuthenticated) {
    return (
      <>
        <h1>Login successful!</h1>;
        <button onClick={() => dispatch({ type: "logout" })}>Logout</button>
      </>
    );
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} aria-label="login-form">
        <h1>Login Form</h1>
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={(e) => handleFieldChange("password", e.target.value)}
          />
          <button onClick={() => setShowPassword(!showPassword)} type="button">
            {showPassword ? "Hide" : "Show"}
          </button>
        </label>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
