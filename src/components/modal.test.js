import { Modal, Prompt } from "./modal";
import { render, screen, fireEvent } from "@testing-library/react";

test("Prompt", () => {
  const component = render(
    <div>
      <div id="prompt" />
      <button
        data-testid="prompt-test-btn"
        onClick={() => {
          Prompt({ type: "information", message: "This is a test modal" });
        }}
      >
        Open Prompt
      </button>
    </div>
  );
  const btn = component.getByTestId("prompt-test-btn");
  fireEvent.click(btn);
  expect(btn.textContent).toEqual("Open Prompt");
  const prompt = component.getByTestId("prompt");
  expect(prompt.textContent).toMatch("This is a test modal");
});
