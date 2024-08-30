import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '../theme/colors';

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.primary} />
    </View>
  );
};

export {Loader};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    height: 200,
    width: 200,
  },
});
