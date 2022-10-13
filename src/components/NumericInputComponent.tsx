import { StyleSheet, View } from 'react-native'
import React, { FC, useState } from 'react'
import { TextInput } from 'react-native-paper'
import globalStyles from '../../globalStyles'

type NumericInputComponentProps={
  label: string
  stateValue: string
  setter: Function
}

const NumericInputComponent: FC<NumericInputComponentProps> = ({setter, stateValue, label}: NumericInputComponentProps) => {
  const [focused, setFocused] = useState<boolean>(false)
  const [tempValue, setTempValue] = useState<string>("")

  const OnBlurInput = ()=>{
    setFocused(false)
    if(tempValue !== ""){
      setter(tempValue)

    }
  }

  const onChangeInput = (text: string)=>{
    if(focused){
      setTempValue(text)  
    }
  }

  return (
    <View style={[globalStyles.inpuQty]}>
      <TextInput
        mode='outlined'
        label={label}
        value={focused ? tempValue : stateValue}
        activeOutlineColor="#337171"
        outlineColor='#c4cfd4'
        onChangeText={text =>onChangeInput(text)}
        onFocus={()=>setFocused(true)}
        onBlur={()=>OnBlurInput()}
        autoComplete="off"
        keyboardType="numeric"
        style={{width:"100%"}}
      />
    </View>
    
  )
}

export default NumericInputComponent

const styles = StyleSheet.create({})