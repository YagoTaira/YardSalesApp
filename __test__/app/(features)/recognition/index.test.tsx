import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import FeatureDetailsScreen from "@/app/(features)/recognition/index";

// Mock the expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the MarkdownDisplay component
jest.mock("../../../../src/components/MarkdownDisplay", () => {
  const { Text } = require("react-native");
  return ({ children }: { children: React.ReactNode }) => (
    <Text testID="MarkdownDisplay">{children}</Text>
  );
});

describe("FeatureDetailsScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<FeatureDetailsScreen />);

    expect(getByText("Menu")).toBeTruthy();
    expect(getByText("Go to Frame Processor")).toBeTruthy();
  });

  it("renders MarkdownDisplay component", () => {
    const { getByTestId } = render(<FeatureDetailsScreen />);
    const markdownDisplay = getByTestId("MarkdownDisplay");
    expect(markdownDisplay).toBeTruthy();
    expect(markdownDisplay.props.children).toContain("# Object Recognition");
    expect(markdownDisplay.props.children).toContain("## Features");
    expect(markdownDisplay.props.children).toContain("## How to Use");
  });

  it("navigates back when back button is pressed", () => {
    const { getByText } = render(<FeatureDetailsScreen />);
    const backButton = getByText("Menu");

    fireEvent.press(backButton);

    expect(router.back).toHaveBeenCalled();
  });
});
