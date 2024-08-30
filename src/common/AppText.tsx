import React from 'react';
import {Text, StyleSheet, TextProps, TextStyle} from 'react-native';
import {
  fontFamily,
  fontFamilyBold,
  fontFamilyLight,
  fontFamilyMedium,
  fontFamilySemiBold,
} from '../theme/typography';
import {colors} from '../theme/colors';

export const THIRTEEN = 'THIRTEEN';
export const FIFTEEN = 'FIFTEEN';
export const SIXTEEN = 'SIXTEEN';
export const TWENTY = 'TWENTY';
export const TWENTY_FOUR = 'TWENTY_FOUR';
export const TWENTY_SIX = 'TWENTY_SIX';
export const FOURTEEN = 'FOURTEEN';
export const EIGHTEEN = 'EIGHTEEN';
export const NINETEEN = 'NINETEEN';
export const TWELVE = 'TWELVE';
export const FORTY = 'FORTY';
export const TWENTY_TWO = 'TWENTY_TWO';
export const THIRTY_FOUR = 'THIRTY_FOUR';
export const TEN = 'TEN';
export const ELEVEN = 'ELEVEN';
export const EIGHT = 'EIGHT';
export const NINE = 'NINE';
export const FIFTY = 'FIFTY';
export const THREE = 'THREE';

export const NORMAL = 'normal';
export const SEMI_BOLD = 'semibold';
export const MEDIUM = 'MEDIUM';
export const BOLD = 'BOLD';
export const LIGHT = 'LIGHT';

export const WHITE = 'WHITE';
export const BLACK = 'BLACK';
export const PRIMARY = 'PRIMARY';
export const BLUE = 'BLUE';
export const BORDER = 'BORDER';
export const ORANGE = 'ORANGE';
export const RED = 'RED';
export const YELLOW = 'YELLOW';
export const SUCCESS = 'SUCESS';

export const TWENTY_ONE_L = 'TWENTY_ONE_L';
export const THIRTY_SIX_L = 'THIRTY_SIX_L';
export const FIFTY_ONE_L = 'FIFTY_ONE_L';

interface AppTextProps extends TextProps {
  type?: number | string;
  weight?: string;
  style?: TextStyle;
  color?: string;
  line?: number;
}

const AppText = ({
  type,
  weight,
  style,
  color,
  line,
  ...props
}: AppTextProps) => {
  const getTextStyle = (type, weight, color, line) => {
    var style = {
      fontFamily: fontFamily,
    };
    switch (type) {
      case FIFTY:
        style['fontSize'] = 50;
        break;
      case FIFTEEN:
        style['fontSize'] = 15;
        break;
      case TWENTY:
        style['fontSize'] = 20;
        break;
      case TWENTY_FOUR:
        style['fontSize'] = 24;
        break;
      case TWENTY_SIX:
        style['fontSize'] = 26;
        break;
      case FOURTEEN:
        style['fontSize'] = 14;
        break;
      case EIGHTEEN:
        style['fontSize'] = 18;
        break;
      case TWELVE:
        style['fontSize'] = 12;
        break;
      case NINETEEN:
        style['fontSize'] = 19;
        break;
      case FORTY:
        style['fontSize'] = 40;
        break;
      case SIXTEEN:
        style['fontSize'] = 16;
        break;
      case TWENTY_TWO:
        style['fontSize'] = 22;
        break;
      case THIRTY_FOUR:
        style['fontSize'] = 34;
        break;
      case THIRTEEN:
        style['fontSize'] = 13;
        break;
      case TEN:
        style['fontSize'] = 10;
        break;
      case ELEVEN:
        style['fontSize'] = 11;
        break;
      case EIGHT:
        style['fontSize'] = 8;
        break;
      case NINE:
        style['fontSize'] = 9;
        break;
      case THREE:
        style['fontSize'] = 3;
        break;
      default:
        style['fontSize'] = 12;
    }

    switch (weight) {
      case NORMAL:
        style['fontFamily'] = fontFamily;
        break;
      case MEDIUM:
        style['fontFamily'] = fontFamilyMedium;
        break;
      case SEMI_BOLD:
        style['fontFamily'] = fontFamilySemiBold;
        break;
      case BOLD:
        style['fontFamily'] = fontFamilyBold;
        break;
      case LIGHT:
        style['fontFamily'] = fontFamilyLight;
        break;
      default:
        style['fontFamily'] = fontFamily;
    }
    switch (line) {
      case TWENTY_ONE_L:
        style['lineHeight'] = 21;
        break;
      case THIRTY_SIX_L:
        style['lineHeight'] = 36;
      case FIFTY_ONE_L:
        style['lineHeight'] = 51;
        break;
    }

    switch (color) {
      case WHITE:
        style['color'] = colors.white;
        break;
      case PRIMARY:
        style['color'] = colors.primary;
        break;
      case BLUE:
        style['color'] = colors.blue;
        break;
      case BORDER:
        style['color'] = colors.border_color;
        break;
      case ORANGE:
        style['color'] = colors.orange_second;
        break;
      case RED:
        style['color'] = colors.red;
        break;
      case YELLOW:
        style['color'] = colors.yellow;
        break;
      case SUCCESS:
        style['color'] = colors.success;
        break;

      default:
        style['color'] = colors.black;
    }

    return style;
  };
  const styles = {
    text: (type, weight, color, line) => ({
      ...getTextStyle(type, weight, color, line),
    }),
  };
  return (
    <Text
      allowFontScaling={false}
      style={StyleSheet.flatten([
        styles.text(type, weight, color, line),
        style,
      ])}
      {...props}
    />
  );
};

export {AppText};
