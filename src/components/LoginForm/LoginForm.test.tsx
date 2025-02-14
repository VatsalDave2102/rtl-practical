import { describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

import {
  act,
  renderHook,
  renderWithAuthContext,
  screen,
} from "../../test-utils/testing-library-utils";
import LoginForm from ".";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import { AuthProvider, useAuth } from "../../context/AuthContext";

describe("LoginForm", () => {
  test("login form renders and it's empty", () => {
    renderWithAuthContext(<LoginForm />);

    // target login form
    const loginForm = screen.getByRole("form", { name: "login-form" });
    expect(loginForm).toBeInTheDocument();

    // target email input
    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveTextContent("");

    // target password input
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveTextContent("");

    // target login button
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();
  });

  test("toggles passwrod visibility", async () => {
    renderWithAuthContext(<LoginForm />);
    const user = userEvent.setup();

    // target password input
    const passwordInput = screen.getByLabelText("Password");

    // target toggle button
    const toggleButton = screen.getByRole("button", { name: "Show" });

    // initially password input is hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // click toggle button
    await user.click(toggleButton);

    // password input is now visible
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveTextContent("Hide");
  });

  test("logs in and updates ui", async () => {
    renderWithAuthContext(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");

    const loginButton = screen.getByRole("button", { name: "Login" });
    await user.click(loginButton);

    await screen.findByText("Login successful!");
  });

  test("auth state updates after login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.dispatch({
        type: "login",
        payload: { email: "test@example.com", password: "password" },
      });
    });

    expect(result.current.state.isAuthenticated).toBe(true);
  });

  test("logs out and login form appears", async () => {
    renderWithAuthContext(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");

    const loginButton = screen.getByRole("button", { name: "Login" });
    await user.click(loginButton);

    await screen.findByText("Login successful!");

    const logoutButton = screen.getByRole("button", { name: "Logout" });

    await user.click(logoutButton);
    await screen.findByText("Login Form");
  });

  test("logs out and context state update", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.dispatch({
        type: "login",
        payload: { email: "test@example.com", password: "password" },
      });
    });

    expect(result.current.state.isAuthenticated).toBe(true);

    act(() => {
      result.current.dispatch({ type: "logout" });
    });

    expect(result.current.state.isAuthenticated).toBe(false);
  });

  test("fails to log in", async () => {
    server.use(
      http.post("/api/login", () => {
        return HttpResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      })
    );

    renderWithAuthContext(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");

    const loginButton = screen.getByRole("button", { name: "Login" });

    await user.click(loginButton);

    await screen.findByText("Invalid credentials");
  });
});
