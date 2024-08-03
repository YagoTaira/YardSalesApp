import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeatureDetailsScreen from "@/app/(features)/wishlist/index";
import { router } from "expo-router";

// Mock the external modules
jest.mock("expo-router", () => ({
  Link: jest.fn().mockImplementation(({ children }) => children),
  router: {
    back: jest.fn(),
  },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
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
    const { getByText, getByRole } = render(<FeatureDetailsScreen />);

    expect(getByText("Menu")).toBeTruthy();
    expect(getByText("Go to Wishlist")).toBeTruthy();
  });

  it("renders MarkdownDisplay component", () => {
    const { getByTestId } = render(<FeatureDetailsScreen />);
    const markdownDisplay = getByTestId("MarkdownDisplay");
    expect(markdownDisplay).toBeTruthy();
    expect(markdownDisplay.props.children).toContain("# Wishlist");
    expect(markdownDisplay.props.children).toContain(
      "Scan barcode from products using Reactive Native Vision Camera."
    );
  });

  it("navigates back when the back button is pressed", () => {
    const { getByText } = render(<FeatureDetailsScreen />);
    const backButton = getByText("Menu");

    fireEvent.press(backButton);

    expect(router.back).toHaveBeenCalled();
  });

  it("navigates to wishlist items when 'Go to Wishlist' button is pressed", () => {
    const { getByText } = render(<FeatureDetailsScreen />);
    const goToWishlistButton = getByText("Go to Wishlist");

    fireEvent.press(goToWishlistButton);
  });
});
