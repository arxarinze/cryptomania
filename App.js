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
  StatusBar,
  StyleSheet,
  Button,
  SafeAreaView,
  Text,
  View
} from 'react-native';

import Papa from 'papaparse';
import DocumentPicker from 'react-native-document-picker';
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import Home from './Home';



const App: () => Node = (navigation) => {
  const [currency, setCurrency] = useState([]);
  const [showHome, setShowHome] = useState(false);
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
          setCurrency(results.data[0]);
          setShowHome(true);
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

  return (
    <SafeAreaView style={styles.container}>
      {
        !showHome && <View>
          <Button
            title="Upload Currencies"
            onPress={uploadCSV}
          />
        </View>
      }
      {showHome && <Home curr={currency}></Home>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
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
