import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LabelResultsScreen from "@/app/(features)/recognition/labels";
import { router, useLocalSearchParams } from "expo-router";

// Mock the external modules
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("@expo/vector-icons", () => ({
  FontAwesome5: "FontAwesome5",
}));

describe("LabelResultsScreen", () => {
  const mockRouter = { back: jest.fn() };
  const mockLabels = JSON.stringify([
    { description: "Label1", confidence: 90.12 },
    { description: "Label2", confidence: 85.34 },
  ]);

  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ labels: mockLabels });
  });

  it("renders correctly with labels", () => {
    const { getByText } = render(<LabelResultsScreen />);

    expect(getByText("Detected Labels:")).toBeTruthy();
    expect(getByText("Label1 - 90.12%")).toBeTruthy();
    expect(getByText("Label2 - 85.34%")).toBeTruthy();
  });

  it("navigates back when back button is pressed", async () => {
    const { getByTestId } = render(<LabelResultsScreen />);

    await waitFor(() => {
      const backButton = getByTestId("back-button");
      fireEvent.press(backButton);
    });

    expect(router.back).toHaveBeenCalled();
  });
});
