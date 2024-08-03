import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import GalleryScreen from "@/app/(features)/gallery/photos";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  Stack: {
    Screen: () => null,
  },
  useFocusEffect: jest.fn(),
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn((_, path) => ({ name: path.split("/").pop() })),
  listAll: jest.fn().mockResolvedValue({ items: [] }),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock("../../../../FirebaseConfig", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  storage: {},
}));

describe("GalleryScreen", () => {
  const mockPhotos = [
    { id: "1", url: "https://example.com/photo1.jpg" },
    { id: "2", url: "https://example.com/photo2.jpg" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading indicator initially", async () => {
    (listAll as jest.Mock).mockResolvedValue({ items: [] });
    const { getByTestId } = render(<GalleryScreen />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders empty gallery message when no photos", async () => {
    (listAll as jest.Mock).mockResolvedValue({ items: [] });
    const { getByTestId } = render(<GalleryScreen />);
    await waitFor(() => {
      expect(getByTestId("empty-container")).toBeTruthy();
    });
  });

  it("renders photos when available", async () => {
    (listAll as jest.Mock).mockResolvedValue({
      items: mockPhotos.map((photo) => ({ name: photo.id })),
    });
    (getDownloadURL as jest.Mock).mockImplementation((ref) => {
      const photo = mockPhotos.find((photo) => photo.id === ref.name);
      return Promise.resolve(photo!.url);
    });
    const { getAllByTestId } = render(<GalleryScreen />);
    await waitFor(() => {
      expect(getAllByTestId("photo-item")).toHaveLength(mockPhotos.length);
    });
  });

  it("deletes a photo when delete button is pressed", async () => {
    (listAll as jest.Mock).mockResolvedValue({
      items: mockPhotos.map((photo) => ({ name: photo.id })),
    });
    (getDownloadURL as jest.Mock).mockImplementation((ref) => {
      const photo = mockPhotos.find((photo) => photo.id === ref.name);
      return Promise.resolve(photo!.url);
    });
    (deleteObject as jest.Mock).mockResolvedValue(undefined);

    const { getAllByTestId } = render(<GalleryScreen />);

    await waitFor(() => {
      expect(getAllByTestId("photo-item")).toHaveLength(mockPhotos.length);
    });

    const deleteButtons = getAllByTestId("delete-button");
    fireEvent.press(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteObject).toHaveBeenCalledWith(
        expect.objectContaining({ name: mockPhotos[0].id })
      );
    });
  });

  it("navigates back when back button is pressed", async () => {
    const { getByTestId } = render(<GalleryScreen />);

    await waitFor(() => {
      const backButton = getByTestId("back-button");
      fireEvent.press(backButton);
    });

    expect(router.back).toHaveBeenCalled();
  });
});
