import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, View } from "react-native";

import LottieView from "lottie-react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

const Splash = ({ setHasAnimationPlayedOnce }) => {
  return (
    <View style={styles.splash}>
      <LottieView
        source={require("../assets/animation.json")}
        autoPlay
        resizeMode='contain'
        loop={false}
        onAnimationFinish={() => {
          setHasAnimationPlayedOnce(true);
        }}
        style={styles.lottieStyles}
      />
    </View>
  );
};

Splash.propTypes = {
  setHasAnimationPlayedOnce: PropTypes.func,
};

const styles = StyleSheet.create({
  splash: {
    alighItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    width: widthPercentageToDP("100"),
  },
});

export default Splash;
