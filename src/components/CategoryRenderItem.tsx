import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { Button } from 'react-native-paper'

type CategoryRenderItemProps={
  category: Category
  allProducts: Product[]
}

const CategoryRenderItem: FC<CategoryRenderItemProps> = ({category, allProducts}: CategoryRenderItemProps) => {

  const displayProductByCategory = (category: string): number => {
    const array: Product[] = allProducts.filter((product: Product)=> product.categorie.nom === category)

    return array.length
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <View style={{width:'60%'}}>
          <Text style={{color:"black"}}>Catégorie : {category.nom}</Text>
          <Text>Nombre de produits concerné : {displayProductByCategory(category.nom)}</Text>
        </View>
        <View style={{width:"40%", height:"100%", justifyContent:"center"}}>
          <Button mode='contained' labelStyle={{fontSize:12}} style={{marginBottom:10}} icon="eye" color="#1C9CEA">
            Voir produits
          </Button>
          <Button mode='contained' labelStyle={{fontSize:12}} style={{marginBottom:10}} icon="delete" color="red">
            Supprimer
          </Button>
        </View>
      </View>
    </View>
  )
}

export default CategoryRenderItem

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal:5,
  },
  infoContainer: {
    width:"100%",
    borderWidth:2,
    borderColor: "gray",
    marginRight:10,
    flexDirection: "row", 
    alignItems: 'center',
    padding:7.5
  }
})