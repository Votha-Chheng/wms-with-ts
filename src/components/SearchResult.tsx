import { StyleSheet, View } from 'react-native'
import React, { FC, useState } from 'react'
import { TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { changeFilters } from '../store/slices/filters'
import { RootState } from '../store/store'


const SearchResult = () => {

  const {filters} = useSelector((state : RootState) => state.filters)
  const {searchByText} = filters

  const dispatch = useDispatch()

  const handleChange = (text:string) =>{
    
  } 

  return (
    <View style={styles.container}>
      <TextInput
        label="Rechercher un mot"
        mode="outlined"
        dense={true}
        left={<TextInput.Icon icon="magnify" />}
        right={<TextInput.Icon icon="close-circle" color='red' onPress={()=>dispatch(changeFilters({...filters, searchByText: ""}))}/>}
        value={searchByText}
        onChangeText={(text)=>dispatch(changeFilters({...filters, searchByText: text}))}
      />
    </View>
  )
}

export default SearchResult

const styles = StyleSheet.create({
  container : {
    marginHorizontal:10,
    flex:1
  }
})