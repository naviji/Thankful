import React, { useContext, useState }from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon, Text, ThemeContext } from "react-native-elements";
import { Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../reducers/style";
import { State } from "../types"


// theme, setTheme


const SettingsScreen=(props)=>{

  const [date, setDate] = useState(new Date(Date.now()));
  
  const [reminder, setReminder] = useState(false);
  const [time, setTime] = useState(new Date(Date.now()));
  const [showClock, setShowClock] = useState(false);

  const [fingerLockEnabled, setFingerLockEnabled] = useState(false)

  const fingerPrintLockToggle=()=>{
    setFingerLockEnabled(!fingerLockEnabled)
  }


  const onTimeSelect = (event, selectedTime) => {
    console.log(event)
    if(event.type==="dismissed"){
      setShowClock(false)
  
    }
    else{
      const currentDate = selectedTime || date;
      setShowClock(false)
      setTime(selectedTime);
      console.log(selectedTime)
    }
  }
  




  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const activeTheme = useSelector((state: State) => state.style.theme)

  return(
    
    <View style={{ flex: 1, paddingTop:50, backgroundColor:theme[activeTheme].colors.background}}>
    <View style={{flex: .4, paddingHorizontal:20, justifyContent:"center", flexDirection:"row"}}>
 
      <Text style={{fontFamily:"Balsamiq-Bold", fontSize:20, color:theme[activeTheme].colors.text}}>Settings</Text>
      
        </View>

    <View style={{flex:3,marginRight:25, marginLeft:27, marginBottom:55}}>
      <View style={{flexDirection:"row",justifyContent:"space-between", marginBottom:25, alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Icon
            color={theme[activeTheme].colors.icon}
            name='moon'
            type='feather'/>
              <Text style={{fontFamily:"Balsamiq-Bold", color:theme[activeTheme].colors.text, marginLeft:10}}>Dark Mode</Text>

        </View>
        <View style={{justifyContent:"flex-end"}}>


      <Switch value={activeTheme === 'dark'}
      color={theme[activeTheme].colors.icon}
        onValueChange={()=>{
          // props.setActiveTheme(activeTheme === 'dark' ? 'light' : 'dark')
          dispatch(setTheme(activeTheme === 'dark' ? 'light' : 'dark'))
        }}></Switch>

      </View>
      </View>


      <View style={{flexDirection:"row",justifyContent:"space-between", marginBottom:25, alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Icon
            color={theme[activeTheme].colors.icon}
            name='bell'
            type='feather'/>
              <Text style={{fontFamily:"Balsamiq-Bold", color:theme[activeTheme].colors.text, marginLeft:10}}>Daily Reminder Notifications</Text>

        </View>
          
        <View style={{justifyContent:"flex-end"}}>
      <Switch value={props.reminder}
      color={theme[activeTheme].colors.icon}
        onValueChange={()=>{
          props.setReminder(!props.reminder)
        }}></Switch>

      </View>
      </View>

      {props.reminder &&
        <TouchableOpacity
        onPress={()=>{
          props.setShow1(true)
        }}
        style={{flexDirection:"row",justifyContent:"space-between", marginBottom:25, alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Icon
            color={theme[activeTheme].colors.icon}
            name='clock'
            
            type='feather'/>
              <Text style={{fontFamily:"Balsamiq-Bold", color:theme[activeTheme].colors.text, marginLeft:10}}>Adjust Reminder Notifications</Text>

        </View>
          
      </TouchableOpacity>
      }

      {props.show1&&
      <DateTimePicker
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={0}
        value={props.time}
        mode='time'
        is24Hour={false}
        onChange={props.onTimeSelect}
      />
      } 
      
      
      <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-between", marginBottom:25, alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Icon
            color={theme[activeTheme].colors.icon}
            name='arrow-up'
            
            type='feather'/>
              <Text style={{fontFamily:"Balsamiq-Bold", color:theme[activeTheme].colors.text, marginLeft:10}}>Export Journals</Text>

        </View>
      </TouchableOpacity>


      <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-between", marginBottom:25, alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Icon
            color={theme[activeTheme].colors.icon}
            name='arrow-down'
            type='feather'/>
              <Text style={{fontFamily:"Balsamiq-Bold", color:theme[activeTheme].colors.text, marginLeft:10}}>Import Journals</Text>

        </View>
          
        
      </TouchableOpacity>

      <View style={{flexDirection:"row",justifyContent:"space-between", marginBottom:25, alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Icon
              color={theme[activeTheme].colors.icon}
              name='lock'
              type='feather'/>
              <Text style={{fontFamily:"Balsamiq-Bold", color:theme[activeTheme].colors.text, marginLeft:10}}>Lock with Fingerprint</Text>
          </View>
        <View style={{justifyContent:"flex-end"}}>
      
      
      
          <Switch value={props.finger}

        color={theme[activeTheme].colors.icon}
          onValueChange={ props.fingerPrintLock }></Switch>

      </View>
      </View>
      </View>
      

    </View>
    
  )
}


  export default SettingsScreen