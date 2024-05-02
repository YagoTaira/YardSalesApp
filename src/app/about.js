import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const about = () => {
  return (
    <View>
      <Text>about</Text>
      <Link href="/">Go to Home</Link>
    </View>
  );
};

export default about;
