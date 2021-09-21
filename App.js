/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import Papa from 'papaparse';
import DocumentPicker from 'react-native-document-picker';
import { View, FloatingButton } from 'react-native-ui-lib';
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';

const CryptoWidget = ({ children }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>

    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currency, setCurrency] = useState([]);
  const uploadCSV = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
      })
      Papa.parse(res[0]?.uri, {
        download: true,
        header: true,
        delimiter: ',',
        complete: function (results) {
          console.log(results);
          //setCurrency(rows[0]);
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const ButtonSpace = 20;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FloatingButton
          button={{
            label: 'Upload',
            onPress: {uploadCSV}
          }}
          // bottomMargin={80}
          hideBackgroundOverlay
          // withoutAnimation
        />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1
          }}>
          {/* {currency.map((file) => (
            <CryptoWidget key={file}>
            {file}
          </CryptoWidget>
          ))} */}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
