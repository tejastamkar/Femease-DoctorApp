import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {AppText} from '../../../common';
import {colors, FONTS} from '../../../theme/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Swiper from 'react-native-swiper';
import {useAppDispatch} from '../../../store/hooks';
import {setIsConfettiVisibleState} from '../../../slices/authSlice';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const PollQuizComponent = ({
  isPoll,
  isQuiz,
  onPressPollOption,
  onPressQuestionOption,
  pollData,
  quizData,
  quizAnswers,
}: any) => {
  // Hooks
  const {userData} = useSelector((state: RootState) => state.auth);
  const BasicDetails = userData;
  const [height, setHeight] = useState(200);
  const [isConfettiVisible, setIsConfettiVisible] = useState<any>(false);
  const dispatch = useAppDispatch();

  // Helper functions
  const totalVotes = pollData?.reduce(
    (acc: any, item: any) => acc + item?.votes?.length,
    0,
  );
  const calculateVoitingPercentage = (votes: number) =>
    Math.round((votes * 100) / totalVotes);
  const getAlphabet = (index: number): string =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index];

  // Function handlers
  const handleLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setHeight(height);
  };

  const handleConfetti = (
    questionId: string,
    answer: string,
    correctAnswer: string,
  ) => {
    if (answer == correctAnswer) {
      setIsConfettiVisible(questionId);
      dispatch(setIsConfettiVisibleState(true));
    }
    setTimeout(() => {
      setIsConfettiVisible(false);
      dispatch(setIsConfettiVisibleState(false));
    }, 10000);
  };

  // Render functions
  const renderQuizData = (item: any) => {
    const question = item?.question;
    const questionId = item?._id;
    const answers = item?.answers;
    const correctAnswer = item?.correctAnswer;
    const myAnswers = quizAnswers?.find(
      (answer: any) => answer?.userId === BasicDetails?._id,
    );
    const myAnswer = myAnswers?.answers.find(
      (answer: any) => answer?.questionId === item?._id,
    )?.answered;
    const rightAnswer = correctAnswer === myAnswer;
    const wrongAnswer = myAnswer !== correctAnswer;
    // console.log(myAnswer)

    return (
      <View style={styles.quizContainer} onLayout={handleLayout}>
        <AppText style={styles.quizQuestion}>{question}</AppText>
        <View style={styles.quizOptionsMainContainer}>
          {answers?.map((answer: any, index: any) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onPressQuestionOption(questionId, answer);
                  handleConfetti(questionId, answer, correctAnswer);
                }}
                disabled={Boolean(myAnswer)}>
                <View
                  style={[
                    styles.quizOptionsContainer,
                    !myAnswer
                      ? {backgroundColor: colors.lightest_gray}
                      : rightAnswer
                      ? answer === myAnswer
                        ? {backgroundColor: '#4EB865'}
                        : {backgroundColor: colors.lightest_gray}
                      : answer === myAnswer
                      ? {backgroundColor: '#FF5D50'}
                      : answer === correctAnswer
                      ? {backgroundColor: '#4EB8658C'}
                      : {backgroundColor: colors.lightest_gray},
                  ]}>
                  <View style={styles.quizTextContainer}>
                    <View
                      style={[
                        styles.quizOptionValueContainer,
                        !myAnswer
                          ? {borderColor: colors.primary}
                          : rightAnswer
                          ? answer === myAnswer
                            ? {borderColor: colors.white}
                            : {borderColor: colors.primary}
                          : answer === myAnswer
                          ? {borderColor: colors.white}
                          : answer === correctAnswer
                          ? {borderColor: colors.white}
                          : {borderColor: colors.primary},
                      ]}>
                      <AppText
                        style={{
                          ...styles.quizOptionValueText,
                          color: !myAnswer
                            ? colors.primary
                            : rightAnswer
                            ? answer === myAnswer
                              ? colors.white
                              : colors.primary
                            : answer === myAnswer
                            ? colors.white
                            : answer === correctAnswer
                            ? colors.white
                            : colors.primary,
                        }}>
                        {!myAnswer
                          ? getAlphabet(index)
                          : rightAnswer
                          ? answer === myAnswer
                            ? '✓'
                            : getAlphabet(index)
                          : answer === myAnswer
                          ? 'X'
                          : answer === correctAnswer
                          ? '✓'
                          : getAlphabet(index)}
                      </AppText>
                    </View>
                    <AppText
                      style={{
                        ...styles.quizText,
                        color: !myAnswer
                          ? colors.primary
                          : rightAnswer
                          ? answer === myAnswer
                            ? colors.white
                            : colors.black
                          : answer === myAnswer
                          ? colors.white
                          : answer === correctAnswer
                          ? colors.white
                          : colors.black,
                      }}>
                      {answer}
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
      </View>
    );
  };

  const renderPollData = (pollData: any) => {
    const iVoted = pollData?.some((item: any) =>
      item.votes.includes(BasicDetails?._id),
    );

    return pollData?.map((item: any, index: any) => {
      const myVote = item.votes.includes(BasicDetails?._id);

      return (
        <TouchableOpacity
          onPress={() => onPressPollOption(index)}
          disabled={iVoted}>
          <View style={styles.optionsContainer}>
            <View style={styles.optionTextcontainer}>
              <AppText style={styles.optionText}>{item?.text}</AppText>
              {iVoted && (
                <AppText style={styles.voteText}>
                  {calculateVoitingPercentage(item?.votes?.length)}%
                </AppText>
              )}
            </View>
            <View
              style={[
                styles.pollBar,
                iVoted && {
                  width: `${calculateVoitingPercentage(item?.votes?.length)}%`,
                  backgroundColor: myVote ? colors.primary : '#E392A15C',
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      );
    });
  };

  // Screen
  return (
    <>
      {isPoll ? (
        <View style={styles.pollContainer}>{renderPollData(pollData)}</View>
      ) : (
        <Swiper
          activeDot={<View style={styles.activeDotStyle} />}
          dotStyle={styles.dotStyle}
          showsPagination={true}
          scrollEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          loop={false}
          style={{height: quizData?.length > 1 ? height + 30 : height + 0}}
          paginationStyle={{marginBottom: -20}}>
          {quizData?.map((item: any) => renderQuizData(item))}
        </Swiper>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pollContainer: {
    gap: 8,
    marginTop: 12,
    paddingLeft: 65,
    width: '80%',
    paddingBottom: 5,
  },
  optionsContainer: {
    backgroundColor: colors.lightest_gray,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  optionTextcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '400',
  },
  voteText: {
    fontSize: 10,
    fontWeight: '300',
  },
  pollBar: {
    position: 'absolute',
    height: '100%',
    zIndex: -1,
  },
  quizContainer: {
    paddingLeft: 65,
    gap: 12,
    width: dimensions.width,
    paddingBottom: 5,
  },
  quizQuestion: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
    fontFamily: FONTS.SemiBold,
  },
  quizOptionsMainContainer: {
    gap: 8,
    width: '80%',
  },
  quizOptionsContainer: {
    backgroundColor: colors.lightest_gray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  quizTextContainer: {
    flexDirection: 'row',
    margin: 8,
    alignItems: 'center',
  },
  quizOptionValueContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.primary,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  quizOptionValueText: {
    fontSize: 8,
    fontWeight: '400',
    color: colors.primary,
  },
  quizText: {
    fontSize: 12,
    fontWeight: '400',
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

export default PollQuizComponent;
