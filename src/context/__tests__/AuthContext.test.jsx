import { vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth, cb) => {
    cb({ uid: "u1" });
    return () => {};
  },
}));
vi.mock("../../firebase/config", () => ({ auth: {} }));
vi.mock("../../services/usersService", () => ({
  getUser: vi.fn().mockResolvedValue({ role: "Admin" }),
}));

import { AuthProvider, useAuth } from "../AuthContext";

function Consumer() {
  const { profile, loading } = useAuth();
  return <div>{loading ? "loading" : profile?.role}</div>;
}

it("exposes loading first, then the profile role", async () => {
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );
  expect(screen.getByText("loading")).toBeInTheDocument();
  expect(await screen.findByText("Admin")).toBeInTheDocument();
});
