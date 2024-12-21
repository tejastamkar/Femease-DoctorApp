import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, FONTS} from '../../../theme/colors';
import {useNavigation} from '@react-navigation/native';
import {shareIcon} from '../../../helper/ImageAssets';
import {shareToAny} from '../../../helper/utility';
import FastImage from 'react-native-fast-image';
import {AppText} from '../../../common';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  isShare?: boolean;
  right?: React.ReactNode; // Accept additional children for right content
  shareMessage: string;
  shareUrl: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  right,
  isShare,
  shareMessage,
  shareUrl,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <IconButton
        icon={() => <Icon name="chevron-back" size={25} color={colors.black} />}
        onPress={handleBackPress}
      />
      <AppText style={styles.title}>{title}</AppText>
      {right && <View style={styles.right}>{right}</View>}
      {isShare && (
        <TouchableOpacity onPress={() => shareToAny(shareMessage, shareUrl)}>
          <FastImage
            source={shareIcon}
            style={styles.shareIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomColor: colors.light_gray,
  },
  title: {
    flex: 1,
    fontSize: 16,
    // marginLeft: 16,
    fontFamily: FONTS.SemiBold,
    color: colors.black,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    height: 20,
    width: 20,
    marginEnd: 20,
  },
});

export default Header;
