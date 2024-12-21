import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Image,
  Linking,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {TextLayoutEventData, NativeSyntheticEvent} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Avatar, Divider} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList as FlatList2} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actions-sheet';

import {AppSafeAreaView, AppText, KeyBoardAware, Loader} from '../../common';
import {useAppSelector} from '../../store/hooks';
import {PostInteractionCount, Header} from './components';
import {showToast} from '../../helper/logger';

import {colors} from '../../theme/colors';
import {AppDispatch, RootState} from '../../store/store';
import NavigationService from '../../navigation/NavigationService';
import * as RouteName from '../../navigation/routes';
import {logError} from '../../helper/logger';
import {useStyle} from './Styles';
import {shareToAny, convertToRelativeTime} from '../../helper/utility';
import {
  setCommentPost,
  setIsLoading,
  setLikePost,
  setBookmarkPost,
  setTurnOffComment,
  setPostRes,
  setCommentReplyLikePost,
  setCommentLikePost,
  setCommentReplyPost,
  setDeleteReplyComment,
  setDeleteComment,
} from '../../slices/postSlice';
import {appOperation} from '../../appOperation';
import Modal from '../../common/Modal';
import {
  setSavedBookmarkPost,
  setSavedCommentLikePost,
  setSavedCommentPost,
  setSavedCommentReplyLikePost,
  setSavedCommentReplyPost,
  setSavedDeleteComment,
  setSavedDeleteReplyComment,
  setSavedIsLoading,
  setSavedLikePost,
  setSavedTurnOffComment,
} from '../../slices/savedPostSlice';
// import { setUserAuthDetails } from "../../redux/action/AuthAction";
import ImageView from 'react-native-image-viewing';
import Swiper from 'react-native-swiper';
import ImageViewerFooter from './components/ImageViewerFooter';
import {SwipeRow} from 'react-native-swipe-list-view';
import {IMAGE_BASE_URL} from '../../helper/Constants';

const ForumMain = ({route}: {route: any}) => {
  const data = route.params;
  const {posts} = useAppSelector(state =>
    data.isFromScreen === 'SavedPosts' ? state.savedPost : state.post,
  );
  const currentPost = posts.find(post => post._id === data._id);
  const dispatch = useDispatch<AppDispatch>();
  const {styles} = useStyle();

  const actionSheetRef = useRef<any>(null);
  const actionSheetRefMenu = useRef<any>(null);
  const reportSheetRef = useRef<any>(null);
  const commentTextInputRef = useRef<any>(null);
  const notInterestedSheetRef = useRef<any>(null);

  const isAuthLoading = false;
  const {userData} = useSelector((state: RootState) => state.auth);
  const BasicDetails = userData;
  const [replyPlaceHolder, setReplyPlaceholder] = useState<any>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [numLines, setNumLines] = useState(0);
  const [commentText, setCommentText] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const [isVisibleTurnOffComment, setIsVisibleTurnOffComment] = useState(false);
  const [isVisibleDeletePost, setIsVisibleDeletePost] = useState(false);

  useEffect(() => {
    (async () => {
      console.log('checking data', data);

      if (data?._id && !data?.author) {
        try {
          const getPostresponse = await appOperation.customer.get_post(
            data?._id,
          );
          const getPostsresponse = await appOperation.customer.get_forum_post(
            1,
          );
          // const userProfileResponse = await appOperation.customer.user_profile();
          dispatch(
            setPostRes({
              posts: [...getPostsresponse.posts, getPostresponse.formattedPost],
              currentPage: getPostsresponse.currentPage,
              totalPages: getPostsresponse.totalPages,
              totalPosts: getPostsresponse.totalPosts,
            }),
          );
          // dispatch(setUserAuthDetails(userProfileResponse.data));
          // console.log("get post response", getPostresponse);
        } catch (e) {
          showToast('Network error, Please try later', 'danger');
          logError(e);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      !commentText && setReplyPlaceholder(false);
      if (commentTextInputRef?.current) commentTextInputRef?.current?.blur();
    });
    return () => hideSubscription.remove();
  }, [commentText]);

  const {
    author,
    createdAt,
    content,
    images,
    likes,
    comments,
    _id,
    bookmarks,
    isCommentingDisabled,
  } = currentPost || data || {};

  const createTime = convertToRelativeTime(createdAt);
  const hasLiked = likes?.includes(BasicDetails?._id);
  const hasBookmarked = bookmarks?.includes(BasicDetails?._id);
  const isPostMy = BasicDetails?._id === author?._id;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const contentParts = content?.split(urlRegex);

  const handleTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      setNumLines(event.nativeEvent.lines.length);
    },
    [],
  );

  const handleLike = useCallback(
    async (id: string, hasLiked: boolean, item: any) => {
      try {
        const updatedPost = JSON.parse(JSON.stringify(item));
        if (hasLiked) {
          const filteredLikes = updatedPost?.likes?.filter(
            (id: string) => id !== BasicDetails?._id,
          );
          updatedPost.likes = filteredLikes;
        } else {
          updatedPost?.likes?.push(BasicDetails?._id);
        }
        dispatch(setLikePost(updatedPost));
        dispatch(setSavedLikePost(updatedPost));
        setReloadKey(prev => prev + 1);
        const response = await appOperation.customer.post_like_post(id);
        // console.log("likePost response", response);
      } catch (e) {
        dispatch(setLikePost(item));
        dispatch(setSavedLikePost(item));
        showToast('Network error, Try again later', 'danger');
        logError(e);
      }
    },
    [dispatch],
  );

  const handleComment = async (data: any, replyPlaceHolder: any) => {
    if (replyPlaceHolder) {
      try {
        const reply = {
          author: {
            _id: BasicDetails?._id,
            name: BasicDetails?.name,
            role_id: BasicDetails?.role_id,
            avatar: BasicDetails?.avatar,
          },
          post: data?._id,
          parentComment: replyPlaceHolder?.parentCommentId,
          content: data?.content?.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: [],
        };
        setCommentText('');
        setReplyPlaceholder(false);
        dispatch(setSavedCommentReplyPost(reply));
        dispatch(setCommentReplyPost(reply));

        const response = await appOperation.customer.post_comment_reply_post(
          replyPlaceHolder?.parentCommentId,
          {replyText: reply.content},
        );
        // console.log("commentReplyPost response", response);
      } catch (e) {
        showToast('Network error, Try again later', 'danger');
        logError(e);
      }
    } else {
      try {
        const theComment = {
          author: {
            _id: BasicDetails?._id,
            name: BasicDetails?.name,
            role_id: BasicDetails?.role_id,
            avatar: BasicDetails?.avatar,
          },
          post: data?._id,
          content: data?.content?.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [],
          likes: [],
        };
        setCommentText('');
        dispatch(setCommentPost(theComment));
        dispatch(setSavedCommentPost(theComment));
        setReplyPlaceholder(false);

        const response = await appOperation.customer.post_comment_post(data);
        // console.log("commentPost response", response);
      } catch (e) {
        showToast('Network error, Try again later', 'danger');
        logError(e);
      }
    }
  };

  const handleReply = (comment: any) => {
    const {author, createdAt, content, _id, likes, replies, parentComment} =
      comment || {};
    setReplyPlaceholder({
      authorName: author?.name,
      parentCommentId: parentComment || _id,
    });
    if (commentTextInputRef?.current) commentTextInputRef?.current?.focus();
  };

  const handleCommentLike = useCallback(
    async (
      comment: any,
      isReply: boolean,
      isLiked: boolean,
      id: string,
      parentCommentId: string,
      post: any,
    ) => {
      if (isReply) {
        try {
          const updatedPost = JSON.parse(JSON.stringify(post));
          const updatedComment = updatedPost?.comments?.find(
            (comment: any) => comment?._id == parentCommentId,
          );
          const updatedReplies = updatedComment?.replies?.find(
            (reply: any) => reply?._id == id,
          );
          if (isLiked) {
            const filteredLikes = updatedReplies?.likes?.filter(
              (id: string) => id !== BasicDetails?._id,
            );
            updatedReplies.likes = filteredLikes;
          } else {
            updatedReplies?.likes?.push(BasicDetails?._id);
          }
          dispatch(setCommentReplyLikePost(updatedPost));
          dispatch(setSavedCommentReplyLikePost(updatedPost));
          const response = await appOperation.customer.post_comment_reply_Like(
            id,
            parentCommentId,
          );
          // console.log("like reply comment response", response);
        } catch (e) {
          dispatch(setCommentReplyLikePost(post));
          dispatch(setSavedCommentReplyLikePost(post));
          showToast('Network error, Try again later', 'danger');
          logError(e);
        }
      } else {
        try {
          const updatedPost = JSON.parse(JSON.stringify(post));
          const updatedComment = updatedPost?.comments?.find(
            (comment: any) => comment?._id == id,
          );
          if (isLiked) {
            const filteredLikes = updatedComment?.likes?.filter(
              (id: string) => id !== BasicDetails?._id,
            );
            updatedComment.likes = filteredLikes;
          } else {
            updatedComment?.likes?.push(BasicDetails?._id);
          }
          dispatch(setCommentLikePost(updatedPost));
          dispatch(setSavedCommentLikePost(updatedPost));
          const response = await appOperation.customer.post_comment_Like(id);
          // console.log("like comment response", response);
        } catch (e) {
          dispatch(setCommentLikePost(post));
          dispatch(setSavedCommentLikePost(post));
          showToast('Network error, Try again later', 'danger');
          logError(e);
        }
      }
    },
    [dispatch],
  );

  const handleDeleteComment = async (
    comment: any,
    isReply: boolean,
    id: string,
    parentCommentId: string,
    post: any,
  ) => {
    if (isReply) {
      try {
        const updatedPost = JSON.parse(JSON.stringify(post));
        const updatedComment = updatedPost?.comments?.find(
          (comment: any) => comment?._id == parentCommentId,
        );
        const filteredReplies = updatedComment?.replies?.filter(
          (reply: any) => reply?._id !== id,
        );
        updatedComment.replies = filteredReplies;
        dispatch(setDeleteReplyComment(updatedPost));
        dispatch(setSavedDeleteReplyComment(updatedPost));
        const response = await appOperation.customer.delete_reply_comment(
          parentCommentId,
          id,
        );
        // console.log("delete reply comment response", response);
      } catch (e) {
        dispatch(setDeleteReplyComment(post));
        dispatch(setSavedDeleteReplyComment(post));
        showToast('Network error, Try again later', 'danger');
        logError(e);
      }
    } else {
      try {
        const updatedPost = JSON.parse(JSON.stringify(post));
        const comment = updatedPost?.comments?.find(
          (comment: any) => comment?._id == id,
        );
        comment.deleted = true;
        dispatch(setDeleteComment(updatedPost));
        dispatch(setSavedDeleteComment(updatedPost));
        const response = await appOperation.customer.delete_comment(id);
        // console.log("delete comment response", response);
      } catch (e) {
        dispatch(setDeleteComment(post));
        dispatch(setSavedDeleteComment(post));
        showToast('Network error, Try again later', 'danger');
        logError(e);
      }
    }
  };

  const handleOffComment = useCallback(
    async (id: string) => {
      try {
        const response = await appOperation.customer.post_comment_off(id);
        let updatedPost = {
          ...currentPost,
          isCommentingDisabled: !isCommentingDisabled,
        };
        dispatch(setTurnOffComment(updatedPost));
        dispatch(setSavedTurnOffComment(updatedPost));
        showToast(response.message, 'success');
        dispatch(setIsLoading(true));
        dispatch(setSavedIsLoading(true));
        setReloadKey(prev => prev + 1);
        actionSheetRefMenu.current?.hide();
        // console.log("commentOff response", response);
      } catch (e) {
        logError(e);
      } finally {
        actionSheetRefMenu.current?.hide();
        dispatch(setIsLoading(false));
        dispatch(setSavedIsLoading(false));
      }
    },
    [dispatch, isCommentingDisabled],
  );

  const handleDeletePost = useCallback(
    async (id: string) => {
      try {
        dispatch(setIsLoading(true));
        dispatch(setSavedIsLoading(true));
        const response = await appOperation.customer.delete_post(id);
        // console.log("deletePost response", response);
        NavigationService.navigate(RouteName.FORUM_LIST);
      } catch (e) {
        logError(e);
      } finally {
        dispatch(setIsLoading(false));
        dispatch(setSavedIsLoading(false));
      }
    },
    [dispatch],
  );

  const handleReport = useCallback(
    async (id: string, reason: string) => {
      try {
        dispatch(setIsLoading(true));
        dispatch(setSavedIsLoading(true));
        const response = await appOperation.customer.post_report(id, {reason});
        // console.log("Report post response", response);
        showToast(response.message, 'success');
        setReloadKey(prev => prev + 1);
      } catch (e) {
        logError(e);
      } finally {
        reportSheetRef.current?.hide();
        actionSheetRefMenu.current?.hide();
        dispatch(setIsLoading(false));
        dispatch(setSavedIsLoading(false));
      }
    },
    [dispatch],
  );

  const handleSave = useCallback(
    async (id: string) => {
      try {
        dispatch(setIsLoading(true));
        dispatch(setSavedIsLoading(true));
        const response = await appOperation.customer.post_bookmark(id);
        dispatch(setBookmarkPost(response?.post));
        dispatch(setSavedBookmarkPost(response?.post));
        // console.log("savePost response", response);
        showToast(response.message, 'success');
      } catch (e) {
        logError(e);
      } finally {
        dispatch(setIsLoading(false));
        dispatch(setSavedIsLoading(false));
      }
    },
    [dispatch],
  );

  const handleNotInterested = useCallback(
    async (id: string, reason: string) => {
      try {
        dispatch(setIsLoading(true));
        dispatch(setSavedIsLoading(true));
        const response = await appOperation.customer.post_not_interested(id, {
          reason,
        });
        showToast(response.message, 'success');
        setReloadKey(prev => prev + 1);
        // console.log("Not interested response", response);
      } catch (e) {
        logError(e);
      } finally {
        actionSheetRefMenu.current?.hide();
        notInterestedSheetRef.current?.hide();
        dispatch(setIsLoading(false));
        dispatch(setSavedIsLoading(false));
      }
    },
    [dispatch],
  );

  const handleShare = useCallback(async (id: string) => {
    shareToAny(
      `https://www.femease.in/forums/posts/${id}`,
      `https://www.femease.in/forums/posts/${id}`,
    );
    // console.log("Shared the post", id);
  }, []);

  const openBottomSheet = useCallback(
    (contentType: 'comments' | 'menu' | 'report' | 'notInterested') => {
      if (contentType == 'comments') {
        actionSheetRef.current?.show();
      } else if (contentType == 'menu') {
        actionSheetRefMenu.current?.show();
      } else if (contentType == 'report') {
        reportSheetRef.current?.show();
      } else if (contentType == 'notInterested') {
        notInterestedSheetRef.current?.show();
      }
    },
    [],
  );

  const renderMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.menuInner}>
          {isPostMy ? (
            <>
              <TouchableOpacity
                onPress={() => setIsVisibleTurnOffComment(true)}
                style={styles.menuItem}>
                {isCommentingDisabled ? (
                  <IconMC
                    name="message-text-outline"
                    size={20}
                    color={colors.black}
                  />
                ) : (
                  <IconMC
                    name="message-off-outline"
                    size={20}
                    color={colors.black}
                  />
                )}
                <AppText style={styles.menuText}>
                  Turn {isCommentingDisabled ? 'on' : 'off'} commenting
                </AppText>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  NavigationService.navigate(RouteName.EDIT_POST, currentPost)
                }>
                <Feather name="edit-3" size={20} color={colors.black} />
                <AppText style={styles.menuText}>Edit post</AppText>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                onPress={() => setIsVisibleDeletePost(true)}
                style={styles.menuItem}>
                <IconMC name="delete-outline" size={20} color={colors.red} />
                <AppText style={{...styles.menuText, color: colors.red}}>
                  Delete
                </AppText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => openBottomSheet('notInterested')}
                style={styles.menuItem}>
                <IconMC name="eye-off" size={20} color={colors.black} />
                <AppText style={styles.menuText}>Not interested</AppText>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                onPress={() => openBottomSheet('report')}
                style={styles.menuItem}>
                <IconMC
                  name="message-alert-outline"
                  size={20}
                  color={colors.red}
                />
                <AppText style={{...styles.menuText, color: colors.red}}>
                  Report
                </AppText>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Modal
          title={`Turn ${
            isCommentingDisabled ? 'on' : 'off'
          } commenting will stop people from posting comments on your post.`}
          isVisible={isVisibleTurnOffComment}
          setIsVisible={setIsVisibleTurnOffComment}
          cb={() => {
            handleOffComment(_id);
            setIsVisibleTurnOffComment(false);
          }}
        />
        <Modal
          title="Are you sure you want to Delete this post?"
          isVisible={isVisibleDeletePost}
          setIsVisible={setIsVisibleDeletePost}
          cb={() => {
            handleDeletePost(_id);
            setIsVisibleDeletePost(false);
          }}
        />
      </View>
    );
  };

  const Comments = memo(({comment, isFromPostsList, isReply, post}: any) => {
    const {
      author,
      createdAt,
      content,
      _id,
      likes,
      replies,
      parentComment,
      deleted,
      isExpert,
    } = comment || {};
    const createTime = convertToRelativeTime(createdAt);
    const isCommentLiked = likes?.includes(BasicDetails?._id);
    const commentSwipeRowRef = useRef<any>(null);
    return (
      <>
        <SwipeRow
          rightOpenValue={-65}
          disableRightSwipe
          disableLeftSwipe={
            !(author?._id === BasicDetails?._id) || isFromPostsList || deleted
          }
          ref={commentSwipeRowRef}>
          <View style={styles.commentSwipeContainer}>
            <Feather
              name="trash"
              style={{padding: 20}}
              color={colors.white}
              size={24}
              onPress={() => {
                commentSwipeRowRef?.current?.closeRow();
                handleDeleteComment(comment, isReply, _id, parentComment, post);
              }}
            />
          </View>
          <View style={styles.commentContainer}>
            <View style={styles.profileContainer}>
              <Avatar.Image
                size={35}
                source={{
                  uri: deleted
                    ? 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
                    : IMAGE_BASE_URL + author?.avatar,
                }}
              />
              <View style={styles.profileTextContainer}>
                <View style={styles.commentNameContainer}>
                  <AppText style={styles.commentName}>
                    {deleted ? '[Deleted]' : author?.name}
                  </AppText>
                  {isExpert && (
                    <AppText style={styles.expertTag}>Expert</AppText>
                  )}
                  {!deleted && (
                    <AppText style={styles.commentTime}>{createTime}</AppText>
                  )}
                </View>
                <AppText style={styles.commentContent}>
                  {deleted ? 'Comment deleted by user' : content}
                </AppText>
                {!isFromPostsList && (
                  <AppText
                    onPress={() => handleReply(comment)}
                    style={styles.reply}>
                    Reply
                  </AppText>
                )}
              </View>
            </View>
            {!isFromPostsList && !deleted && (
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() =>
                  handleCommentLike(
                    comment,
                    isReply,
                    isCommentLiked,
                    _id,
                    parentComment,
                    post,
                  )
                }>
                <IconMC
                  name={isCommentLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isCommentLiked ? colors.primary : colors.black}
                />
                <AppText>{likes?.length}</AppText>
              </TouchableOpacity>
            )}
          </View>
        </SwipeRow>
        {!isFromPostsList && (
          <FlatList2
            data={replies}
            renderItem={reply =>
              renderComments(reply, isFromPostsList, true, post)
            }
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingLeft: 40}}
          />
        )}
      </>
    );
  });

  const renderComments = useCallback(
    ({item}: any, isFromPostsList?: boolean, isReply?: boolean, post?: any) => (
      <Comments
        comment={item}
        isFromPostsList={isFromPostsList}
        isReply={isReply}
        post={post}
      />
    ),
    [reloadKey],
  );

  const renderCommentsList = useMemo(() => {
    return (
      <FlatList2
        data={comments}
        renderItem={comment =>
          renderComments(comment, undefined, undefined, currentPost || data)
        }
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{paddingBottom: 10}}
        nestedScrollEnabled
        onMomentumScrollEnd={() => {
          actionSheetRef.current?.handleChildScrollEnd();
        }}
      />
    );
  }, [comments, currentPost, data, reloadKey]);

  if (!author) return <Loader />;

  return (
    <AppSafeAreaView>
      {isAuthLoading ? (
        <Loader />
      ) : (
        <>
          <Header title="" />
          <KeyboardAvoidingView
            style={{flex: 1}}
            contentContainerStyle={{flex: 1}}
            behavior="position"
            keyboardVerticalOffset={20}>
            <ScrollView style={{backgroundColor: colors.white}}>
              <View style={styles.container}>
                <View style={styles.postContainer}>
                  <View style={styles.profileContainer}>
                    <Avatar.Image
                      size={55}
                      source={{uri: IMAGE_BASE_URL + author?.avatar}}
                    />
                    <View style={styles.profileTextContainer}>
                      <AppText style={styles.profileName}>
                        {author?.name}
                      </AppText>
                      <AppText style={styles.profileTime}>{createTime}</AppText>
                    </View>
                  </View>
                  <View>
                    <AppText
                      numberOfLines={isExpanded ? numLines : 5}
                      onTextLayout={handleTextLayout}
                      style={styles.postContent}>
                      {contentParts?.map((contentPart: string) => {
                        return urlRegex.test(contentPart) ? (
                          <TouchableOpacity
                            onPress={() => Linking.openURL(contentPart)}>
                            <AppText
                              style={{
                                color: colors.blue,
                                textDecorationLine: 'underline',
                              }}>
                              {contentPart}
                            </AppText>
                          </TouchableOpacity>
                        ) : (
                          contentPart
                        );
                      })}
                    </AppText>
                    {!isExpanded && numLines > 5 && (
                      <TouchableOpacity onPress={() => setIsExpanded(true)}>
                        <AppText style={styles.readMore}>Read More</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                  {images.length > 0 && (
                    <Swiper
                      activeDot={<View style={styles.activeDotStyle} />}
                      dotStyle={styles.dotStyle}
                      showsPagination={true}
                      scrollEnabled={true}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      removeClippedSubviews={false}
                      loop={false}
                      style={{
                        height: 265,
                        marginBottom: images.length > 1 ? 40 : 0,
                      }}
                      paginationStyle={{marginBottom: -20}}>
                      {images?.map((image: string) => (
                        <TouchableWithoutFeedback
                          onPress={() => setIsImageViewVisible(true)}>
                          <Image
                            source={{uri: IMAGE_BASE_URL + image}}
                            style={styles.postImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableWithoutFeedback>
                      ))}
                    </Swiper>
                  )}
                  <View style={styles.postSocialContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        handleLike(_id, hasLiked, currentPost || data)
                      }>
                      <IconMC
                        name={hasLiked ? 'heart' : 'heart-outline'}
                        size={24}
                        color={hasLiked ? colors.primary : colors.black}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleShare(_id)}>
                      <Feather name="share" size={24} color={colors.black} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleSave(_id)}>
                      <IconMC
                        name={hasBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={25}
                        color={hasBookmarked ? colors.primary : colors.black}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => openBottomSheet('menu')}>
                      <Feather
                        name="more-horizontal"
                        size={24}
                        color={colors.black}
                      />
                    </TouchableOpacity>
                  </View>
                  <PostInteractionCount
                    likesCount={likes?.length}
                    commentsCount={comments?.length}
                    isCommentingDisabled={isCommentingDisabled}
                  />
                  {renderCommentsList}
                  <ImageView
                    images={images?.map((image: any) => {
                      return {uri: IMAGE_BASE_URL + image};
                    })}
                    imageIndex={0}
                    visible={isImageViewVisible}
                    onRequestClose={() => setIsImageViewVisible(false)}
                    FooterComponent={({imageIndex}) => (
                      <ImageViewerFooter
                        imageIndex={imageIndex}
                        imagesCount={images?.length}
                      />
                    )}
                  />
                  <ActionSheet ref={actionSheetRefMenu} gestureEnabled>
                    {renderMenu()}
                  </ActionSheet>
                  <ActionSheet ref={reportSheetRef} gestureEnabled>
                    <View style={{marginTop: 10}}>
                      <AppText style={styles.sheetTitle}>Report</AppText>
                      <Divider style={{marginVertical: 10}} />
                    </View>
                    <View style={{marginHorizontal: 20}}>
                      <TouchableOpacity
                        onPress={() => {
                          handleReport(_id, `I just don't like it`);
                        }}>
                        <AppText style={styles.repostReasonText}>
                          I just don't like it
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleReport(_id, `Its a spam`);
                        }}>
                        <AppText style={styles.repostReasonText}>
                          Its a spam
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleReport(_id, `Hate speech or symbol`);
                        }}>
                        <AppText style={styles.repostReasonText}>
                          Hate speech or symbol
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleReport(_id, `False information`);
                        }}>
                        <AppText style={styles.repostReasonText}>
                          False information
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleReport(_id, `Others`);
                        }}>
                        <AppText style={styles.repostReasonText}>
                          Others
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                    </View>
                  </ActionSheet>
                  <ActionSheet ref={notInterestedSheetRef} gestureEnabled>
                    <View style={{marginTop: 10}}>
                      <AppText style={styles.sheetTitle}>
                        Don't want to see this
                      </AppText>
                      <Divider style={{marginVertical: 10}} />
                    </View>
                    <View style={{marginHorizontal: 20}}>
                      <TouchableOpacity
                        onPress={() => {
                          handleNotInterested(
                            _id,
                            `I'm not interested in the author`,
                          );
                        }}>
                        <AppText style={styles.repostReasonText}>
                          I'm not interested in the author
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleNotInterested(
                            _id,
                            `I'm not interested in this topic`,
                          );
                        }}>
                        <AppText style={styles.repostReasonText}>
                          I'm not interested in this topic
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleNotInterested(
                            _id,
                            `I didn't find it enagaging`,
                          );
                        }}>
                        <AppText style={styles.repostReasonText}>
                          I didn't find it enagaging
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleNotInterested(
                            _id,
                            `I already know this information`,
                          );
                        }}>
                        <AppText style={styles.repostReasonText}>
                          I already know this information
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                      <TouchableOpacity
                        onPress={() => {
                          handleNotInterested(_id, `Others`);
                        }}>
                        <AppText style={styles.repostReasonText}>
                          Others
                        </AppText>
                      </TouchableOpacity>
                      <Divider style={{marginVertical: 10}} />
                    </View>
                  </ActionSheet>
                </View>
              </View>
            </ScrollView>
            {!isCommentingDisabled && (
              <View
                style={{
                  ...styles.answerToolbar,
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  paddingTop: 10,
                  backgroundColor: colors.white,
                  marginTop: 0,
                }}>
                <Avatar.Image
                  size={35}
                  source={{uri: IMAGE_BASE_URL + BasicDetails?.avatar}}
                  style={{margin: 5}}
                />
                <TextInput
                  ref={commentTextInputRef}
                  placeholder={
                    replyPlaceHolder
                      ? `Reply to ${replyPlaceHolder?.authorName}`
                      : 'Write a comment'
                  }
                  style={styles.textInput}
                  placeholderTextColor={colors.second_text}
                  multiline={true}
                  onChangeText={text => setCommentText(text)}
                  value={commentText}
                />
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() =>
                    handleComment(
                      {content: commentText, _id: _id},
                      replyPlaceHolder,
                    )
                  }>
                  {commentText && (
                    <IconFA
                      name="paper-plane"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </>
      )}
    </AppSafeAreaView>
  );
};

export default ForumMain;
