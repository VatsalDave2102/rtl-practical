import * as matchers from "@testing-library/jest-dom/matchers";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { server } from "./mocks/server";

expect.extend(matchers);

// start msw server before all tests
beforeAll(() => server.listen());

// clear all msw handler after each test
afterEach(() => server.resetHandlers());

// close msw server after all tests
afterAll(() => server.close());
