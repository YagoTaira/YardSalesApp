import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeatureDetailsScreen from "../../../../src/app/(features)/camera/index";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  Link: ({ children }: { children: React.ReactNode }) => children,
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
    expect(getByText("Go to Camera")).toBeTruthy();
  });

  it("navigates back when back button is pressed", () => {
    const { getByText } = render(<FeatureDetailsScreen />);
    fireEvent.press(getByText("Menu"));
    expect(router.back).toHaveBeenCalled();
  });

  it("displays the correct markdown content ", () => {
    const { getByTestId } = render(<FeatureDetailsScreen />);
    const markdownDisplay = getByTestId("MarkdownDisplay");
    expect(markdownDisplay).toBeTruthy();
    expect(markdownDisplay.props.children).toContain("# Camera");
    expect(markdownDisplay.props.children).toContain(
      "Take pictures and record products using Reactive Native Vision Camera for future visualization."
    );
  });
});
