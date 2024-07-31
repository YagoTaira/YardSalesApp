import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { signOut } from "firebase/auth";
import Features from "../../src/app/features";
import { router } from "expo-router";

// Mock the FeatureList component
jest.mock("../../src/components/core/FeatureList", () => {
  const { Text } = require("react-native");
  return function MockFeatureList({ feature }: { feature: string }) {
    return <Text>MockFeatureList:{feature}</Text>;
  };
});

describe("Features", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all features correctly", () => {
    const { getByText } = render(<Features />);

    expect(getByText("Sign Out")).toBeTruthy();
    const features = [
      "barcode",
      "recognition",
      "camera",
      "gallery",
      "notebook",
      "wishlist",
    ];
    features.forEach((feature) => {
      expect(getByText(`MockFeatureList:${feature}`)).toBeTruthy();
    });
  });

  it("handles sign out correctly", async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(<Features />);

    const signOutButton = getByText("Sign Out");
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith("/auth");
    });
  });

  it("handles sign out error", async () => {
    const mockError = new Error("Sign out error");
    (signOut as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    const { getByText } = render(<Features />);

    const signOutButton = getByText("Sign Out");
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Error signing out: ",
        mockError
      );
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
