import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ItemsScreen from "../../../../src/app/(features)/barcode/items";
import { useLocalSearchParams, router } from "expo-router";
import { deleteObject, uploadBytes } from "firebase/storage";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
  },
}));

jest.mock("../../../../FirebaseConfig", () => ({
  auth: {
    currentUser: { uid: "testuser" },
  },
  storage: {
    ref: jest.fn(),
  },
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(() => Promise.resolve()),
  deleteObject: jest.fn(() => Promise.resolve()),
}));

const mockItems = [
  {
    id: "1",
    title: "Test Item",
    imageSource: "https://example.com/image.jpg",
    price: "9.99",
    seller: "Test Seller",
    url: "https://example.com",
  },
];

describe("ItemsScreen", () => {
  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      items: JSON.stringify(mockItems),
    });
  });

  it("renders correctly", () => {
    const { getByText } = render(<ItemsScreen />);
    expect(getByText("Test Item")).toBeTruthy();
    expect(getByText("Price: €9.99")).toBeTruthy();
    expect(getByText("Store: Test Seller")).toBeTruthy();
  });

  it("handles back navigation", () => {
    const { getByTestId } = render(<ItemsScreen />);
    fireEvent.press(getByTestId("back-button"));
    expect(router.back).toHaveBeenCalled();
  });

  it("toggles wishlist", async () => {
    const { getByTestId } = render(<ItemsScreen />);
    fireEvent.press(getByTestId("wishlist-button-1"));

    // Item was added to the wishlist
    expect(uploadBytes).toHaveBeenCalled();

    fireEvent.press(getByTestId("wishlist-button-1"));

    // Item was removed from the wishlist
    expect(deleteObject).toHaveBeenCalled();
  });
});
