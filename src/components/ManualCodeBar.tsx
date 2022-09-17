import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import globalStyles from '../../globalStyles'
import { useDispatch } from 'react-redux'
import { unscan } from '../store/slices/scanning'

export type ManualCodeBarProps = {
  setManualMode: Function
  handleValidation: Function
}

const ManualCodeBar: FC<ManualCodeBarProps> = ({setManualMode, handleValidation}: ManualCodeBarProps) => {

  const [manualBarCode, setManualBarCode] = useState<string>("")
  
  const dispatch = useDispatch()

  return (
    <View style={{backgroundColor:"white", height:"50%", width:"100%", position:"absolute", top:"50%", paddingVertical:15}}>
        <TextInput label="Entrez manuellement le code-barre" style={{width:"100%"}} keyboardType="numeric" onChangeText={(text)=>setManualBarCode(text)} />
        <View style={[globalStyles.flexRowButtons]}>
          <Button 
            mode='contained'
            color='green'
            style={{marginHorizontal:10}}
            onPress={()=>handleValidation(manualBarCode)}
          >
            Valider
          </Button>
          <Button 
            mode='contained'
            color="red"
            style={{marginHorizontal:10}}
            onPress={()=> {
            setManualMode(false)
            dispatch(unscan())
          }}>
            Annuler
          </Button>
        </View>
    </View>
  )
}

export default ManualCodeBar

const styles = StyleSheet.create({})