import { View, Text } from "react-native";
import React from "react";

const ProtectedScreen = () => {
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontFamily: "InterBold", fontSize: 30 }}>
        Hey How's it going?
      </Text>
      <Text style={{ fontFamily: "InterSemi", fontSize: 20, color: "grey" }}>
        You should see this page if you're authenticated
      </Text>
    </View>
  );
};

export default ProtectedScreen;
