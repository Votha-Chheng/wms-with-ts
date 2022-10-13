import { StyleSheet, Text, View } from 'react-native'
import React, {FC, useState, useEffect} from 'react'
import { Button, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import TextInPutComponent from './TextInPutComponent'
import CategoryPicker from './CategoryPicker'
import { Category } from '../models/Category'
import { getSingleCategory, getSingleProduct } from '../store/slices/productsAndCategories'
import { createNewCategory, fetchCategoryById } from '../actions/categoryActions'
import { showToast } from '../../utils'
import globalStyles from '../../globalStyles'
import { hideModal } from '../store/slices/modal'
import { resetCodeBarData } from '../store/slices/dataBarCode'
import { unscan } from '../store/slices/scanning'
import { createProduct, updateProduct } from '../actions/productActions'
import { Product } from '../models/Product'

export interface ProductFormProps {
  realm: Realm
  newProduct: boolean
}

const ProductForm: FC<ProductFormProps> = ({newProduct, realm}: ProductFormProps) => {
  const {type, data} = useSelector((state: RootState)=> state.codeBarDataType)
  const {allCategories, singleProduct} = useSelector((state: RootState)=> state.productAndCategories)

  const [marqueInput, setMarqueInput] = useState<string>("")
  const [nomInput, setNomInput] = useState<string>("")
  const [categoryInput, setCategoryInput] = useState<string>("")
  const [qtyInput, setQtyInput] = useState<string>("")
  const [stockLimite, setStockLimite] = useState<string>("")
  const [telFournisseur, setTelFournisseur] = useState<string>("")
  const [webSite, setWebSite] = useState<string>("")
  const [commandeEncours, setCommandeEnCours] = useState<boolean>(false)

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("")
  const [focused, setFocused] = useState<boolean>(false)
  const [createCatMode, setCreateCatMode] = useState<boolean>(false)
  
  const dispatch = useDispatch()

  useEffect(()=> {
    if(newProduct === false){
      setMarqueInput(singleProduct.marque)
      setNomInput(singleProduct.nom)
      setCategoryInput(singleProduct.categorie.nom)
      setQtyInput(singleProduct.qty.toString())
      setStockLimite(singleProduct.stockLimite.toString())
      setTelFournisseur(singleProduct.telFournisseur)
      setWebSite(singleProduct.siteFournisseur)
      setCommandeEnCours(singleProduct.commandeEncours)

      selectedCategoryName ==="" && setSelectedCategoryName(singleProduct.categorie.nom)
    }
  }, [selectedCategoryName])


  const onValuePickerChange = (name: string) : void=>{
    if(name !== "Nouvelle catégorie"){
      const chosenCat: Category[] = allCategories.filter((cat: Category) => cat.nom === name)

      dispatch(getSingleCategory(chosenCat[0]))
      setSelectedCategoryName(name)

    } else {
      setCreateCatMode(true)
    }
  }

  const validateNewCategory = (realm: Realm, newCategoryName: string): void=>{
    const catExists = allCategories.filter((cat: Category)=> cat.nom === newCategoryName.trim())

    if(catExists.length <1){
      createNewCategory(realm, newCategoryName.trim())
      setSelectedCategoryName(newCategoryName.trim())

      setCreateCatMode(false)

      dispatch(getSingleCategory(null))
      setCategoryInput('')

    } else {
      showToast("error","Attention !", "La catégorie existe déjà !")

    }  
  }

  const createOrModifyProduct = (createNewProduct: boolean)=>{
    const catId = allCategories.filter((cat: Category)=> cat.nom === selectedCategoryName.trim())
    const cat: Category = fetchCategoryById(realm, catId[0]._id)

    const obj: Product = {
      _id: createNewProduct === true ? data : singleProduct._id,
      codeBarType: createNewProduct === true ? type : singleProduct.codeBarType,
      nom: nomInput.trim(),
      marque: marqueInput.toUpperCase().trim(),
      qty: +qtyInput,
      stockLimite: +stockLimite,
      categorie: cat,
      telFournisseur: telFournisseur.trim(),
      siteFournisseur : webSite.trim(),
      commandeEncours: createNewProduct? false : commandeEncours
    }

    createNewProduct === true ? createProduct(realm, obj) : updateProduct(realm, obj)
    dispatch(hideModal())
    setCreateCatMode(false)
    dispatch(getSingleProduct(null))

    setTimeout(()=>{
      dispatch(unscan())
    }, 3000)

    dispatch(resetCodeBarData())
  }

  return (
    <View>
      <Text style={styles.title}>{newProduct ? "Nouveau produit": "Modifier les infos produit"}</Text>
      <View style={{marginVertical:10, alignItems:"center"}}>
        <Text>Code-barre de type 
          <Text style={styles.type}> {newProduct || type !== null ? type : newProduct === false ? singleProduct.codeBarType : "inconnu"}</Text> 
          <Text> & n° </Text>
          <Text style={styles.type}>{newProduct || type !== null ? data : singleProduct._id}</Text>
        </Text>
      </View>
      {
        newProduct &&
        <Text style={{textAlign:"center"}}>Renseignez les informations suivantes :</Text>
      }
      
      <SafeAreaView style={styles.bodyModal}>
        <TextInPutComponent
          label="Nom du produit"
          setter={setNomInput}
          stateValue={nomInput}
        />
        <TextInPutComponent
          setter={setMarqueInput}
          stateValue={marqueInput}
          label="Fabricant"
          autoCapitalize='characters'
        />
        <CategoryPicker
          focused={focused}
          onValuePickerChange={onValuePickerChange}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          categoryInput={categoryInput}
          setCategoryInput={setCategoryInput}
          createCatMode={createCatMode}
          setCreateCatMode={setCreateCatMode}
          validateNewCategory = {validateNewCategory}
          realm={realm}
          selectedCategoryName={selectedCategoryName}
        />

        <TextInput
          mode='outlined'
          label="Quantité à rentrer"
          value={qtyInput.toString()}
          activeOutlineColor="#337171"
          outlineColor='#c4cfd4'
          onChangeText={text => setQtyInput(text)}
          onFocus={()=>setQtyInput("")}
          onBlur={()=>setQtyInput(prev => prev !== "" ? qtyInput : "1")}
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
            value={telFournisseur}
            activeOutlineColor="#a25553"
            outlineColor='#c4cfd4'
            onChangeText={text => setTelFournisseur(text)}
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

        <View style={globalStyles.flexRowButtons}>
          <Button
            mode='contained'
            color='red'
            icon='close'
            style={{marginHorizontal:5}}
            onPress={() => {
              dispatch(hideModal())
              dispatch(resetCodeBarData())
              setTimeout(()=>{
                dispatch(unscan())
              }, 2000)
            }}
          >
            Annuler
          </Button>

          <Button
            mode='contained'
            icon='check-bold'
            color='green'
            style={{marginHorizontal:5}}
            onPress={() => createOrModifyProduct(newProduct)}
          >
            Valider les infos
          </Button>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default ProductForm

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