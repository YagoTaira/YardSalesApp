import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import WishlistScreen from "@/app/(features)/wishlist/items";
import { router } from "expo-router";
import { auth, storage } from "../../../../FirebaseConfig";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { Linking } from "react-native";

// Mock the external modules
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  listAll: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("../../../../FirebaseConfig", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  storage: jest.fn(),
}));

describe("WishlistScreen", () => {
  beforeEach(() => {
    (listAll as jest.Mock).mockResolvedValue({
      items: [
        {
          name: "item1.json",
        },
      ],
    });
    (getDownloadURL as jest.Mock).mockResolvedValue(
      "https://example.com/item1.json"
    );
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        id: "item1",
        title: "Test Item",
        imageSource: "https://example.com/image.jpg",
        price: "10.00",
        seller: "Test Seller",
        url: "https://example.com",
      }),
    } as any);
  });

  it("renders correctly with items", async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => expect(getByText("Test Item")).toBeTruthy());
    expect(getByText("Price: €10.00")).toBeTruthy();
    expect(getByText("Store: Test Seller")).toBeTruthy();
  });

  it("renders empty state when no items are available", async () => {
    (listAll as jest.Mock).mockResolvedValueOnce({
      items: [],
    });

    const { getByText } = render(<WishlistScreen />);

    await waitFor(() =>
      expect(getByText("Your wishlist is empty.")).toBeTruthy()
    );
  });

  it("navigates back when back button is pressed", async () => {
    const { getByTestId } = render(<WishlistScreen />);

    await waitFor(() => expect(getByTestId("back-button")).toBeTruthy());
    const backButton = getByTestId("back-button");

    fireEvent.press(backButton);

    expect(router.back).toHaveBeenCalled();
  });

  it("opens URL when item image is pressed", async () => {
    const { getByTestId } = render(<WishlistScreen />);

    await waitFor(() => expect(getByTestId("item-image")).toBeTruthy());
    fireEvent.press(getByTestId("item-image"));

    await waitFor(() =>
      expect(Linking.openURL).toHaveBeenCalledWith("https://example.com")
    );
  });
});
