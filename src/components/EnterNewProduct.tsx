import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { createButtonAlert, setInitialToUpperCase, showToast, spaceTelFournisseur } from '../../utils'
import NewProductFabricant from './NewProductFabricant'
import globalStyles from '../../globalStyles'
import NewProductName from './NewProductName'
import CategoryPicker from './CategoryPicker'
import Realm from 'realm'
import { createNewCategory } from '../actions/categoryActions'
import { createProduct } from '../actions/productActions'
import { getErrorToTrueOrFalse, getMessageError } from '../store/slices/errorMessage'
import { hideModal } from '../store/slices/modal'
import { resetCodeBarData } from '../store/slices/dataBarCode'
import { unscan } from '../store/slices/scanning'

type NewProductProps = {
  type: string
  data: string
  realm: Realm
  allCategories: Category[]
}

const EnterNewProduct:FC<NewProductProps> = ({data, type, realm, allCategories}: NewProductProps) => {

  const [fabricant, setFabricant] = useState<string>("")
  const [chooseCategory, setChooseCategory] = useState<Category>(null)
  const [quantity, setQuantity] = useState<string>("1")
  const [newCategory, setNewCategory] = useState<string>("")
  const [createCatMode, setCreateCatMode] = useState<boolean>(false)
  const [nom, setNom] = useState<string>("")
  const [focused, setFocused] = useState<boolean>(false)
  const [stockLimite, setStockLimite] = useState<string>("1")
  const [telFournisseur, setTelFournisseur] = useState<string>("")
  const [displayTel, setDisplayTel] = useState<string>("")
  const [webSite, setWebSite] = useState<string>("")

  const {error, message} = useSelector((state: RootState) => state.errorMessage)

  const dispatch = useDispatch()

  useEffect(()=>{
    if(error){
      createButtonAlert("Une erreur est survenue !", message, onPressAlert)
    }
  }, [error])

  const onPressAlert = ()=>{
    dispatch(getErrorToTrueOrFalse(false))
    dispatch(getMessageError(""))
  }
  
  const validateProductCreation = ()=>{
    const obj: Product = {
      _id: data,
      codeBarType: type,
      nom: nom,
      marque: fabricant,
      categorie: realm.objectForPrimaryKey("Category", chooseCategory._id),
      telFournisseur: telFournisseur,
      siteFournisseur : webSite ? `https://${webSite}` : null,
      qty:+quantity,
      stockLimite:+stockLimite,
      commandeEncours: false
    }

    createProduct(realm, obj)

    dispatch(hideModal())

    dispatch(resetCodeBarData())

    setTimeout(()=>{
      dispatch(unscan())
    }, 3000)
  } 

  const validateNewCategory = (realm: Realm, newCategory: string): void=>{
    const catExists = allCategories.filter((cat: Category)=> cat.nom === setInitialToUpperCase(newCategory.trim()) )

    if(catExists.length === 0){
      const categoryCreated: Category = createNewCategory(realm, newCategory)
      setCreateCatMode(false)
      setNewCategory('')
      setChooseCategory(categoryCreated)

    } else {
      showToast("error","Attention !", "La catégorie existe déjà !")

    }  
  }

  const unspaceTel = (telWithSpace: string): string =>{
    const newTel = telWithSpace.split(" ")

    return newTel.join()
  }

  const onValuePickerChange = (name: string) : void=>{
    if(name !== "Nouvelle catégorie"){
      const chosenCat: Category[] = allCategories.filter((cat: Category) => cat.nom === name)

      setChooseCategory(chosenCat[0])

    } else {
      setCreateCatMode(true)
      
    }
  }

  return (
    <ScrollView>
      <Text style={styles.title}>Nouveau produit</Text>
      <View style={{marginVertical:10, alignItems:"center"}}>
        <Text>Code-barre de type 
          <Text style={styles.type}> {type !== null ? type : "inconnu"}</Text> 
          <Text> & n° </Text>
          <Text style={styles.type}>{data}</Text>
        </Text>
      </View>
      <Text style={{textAlign:"center"}}>Renseignez les informations suivantes :</Text>
      
      <SafeAreaView style={styles.bodyModal}>
        
        <NewProductFabricant fabricant={fabricant} onChangeFabricant ={setFabricant}/>

        <NewProductName nom={nom} onChangeName={setNom} />

        <CategoryPicker
          focused={focused}
          chooseCategory={chooseCategory}
          onValuePickerChange={onValuePickerChange}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          newCategory={newCategory}
          onChangeCategory={setNewCategory}
          createNewCategory = {()=>validateNewCategory(realm, newCategory)}
          createCatMode={createCatMode}
          createCatModeToFalse={()=>setCreateCatMode(false)}
          allCategories={allCategories}
        />
        
        <TextInput
          mode='outlined'
          label="Quantité à rentrer"
          value={quantity}
          activeOutlineColor="#337171"
          outlineColor='#c4cfd4'
          onChangeText={text => setQuantity(text)}
          onFocus={()=>setQuantity("")}
          onBlur={()=>setQuantity(prev => prev !== "" ? quantity : "1")}
          autoComplete="off"
          keyboardType="numeric"
          style={globalStyles.inpuQty}
        />
        <TextInput
          mode='outlined'
          label="Stock limite"
          value={stockLimite}
          activeOutlineColor="#a25553"
          outlineColor='#c4cfd4'
          onChangeText={text => setStockLimite(text)}
          onFocus={()=>setStockLimite("")}
          autoComplete="off"
          keyboardType="numeric"
          style={globalStyles.inpuQty}
        />

        <View style={{borderColor: "#c4cfd4", borderWidth:2, padding:2.5, marginBottom:10}}>
          <Text style={{color:"#6e6e72", fontSize:15, marginVertical:5, marginLeft:10}}>Contact fournisseur (optionnel)</Text>
          <TextInput
            mode='outlined'
            label="N° de téléphone"
            value={displayTel}
            activeOutlineColor="#a25553"
            outlineColor='#c4cfd4'
            onChangeText={text => setTelFournisseur(text)}
            onFocus={()=>setDisplayTel(unspaceTel(telFournisseur))}
            onBlur={()=>setDisplayTel(spaceTelFournisseur(telFournisseur))}
            autoComplete="off"
            keyboardType="numeric"
            style={globalStyles.input}
            maxLength={14}
          />
          <TextInput
            mode='outlined'
            label="Site web"
            value={webSite}
            onChangeText={text => setWebSite(text)}
            onBlur = {()=> setWebSite(webSite.toLowerCase())}
            autoComplete="off"
            activeOutlineColor="#54b3f2"
            outlineColor='#54b3f2'
            style={globalStyles.input}
            left={<TextInput.Affix text="https://" />}
            autoCapitalize="none"
          />
        </View>
        <Text>{telFournisseur}</Text>
        <Button
          mode='contained'
          icon='check-bold'
          onPress={() => validateProductCreation()}
        >
          Valider les informations
        </Button>
      </SafeAreaView>
    </ScrollView>
  )
}

export default EnterNewProduct

const styles = StyleSheet.create({
  title : {
    fontSize : 20,
    textAlign : 'center',
    fontFamily : "Roboto_900Black",
    textTransform:'uppercase',
    marginBottom:10
  },
  bodyModal : {
    padding:10
  },
  type : {
    fontFamily: "Roboto_900Black"
  },
  categoryTags: {
    marginHorizontal: 5,
    paddingVertical:2.5,
    paddingHorizontal:5,
    borderRadius:5
  }
})