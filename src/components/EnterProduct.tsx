import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { newQtyToNumber, showToast } from '../../utils'
import globalStyles from '../../globalStyles'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { hideModal } from '../store/slices/modal'
import { Product } from '../models/Product'
import { updateProduct } from '../actions/productActions'
import { unscan } from '../store/slices/scanning'
import { resetCodeBarData } from '../store/slices/dataBarCode'

type EnterProductProps = {
  realm: Realm
}

const EnterProduct: FC<EnterProductProps> = ({realm}: EnterProductProps) => {

  const {singleProduct, allProducts} = useSelector((state: RootState)=> state.productAndCategories)

  const [newQty, setNewQty] = useState<string>("1")

  const dispatch = useDispatch()

  const validateNewStock = ()=>{
    dispatch(hideModal())

    const product: Product[] = allProducts.filter((prod: Product)=> prod._id === singleProduct._id)

    const updatedProd: Product = {...product[0], qty: product[0].qty += +newQty}

    updateProduct(realm, updatedProd)

    setTimeout(()=>{
      dispatch(unscan())
    }, 1500)
    
    dispatch(resetCodeBarData())

    setNewQty("1")

    const productUpdated:any = realm.objectForPrimaryKey("Product", singleProduct._id)
    showToast("success", "Stock mis à jour", `Stock actuel de ${singleProduct.nom} : ${productUpdated.qty} unités.`)

  }

  const cancelNewStock = ()=>{
    dispatch(hideModal())

    setTimeout(()=>{
      dispatch(unscan())
    }, 3000)

    dispatch(resetCodeBarData())

    setNewQty("1")
    
    showToast("info", "Stock inchangé", "Mise à jour du stock annulée.")
  }

  return (
    <View>
      <Text style={[globalStyles.screenTitle, {color:"green"}]}>Ajouter dans l'inventaire</Text>
      <Text style={{textAlign:"center", marginVertical:20}}>Code-barre n° {singleProduct._id}</Text>
      <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:20}}>
        <View style={{width:"50%", paddingLeft:10}}>
          <Text style={[globalStyles.nom, {alignSelf:'flex-start'}]}>{singleProduct.nom}</Text>
          <Text style={globalStyles.marque}>{singleProduct.marque}</Text>
          <Text style={[globalStyles.categorie, {alignSelf:'flex-start'}]}>{singleProduct.categorie.nom}</Text>
        </View>

        <View style={{width:"50%", flexDirection:"row", alignItems:"center"}}>
          <View style={{width:"60%", justifyContent:"center"}}>
            <Text style={{height: 50 }}>Qté actuelle : </Text>
            <Text style={{height: 50 }}>Qté à ajouter : </Text>
            <Text style={{fontFamily:"Rubik_600SemiBold", color:"purple"}}>Stock total : </Text>
          </View>
          <View>
            <Text style={{marginTop:5, height: 40, alignSelf: "center"}}>{singleProduct.qty}</Text>
            <TextInput
              mode='flat'
              label=""
              value={newQty}
              activeOutlineColor="#337171"
              outlineColor='#c4cfd4'
              onChangeText={text => setNewQty(text)}
              onFocus={()=>setNewQty("")}
              autoComplete="off"
              keyboardType="numeric"
              dense={true}
              style={{marginTop:0}}
            />
            <Text style={{marginBottom:10, marginTop: 25, fontFamily:"Rubik_600SemiBold", color: "purple"}}>{singleProduct.qty + newQtyToNumber(newQty)}</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection:'row', justifyContent:'center'}}>
        <Button mode="contained" color="#d44f0c" style={{width:"40%", marginRight:10}} onPress={()=>cancelNewStock()}>
          Annuler
        </Button>
        <Button mode="contained" color="green" style={{width:"40%", marginLeft:10}} onPress={()=>validateNewStock()}>
          Valider
        </Button>
      </View>
    </View>
  )
}

export default EnterProduct

const styles = StyleSheet.create({})