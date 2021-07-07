import React from 'react';
import { Text, View, StyleSheet, Image, SafeAreaView, Pressable, Dimensions, ScrollView, TextInput } from 'react-native';
import { loadAsync, useFonts } from 'expo-font';
import { useState, useEffect, useContext } from 'react';
import AppLoading from 'expo-app-loading';
import BackIcon from '../assets/back.svg';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Colors from './Colors';
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const getFonts = () =>
    loadAsync({
        ApercuBold: require("../assets/Apercu-Bold.otf"),
        Apercu: require("../assets/Apercu-Regular.otf"),
});











var twoFuncSync = null;

var k = 1;




function Colors({paintingName, hexCodesArray}){
    var hexCodesArrayReal = JSON.parse(hexCodesArray);
    const [fontsloaded, setFontsLoaded] = useState(false);
    if (fontsloaded){
        return (
            <SafeAreaView style={{top: (45/734)*windowHeight}}>
                <Pressable style={{position: "absolute", left: (18.2/414)*windowWidth}} onPress={() => {console.log("btn cliked"); twoFuncSync = "AAaa";}}>
                    <BackIcon />
                </Pressable>
                <Text style={{fontFamily: 'ApercuBold', fontSize: 40, letterSpacing: -2, alignSelf: "center", marginBottom: (27/734)*windowHeight}}>{paintingName}</Text>
                <ScrollView>
                    {hexCodesArrayReal.map(item => (
                        <View key={++k} style={{backgroundColor: item, width: "100%", justifyContent: 'center', height: (78/734)*windowHeight, paddingLeft: (16/414)*windowWidth}}>
                            <Text style={{fontFamily: "ApercuBold", fontSize: 25, letterSpacing: -2}}>
                                {item}
                            </Text>
                        </View>
                    ))}
                    <Pressable style={{width: "100%", justifyContent: 'center', alignItems: "center", height: (78/734)*windowHeight}}>
                        <Text style={{fontFamily: "ApercuBold", fontSize: 25, letterSpacing: -2}}>
                            + Add color
                        </Text>
                    </Pressable>
                    
                </ScrollView>

            </SafeAreaView>
        );
        
    }else {
        return (
            <AppLoading
                
                startAsync={getFonts}
                onFinish={() => {
                    setFontsLoaded(true);
                }}
                onError={console.warn}
            />
        );
    }
}














const retrievePaintingNames = async () => {
    try {
        const retrievedArray = await AsyncStorage.getItem('paintingnames');
        if (retrievedArray !== null && retrievedArray!=null){
            //['htllo', 'sfsdfe']
            return JSON.parse(retrievedArray);
        }
        else {
            //[]
            return [];
        }
    }
    catch (e){
        console.error(e);
    }
};

const storePaintingNames = async (arrayToSet) => {
    try {
        await AsyncStorage.setItem('paintingnames', JSON.stringify(arrayToSet));
    } catch (error) {
        console.error(error);
    }
};

var variable = null;
retrievePaintingNames().then((va) => {
    variable = va;
});

async function getCArray(stri){
    console.log(`STRING: ${stri}`);
    await retrievePaintingNames().then((vari) => {
        for (var i =0;i<vari.length;i++){
            if (vari[i].ptname == stri){
                console.log(`HCARRAY: ${vari[i].hcArray}`);
                //THIS IS NULL?? DOWN
                return vari[i].hcArray;
            }
        }
    });
}
//const listTest = [];

export default function Gallery(props){
    const [fontsloaded, setFontsLoaded] = useState(false);
    const [colorsLoaded, setColorsLoaded] = useState(null);
    const [list, setList] = useState(variable);
    const curId = list.length > 0 ? list[list.length-1].id +1 : 1;
    const [currentId, setCurrentId] = useState(curId); 
    const [shouldEnterText, setShouldEnterText] = useState(false);
    const [nameValue, setNameValue] = useState("");
    const [showPalletteColor, setShowPalletteColor] = useState(null);
    const navigation = useNavigation();
    
    

    //list currently equals []

    navigation.addListener("blur", () => {
        setShouldEnterText(false);
        setShowPalletteColor(null);
        setColorsLoaded(null);
    })
    if (twoFuncSync){
        setColorsLoaded(false);
    }
    useEffect(() => {//SHOW PALLEETTE COLOR NOT CHANGING, USE EFFECT ONLY RUNNING ONCE
        let abortController = new AbortController();
        if (showPalletteColor){
            try {
                AsyncStorage.getItem("paintingnames").then((arr) => {
                    if (arr === null){
                        arr = [];
                    }
                    var vartest = JSON.parse(arr);
                    for (var i =0;i<vartest.length;i++){
                        if (vartest[i].ptname == showPalletteColor){
                            setColorsLoaded(vartest[i].hcArray);
                        }
                    }
                });

            } catch (er) {
                console.error(er);
            }
        }
        return () => {
            abortController.abort();
        };
    },[showPalletteColor]);
    if (fontsloaded) {
        
        if (showPalletteColor == null && colorsLoaded == null){
            return (
            
                <View style={{flex: 1}}>
                    <SafeAreaView style={{top: (45/734)*windowHeight, flex: 1}}>
                        <Text style={{fontFamily: 'ApercuBold', fontSize: 40, letterSpacing: -2, alignSelf: "center"}}>Palettes</Text>
                        <ScrollView style={{paddingHorizontal: (26/414)*windowWidth,top: (33/734)*windowHeight, flex: 1, paddingTop: 20}}>
                            {console.log("HERE IS DA LIST!! --  " + list + `   ${showPalletteColor}      ${colorsLoaded}`)}
                            {list.map((item) => (
                                <Pressable style={styles.paintingBtn} key={item.id} onPress={() => {
                                    setShowPalletteColor(item.ptname);
                                }}>
                                    <Text style={styles.paintingBtnText}>{item.ptname}</Text>
                                </Pressable>
                            ))}
                            
                            <Pressable style={{backgroundColor: "#8ED1CD",width: "100%", height: (67/734)*windowHeight, borderRadius: 9, alignItems: "center", justifyContent: "center", marginBottom: (80/734)*windowHeight, shadowRadius: 10, shadowOpacity: 0.32, shadowOffset: {width: 2, height: 0}, display: shouldEnterText ? "none" : "flex"}} onPressOut={() => {setShouldEnterText(true);}}>
                                <Text style={styles.paintingBtnText}>+ Add palette</Text>
                            </Pressable>
                            <View style={{height: (67/734)*windowHeight, display: shouldEnterText ? "flex" : "none",  marginBottom: (80/734)*windowHeight}}>
                                <TextInput ref={function(input){if(input!=null && !shouldEnterText){input.clear()}}} style={{height: "100%",backgroundColor: '#F5F3F0', borderRadius: 9, fontFamily: "Apercu", fontSize: 25, letterSpacing: -2, paddingLeft: (56/414)*windowWidth}} placeholder={"Type pallette name..."} onChangeText={(val) => setNameValue(val)}>
                                </TextInput>
                                <Pressable stylse={{ backgroundColor: "#8ED1CD", height: (50/734)*windowHeight, width: (50/734)*windowHeight, zIndex: 1, position: "absolute", alignSelf: "flex-end", marginTop: (8.5/734)*windowHeight, right: (8.5/734)*windowHeight, borderRadius: 9, alignItems: "center", justifyContent: "center", shadowRadius: 10, shadowOpacity: 0.32, shadowOffset: {width: 0, height: 2}}} onPressOut={() => {
                                    if (nameValue.trim()){
                                        setCurrentId(currentId +1); 

                                        const newList = list.concat({ptname: nameValue, id: currentId, hcArray: ["#43175e", "#76ab84"]}); storePaintingNames(newList); console.log("NEWLIST (array)    ------     " + newList); setList(newList);

                                        setShouldEnterText(false); setNameValue("");
                                    }
                                    
                                }}>
                                    <Text style={{fontFamily: "ApercuBold", fontSize: 35}}>+</Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            );
            
        } else if (colorsLoaded){
            
            return (<Colors paintingName={showPalletteColor} hexCodesArray={JSON.stringify(colorsLoaded)}/>);

            


            // AsyncStorage.getItem('paintingnames').then((retrievedArray) => {
            //     console.log("in promise callback")
            //     if (retrievedArray !== null){
            //         //['htllo', 'sfsdfe']
            //         vartest = JSON.parse(retrievedArray);
            //     }
            //     else {
            //         //[]
            //         vartest = [];
            //     }
            //     console.log(`VARTEST:     ${vartest}\nRETRIEVED ARRAY:     ${retrievedArray}`);
            // }).then((retrievedArray) => {
            //     for (var i =0;i<vartest.length;i++){
            //         if (vartest[i].ptname == showPalletteColor){
            //             console.log(`HCARRAY: ${vartest[i].hcArray}`);
            //             return (
            //                 <Colors paintingName={showPalletteColor} hexCodesArray={JSON.stringify(vartest[i].hcArray)}/>
            //             );
            //         }
            //     }
            // });
            
            
        } else {
            return null;
        }
        
    } else {
        return (
            <AppLoading
                
                startAsync={getFonts}
                onFinish={() => {
                    setFontsLoaded(true);
                }}
                onError={console.warn}
            />
        );
    }
    
}
const styles = StyleSheet.create({
    paintingBtn: {
        marginBottom: (24/734)*windowHeight,
        backgroundColor:"#F5F3F0",
        width: "100%",
        height: (67/734)*windowHeight,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center"
    },
    paintingBtnText: {
        fontSize: 30,
        fontFamily: "ApercuBold",
        letterSpacing: -2
    }
});
