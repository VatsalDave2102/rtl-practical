type Login = { type: "login"; payload: { email: string; password: string } };
type Logout = { type: "logout" };

export type Action = Login | Logout;
export type Dispatch = (action: Action) => void;
