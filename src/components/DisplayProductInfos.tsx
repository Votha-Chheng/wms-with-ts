import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Product } from '../models/Product'
import globalStyles from '../../globalStyles'
import { Button } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { spaceTelFournisseur } from '../../utils'
import { hideModal } from '../store/slices/modal'

type DisplayProductInfosProps = {
  displayProduct: Product
  setModify: Function
}

const DisplayProductInfos: FC<DisplayProductInfosProps> = ({displayProduct, setModify}: DisplayProductInfosProps) => {
  const dispatch = useDispatch()

  const goBackButton = ()=>{
    dispatch(hideModal())
  }
  return (
    <ScrollView>
      <Text style={[globalStyles.screenTitle, {marginBottom:20}]}>
        Code barre de type {displayProduct.codeBarType} n°{displayProduct._id}
      </Text>
      <View style={[styles.row]}>
        <Text style={{marginRight: 10}}>
          Nom : 
        </Text>
        <Text>
          {displayProduct.nom}
        </Text>
      </View>
      <View style={[styles.row]}>
        <Text style={[styles.textMarginRight]}>
          Catégorie : 
        </Text>
        <Text>
          {displayProduct.categorie.nom}
        </Text>
      </View>
      
      <View style={[styles.row]}>
        <Text style={[styles.textMarginRight]}>
          Fabricant : 
        </Text>
        <Text>
          {displayProduct.marque}
        </Text>  
      </View>
      
      <View>
        {
          (displayProduct.telFournisseur !== "" && displayProduct.telFournisseur !== null) && 
            <View style={[styles.row]}>
              <Text style={[styles.textMarginRight]} >N° de téléphone du fournisseur :</Text> 
              <Text>{spaceTelFournisseur(displayProduct.telFournisseur) }</Text> 
            </View>     
        }
        {
          displayProduct.siteFournisseur !=="" && 
            <View style={[styles.row]}>
              <Text style={[styles.textMarginRight]}>Site web du fournisseur :</Text> 
              <Text onPress={()=> Linking.openURL(displayProduct.siteFournisseur)}>{displayProduct.siteFournisseur}</Text>
            </View>
        }
        
      </View>
      <View style={globalStyles.buttonRow}>
        <Button mode="contained" onPress={()=>goBackButton()} color="grey" labelStyle={{color:"white"}} >
          Retour
        </Button>
        <Button mode="contained" onPress={()=>setModify(true)} color="#1C9CEA">
          Modifier les infos produit
        </Button>
      </View>
      
    
    </ScrollView>  
  )
}

export default DisplayProductInfos

const styles = StyleSheet.create({
  row: {
    flexDirection:"row",
    marginVertical:5,
    marginHorizontal:5
  },
  textMarginRight: {
    marginRight: 10
  }
})