import { StyleSheet, Text, View, FlatList} from 'react-native'
import React, {FC, useState, useEffect} from 'react'
import CategoryTopMenu from './CategoryTopMenu'
import { IconButton, TextInput } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { changeCategory, fetchCategoryById } from '../actions/categoryActions'

export interface ModifyCategoryOptionProps {
  realm: Realm
}

const ModifyCategoryOption: FC<ModifyCategoryOptionProps> = ({realm}: ModifyCategoryOptionProps) => {

  const {allCategories} = useSelector((state: RootState)=> state.productAndCategories)

  const [idToModify, setIdToModify] =  useState<number | null>(null)
  const [nameCat, setNameCat] =  useState<string>("")

  useEffect(() => {
    if(idToModify !== null){
      setNameCat(fetchCategoryById(realm, +idToModify)?.nom)
    }
  
  }, [idToModify])

  const changeCategoryName = ()=>{
    changeCategory(realm, idToModify, nameCat.trim().toUpperCase())
    setIdToModify(null)
  }
  

  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <View>
            <CategoryTopMenu/>
            <View style={styles.warning}>
              <Text style={styles.title}>Catégories modifiables</Text>
              <Text style={styles.warningText}>
                Quand vous modifiez le nom d'une catégorie, la modification s'appliquera sur tous les produit qui sont associés à cette catégorie.
              </Text>
            </View>

          </View>
        }
        data={allCategories}
        keyExtractor={(item) => item._id.toString()}
        renderItem = {({item}) => (
          <View>
            {
              idToModify !== item._id 
              ?
              <View style={styles.renderItem}>
                <Text style={styles.renderItemText}>{item.nom}</Text>
                <IconButton icon="lead-pencil" color="grey" onPress={()=> setIdToModify(item._id)} />
              </View>
              :
              <View style={{flexDirection:"row", width: "100%", height:35, alignItems: 'center', marginBottom:10}}>
                <TextInput autoCapitalize='characters' mode="outlined" style={{width:'80%'}} dense={true} value={nameCat} right={<IconButton icon={"checkbox-marked-outline"} />} onChangeText={(text)=> setNameCat(text)}/>
                <IconButton size={30} icon="close-box-outline" color="red" onPress={()=> setIdToModify(null)} style={{marginRight:-10, marginLeft:-5}} />
                <IconButton size={30} icon="checkbox-marked-outline" color="green" onPress={()=> changeCategoryName() } />
              </View>
            }
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: "center"}}>Toutes les catégories sont associées à au moins un produit.</Text>}
      />
    </View>
  )
}

export default ModifyCategoryOption

const styles = StyleSheet.create({
  title: {
    marginVertical:7.5, 
    fontSize:15, 
    fontFamily:"Inter_600SemiBold",
    textAlign: "center",
    padding:10
  },
  textInput: {
    width:'80%',
    height:20
  },
  warning: {
    borderWidth:2, 
    borderColor: "#b20645",
    backgroundColor:"white",
    marginBottom:25,
    marginTop:10
  },
  warningText: {
    fontSize: 11.5, 
    fontFamily:"Inter_500Medium", 
    padding:10,
    color:"#b20645"
  }, 
  renderItem: {
    backgroundColor:"#a4d4b4" ,
    borderRadius: 5,
    borderColor: "grey",
    borderWidth:2,
    marginVertical:7.5,
    flexDirection:"row",
    alignItems:"flex-start",
    justifyContent: "space-between"
  },
  renderItemText: {
    padding: 10
  }
})