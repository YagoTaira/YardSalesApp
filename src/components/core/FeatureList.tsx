import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

type FeatureList = {
  feature: string;
};

export default function FeatureList({ feature }: FeatureList) {
  return (
    <Link href={`/${feature}`} asChild>
      <Pressable style={styles.box}>
        <Text style={styles.text}>{feature}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#F9EDE3",
    flex: 1,
    aspectRatio: 1,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#9b4521",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#9b4521",
    fontSize: 30,
    fontFamily: "AmaticBold",
  },
});
