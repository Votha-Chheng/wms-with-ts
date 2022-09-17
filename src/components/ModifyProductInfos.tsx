import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import React, { FC, useState } from 'react'
import { Category } from '../models/Category'
import TextInPutComponent from './TextInPutComponent'
import NumericInputComponent from './NumericInputComponent'
import CategoryPicker from './CategoryPicker'
import { createNewCategory } from '../actions/categoryActions'
import { setInitialToUpperCase, showToast } from '../../utils'
import { updateProduct } from '../actions/productActions'
import { Product } from '../models/Product'
import { useDispatch } from 'react-redux'
import { hideModal } from '../store/slices/modal'

type ModifyProductInfosProps = {
  allCategories: Category[]
  displayProduct: Product
  modifyNom: string
  modifyCategory: Category
  modifyMarque: string
  modifyQty: number
  modifyStockLimite: number
  modifyTelFournisseur: string
  modifySiteWeb: string
  setModifyNom: Function
  setModifyCategory: Function
  setModifyMarque: Function
  setModifyQty: Function
  setModifyStockLimite: Function
  setModifyTelFournisseur: Function
  setModifySiteWeb: Function
  setModify: Function
  realm: Realm
}

const ModifyProductInfos: FC<ModifyProductInfosProps> = ({
  allCategories,
  modifyNom,
  modifyCategory,
  modifyMarque,
  modifyQty,
  modifyStockLimite,
  modifyTelFournisseur,
  modifySiteWeb,
  setModifyNom,
  setModifyCategory,
  setModifyMarque,
  setModifyQty,
  setModifyStockLimite,
  setModifyTelFournisseur,
  setModifySiteWeb,
  setModify,
  realm,
  displayProduct

}: ModifyProductInfosProps) => {

  const [categoryFocused, setcategoryFocused] = useState<boolean>(false)
  const [createCatMode, setCreateCatMode] = useState<boolean>(false)
  const [newCategory, setNewCategory] = useState<string>("")

  const dispatch = useDispatch()

  const onValuePickerChange = (name: string) : void=>{
    if(name !== "Nouvelle catégorie"){
      const chosenCat: Category[] = allCategories.filter((cat: Category) => cat.nom === name)

      setModifyCategory(chosenCat[0])

    } else {
      setCreateCatMode(true)
      
    }
  }

  const validateNewCategory = (realm: Realm, newCategory: string): void=>{
    const catExists = allCategories.filter((cat: Category)=> cat.nom === setInitialToUpperCase(newCategory.trim()) )

    if(catExists.length === 0){
      const categoryCreated: Category = createNewCategory(realm, newCategory)
      setCreateCatMode(false)
      setNewCategory('')
      setModifyCategory(categoryCreated)

    } else {
      showToast("error","Attention !", "La catégorie existe déjà !")

    }  
  }

  const validateModifications = ()=>{
    const objectProduct: Product = {
      _id: displayProduct._id,
      codeBarType: displayProduct.codeBarType,
      nom: modifyNom,
      marque: modifyMarque,
      categorie: modifyCategory,
      stockLimite: +modifyStockLimite,
      qty: +modifyQty,
      siteFournisseur: modifySiteWeb.toLowerCase(),
      telFournisseur: modifyTelFournisseur,
      commandeEncours: displayProduct.commandeEncours
    }
    updateProduct(realm, objectProduct)
    dispatch(hideModal())
    showToast("success", "Succès", "Mise à jour réussie.")
  }

  return (
    <View style={{marginHorizontal:5}}>
      <TextInPutComponent
        label="Nom du produit"
        setter={setModifyNom}
        stateValue={modifyNom}
      />
      <TextInPutComponent
        setter={setModifyMarque}
        stateValue={modifyMarque}
        label="Fabricant"
      />
      <View style={{flexDirection: "row", justifyContent:"space-around"}}>
        <NumericInputComponent
          setter={setModifyQty}
          stateValue={modifyQty.toString()}
          label="Stock actuelle"
        />
        <NumericInputComponent
          setter={setModifyStockLimite}
          stateValue={modifyStockLimite.toString()}
          label="Stock limite"
        />
      </View>
      <View>
        <CategoryPicker
          focused={categoryFocused}
          chooseCategory={modifyCategory}
          onValuePickerChange={onValuePickerChange}
          onFocus={()=>setcategoryFocused(true)}
          onBlur={()=>setcategoryFocused(false)}
          newCategory={newCategory}
          onChangeCategory={setNewCategory}
          createNewCategory = {()=>validateNewCategory(realm, newCategory)}
          createCatMode={createCatMode}
          createCatModeToFalse={()=>setCreateCatMode(false)}
          allCategories={allCategories}
        />
      </View>
      <TextInPutComponent
        setter={setModifySiteWeb}
        stateValue={modifySiteWeb}
        label="Site du fournisseur"
        textAffix='https://'
      />
      <TextInPutComponent
        setter={setModifyTelFournisseur}
        stateValue={modifyTelFournisseur}
        label="Tél. du fournisseur"
        keyBoard='phone-pad'
      />

      <View style={{flexDirection: "row", justifyContent:"space-around", marginTop:15}}>
        <Button mode="contained" onPress={()=>setModify(false)} color="orange">
          Annuler
        </Button>
        <Button mode="contained" onPress={()=>validateModifications()}>
          Valider les modifications
        </Button>
      </View>
    </View>
    
  )
}

export default ModifyProductInfos

const styles = StyleSheet.create({})