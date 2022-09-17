import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
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


type ListeProduitsScreenProps = {
  realm: Realm
  allProducts: Product[]
  allCategories: Category[]
}

const ListeProduitsScreen: FC<ListeProduitsScreenProps> = ({realm, allProducts, allCategories}: ListeProduitsScreenProps) => {

  const [displayProduct, setDisplayProduct] = useState<Product>(null)
  const [productToDisplay, setProductToDisplay] = useState<Product[]>([])
  const [modify, setModify] = useState<boolean>(false)

  const { cameraStatus } = useSelector((state: RootState)=> state.cameraPermission)

  const { filters } = useSelector((state: RootState) => state.filters)
  const { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock } = filters

  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    dispatch(getCameraPermission())
    dispatch(unscan())
    dispatch(hideModal())
    setDisplayProduct(null)
    setModify(false)

    return()=>{
      dispatch(hideModal())
      dispatch(resetCodeBarData())
      dispatch(unscan())
      
    }
  }, [cameraStatus])

  useEffect(()=>{
    displayProductByFilters(allProducts)

  }, [filters])

  const displayProductByFilters = (productList: Product[])=>{
    let temp : Product[]

    if(parType !== ""){
      temp = productList.filter( p => p.categorie.nom === parType)
    }

    if(alertStock === true){
      temp = productList.filter(p => p.qty <= p.stockLimite)
    }

    if(dateEntree === true && recent === false){
      temp = temp
    }

    if(dateEntree === true && recent === true){
      temp = temp.reverse()
    }

    if(alphabetique === true && ordreAlphabet === true){
      temp = temp.sort()
    }

    if(alphabetique === true && ordreAlphabet === false){
      temp = temp.sort((a, b) => b[parType.toString()].localeCompare(a[parType.toString()]))
    }

    setProductToDisplay(temp)
  }

  const onPressItem = (id: string)=>{
    setDisplayProduct(fetchProductById(realm, id))
    setModify(false)
    dispatch(showModal())  

  }

  return (
    <View style={styles.screenContainer}>
      <FilterProducts/>
      <View>
        {
          productToDisplay.length >0
          ?
          <FlatList
            data={productToDisplay}
            keyExtractor={(item: Product) => item._id.toString()}
            renderItem = {({item}) => (
              <InventaireListRender
                data={item}
                onPressFunction={onPressItem}
              />
            )}
          />
          :
          <Text style={{flex:1, justifyContent:"center", alignItems:"center", fontSize:20}}>Aucun produit enregistré.</Text>
        }
      </View>

      {
        displayProduct !== null &&
        <ModalListRenderer modify={modify} setModify={setModify} displayProduct={displayProduct} allCategories={allCategories} setDisplayProduct={setDisplayProduct} realm={realm}/>

      }
      
    </View>
  )
}

export default ListeProduitsScreen

const styles = StyleSheet.create({
  screenContainer: {
    height: "100%"
  },
})