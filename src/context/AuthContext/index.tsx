import React, { createContext, useContext, useReducer } from "react";
import { Action, Dispatch } from "./actions";

type State = { isAuthenticated: boolean; email: string | null };
type AuthProviderProps = { children: React.ReactNode };

const initialState: State = { isAuthenticated: false, email: null };

const AuthContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const authReducer = (_state: State, action: Action) => {
  switch (action.type) {
    case "login": {
      return { isAuthenticated: true, email: action.payload.email };
    }

    case "logout": {
      return { isAuthenticated: false, email: null };
    }

    default: {
      throw new Error(`Invalid action type`);
    }
  }
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const value = { state, dispatch };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
