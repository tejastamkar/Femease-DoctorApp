import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigator from './navigation/Navigator';
import {Provider} from 'react-redux';
import RootComponent from './RootComponent';
import store from './store/store';
import {onAppStart} from './helper/app';
onAppStart();
const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootComponent>
          <Navigator />
        </RootComponent>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
