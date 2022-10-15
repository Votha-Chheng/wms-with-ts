import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Product } from '../models/Product'
import InventaireListRender from '../components/InventaireListRender'
import FilterProducts from '../components/FilterProducts'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal, showModal } from '../store/slices/modal'
import { fetchProductById } from '../actions/productActions'
import ModalListRenderer from '../components/ModalListRenderer'
import { unscan } from '../store/slices/scanning'
import { getCameraPermission } from '../store/slices/cameraPermission'
import { resetCodeBarData } from '../store/slices/dataBarCode'
import { AppDispatch, RootState } from '../store/store'
import { getSingleCategory, getSingleProduct } from '../store/slices/productsAndCategories'
import { displayProductByFilters } from '../../utils'

type ListeProduitsScreenProps = {
  realm: Realm
}

const ListeProduitsScreen: FC<ListeProduitsScreenProps> = ({realm}: ListeProduitsScreenProps) => {
  const [modify, setModify] = useState<boolean>(false)
  const [localSingleProduct, setLocalSingleProduct] = useState<Product|null>(null)

  const { cameraStatus } = useSelector((state: RootState)=> state.cameraPermission)

  const { filters } = useSelector((state: RootState) => state.filters)

  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)

  const {allProducts, allCategories, singleProduct} = useSelector((state: RootState)=> state.productAndCategories)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    dispatch(getCameraPermission())
    dispatch(unscan())
    dispatch(hideModal())
    setModify(false)

    return()=>{
      dispatch(hideModal())
      dispatch(resetCodeBarData())
      dispatch(unscan())
      
    }
  }, [cameraStatus])

  useEffect(()=>{
    if(singleProduct !== null){
      const product = allProducts.filter(prod=> prod._id === singleProduct._id)

      setLocalSingleProduct(product[0])
    }
  }, [allProducts])

  const onPressItem = (id: string)=>{
    const prod = fetchProductById(realm, id)
    
    dispatch(getSingleProduct(prod))
    dispatch(getSingleCategory(prod.categorie))
    setLocalSingleProduct(prod)
    setModify(false)
    dispatch(showModal())  
      
    console.log(localSingleProduct)
  }

  return (
    <View style={styles.screenContainer}>
      <View>
        <FlatList
          ListHeaderComponent={
            <FilterProducts allProducts={allProducts} allCategories={allCategories}/>
          }
          data={displayProductByFilters(allProducts, filters, selectedMarqueOrCategory)}
          keyExtractor={(item: Product) => item._id.toString()}
          renderItem = {({item}) => (
            <InventaireListRender
              data={item}
              onPressFunction={()=>onPressItem(item._id.toString())}
            />
          )}
          ListEmptyComponent={<Text>Aucun produit trouvé</Text>}
        />
      </View>
      {
        localSingleProduct !== null &&
        <ModalListRenderer 
          modify={modify} 
          setModify={setModify} 
          realm={realm}
          setLocalSingleProduct={setLocalSingleProduct}
          localSingleProduct={localSingleProduct}
        />
      }
    </View>
  )
}

export default ListeProduitsScreen

const styles = StyleSheet.create({
  screenContainer: {
    marginHorizontal:5
  },
})