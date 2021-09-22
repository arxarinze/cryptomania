/**
 * Sample React Native Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    RefreshControl,
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';

import Papa from 'papaparse';
import DocumentPicker from 'react-native-document-picker';
import { Text, Colors, View, FloatingButton, Card, Toast } from 'react-native-ui-lib';


const CryptoWidget = ({ children, currency }): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>

            <Card flex useNative activeOpacity={1} activeScale={0.96}>
                <Card.Section
                    bg-black
                    padding-20
                    flex-3
                    content={[
                        { text: children['unit'], text60: true, white: true },
                        { text: children['coin/token'], text70: true, white: true, },
                        { text: children['total cost'] + ' ' + currency['purchasing_currency'], text60: true, white: true }
                    ]}
                    contentStyle={{ alignItems: 'center' }}
                />
                <Card.Section
                    bg-white
                    padding-20
                    flex
                    content={[{ text: 'Market Price', text70: true, grey10: true },
                    { text: children['market_price'], text70: true, grey10: true }]}
                    contentStyle={{ alignItems: 'center', margin: 0, padding: 0 }}
                />
                <Card.Section
                    bg-white
                    padding-20
                    flex
                    content={[{ text: 'Other Prices', text70: true, grey10: true },
                    { text: children['other_price'], text70: true, grey10: true }]}
                    contentStyle={{ alignItems: 'center', margin: 0, padding: 0 }}
                />
                <Card.Section
                    bg-red30
                    padding-20
                    flex-3
                    content={[
                        { text: children['unit'], text60: true, white: true },
                        { text: children['coin/token'], text70: true, white: true, },
                        { text: children['total cost'] + ' ' + currency['purchasing_currency'], text60: true, white: true }
                    ]}
                    contentStyle={{ alignItems: 'center' }}
                />
            </Card>
        </View>
    );
};

const Home = ({ curr }): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    let data = [];
    const [purchases, setPurchases] = useState([]);
    const mergeCurrencies = async (data) => {
        var seen = {};
        var check = [];
        data.filter(async function (entry) {
            var previous;
            if (seen.hasOwnProperty(entry['coin/token'])) {
                previous = seen[entry['coin/token']];
                previous['total cost'] = parseFloat(previous['total cost']) + parseFloat(entry['total cost']);
                previous['unit'] = parseFloat(previous['unit']) + parseFloat(entry['unit']);
                if (entry['percentage_to_sell_at'] == "") {
                    entry['percentage_to_sell_at'] = "25";
                }
                return false;
            }
            if (entry['percentage_to_sell_at'] == "") {
                entry['percentage_to_sell_at'] = "25";
            }
            // marketPrice = marketPrice[curr['purchasing_currency']];
            // entry['market_price'] = marketPrice;


            seen[entry['coin/token']] = entry;
            return true;

        });
        return Object.values(seen);
    }
    useEffect(async () => {
        await refreshPage(purchases);
      });
    
    const refreshPage = async (dat) => {
        let data = dat
        data.map(async function (temp) {
            let response =
                await fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + temp['coin/token'] + "&tsyms=" + curr['purchasing_currency']);
            let marketPrice = await response.json();
            let tmp = curr;
            tmp = Object.values(tmp)
            tmp.shift();
            tmp= tmp.join(',');
            let response1 =
                await fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + temp['coin/token'] + "&tsyms=" + tmp);
            let otherPrices = await response1.json();
            let key = Object.keys(otherPrices[temp['coin/token']]);
            let values = Object.values(otherPrices[temp['coin/token']]);
            let othertemp = '';
            key.map((k,index)=>{
                othertemp = othertemp+"\n" + values[index] +' '+k;
            });
            temp['other_price'] = othertemp;
            temp['market_price'] = marketPrice[temp['coin/token']][curr['purchasing_currency']];
            setPurchases(data);
        });
    }
    const uploadCSV = async (type) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.csv],
            })
            if (type == "P") {

                Papa.parse(res[0]?.uri, {
                    download: true,
                    header: true,
                    delimiter: ',',
                    complete: async function (results) {
                        data = await mergeCurrencies(results.data);
                        await refreshPage(data);
                        await setPurchases(data);
                    }
                });
            }
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
    const [refreshing, setRefreshing] = React.useState(false);


    return (
        <View style={backgroundStyle}>

            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            refreshPage(purchases);
                            setPurchases(data);
                         }}
                    />
                }
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        flex: 1
                    }}>
                    {purchases.map((file) => {
                        return <CryptoWidget key={file['purchase id']} currency={curr}>
                            {file}
                        </CryptoWidget>
                    })}

                </View>
            </ScrollView>
            <FloatingButton

                visible={true}
                button={{
                    label: 'Upload Purchase',
                    onPress: () => { uploadCSV('P') },
                    style: {
                        position: 'absolute',
                        bottom: 30,
                        borderRadius: 15
                    }
                }}
                bottomMargin={-100}
            hideBackgroundOverlay
            // withoutAnimation
            />

        </View>

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

export default Home;
