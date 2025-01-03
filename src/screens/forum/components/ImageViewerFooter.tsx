import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  imageIndex: number;
  imagesCount: number;
};

const ImageViewerFooter = ({ imageIndex, imagesCount }: Props) => (
  <View style={styles.root}>
    <Text style={styles.text}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    height: 64,
    backgroundColor: "#00000077",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 17,
    color: "#FFF"
  }
});

export default ImageViewerFooter;