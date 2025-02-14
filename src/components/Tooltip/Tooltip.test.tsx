import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import Tooltip from ".";

describe("Tooltip component", () => {
  const user = userEvent.setup();
  test("should render children correctly", () => {
    render(<Tooltip content="Tooltip Context">Tooltip trigger</Tooltip>);
    expect(screen.getByText("Tooltip trigger")).toBeInTheDocument();
  });

  test("shows tooltip on hover", async () => {
    render(<Tooltip content="Tooltip Context">Tooltip trigger</Tooltip>);

    const trigger = screen.getByText("Tooltip trigger");
    await user.hover(trigger);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  test("hides tooltip on mouse leave", async () => {
    render(<Tooltip content="Tooltip Context">Tooltip trigger</Tooltip>);

    const trigger = screen.getByText("Tooltip trigger");
    await user.hover(trigger);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();

    await user.unhover(trigger);
    expect(tooltip).not.toBeInTheDocument();
  });

  test("shows tooltip on focus", async () => {
    render(<Tooltip content="Tooltip Context">Tooltip trigger</Tooltip>);

    await user.tab();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  test("hides tooltip on blur", async () => {
    render(<Tooltip content="Tooltip Context">Tooltip trigger</Tooltip>);

    await user.tab();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  test("hides tooltip when escape key is pressed", async () => {
    render(<Tooltip content="Tooltip Context">Tooltip trigger</Tooltip>);

    await user.tab();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  test("shows tooltip on hover after delay", async () => {
    render(
      <Tooltip content="Tooltip Context" delay={500}>
        Tooltip trigger
      </Tooltip>
    );

    const trigger = screen.getByText("Tooltip trigger");

    await user.hover(trigger);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
  });
});
