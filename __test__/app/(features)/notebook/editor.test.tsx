import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import EditorScreen from "@/app/(features)/notebook/editor";

// Mock the expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock the MarkdownDisplay component
jest.mock("../../../../src/components/MarkdownDisplay", () => {
  const { Text } = require("react-native");
  return ({ children }: { children: React.ReactNode }) => (
    <Text testID="MarkdownDisplay">{children}</Text>
  );
});

describe("EditorScreen", () => {
  it("renders correctly", () => {
    const { getByText, getByDisplayValue } = render(<EditorScreen />);

    expect(getByText("Description")).toBeTruthy();
    expect(getByText("Edit")).toBeTruthy();
    expect(getByText("Preview")).toBeTruthy();
    expect(
      getByDisplayValue("# Notebook editor\n\nHello **World**!\n")
    ).toBeTruthy();
  });

  it("switches between Edit and Preview tabs", () => {
    const { getByText, getByDisplayValue, getByTestId } = render(
      <EditorScreen />
    );
    const editTab = getByText("Edit");
    const previewTab = getByText("Preview");

    // Initially in Edit tab
    expect(
      getByDisplayValue("# Notebook editor\n\nHello **World**!\n")
    ).toBeTruthy();

    // Switch to Preview tab
    fireEvent.press(previewTab);
    expect(getByTestId("MarkdownDisplay")).toBeTruthy();
    expect(getByTestId("MarkdownDisplay").props.children).toBe(
      "# Notebook editor\n\nHello **World**!\n"
    );

    // Switch back to Edit tab
    fireEvent.press(editTab);
    expect(
      getByDisplayValue("# Notebook editor\n\nHello **World**!\n")
    ).toBeTruthy();
  });

  it("updates the content in the Edit tab", () => {
    const { getByDisplayValue } = render(<EditorScreen />);
    const textInput = getByDisplayValue(
      "# Notebook editor\n\nHello **World**!\n"
    );

    fireEvent.changeText(textInput, "# Updated Content");
    expect(textInput.props.value).toBe("# Updated Content");
  });

  it("navigates back when the back button is pressed", () => {
    const { getByText } = render(<EditorScreen />);
    const backButton = getByText("Description");

    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });
});
