import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import globalStyles from '../../globalStyles'
import { Button, Chip } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { showToast, spaceTelFournisseur } from '../../utils'
import { hideModal } from '../store/slices/modal'
import { getSingleCategory, getSingleProduct } from '../store/slices/productsAndCategories'
import { Product } from '../models/Product'

type DisplayProductInfosProps = {
  setModify: Function
  realm: Realm
  localSingleProduct: Product
  setLocalSingleProduct: Function
}

const DisplayProductInfos: FC<DisplayProductInfosProps> = ({setModify, realm, localSingleProduct, setLocalSingleProduct}: DisplayProductInfosProps) => {

  const dispatch = useDispatch()

  const goBackButton = ()=>{
    dispatch(hideModal())
    dispatch(getSingleProduct(null))
    setLocalSingleProduct(null)
  }

  const changeCommandeEnCours = (id: any)=>{
    const prod: any = realm.objectForPrimaryKey("Product", id)

    try {
      realm.write(()=>{
        prod.commandeEncours = !prod.commandeEncours
      })

    } catch (error) {
      showToast("error", "Echec", "Veuillez recommencer l'opération.")

    }  
  }

  return (
    <ScrollView>
      {
        localSingleProduct !==null &&
        <View>
          <Text style={[globalStyles.screenTitle, {marginBottom:20}]}>
            Code barre de type {localSingleProduct.codeBarType} n°{localSingleProduct._id}
          </Text>
          <View style={[styles.row]}>
            <Text style={{marginRight: 10}}>
              Nom : 
            </Text>
            <Text>
              {localSingleProduct.nom}
            </Text>
          </View>
          <View style={[styles.row]}>
            <Text style={[styles.textMarginRight]}>
              Catégorie : 
            </Text>
            <Text>
              {localSingleProduct.categorie.nom}
            </Text>
          </View>
          <View style={[styles.row]}>
            <Text style={[styles.textMarginRight]}>
              Fabricant : 
            </Text>
            <Text>
              {localSingleProduct.marque}
            </Text>  
          </View>
          
          <View>
            {
              localSingleProduct.telFournisseur !== null && localSingleProduct.telFournisseur !== "" 
              &&
              <View style={[styles.row]}>
                <Text style={[styles.textMarginRight]} >N° de téléphone du fournisseur :</Text> 
                <Text onPress={()=>Linking.openURL(`tel:${localSingleProduct.telFournisseur}`)}>{spaceTelFournisseur(localSingleProduct.telFournisseur) }</Text> 
              </View>     
            }
            {
              localSingleProduct.siteFournisseur !== null && localSingleProduct.siteFournisseur !== ""
              && 
              <View style={[styles.row]}>
                <Text style={[styles.textMarginRight]}>Site web du fournisseur :</Text> 
                <Text onPress={()=> Linking.openURL(localSingleProduct.siteFournisseur)}>https://{localSingleProduct.siteFournisseur}</Text>
              </View>
            }
            {
              localSingleProduct.qty <= localSingleProduct.stockLimite 
              &&
              <View style={[styles.row, {alignItems:"center", marginBottom:15}]}>
                <Text style={{marginHorizontal:5}}>Une commande du produit a été effectuée ? :</Text> 
                <Chip 
                  icon={localSingleProduct.commandeEncours === true ? "check-bold" :"close"} 
                  selected={localSingleProduct.commandeEncours === true ? true : false}
                  selectedColor={localSingleProduct.commandeEncours === true ? "green" : "red"}
                  onPress={()=> changeCommandeEnCours(localSingleProduct._id)}
                >
                  {localSingleProduct.commandeEncours === true? "Oui": "Non"}
                </Chip>
              </View>
            }
            
          </View>

          <View style={globalStyles.buttonRow}>
            <Button mode="contained" onPress={()=>goBackButton()} color="grey" labelStyle={{color:"white"}} >
              Retour
            </Button>
            <Button 
              mode="contained" 
              onPress={()=>{
                dispatch(getSingleCategory({_id: localSingleProduct.categorie._id, nom: localSingleProduct.categorie.nom}))
                setModify(true)}
              } 
              color="#1C9CEA">
              Modifier les infos produit
            </Button>
          </View>
        </View>  
      }
      
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