import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeatureDetailsScreen from "../../../../src/app/(features)/barcode";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  Link: "Link",
  router: {
    back: jest.fn(),
  },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

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
    expect(getByText("Go to Barcode Scanner")).toBeTruthy();
  });

  it("handles back navigation", () => {
    const { getByText } = render(<FeatureDetailsScreen />);
    fireEvent.press(getByText("Menu"));
    expect(router.back).toHaveBeenCalled();
  });

  it("renders MarkdownDisplay component", () => {
    const { getByTestId } = render(<FeatureDetailsScreen />);
    const markdownDisplay = getByTestId("MarkdownDisplay");
    expect(markdownDisplay).toBeTruthy();
    expect(markdownDisplay.props.children).toContain("# Barcode Scanner");
    expect(markdownDisplay.props.children).toContain("## Features");
    expect(markdownDisplay.props.children).toContain("## How to Use");
  });
});
