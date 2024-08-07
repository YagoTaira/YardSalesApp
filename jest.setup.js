jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("expo-router", () => ({
  Link: "Link",
  Stack: {
    Screen: "Screen",
  },
  router: {
    replace: jest.fn(),
    back: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("./FirebaseConfig", () => ({
  auth: {
    createUserWithEmailAndPassword: jest.fn(),
  },
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn((title, message, buttons) => {
    if (buttons && buttons.length > 0 && buttons[0].onPress) {
      buttons[0].onPress();
    }
  }),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  FontAwesome5: "FontAwesome5",
}));
