import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeatureDetailsScreen from "@/app/(features)/gallery/index";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  router: {
    back: jest.fn(),
  },
}));

describe("FeatureDetailsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<FeatureDetailsScreen />);

    expect(getByText("Photo Gallery")).toBeTruthy();
    expect(getByText("Features")).toBeTruthy();
    expect(getByText("How to Use")).toBeTruthy();
    expect(getByText("Go to Gallery")).toBeTruthy();
  });

  it("navigates back when back button is pressed", () => {
    const { getByTestId } = render(<FeatureDetailsScreen />);
    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });

  it("renders href button component", () => {
    const { getByText } = render(<FeatureDetailsScreen />);

    const galleryButton = getByText("Go to Gallery");
    expect(galleryButton).toBeTruthy();
  });
});
