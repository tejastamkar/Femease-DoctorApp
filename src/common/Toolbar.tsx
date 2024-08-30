import React from 'react';
import {TouchableOpacityView} from './TouchableOpacityView';
import {Image, StyleSheet, View} from 'react-native';
import {backIconFirst, backIconSecond} from '../helper/ImageAssets';
import {colors} from '../theme/colors';
import NavigationService from '../navigation/NavigationService';
import FastImage from 'react-native-fast-image';

const Toolbar = ({isSecond = false, style}: any) => {
  return (
    <View style={[styles.mainContainer, style]}>
      <TouchableOpacityView
        onPress={() => {
          NavigationService.goBack();
        }}
        style={[styles.container, style]}>
        <FastImage
          source={isSecond ? backIconSecond : backIconFirst}
          resizeMode="contain"
          style={styles.icon}
        />
      </TouchableOpacityView>
    </View>
  );
};
export default Toolbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 50,
    justifyContent: 'center',
    width: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  icon: {
    height: 25,
    width: 25,
  },
  mainContainer: {
    backgroundColor: colors.white,
  },
});
