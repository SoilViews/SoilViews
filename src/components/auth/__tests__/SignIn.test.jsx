import { vi, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const signIn = vi.fn();
vi.mock("../../../services/authService", () => ({ signIn: (...a) => signIn(...a) }));
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ user: null, profile: null, loading: false }),
}));

import SignIn from "../SignIn";

const setup = () =>
  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
  );

beforeEach(() => {
  signIn.mockReset();
});

it("submits email and password to signIn", async () => {
  signIn.mockResolvedValue({});
  setup();
  await userEvent.type(screen.getByLabelText(/^Email/), "a@b.co");
  await userEvent.type(screen.getByLabelText(/^Password/), "secret1");
  await userEvent.click(screen.getByRole("button", { name: /Login/ }));
  await waitFor(() => expect(signIn).toHaveBeenCalledWith("a@b.co", "secret1"));
});

it("shows an error Alert when signIn rejects", async () => {
  signIn.mockImplementation(async () => {
    throw new Error("Bad credentials");
  });
  setup();
  await userEvent.type(screen.getByLabelText(/^Email/), "a@b.co");
  await userEvent.type(screen.getByLabelText(/^Password/), "secret1");
  await userEvent.click(screen.getByRole("button", { name: /Login/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Bad credentials");
});
