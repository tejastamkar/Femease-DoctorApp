import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  RefreshControl,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {TextLayoutEventData, NativeSyntheticEvent} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Avatar, Chip, Divider, FAB} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList as FlatList2} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actions-sheet';

import {AppSafeAreaView, AppText} from '../../common';
import {showToast} from '../../helper/logger';
import {PostInteractionCount, Header} from './components';
import {colors, FONTS} from '../../theme/colors';
import {useAppSelector} from '../../store/hooks';
import {AppDispatch, RootState} from '../../store/store';
import NavigationService from '../../navigation/NavigationService';
import {logError} from '../../helper/logger';
import {shareToAny, convertToRelativeTime} from '../../helper/utility';
import {useStyle} from './Styles';
import {
  setCommentLikePost,
  setCommentPost,
  setCommentReplyLikePost,
  setCommentReplyPost,
  setDeleteComment,
  setDeleteReplyComment,
  setIsLoading,
  setLikePost,
  setPollAnswer,
  setPostRes,
  setQuizAnswer,
  setTurnOffComment,
} from '../../slices/postSlice';
import * as RouteName from '../../navigation/routes';

import {appOperation} from '../../appOperation';
import Modal from '../../common/Modal';
import {IMAGE_BASE_URL} from '../../helper/Constants';
import PollQuizComponent from './components/PollQuizComponent';
import ImageView from 'react-native-image-viewing';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import axios from 'axios';
import {setIsLoginModal} from '../../slices/authSlice';
import {Path, Svg} from 'react-native-svg';
import ImageViewerFooter from './components/ImageViewerFooter';
import Swiper from 'react-native-swiper';
import {SwipeRow} from 'react-native-swipe-list-view';
import {confetti} from '../../helper/ImageAssets';
import AnimatedLottieView from 'lottie-react-native';
const ForumList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {styles} = useStyle();

  const {posts, isLoading, currentPage, totalPages} = useAppSelector(
    state => state.post,
  );
  const {userData} = useSelector((state: RootState) => state.auth);
  const {isConfettiVisibleState} = useSelector(
    (state: RootState) => state.auth,
  );
  const BasicDetails: any = userData;

  const isLogin = true;

  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [filterChips, setFilterChips] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchSuggetions, setSearchSuggetions] = useState([]);
  const [isSearchSuggetionsLoading, setIsSearchSuggetionsLoading] =
    useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const getForumPost = async (page: number) => {
    try {
      dispatch(setIsLoading(true));
      const response = await appOperation.customer.get_forum_post(page);
      dispatch(
        setPostRes({
          posts: response.posts,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalPosts: response.totalPosts,
        }),
      );
    } catch (e) {
      logError(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const onSearchPost = async (page: number, query?: any, category?: any) => {
    try {
      const response = await appOperation.customer.get_forum_search(
        page,
        query,
        category,
      );
      dispatch(
        setPostRes({
          posts: response.posts,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalPosts: response.totalPosts,
        }),
      );
    } catch (e) {
      logError(e);
    }
  };

  useEffect(() => {
    if (searchQuery || (selectedFilter && selectedFilter !== 'All')) {
      onSearchPost(1, searchQuery || '', selectedFilter || '');
    } else {
      getForumPost(1);
    }
  }, [dispatch, refreshing, reloadKey, searchQuery, selectedFilter]);

  useEffect(() => {
    (async () => {
      try {
        const response = await appOperation.customer.blog_categories();
        const categories = response?.data?.map(
          (categories: any, index: number) => {
            return {title: categories?.title, id: categories._id};
          },
        );
        categories?.unshift({title: 'All', id: 0});
        setFilterChips(categories);
        setSelectedFilter('All');
      } catch (e) {
        logError(e);
      } finally {
      }
    })();
  }, []);

  const getSearchSuggetions = async (text: any) => {
    setIsSearchSuggetionsLoading(true);
    setSearchQuery(text);

    try {
      const response = await axios.get(
        `https://api.datamuse.com/sug?s=${text}&&max=5`,
      );
      const suggestions = response.data.map((item: any) => ({
        id: item.score,
        title: item.word,
      }));
      setSearchSuggetions(suggestions);
      setIsSearchSuggetionsLoading(false);
      return text;
    } catch (error) {
      setSearchSuggetions([]);
      setIsSearchSuggetionsLoading(false);
      return text;
    }
  };

  const handleLoadMore = useCallback(() => {
    if (
      (currentPage < totalPages && searchQuery) ||
      (selectedFilter && selectedFilter !== 'All')
    ) {
      onSearchPost(currentPage + 1, searchQuery, selectedFilter);
    } else if (currentPage < totalPages) {
      getForumPost(currentPage + 1);
    }
    // if (!isLoading && currentPage < totalPages) {
    //   console.log('calling that')
    //   getForumPost(currentPage + 1);
    // } else if (!isLoading && currentPage < totalPages && (searchQuery || selectedFilter)) {
    //   console.log('calling this')
    //   onSearchPost(currentPage + 1, searchQuery, selectedFilter);
    // }
  }, [
    dispatch,
    isLoading,
    currentPage,
    totalPages,
    searchQuery,
    selectedFilter,
  ]);

  const renderChip = useCallback(
    ({item}: {item: {id: number; title: string}}) => (
      <Chip
        mode="outlined"
        style={[
          styles.chip,
          selectedFilter === item.title && {
            backgroundColor: colors.primary,
          },
          selectedFilter !== item.title && {borderColor: colors.black},
        ]}
        selected={selectedFilter === item.title}
        selectedColor={colors.primary}
        showSelectedCheck={false}
        onPress={() => setSelectedFilter(item.title)}>
        <AppText
          style={StyleSheet.flatten([
            {fontFamily: FONTS.Medium, fontSize: 14},
            selectedFilter === item.title
              ? {color: colors.white}
              : {color: colors.black},
          ])}>
          {item.title}
        </AppText>
      </Chip>
    ),
    [selectedFilter],
  );

  const Posts = useCallback(
    ({item}: {item: any}) => {
      const {
        author,
        createdAt,
        content,
        images,
        likes,
        comments,
        _id,
        isCommentingDisabled,
        bookmarks,
        isQuestion,
        isPoll,
        isQuiz,
        pollOptions,
        quizQuestions,
        quizAnswers,
      } = item;

      const actionSheetRef = useRef<any>(null);
      const actionSheetRefMenu = useRef<any>(null);
      const reportSheetRef = useRef<any>(null);
      const notInterestedSheetRef = useRef<any>(null);
      const commentTextInputRef = useRef<any>(null);

      const createTime = convertToRelativeTime(createdAt);
      const hasLiked = likes?.includes(BasicDetails?._id);
      const hasBookmarked = bookmarks?.includes(BasicDetails?._id);
      const isPostMy = BasicDetails?._id === author?._id;

      const [replyPlaceHolder, setReplyPlaceholder] = useState<any>(false);
      const [isExpanded, setIsExpanded] = useState(false);
      const [numLines, setNumLines] = useState(0);
      const [commentText, setCommentText] = useState<string | null>(null);
      const [isImageViewVisible, setIsImageViewVisible] = useState(false);
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          !commentText && setReplyPlaceholder(false);
          if (commentTextInputRef?.current)
            commentTextInputRef?.current?.blur();
        });
        return () => hideSubscription.remove();
      }, [commentText]);

      const handleTextLayout = useCallback(
        (event: NativeSyntheticEvent<TextLayoutEventData>) => {
          setNumLines(event.nativeEvent.lines.length);
        },
        [],
      );

      const handleLike = useCallback(
        async (id: string, hasLiked: boolean, item: any) => {
          if (!isLogin) {
            dispatch(setIsLoginModal(true));
            return;
          }
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
            const response = await appOperation.customer.post_like_post(id);
            // console.log("likePost response", response);
          } catch (e) {
            dispatch(setLikePost(item));
            showToast('Network error, Try again later', 'danger');
            logError(e);
          }
        },
        [dispatch],
      );

      const handleComment = async (data: any, replyPlaceHolder: any) => {
        if (!isLogin) {
          dispatch(setIsLoginModal(true));
          return;
        }
        if (replyPlaceHolder) {
          try {
            const reply: any = {
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

            const response =
              await appOperation.customer.post_comment_reply_post(
                replyPlaceHolder?.parentCommentId,
                {replyText: data?.content?.trim()},
              );
            reply['_id'] = response.data.reply._id;

            dispatch(setCommentReplyPost(reply));
            // console.log("commentReplyPost response", response);
          } catch (e) {
            showToast('Network error, Try again later', 'danger');
            logError(e);
          }
        } else {
          try {
            // const theComment = {
            //   author: {
            //     _id: BasicDetails?._id,
            //     name: BasicDetails?.name,
            //     role_id: BasicDetails?.role_id,
            //     avatar: BasicDetails?.avatar,
            //   },
            //   post: data?._id,
            //   content: data?.content?.trim(),
            //   createdAt: new Date().toISOString(),
            //   updatedAt: new Date().toISOString(),
            //   replies: [],
            //   likes: [],
            // };
            setCommentText('');
            setReplyPlaceholder(false);

            const response = await appOperation.customer.post_comment_post(
              data,
            );
            dispatch(setCommentPost(response.savedComment));
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
          if (!isLogin) {
            dispatch(setIsLoginModal(true));
            return;
          }
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
              const response =
                await appOperation.customer.post_comment_reply_Like(
                  id,
                  parentCommentId,
                );
              // console.log("like reply comment response", response);
            } catch (e) {
              dispatch(setCommentReplyLikePost(post));
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
              const response = await appOperation.customer.post_comment_Like(
                id,
              );
              // console.log("like comment response", response);
            } catch (e) {
              dispatch(setCommentLikePost(post));
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
            const response = await appOperation.customer.delete_reply_comment(
              parentCommentId,
              id,
            );
            // console.log("delete reply comment response", response);
          } catch (e) {
            dispatch(setDeleteReplyComment(post));
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
            const response = await appOperation.customer.delete_comment(id);
            // console.log("delete comment response", response);
          } catch (e) {
            dispatch(setDeleteComment(post));
            showToast('Network error, Try again later', 'danger');
            logError(e);
          }
        }
      };

      const handleOffComment = useCallback(
        async (id: string) => {
          try {
            dispatch(setIsLoading(true));
            const response = await appOperation.customer.post_comment_off(id);
            let updatedPost = {
              ...item,
              isCommentingDisabled: !isCommentingDisabled,
            };
            dispatch(setTurnOffComment(updatedPost));
            showToast(response.message, 'success');
            setReloadKey(prev => prev + 1);
            actionSheetRefMenu.current?.hide();
            // console.log("commentOff response", response);
          } catch (e) {
            logError(e);
          } finally {
            actionSheetRefMenu.current?.hide();
            dispatch(setIsLoading(false));
          }
        },
        [dispatch, isCommentingDisabled],
      );

      const handleDeletePost = useCallback(
        async (id: string) => {
          try {
            dispatch(setIsLoading(true));
            const response = await appOperation.customer.delete_post(id);
            setReloadKey(prev => prev + 1);
            // console.log("deletePost response", response);
          } catch (e) {
            logError(e);
          } finally {
            actionSheetRefMenu.current?.hide();
            dispatch(setIsLoading(false));
          }
        },
        [dispatch],
      );

      const handleReport = useCallback(
        async (id: string, reason: string) => {
          try {
            dispatch(setIsLoading(true));
            const response = await appOperation.customer.post_report(id, {
              reason,
            });
            // console.log("report pot response", response);
            showToast(response.message, 'success');
            // setReloadKey((prev) => prev + 1);
          } catch (e) {
            logError(e);
          } finally {
            actionSheetRefMenu.current?.hide();
            reportSheetRef.current?.hide();
            dispatch(setIsLoading(false));
          }
        },
        [dispatch],
      );

      const handleSave = useCallback(
        async (id: string) => {
          if (!isLogin) {
            dispatch(setIsLoginModal(true));
            return;
          }
          try {
            dispatch(setIsLoading(true));
            const response = await appOperation.customer.post_bookmark(id);
            // console.log("deletePost response", response);
            showToast(response.message, 'success');
            setReloadKey(prev => prev + 1);
          } catch (e) {
            logError(e);
          } finally {
            dispatch(setIsLoading(false));
          }
        },
        [dispatch],
      );

      const handleNotInterested = useCallback(
        async (id: string, reason: string) => {
          try {
            dispatch(setIsLoading(true));
            const response = await appOperation.customer.post_not_interested(
              id,
              {reason},
            );
            showToast(response.message, 'success');
            setReloadKey(prev => prev + 1);
            // console.log("Not interested response", response);
          } catch (e) {
            logError(e);
          } finally {
            actionSheetRefMenu.current?.hide();
            notInterestedSheetRef.current?.hide();
            dispatch(setIsLoading(false));
          }
        },
        [dispatch],
      );

      const handleShare = useCallback(async (id: string) => {
        if (!isLogin) {
          dispatch(setIsLoginModal(true));
          return;
        }
        shareToAny(
          `https://www.femease.in/forums/posts/${id}`,
          `https://www.femease.in/forums/posts/${id}`,
        );
        // console.log("Shared the post", id);
      }, []);

      const openBottomSheet = useCallback(
        (contentType: 'comments' | 'menu' | 'report' | 'notInterested') => {
          if (!isLogin) {
            dispatch(setIsLoginModal(true));
            return;
          }
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

      const handlePoll = useCallback(
        async (id: string, selectedOptionIndex: number, item: any) => {
          if (!isLogin) {
            dispatch(setIsLoginModal(true));
            return;
          }
          try {
            dispatch(setIsLoading(true));
            const updatedPost = {
              ...item,
              pollOptions: item.pollOptions.map((option: any, index: number) =>
                index === selectedOptionIndex
                  ? {...option, votes: [...option.votes, BasicDetails?._id]}
                  : option,
              ),
            };
            dispatch(setPollAnswer(updatedPost));
            const response = await appOperation.customer.post_poll_answer(id, {
              selectedOptionIndex,
            });
            // console.log("poll response", item);
          } catch (e) {
            dispatch(setPollAnswer(item));
            showToast('You have already voted', 'danger');
            logError(e);
          } finally {
            dispatch(setIsLoading(false));
          }
        },
        [dispatch],
      );

      const handleQuiz = useCallback(
        async (id: string, questionId: string, answered: number, item: any) => {
          if (!isLogin) {
            dispatch(setIsLoginModal(true));
            return;
          }
          try {
            let updatedPost = JSON.parse(JSON.stringify(item));
            const iHaveAnswered = updatedPost?.quizAnswers?.find(
              (answers: any) => answers?.userId === BasicDetails?._id,
            );
            if (iHaveAnswered) {
              iHaveAnswered.answers.push({questionId, answered});
              dispatch(setQuizAnswer(updatedPost));
            } else {
              updatedPost.quizAnswers.push({
                userId: BasicDetails?._id,
                answers: [{questionId, answered}],
              });
              dispatch(setQuizAnswer(updatedPost));
            }
            const response = await appOperation.customer.post_quiz_answer(id, {
              selectedAnswers: [{questionId, answered}],
            });
            // console.log("quiz response", response);
          } catch (e) {
            dispatch(setQuizAnswer(item));
            showToast('You have already answered', 'danger');
            logError(e);
          }
        },
        [dispatch, quizAnswers],
      );

      const renderMenu = useCallback(() => {
        const [isVisibleTurnOffComment, setIsVisibleTurnOffComment] =
          useState(false);
        const [isVisibleDeletePost, setIsVisibleDeletePost] = useState(false);

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
                    onPress={() => setIsVisibleDeletePost(true)}
                    style={styles.menuItem}>
                    <IconMC
                      name="delete-outline"
                      size={20}
                      color={colors.red}
                    />
                    <AppText style={{...styles.menuText, color: colors.red}}>
                      Delete
                    </AppText>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      openBottomSheet('notInterested');
                    }}
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
      }, [reloadKey, posts, isCommentingDisabled, item]);

      const Comments = memo(
        ({comment, isFromPostsList, isReply, post}: any) => {
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
                  !(author?._id === BasicDetails?._id) ||
                  isFromPostsList ||
                  deleted
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
                      handleDeleteComment(
                        comment,
                        isReply,
                        _id,
                        parentComment,
                        post,
                      );
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
                          <AppText style={styles.commentTime}>
                            {createTime}
                          </AppText>
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
                  {isFromPostsList && !deleted && (
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
                        size={18}
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
        },
      );

      const renderComments = useCallback(
        (
          {item}: any,
          isFromPostsList?: boolean,
          isReply?: boolean,
          post?: any,
        ) => (
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
              renderComments(comment, true, undefined, item)
            }
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingBottom: 10}}
            nestedScrollEnabled
            onMomentumScrollEnd={() => {
              actionSheetRef.current?.handleChildScrollEnd();
            }}
          />
        );
      }, [comments, item, reloadKey]);

      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!isLogin) {
              dispatch(setIsLoginModal(true));
              return;
            }
            NavigationService.navigate(RouteName.FORUM, item);
          }}
          disabled={isPoll || isQuiz}
          style={styles.postContainer}>
          <View style={styles.profileContainer}>
            <Avatar.Image
              size={55}
              source={{uri: IMAGE_BASE_URL + author?.avatar}}
            />
            <View style={styles.profileTextContainer}>
              <AppText style={styles.profileName}>{author?.name}</AppText>
              <AppText style={styles.profileTime}>{createTime}</AppText>
            </View>
          </View>
          <View>
            {!isQuiz && (
              <AppText
                numberOfLines={isExpanded ? numLines : 5}
                onTextLayout={handleTextLayout}
                style={{
                  ...styles.postContent,
                  fontFamily: isPoll ? FONTS.SemiBold : FONTS.Regular,
                }}>
                {content
                  ?.split(urlRegex)
                  ?.map((contentPart: string, index: number) => {
                    return urlRegex.test(contentPart) ? (
                      <TouchableOpacity
                        key={index}
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
                        ?.split(new RegExp(`(${searchQuery})`, 'gi'))
                        ?.map((part: any, index: any) =>
                          part?.toLowerCase() === searchQuery?.toLowerCase() ? (
                            <Text
                              key={index}
                              style={{backgroundColor: '#f8ff00'}}>
                              {part}
                            </Text>
                          ) : (
                            part
                          ),
                        )
                    );
                  })}
              </AppText>
            )}
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
              style={{height: 265, marginBottom: images.length > 1 ? 40 : 0}}
              paginationStyle={{marginBottom: -20}}>
              {images?.map((image: string, index: number) => (
                <TouchableWithoutFeedback
                  key={index}
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
          {isQuestion ? (
            <View style={styles.answerToolbar}>
              <AppText style={styles.noAnswersText}>
                {comments.length > 0
                  ? comments.length + ' answers'
                  : 'No answers yet'}
              </AppText>
              <View style={styles.rightIcons}>
                <TouchableOpacity onPress={() => openBottomSheet('comments')}>
                  <Feather
                    name="edit"
                    style={styles.writeText}
                    color={'#000'}
                    size={24}
                  />
                  {/* <AppText style={styles.writeText}>Write</AppText> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openBottomSheet('menu')}>
                  <Feather
                    name="more-horizontal"
                    size={24}
                    color={colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : isPoll || isQuiz ? (
            <PollQuizComponent
              isPoll={isPoll}
              isQuiz={isQuiz}
              pollData={pollOptions}
              quizData={quizQuestions}
              quizAnswers={quizAnswers}
              onPressPollOption={(index: any) => {
                handlePoll(_id, index, item);
              }}
              onPressQuestionOption={(questionId: any, answer: any) => {
                handleQuiz(_id, questionId, answer, item);
              }}
            />
          ) : (
            <>
              <View style={styles.postSocialContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLike(_id, hasLiked, item)}>
                  <IconMC
                    name={hasLiked ? 'heart' : 'heart-outline'}
                    size={24}
                    color={hasLiked ? colors.primary : colors.black}
                  />
                </TouchableOpacity>
                {isCommentingDisabled ? (
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M21 14.9C21.5343 13.3118 21.6146 11.606 21.2319 9.97461C20.8492 8.34324 20.0186 6.85111 18.8338 5.66623C17.6489 4.48136 16.1568 3.6508 14.5254 3.26808C12.894 2.88537 11.1882 2.96569 9.6 3.5M2.5 2L22.5 22M6.1 5.6C3.5 8.3 2.7 12.5 4.5 16L2.5 22L8.5 20C11.9 21.8 16.1 21.1 18.8 18.3"
                      stroke="#3A3A3A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => openBottomSheet('comments')}>
                    <Feather
                      name="message-circle"
                      size={24}
                      color={colors.black}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleShare(_id)}>
                  <Feather name="share" size={24} />
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
                likesCount={likes.length}
                commentsCount={comments.length}
                isCommentingDisabled={isCommentingDisabled}
              />
              {comments.length > 0 && (
                <FlatList2
                  data={comments.slice(0, 2)}
                  renderItem={comment =>
                    renderComments(comment, true, undefined, item)
                  }
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={{paddingBottom: 10}}
                />
              )}
              {comments.length > 0 && (
                <AppText
                  style={{
                    color: colors.second_text,
                    fontSize: 14,
                    marginLeft: 5,
                    marginBottom: 5,
                  }}>
                  View all comments
                </AppText>
              )}
            </>
          )}
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
          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled
            containerStyle={{flex: 0.97}}>
            <View style={{marginTop: 10}}>
              <AppText style={styles.sheetTitle}>Comments</AppText>
              <Divider style={{marginVertical: 10}} />
            </View>
            {renderCommentsList}
            {!isCommentingDisabled && (
              <View
                style={{
                  ...styles.answerToolbar,
                  borderRadius: 10,
                  marginHorizontal: 10,
                  marginVertical: 20,
                }}>
                <Avatar.Image
                  size={30}
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
                  multiline={Boolean(commentText)}
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
          </ActionSheet>
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
                <AppText style={styles.repostReasonText}>Its a spam</AppText>
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
                <AppText style={styles.repostReasonText}>Others</AppText>
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
                  handleNotInterested(_id, `I'm not interested in the author`);
                }}>
                <AppText style={styles.repostReasonText}>
                  I'm not interested in the author
                </AppText>
              </TouchableOpacity>
              <Divider style={{marginVertical: 10}} />
              <TouchableOpacity
                onPress={() => {
                  handleNotInterested(_id, `I'm not interested in this topic`);
                }}>
                <AppText style={styles.repostReasonText}>
                  I'm not interested in this topic
                </AppText>
              </TouchableOpacity>
              <Divider style={{marginVertical: 10}} />
              <TouchableOpacity
                onPress={() => {
                  handleNotInterested(_id, `I didn't find it enagaging`);
                }}>
                <AppText style={styles.repostReasonText}>
                  I didn't find it enagaging
                </AppText>
              </TouchableOpacity>
              <Divider style={{marginVertical: 10}} />
              <TouchableOpacity
                onPress={() => {
                  handleNotInterested(_id, `I already know this information`);
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
                <AppText style={styles.repostReasonText}>Others</AppText>
              </TouchableOpacity>
              <Divider style={{marginVertical: 10}} />
            </View>
          </ActionSheet>
        </TouchableOpacity>
      );
    },
    [BasicDetails, searchQuery],
  );

  const renderItems = useCallback(
    ({item}: {item: any}) => <Posts item={item} />,
    [reloadKey, searchQuery],
  );

  const filteredPosts =
    selectedFilter == 'All'
      ? posts
      : posts.filter(post => post.category === selectedFilter);

  return (
    <AppSafeAreaView>
      <Header title="" />
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <AppText style={styles.sectionTitle}>
                {`Empowering Women's Health:\nWhere Stories Unite, Support Prevails.`}
              </AppText>
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  {/* <TextInput
                    placeholder="Search for keywords"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchInputText}
                    placeholderTextColor={colors.second_text}
                  /> */}
                  <AutocompleteDropdown
                    loading={isSearchSuggetionsLoading}
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    showChevron={false}
                    onChangeText={text => {
                      if (text.length == 0) {
                        setSearchQuery(null);
                        setSearchSuggetions([]);
                        return;
                      }
                      if (text.length >= 3) {
                        getSearchSuggetions(text);
                      } else {
                        text;
                      }
                    }}
                    direction={Platform.select({ios: 'down', android: 'down'})}
                    onSelectItem={(e: any) => e && setSearchQuery(e?.title)}
                    onClear={() => {
                      setSearchQuery(null);
                      setSearchSuggetions([]);
                    }}
                    dataSet={searchSuggetions}
                    inputContainerStyle={{
                      backgroundColor: colors.gray_bg,
                    }}
                    containerStyle={styles.searchInputText}
                    textInputProps={{
                      placeholder: 'Search for keywords',
                      placeholderTextColor: colors.second_text,
                      style: {
                        backgroundColor: colors.gray_bg,
                        ...styles.searchInputText,
                      },
                      // value: searchQuery
                    }}
                    suggestionsListContainerStyle={{
                      backgroundColor: colors.white,
                    }}
                    renderItem={(item, index) => {
                      return (
                        <Text
                          key={index}
                          style={{
                            color: 'black',
                            padding: 10,
                            borderBottomColor: colors.gray_bg,
                          }}>
                          {item.title}
                        </Text>
                      );
                    }}
                  />
                  <IconMC name="magnify" size={24} color={colors.black} />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (!isLogin) {
                      dispatch(setIsLoginModal(true));
                      return;
                    }
                    NavigationService.navigate(RouteName.SAVED_POSTS);
                  }}>
                  <View style={styles.icon}>
                    <Feather name="bookmark" size={22} color={colors.black} />
                    <AppText style={styles.savedTitle}>Saved</AppText>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={filterChips}
                renderItem={renderChip}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipList}
              />
            </>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              colors={[colors.primary]}
              onRefresh={onRefresh}
            />
          }
          data={filteredPosts}
          renderItem={renderItems}
          keyExtractor={(_, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 60}}
          ItemSeparatorComponent={() => <Divider />}
        />
        {isConfettiVisibleState && (
          <AnimatedLottieView
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              right: 'auto',
              left: 'auto',
              top: 'auto',
              zIndex: 1,
            }}
            source={confetti}
            autoPlay
            loop={false}
          />
        )}
      </View>
    </AppSafeAreaView>
  );
};

export default ForumList;
