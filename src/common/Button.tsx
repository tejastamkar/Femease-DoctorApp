import React, {memo, useMemo} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {AppText, TouchableOpacityView} from '.';
import {buttonHeight} from '../theme/dimens';
import {FOURTEEN, MEDIUM, SEMI_BOLD, WHITE} from './AppText';
import {colors} from '../theme/colors';

interface ButtonProps {
  children: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean;
}

const Button = ({
  children,
  containerStyle,
  titleStyle,
  disabled,
  onPress,
  loading,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacityView
      style={[
        styles.buttonStyle,
        disabled || loading ? {backgroundColor: colors.buttonBgDisabled} : {},
        containerStyle,
      ]}
      activeOpacity={0.8}
      onPress={
        disabled || loading ? console.log('AMIT SINGH SHEKHAWAT') : onPress
      }
      {...rest}>
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <AppText
          type={FOURTEEN}
          color={WHITE}
          weight={MEDIUM}
          style={titleStyle}>
          {children}
        </AppText>
      )}
    </TouchableOpacityView>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: buttonHeight,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginTop: 20,
  },
});

export {Button};
