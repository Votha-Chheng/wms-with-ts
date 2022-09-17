import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { IconButton } from 'react-native-paper'
import globalStyles from '../../globalStyles'
import { useDispatch } from 'react-redux'
import { scan } from '../store/slices/scanning'

export type RoundButtonProps = {
  setManualMode: Function
  backgroundColor: string
}

const RoundButton:FC<RoundButtonProps> = ({setManualMode, backgroundColor}: RoundButtonProps) => {

  const dispatch = useDispatch()

  return (
    <TouchableOpacity 
      style={[globalStyles.roundButton, {backgroundColor}]} 
      onPress={()=>{
        setManualMode(true)
        dispatch(scan())
      }}
    >
      <IconButton icon="pen-plus" color="white" size={50}/>
    </TouchableOpacity>
  )
}

export default RoundButton

const styles = StyleSheet.create({})