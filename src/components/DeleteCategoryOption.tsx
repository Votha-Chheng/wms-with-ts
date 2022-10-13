import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Category } from '../models/Category'
import { IconButton } from 'react-native-paper'
import { deleteCategory } from '../actions/categoryActions'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import CategoryTopMenu from './CategoryTopMenu'

export interface DeleteCategoryOptionProps {
  realm: Realm

}

const DeleteCategoryOption: FC<DeleteCategoryOptionProps> = ({realm}: DeleteCategoryOptionProps) => {

  const {allCategories, allProducts} = useSelector((state: RootState)=> state.productAndCategories)

  const displayCategoriesToDelete = (): Category[]=>{
    const catWithProd: string[] = allProducts.map(element => element.categorie.nom)

    return allCategories.filter(cat => !catWithProd.includes(cat.nom))
  }

  const handleDeleteCategory = (id: number)=>{
    deleteCategory(realm, id)
  }

  return (
    <FlatList
        ListHeaderComponent={
          <View>
            <CategoryTopMenu/>
            <View style={styles.warning}>
              <Text style={styles.title}>Catégories supprimables</Text>
              <Text style={styles.warningText}>
                Pour qu'une catégorie puisse être supprimée, il ne faut pas qu'elle soit déjà associée à un produit. Si c'est le cas, allez dans l'inventaire pour modifier les informations du produit associé.
              </Text>
            </View>

          </View>
        }
        data={displayCategoriesToDelete()}
        keyExtractor={(item) => item._id.toString()}
        renderItem = {({item}) => (
          <View style={styles.renderItem}>
            <Text style={styles.renderItemText}>{item.nom}</Text>
            <IconButton icon="delete" color="grey" onPress={()=> handleDeleteCategory(item._id)} />
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: "center"}}>Toutes les catégories sont associées à au moins un produit.</Text>}
      />
  )
}

export default DeleteCategoryOption

const styles = StyleSheet.create({
  title: {
    marginVertical:7.5, 
    fontSize:15, 
    fontFamily:"Inter_600SemiBold",
    textAlign: "center",
    padding:10
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
    backgroundColor:"#ffad5c" ,
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