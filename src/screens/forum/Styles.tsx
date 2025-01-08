import {StyleSheet, useWindowDimensions} from 'react-native';
import {colors , FONTS} from '../../theme/colors';

export const useStyle = () => {
  const {width, height} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      backgroundColor: colors.white,
      flex: 1,
    },
    sectionTitle: {
      fontSize: 16,
      marginBottom: 10,
      fontFamily: FONTS.SemiBold,
      color: colors.black,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Positions search bar on the left and icon on the right
      marginTop: 10,
    },
    searchBar: {
      flex: 1,
      marginRight: 10,
      borderRadius: 10,
      height: 45,
      backgroundColor: colors.gray_bg,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInputText: {
      flex: 1,
      color: colors.black,
      fontFamily: FONTS.Regular,
      fontSize: 13,
     // backgroundColor: colors.white,
    },
    icon: {
      padding: 5, // Optional: Adjust padding to position the icon as desired
      alignItems: 'center',
    },
    savedTitle: {
      fontSize: 13,
      fontFamily: FONTS.Regular,
      color: colors.black,
      textAlign: 'center',
    },
    chip: {
      marginLeft: 5,
      borderRadius: 7,
      marginTop: 10,
    },
    chipList: {
      paddingVertical: 5,
      paddingRight: 20,
    },
    postContainer: {
      backgroundColor: colors.white,
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    profileTextContainer: {
      flex: 1,
      marginLeft: 10,
    },
    profileName: {
      fontSize: 14,
      color: colors.black,
      fontFamily: FONTS.SemiBold,
    },
    profileTime: {
      fontSize: 12,
      color: colors.second_text,
    },
    postContent: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.black,
      textAlignVertical: 'top',
      paddingLeft: 65,
    },
    readMore: {
      color: colors.dark_gray,
      fontSize: 14,
      marginTop: 5,
      fontFamily: FONTS.Medium,
      paddingLeft: 65,
    },
    postImage: {
      width: '100%',
      height: 245,
      marginTop: 20,
    },
    postSocialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#fff',
      marginHorizontal: 20,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#000', // You can change this to your theme color
    },
    bottomSheetContent: {
      flex: 1,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    comment: {
      fontSize: 16,
      marginVertical: 10,
    },
    commentsContainer: {
      marginBottom: 10,
    },
    menuContainer: {
      marginHorizontal: 10,
    },
    menuInner: {
      marginHorizontal: 20,
      marginVertical: 20,
      backgroundColor: colors.light_gray_ECEBEB,
      borderRadius: 10,
    },
    menuItem: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuText: {
      fontSize: 14,
      color: colors.black,
      marginLeft: 10,
      fontFamily: FONTS.Medium,
    },
    commentContainer: {
      paddingTop: 10,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      flexDirection: 'row',
    },
    commentNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    commentName: {
      fontSize: 14,
      color: colors.black,
      fontFamily: FONTS.SemiBold,
    },
    expertTag: {
      backgroundColor: colors.primary,
      borderRadius: 35,
      paddingHorizontal: 6,
      paddingVertical: 4,
      color: colors.white,
      fontFamily: FONTS.SemiBold,
    },
    commentTime: {
      fontSize: 12,
      color: colors.second_text,
    },
    commentContent: {
      fontSize: 14,
      color: colors.black,
      marginTop: 4,
    },
    reply: {
      fontWeight: '600',
      fontSize: 10,
      color: colors.dark_gray,
      paddingTop: 8,
    },
    answerToolbar: {
      flexDirection: 'row',
      // alignItems: "center",
      justifyContent: 'space-between',
      marginTop: 10,
      paddingHorizontal: 10,
    },
    noAnswersText: {
      fontSize: 14,
      color: colors.second_text,
      fontFamily: FONTS.Medium,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    writeText: {
      marginRight: 15, // space between Write text and menu icon
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 25,
      backgroundColor: colors.primary, // Customize with your theme color
      color: colors.white,
      borderRadius: 50,
    },
    postButton: {
      borderRadius: 8,
    },
    textInput: {
      flex: 1, // Takes up the available space on the left
      marginRight: 10, // Adds space between the search bar and the icon
      borderRadius: 8,
      color: colors.black,
      backgroundColor: colors.white,
      paddingLeft: 10,
    },
    repostReasonText: {
      fontSize: 14,
      marginVertical: 10,
    },
    dotStyle: {
      backgroundColor: colors.lightPink_second,
      height: 8,
      width: 8,
      borderRadius: 4,
    },
    activeDotStyle: {
      backgroundColor: colors.lightPink_active,
      height: 8,
      width: 15,
      borderRadius: 4,
    },
    commentSwipeContainer: {
//      backgroundColor: colors.primary,
      flex: 1,
      backgroundColor: '#ff3f32',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
  });

  const ceratePostStyles = StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: colors.white,
    },
    title: {
      fontSize: 17,
      color: colors.black,
      fontFamily: FONTS.SemiBold,
    },
    underlineContainer: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    content: {
      marginTop: 10,
      fontSize: 16,
    },
    textInputCon: {
      marginHorizontal: 15,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInput: {
      flex: 0.9,
      borderRadius: 8,
      backgroundColor: colors.gray_bg,
      color: colors.black,
      paddingLeft: 10,
    },
    answerToolbar: {
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    postImage: {
      width: '100%',
      height: 245,
      // marginTop: 20,
    },
    dotStyle: {
      backgroundColor: colors.lightPink_second,
      height: 8,
      width: 8,
      borderRadius: 4,
    },
    activeDotStyle: {
      backgroundColor: colors.lightPink_active,
      height: 8,
      width: 15,
      borderRadius: 4,
    },
  });
  return {styles, width, height, ceratePostStyles};
};
