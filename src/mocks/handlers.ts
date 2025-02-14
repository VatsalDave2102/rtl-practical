import { delay, http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/login", async () => {
    return HttpResponse.json({ message: "Login successful!" }, { status: 200 });
  }),
  http.get("/api/cart", async () => {
    delay(1000);
    return HttpResponse.json(
      [
        {
          id: "1",
          name: "Product A",
          description: "Product A description",
          price: 100,
          quantity: 1,
        },
        {
          id: "2",
          name: "Product B",
          description: "Product B description",
          price: 200,
          quantity: 2,
        },
      ],
      { status: 200 }
    );
  }),
];
