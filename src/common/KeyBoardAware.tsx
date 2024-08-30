import React from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from '@codler/react-native-keyboard-aware-scroll-view';
import {commonStyles} from '../theme/commonStyles';
import {ViewProps} from 'react-native';

interface KeyBoardAwareProps extends KeyboardAwareScrollViewProps {
  children: JSX.Element;
  style?: ViewProps;
}

const KeyBoardAware = ({
  children,
  style,
  ...props
}: KeyBoardAwareProps): JSX.Element => {
  return (
    <KeyboardAwareScrollView
      {...props}
      keyboardShouldPersistTaps="handled"
      style={[commonStyles.whiteBackgroundWithPadding, style]}
      contentContainerStyle={commonStyles.flexGrow}
      showsVerticalScrollIndicator={false}>
      {children}
    </KeyboardAwareScrollView>
  );
};
export {KeyBoardAware};
