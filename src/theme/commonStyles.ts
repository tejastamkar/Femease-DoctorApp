import {Platform, StyleSheet} from 'react-native';
import {universalPaddingHorizontal} from './dimens';
import {colors} from './colors';
import {fontFamilyMedium} from './typography';
export const commonStyles = StyleSheet.create({
  whiteBackgroundWithPadding: {
    flex: 1,
    padding: universalPaddingHorizontal,
    backgroundColor: colors.white,
  },
  whiteBackgroundWithOutPadding: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {height: 25, width: 25},
  flex: {
    flex: 1,
  },
  textAlign: {
    textAlign: 'center',
  },
  spaceCenter: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexEnd: {
    alignItems: 'flex-end',
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    height: Platform.OS == 'android' ? 60 : 80,
    borderTopWidth: 0,
    paddingTop: Platform.OS == 'android' ? 0 : 10,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  tabBarLabelStyle: {
    marginTop: Platform.OS == 'android' ? 0 : 10,
    marginBottom: Platform.OS == 'android' ? 8 : 0,
    fontFamily: fontFamilyMedium,
    fontSize: 11,
  },
  dashboardIcon: {
    height: 55,
    width: 55,
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginBottom: 30,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  emptyView: {
    height: 100,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 0,
  },
});
