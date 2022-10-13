import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState, useRef} from 'react'
import { Picker } from '@react-native-picker/picker'
import { Button, TextInput } from 'react-native-paper'
import globalStyles from '../../globalStyles'
import {  useSelector } from 'react-redux'
import { RootState } from '../store/store'

type CategoryPickerProps = {
  realm: Realm
  onValuePickerChange: Function
  onFocus: Function
  onBlur: Function
  focused: boolean
  categoryInput: string
  setCategoryInput: Function
  validateNewCategory: Function
  createCatMode: boolean
  setCreateCatMode: Function
  selectedCategoryName : string 
}

const CategoryPicker: FC<CategoryPickerProps> = ({
  realm, 
  focused, 
  categoryInput, 
  onValuePickerChange, 
  onFocus, 
  onBlur, 
  setCategoryInput, 
  validateNewCategory,
  createCatMode,
  setCreateCatMode,
  selectedCategoryName,
}: CategoryPickerProps) => {

  const {allCategories} = useSelector((state: RootState)=> state.productAndCategories)

  const [categoryNameList, setCategoryNameList] = useState<string[]>([])

  const categoryInputRef = useRef(null)

  useEffect(()=>{
    createCatMode === true && setCategoryInput("")

    if(createCatMode === true && categoryInputRef !== null){
      categoryInputRef.current.forceFocus()
    }
  }, [createCatMode])
  
  useEffect(()=>{
    setCategoryNameList(allCategories.map(cat=> cat.nom))
  }, [allCategories])


  return (
    <View style={{borderColor: "#c4cfd4", borderWidth:2, padding:2.5, marginBottom:10}}>
    <Text style={{color:"#6e6e72", fontSize:15, marginVertical:5, marginLeft:10}}>Catégorie du produit</Text>
      {
        createCatMode === false
        ?
        <Picker 
          mode='dialog' 
          onValueChange={(item: string)=>onValuePickerChange(item)}
          selectedValue={selectedCategoryName !== "" ? selectedCategoryName : "Choisir catégorie..."}
          itemStyle={{fontSize:20, padding:0, margin:0}}
          style={{backgroundColor: "#e0e0e1"}}
          placeholder="Choisir une catégorie..."
          onFocus={()=>onFocus()}
          onBlur={()=>onBlur()}
        >
          <Picker.Item label="Choisir catégorie..." enabled={!focused ? true : false} value={null} color='#66666e'/>  
          <Picker.Item label="Nouvelle catégorie" value="Nouvelle catégorie" color='#292f36'/>
          {
            categoryNameList && categoryNameList.map((cat: string, index: number) => {
              return (
                <Picker.Item key={index.toString()} label={cat} value={cat} color='#292f36' />
              )
            })
          }
        </Picker>
        :
        <View>
          <TextInput
            mode='outlined'
            label="Entrer une nouvelle catégorie"
            value={categoryInput}
            outlineColor="#621b00"
            activeOutlineColor="#a32e00"
            onChangeText={text => setCategoryInput(text.toUpperCase())}
            autoComplete="off"
            style={globalStyles.input}
            autoCapitalize="characters"
            ref={categoryInputRef}
            
          />
          <View style={{flexDirection:"row", width:"100%", paddingRight:3.5 }}>
            <Button
              mode='contained' 
              color="#698d68" 
              labelStyle={{fontSize:12}} 
              style={{width:"60%", marginRight:2.5, marginBottom:5 }}
              onPress={()=>validateNewCategory(realm, categoryInput)}
            >
              Ajouter catégorie
            </Button>
            <Button 
              mode='contained' 
              color="#b64e3e" 
              labelStyle={{fontSize:12}} 
              style={{width:"40%", marginBottom:5}} 
              onPress={()=>setCreateCatMode(false)}
            >
              Annuler
            </Button>
          </View>
        </View>            
      }  
    </View>
  )
}

export default CategoryPicker

const styles = StyleSheet.create({})