import React from 'react';
import {
  AppSafeAreaView,
  AppText,
  KeyBoardAware,
  SEMI_BOLD,
  SIXTEEN,
} from '../common';
import Toolbar from '../common/Toolbar';
import {StyleSheet} from 'react-native';

const Remarks = () => {
  return (
    <AppSafeAreaView>
      <Toolbar />
      <KeyBoardAware>
        <>
          <AppText style={styles.title} type={SIXTEEN} weight={SEMI_BOLD}>
            Remarks
          </AppText>
          <AppText>
            Lorem ipsum dolor sit amet consectetur. Eget elementum vel justo
            dolor at. Et tincidunt phasellus feugiat malesuada nibh vulputate
            sed donec. Elementum at aliquet nullam cursus venenatis varius
            tellus ornare. Erat tellus lacus nullam ultrices enim consequat
            dignissim sodales.
          </AppText>
        </>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default Remarks;

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
});
