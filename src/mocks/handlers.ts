import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/login", async () => {
    return HttpResponse.json({ message: "Login successful!" }, { status: 200 });
  }),
];
