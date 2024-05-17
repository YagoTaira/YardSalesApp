import { Slot } from "expo-router";
import { withAuthenticator } from "@aws-amplify/ui-react-native";

function ProtectedLayout() {
  return <Slot />;
}

export default withAuthenticator(ProtectedLayout);
