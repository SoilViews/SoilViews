import { vi, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k) => k }) }));
import ShapeList from "../ShapeList";

const groups = [
  { key: "drawn", title: "map.shapes", items: [{ id: "a", name: "Shape 1", area: "10  m²" }, { id: "b", name: "Shape 2", area: "20  m²" }] },
  { key: "saved", title: "map.savedFields", items: [{ id: "s", name: "Field – 1/1/2025", area: "30  m²" }] },
];

it("renders rows with name, area and checkbox state", () => {
  render(<ShapeList groups={groups} selected={new Set(["a"])} onToggle={vi.fn()} onSetMany={vi.fn()} onHover={vi.fn()} />);
  expect(screen.getByText("Shape 2")).toBeTruthy();
  expect(screen.getByText("30 m²")).toBeTruthy();
  expect(screen.getByLabelText(/Shape 1/).checked).toBe(true);
  expect(screen.getByLabelText(/Shape 2/).checked).toBe(false);
  expect(screen.getByText("map.savedFields")).toBeTruthy();
});

it("toggles a row and select all, and reports hover", () => {
  const onToggle = vi.fn();
  const onSetMany = vi.fn();
  const onHover = vi.fn();
  render(<ShapeList groups={groups} selected={new Set(["a"])} onToggle={onToggle} onSetMany={onSetMany} onHover={onHover} />);
  fireEvent.click(screen.getByLabelText(/Shape 2/));
  expect(onToggle).toHaveBeenCalledWith("b");
  fireEvent.click(screen.getByLabelText("map.selectAll"));
  expect(onSetMany).toHaveBeenCalledWith(["a", "b", "s"], true);
  fireEvent.mouseEnter(screen.getByText("Shape 1").closest("li"));
  expect(onHover).toHaveBeenCalledWith("a");
  fireEvent.mouseLeave(screen.getByText("Shape 1").closest("li"));
  expect(onHover).toHaveBeenLastCalledWith(null);
});

it("select all unticks everything when all are selected", () => {
  const onSetMany = vi.fn();
  render(<ShapeList groups={groups} selected={new Set(["a", "b", "s"])} onToggle={vi.fn()} onSetMany={onSetMany} onHover={vi.fn()} />);
  fireEvent.click(screen.getByLabelText("map.selectAll"));
  expect(onSetMany).toHaveBeenCalledWith(["a", "b", "s"], false);
});
