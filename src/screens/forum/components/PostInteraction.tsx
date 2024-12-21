import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {colors} from '../../../theme/colors'; // Replace with your theme import
import {AppText} from '../../../common';

const PostInteractionCount = ({
  likesCount = 0,
  commentsCount = 0,
  isCommentingDisabled,
}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.countText}>
        {likesCount > 0 ? `${likesCount} likes` : 'No Likes'}
      </AppText>
      {!isCommentingDisabled && <AppText style={styles.countText}>, </AppText>}
      {!isCommentingDisabled && (
        <AppText style={styles.countText}>
          {commentsCount > 0 ? `${commentsCount} comments` : 'No Comments'}
        </AppText>
      )}
    </View>
  );
};

export default PostInteractionCount;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  countText: {
    fontSize: 14,
    color: colors.second_text,
  },
});
