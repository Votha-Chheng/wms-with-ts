import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, {FC, useEffect} from 'react'
import FilterProducts from '../components/FilterProducts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Product } from '../models/Product'
import { createButtonAlert, displayProductByFilters, showToast } from '../../utils'
import { deleteProduct, fetchProductById } from '../actions/productActions'
import { getSingleProduct } from '../store/slices/productsAndCategories'
import ItemProductToDelete from '../components/ItemProductToDelete'
import { Button } from 'react-native-paper'

export interface DeleteProductScreenProps {
  realm: Realm
}

const DeleteProductScreen: FC<DeleteProductScreenProps> = ({realm}: DeleteProductScreenProps) => {

  const {allProducts, allCategories} = useSelector((state: RootState)=> state.productAndCategories)
  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)
  const {filters} = useSelector((state: RootState)=> state.filters)

  const dispatch = useDispatch()

  useEffect(() => {
  
    return () => {
      dispatch(getSingleProduct(null))
    }
  }, [])
  

  const deleteAllObjects = ()=>{
    realm.write(()=>{
      realm.delete(realm.objects("Product"))
    })
    showToast("success", 'Inventaire vide !', "Il n'y a plus rien dans l'inventaire.")
  }


  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <FilterProducts allProducts={allProducts} allCategories={allCategories}/>
        }
        ListFooterComponent={
          allProducts.length>1 &&
          <Button 
            color="red" 
            mode='contained' 
            style={{marginBottom:15, width:'90%', alignSelf:"center"}} 
            onPress={()=>createButtonAlert("Attention !", "Vous êtes sur le point de supprimer tous les produit de l'inventaire !", deleteAllObjects, null)}>
            Supprimer tous les produits
          </Button>
        }
        data={displayProductByFilters(allProducts, filters, selectedMarqueOrCategory)}
        keyExtractor={(item: Product) => item._id.toString()}
        renderItem = {({item}) => (
          <ItemProductToDelete
            data={item}
            onPressFunction={()=>createButtonAlert(`Vous êtes sur le point de supprimer le produit : ${item.nom}`, "Confirmer pour supprimer définitivement le produit.", deleteProduct, [realm, item._id])}
          />
        )}
        ListEmptyComponent={<Text style={{textAlign:"center", marginBottom:20}} >Aucun produit trouvé</Text>
      }
        
      />
    </View>
  )
}

export default DeleteProductScreen

const styles = StyleSheet.create({})