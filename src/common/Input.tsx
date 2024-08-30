import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../theme/colors';
import {borderWidth, inputHeight} from '../theme/dimens';
import {fontFamilySemiBold} from '../theme/typography';
import {AppText, LIGHT, MEDIUM, TEN, THIRTEEN} from './AppText';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText?: ((text: string) => void) | undefined;
  placeholder?: string;
  label?: string;
  assignRef?: any;
  isSecure?: boolean;
  container?: ViewStyle;
  secondContainer?: ViewStyle;
  inputStyle?: TextStyle;
  title?: string;
  isSecond?: boolean;
  titleSecond?: string;
}

const Input = ({
  value,
  onChangeText,
  placeholder,
  assignRef,
  secureTextEntry,
  container,
  secondContainer,
  inputStyle,
  title,
  isSecond,
  titleSecond,
  ...props
}: InputProps) => {
  return (
    <View style={[styles.container, container]}>
      {title && (
        <AppText type={THIRTEEN} weight={MEDIUM}>
          {title} {titleSecond && '('}
          {titleSecond && (
            <AppText type={TEN} weight={LIGHT}>
              {titleSecond}
            </AppText>
          )}
          {titleSecond && ')'}
        </AppText>
      )}
      <View
        style={[
          styles.secondContainer,
          isSecond && {borderColor: colors.border_color},
          secondContainer,
        ]}>
        <TextInput
          {...props}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          autoCorrect={false}
          ref={component => {
            assignRef && assignRef(component);
          }}
          secureTextEntry={secureTextEntry}
          style={[styles.inputStyle, inputStyle]}
        />
      </View>
    </View>
  );
};

export {Input};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  secondContainer: {
    borderRadius: 5,
    borderWidth: borderWidth,
    borderColor: colors.primary,
    height: inputHeight,
    backgroundColor: colors.white,
    marginTop: 5,
  },
  inputStyle: {
    fontFamily: fontFamilySemiBold,
    color: colors.black,
    fontSize: 18,
    flex: 1,
    marginHorizontal: 10,
    letterSpacing: 1,
  },
  eyeContainer: {
    height: inputHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
