/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Button,
  SafeAreaView,
  ActivityIndicator,
  View,
} from 'react-native';

import Papa from 'papaparse';
import DocumentPicker from 'react-native-document-picker';

import Home from './components/Home';
import FadeInView from './components/FadeInView';



const App = () => {
  const [currency, setCurrency] = useState([]);
  const [showHome, setShowHome] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const uploadCSV = async () => {
    setShowLoader(true);
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
          setShowLoader(false);
          setShowHome(true);
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {

      } else {
        throw err
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        showLoader &&
        <ActivityIndicator size="large" />
      }
      {
        !showHome && 
        <FadeInView >
          <View>
          <Button
            title="Upload Currencies"
            onPress={uploadCSV}
          />
        </View>
        </FadeInView>
        
      }
      {showHome && 
        <FadeInView >
          <Home curr={currency}></Home>
      </FadeInView>}
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
