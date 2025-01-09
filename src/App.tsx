import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigator from './navigation/Navigator';
import {Provider} from 'react-redux';
import RootComponent from './RootComponent';
import store from './store/store';
import {onAppStart} from './helper/app';
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

onAppStart();
const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AutocompleteDropdownContextProvider>
          <RootComponent>
            <Navigator />
          </RootComponent>
        </AutocompleteDropdownContextProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
