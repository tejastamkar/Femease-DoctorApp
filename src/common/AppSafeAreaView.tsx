/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {Platform, StatusBar, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';

interface AppSafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
  isSecond?: boolean;
  statusColor?: string;
}

const AppSafeAreaView = ({
  children,
  style,
  isSecond,
  statusColor,
}: AppSafeAreaViewProps) => {
  return Platform.OS === 'ios' ? (
    <>
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 0,
          backgroundColor: statusColor ? statusColor : colors.white,
        }}
      />
      <SafeAreaView
        edges={['right', 'left']}
        style={[
          {
            flex: 1,
          },

          style,
        ]}>
        <StatusBar
          translucent={false}
          barStyle={isSecond ? 'light-content' : 'dark-content'}
        />

        {children}
      </SafeAreaView>
    </>
  ) : (
    <View style={[{flex: 1}, style]}>
      <StatusBar
        translucent={false}
        backgroundColor={statusColor ? statusColor : colors.white}
        barStyle={isSecond ? 'light-content' : 'dark-content'}
      />
      {children}
    </View>
  );
};

export {AppSafeAreaView};
