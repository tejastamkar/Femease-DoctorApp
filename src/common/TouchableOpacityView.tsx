import React, {ReactNode} from 'react';
import {
  TouchableOpacity as TouchableOpacityBase,
  Platform,
  TouchableOpacityProps,
} from 'react-native';
import {TouchableOpacity as TouchableOpacityGesture} from 'react-native-gesture-handler';

interface TouchableOpacityViewProps extends TouchableOpacityProps {
  children?: ReactNode;
  isGesture?: boolean;
}

const TouchableOpacityView = ({
  children,
  isGesture,
  ...props
}: TouchableOpacityViewProps) => {
  const isIos = Platform.OS === 'ios';
  if (isGesture && !isIos) {
    return (
      <TouchableOpacityGesture activeOpacity={0.8} {...props}>
        {children}
      </TouchableOpacityGesture>
    );
  } else {
    return (
      <TouchableOpacityBase activeOpacity={0.8} {...props}>
        {children}
      </TouchableOpacityBase>
    );
  }
};

export {TouchableOpacityView};
