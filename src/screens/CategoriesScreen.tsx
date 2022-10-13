import { FlatList, StyleSheet } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
import CategoryRenderItem from '../components/CategoryRenderItem'
import { useDispatch } from 'react-redux'
import { hideModal } from '../store/slices/modal'

type CategoriesScreenProps = {
  realm: Realm
  allProducts: Product[]
  allCategories: Category[]
  setChosenOption: Function
}

const CategoriesScreen: FC<CategoriesScreenProps> = ({realm, allProducts, allCategories, setChosenOption}: CategoriesScreenProps) => {

  const dispatch = useDispatch()

  useEffect(()=>{
    
    return()=> {
      setChosenOption("")
      dispatch(hideModal())
    }
  }, [])

  return (
    <FlatList
      data={allCategories}
      keyExtractor={(item: Category) => item._id.toString()}
      renderItem= {({item}) => (
        <CategoryRenderItem category={item} allProducts={allProducts} />
      )}
      contentContainerStyle = {styles.cards}
    />
  
  )
}

export default CategoriesScreen

const styles = StyleSheet.create({
  header: {
    padding: 10,
    display: "flex",
    marginBottom: 10
  },
  cards: {
    //flex:1,
    //alignItems: "center",
    //height:"100%"
  },
})