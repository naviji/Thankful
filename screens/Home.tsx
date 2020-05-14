import React, { useState } from "react";
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Icon, Text } from "react-native-elements";
import { ToggleButton, Switch } from 'react-native-paper';
import {BlurView} from 'expo-blur';
import * as Font from 'expo-font';
import JournalEntry from '../screens/JournalEntry'
import { useFonts } from '@use-expo/font';

import {LinearGradient} from 'expo-linear-gradient';
import {
  ScrollView,
  FlatList,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  Image,
  
  ImageBackground,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatListProps,
  ListRenderItem,
  StatusBar,
  Button,
  Animated,
} from "react-native";
import Carousel from "react-native-snap-carousel";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadEntries, createEntry, removeEntry } from "../reducers/entries";

import { AppLoading } from 'expo';
import { Entry, HomeProps, IAppState } from "../types";
// import { v4 as uuidv4 } from 'uuid';

import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("paperNote.db");
const {height, width} = Dimensions.get('window')

const dummyData: Array<Entry> = [
  {
    id: 1,
    date: new Date("January 29, 2020 13:15:30"),
    content:
      "Sed blandit finibus diam, eget finibus purus interdum at. Aenean ac dictum eros, fermentum ultricies est. Proin at ipsum sit amet dui sollicitudin bibendum. Sed felis felis, pharetra in odio et, egestas dapibus quam.",
  },
  {
    id: 2,
    date: new Date("January 2, 2020 20:15:30"),
    content:
      "Nam blah tortor ex. Praesent congue a nisl et feugiat. Nullam lacus nisl, scelerisque sit amet nunc vitae, sagittis lacinia arcu. Aenean at nisi lorem. Suspendisse potenti. Vestibulum vitae risus enim. Mauris porttitor risus urna, vitae vehicula risus condimentum a.",
  },
  {
    id: 3,
    date: new Date("January 8, 2020 10:15:30"),
    content:
      "Cras et tellus maximus, auctor odio vitae, tristique augue. Donec vitae velit ut leo lobortis tempor. Sed ullamcorper nisl in sapien facilisis efficitur. Vivamus volutpat tempus magna, vitae interdum odio. Nulla egestas nisl dui, eu egestas magna consectetur eleifend. Pellentesque id nisi nisi. Praesent vitae venenatis turpis. Sed tristique odio nisi, at pulvinar nisi blandit quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris risus urna, iaculis non maximus in, condimentum quis felis. Morbi fermentum vulputate mi, at volutpat dui scelerisque non. In volutpat odio dolor, nec rutrum enim tincidunt a. Duis a odio ac nulla euismod dictum. Aliquam sem dolor, finibus ut ligula sit amet, sagittis feugiat diam. Curabitur commodo enim in nunc maximus, scelerisque efficitur massa cursus. \
        \n\nUt in felis eget ligula laoreet ultrices. Pellentesque aliquet tortor sit amet purus interdum euismod. Duis a erat erat. Sed blandit aliquet semper. Vestibulum euismod eget ex id cursus. Proin lorem odio, malesuada quis sagittis nec, vehicula vel nisi. Mauris metus dolor, scelerisque sit amet risus non, interdum rutrum risus. Fusce id diam lobortis, scelerisque metus vel, aliquam erat. Nunc sit amet nisi et lorem scelerisque venenatis a a eros.",
  },
  {
    id: 4,
    date: new Date("January 18, 2020 12:15:30"),
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet purus consequat neque pellentesque commodo et in elit. Etiam sagittis quis ligula eu auctor. Vivamus interdum mauris eget ligula euismod vestibulum. Vestibulum tortor lectus, tristique ut nibh ultricies, suscipit eleifend leo. Nullam nisi nisi, placerat vitae commodo quis, pulvinar ut nulla. Vestibulum quis semper massa. Suspendisse velit lectus, dictum at ex in, lacinia ornare libero.",
  },
  {
    id: 5,
    date: new Date("April 16, 2020 11:15:30"),
    content:
      "Today I am grateful for good friends and good food. I'm also able to spend time with my family. Most of all, we are safe and together.",
  },
];

const _onError: SQLite.SQLTransactionErrorCallback | undefined = (e) => {
  console.warn(e);
};

const _onSuccess: SQLite.SQLVoidCallback | undefined = () => {
  console.log("Success loading database");
};



export default function Home({ navigation }: HomeProps) {
  const [bgColor, setBgColor] = useState("#fff")
  const [textColor, setTextColor] = useState("#131d27")
  const [iconColor, setIconColor] = useState("#cf3d43")
  const [cardColor, setCardColor] = useState("#f8d69c")
  const [cardTextColor, setCardTextColor] = useState("#fff")
  const [backTopColor,setBackTopColor ] = useState('#ededed')
  const [backBottomColor,setBackBottomColor ] = useState('#ededed')
  const [cardType,setCardType] = useState("light")
  const [settingToggle, setSettingToggle] = useState(false)

  let [fontsLoaded] = useFonts({
    'Balsamiq-Bold': require('../assets/fonts/BalsamiqSans-Bold.ttf'),
    'Balsamiq-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'),
  });

  
  const [theme,setTheme] = useState(true)  

  // const [entries, setEntires] = useState(data);
  //   const entries: Array<Entry> = useSelector(state => state.entries);
  // const windowHeight = useWindowDimensions().height;
  let entries = useSelector((state: IAppState) => state.entries);
  const dispatch = useDispatch();

  React.useEffect(() => {
    db.transaction(
      (tx) => {
        // tx.executeSql(
        //   `DROP TABLE entries`
        // );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS entries (
          id TEXT PRIMARY_KEY,
          content TEXT NOT NULL,
          created_time INT NOT NULL
        )`
        );

        // tx.executeSql(
        //   `INSERT into entries(id, content, created_time) values ('1', 'testbody1', '1587568912445');`
        // );

        // tx.executeSql(
        //   `INSERT into entries(id, content, created_time) values ('2', 'testbody2', '1587568912445');`
        // );

        tx.executeSql(
          "SELECT id, content, created_time from entries;",
          [],
          (_, { rows }) => {
            // @ts-ignore
            let result = rows._array.map((x) => ({
              ...x,
              date: new Date(x.created_time),
            }));
            // console.log(result);
            dispatch(loadEntries(result.concat(dummyData)));
          }
        );
      },
      _onError,
      _onSuccess
    );
    
  }, []);


  React.useEffect(()=>{
    if(theme){
      setBgColor("#f1f2fa")
      setTextColor("#262c33")
      setCardTextColor("#262c33")
      setCardColor("#fff")
      setBackBottomColor('#fea09c')
      setBackTopColor('#fdc7d5')
      setCardType("light")
    }
    else{
      setBgColor("#161616")
      setCardColor("#1a1a1a")
      setCardTextColor("white")
      setTextColor("#ededed")
      setBackBottomColor('#2d455d')
      setBackTopColor('#2d455d')
      setCardType("dark")

    }
  },[theme])

  // if (entries.length && !isToday(entries[0].date)) {
  //   const today = new Date();
  //   const entryForToday: Entry = {
  //     id: entries.length + 1,
  //     content: "",
  //     date: today,
  //   };
  //   dispatch(createEntry(entryForToday));
  // }

  const _renderItem: ListRenderItem<Entry> = ({ item }) => {
    return (
      
      <View
        style={{

          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Editor", {
              entryId: item.id, backgroundColor:cardColor, textColor:textColor, iconColor:iconColor
            })
          }
          key={item.id}
          style={{
            flex: 1,
          }}
        >
         <JournalEntry entry={item} cardColor={cardColor} textColor={cardTextColor} iconColor={iconColor} cardType={cardType}/>
        </TouchableOpacity>
        
      </View>
    );
  };



  const Settings=()=>{
    return(
      <View style={{flex:3,marginHorizontal:25, marginBottom:55}}>
        <View style={{flexDirection:"row",justifyContent:"space-between", marginBottom:15}}>
          <Text style={{fontFamily:"Balsamiq-Bold", color:textColor}}>Dark Mode</Text>
          <View style={{justifyContent:"flex-end"}}>
        <Switch value={!theme}
        color='#cf3d43'
          onValueChange={()=>{
            setTheme(!theme)
          }}></Switch>

        </View>
        </View>
        
        

      </View>
      
    )
  }

  const BottomTab=()=>{
    return(
      <View style={{ flex: 0, alignItems: 'center', backgroundColor:cardColor, marginHorizontal:10, marginBottom:10, padding:25,borderRadius:15}}>
          


 <View style={{
   width:"100%",
            justifyContent:"space-between",
            flex: 0,
            paddingHorizontal:15,
            alignItems:"center",
            flexDirection:"row",}}>

              <View style={{justifyContent:"flex-start"}}>

          <TouchableOpacity onPress={() => { 
            const newEntry = {
              id: Math.round(Math.random() * 1000000),
              date: new Date(),
              content: "",
            };
  
            db.transaction(
              (tx) => {
                tx.executeSql(
                  "INSERT into entries(id, content, created_time) values (?, ?, ?)",
                  [newEntry.id, newEntry.content, newEntry.date.getTime()],
                  () => console.log("Insert success"),
                  (t, e) => {
                    console.log("Insert failed");
                    return false;
                  }
                );
              },
              () => console.log("creation failed"),
              () => console.log("creation successful")
            );
  
            dispatch(createEntry(newEntry));
  
            navigation.navigate("Editor", {
              entryId: newEntry.id, backgroundColor:cardColor, textColor:textColor, iconColor:iconColor
            });
            setSettingToggle(false)
          }}>
          <Icon
          color={iconColor}
          name='event'
          type='simple-line-icon'
        />

          </TouchableOpacity>
        </View>
        <View style={{justifyContent:"center"}}>

        <TouchableOpacity onPress={()=>{ setSettingToggle(false)}}><Icon
          color={iconColor}
          name='emotsmile'
          type='simple-line-icon'
        /></TouchableOpacity>
        
      </View>

        <View style={{justifyContent:"flex-end"}}>

        <TouchableOpacity
          onPress={()=>{ setSettingToggle(true)}}>
        <Icon
          color={iconColor}
          name="settings"
          type='simple-line-icon'
        />

        </TouchableOpacity>
          
        </View>
      </View>
          
        </View>
    )
  }

  const { width, height } = Dimensions.get("screen");
  

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
  return (
    <View style={{ flex: 1, paddingTop:50, backgroundColor:bgColor}}>
      {/* <LinearGradient
          colors={[backTopColor, backBottomColor]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: height,
          }}
        /> */}
      {/* <Image source={require("../assets/ab2.jpg")}  blurRadius={10} style={{flex:1,opacity:0.9, position:"absolute",height:"110%", width:"100%", }} resizeMode="cover"></Image> */}
      <View style={{flex: .4, paddingHorizontal:20, justifyContent:"center", flexDirection:"row"}}>
      {settingToggle &&
      <Text style={{fontFamily:"Balsamiq-Bold", fontSize:20, color:textColor}}>Settings</Text>}
        {!settingToggle &&
      <Text style={{fontFamily:"Balsamiq-Bold", marginTop:10, fontSize:20, color:textColor}}>Welcome to Thankfully</Text>}
        
        </View>
        
        {!settingToggle &&
        <View style={{flex:4, paddingBottom:55}}>
        <Carousel
        style={{
        elevation: 4,
        }}
        layout="default"
        inactiveSlideOpacity={1}
        activeSlideOffset={100}
          data={entries}
          renderItem={_renderItem}
          sliderWidth={width / 1}
          itemWidth={width / 1.1}
          hasParallaxImages={true}
        /></View>}

        {settingToggle &&
        <Settings></Settings>}

        <BottomTab></BottomTab>
     
      
      
    </View>
  );
  }
}
