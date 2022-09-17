import { FC, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import TopMenuOptions from "../components/TopMenuOptions"
import { Category } from "../models/Category"
import { Product } from "../models/Product"
import { getCameraPermission } from "../store/slices/cameraPermission"
import { resetCodeBarData } from "../store/slices/dataBarCode"
import { hideModal, showModal } from "../store/slices/modal"
import { unscan } from "../store/slices/scanning"
import { AppDispatch } from "../store/store"


type OptionScreenProps = {
  realm: Realm
  allProducts: Product[]
  allCategories: Category[]
}


const OptionScreen: FC<OptionScreenProps> = ({realm, allProducts, allCategories}: OptionScreenProps) => {
  
  const [chosenOption, setChosenOption] = useState<string>("")

  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    if(chosenOption === ""){
      dispatch(hideModal())
    }

  }, [chosenOption])

  useEffect(()=>{
    dispatch(getCameraPermission())
    dispatch(unscan())
    dispatch(hideModal())
    setChosenOption("")

    return()=>{
      dispatch(resetCodeBarData())
      
      dispatch(unscan())

    }
  }, [])

  useEffect(()=>{
    return()=>{
      dispatch(hideModal())
    }
  }, [])

  const deleteAllObjects = ()=>{
    realm.write(()=>{
      realm.deleteAll()
    })
  }

  const chooseOption = (text: string)=>{
    setChosenOption(text)
    dispatch(showModal())
  }

  return (
    <View style={styles.container}>
      <TopMenuOptions/>
      {/* <View style={{height:"100%", justifyContent:"center"}}>
        <Button style={{marginVertical:15}} onPress={()=>chooseOption("categories")}>
          Gestion des catégories
        </Button>
        <Button style={{marginVertical:15}}  onPress={()=>deleteAllObjects()}>
          Supprimer tous les produits
        </Button>
      </View> */}
      {/* <Provider>
        <Portal>
          <Modal visible={visible && chosenOption !==""} onDismiss={()=>setChosenOption("")} contentContainerStyle={styles.modalStyle}>
            {
              chosenOption === "categories" 
                ? <CategoriesScreen realm={realm} setChosenOption={setChosenOption} allProducts={allProducts} allCategories={allCategories} />
                : null
            }
          </Modal>
        </Portal>
      </Provider> */}
    </View>
  )
}

const styles = StyleSheet.create({
  modalStyle : {
    backgroundColor: 'white', 
    paddingVertical: 10,
    fontWeight: '900',
    height:"100%",
  },
  container: {
    height:"100%",
    flex:1,
    backgroundColor: 'white',
    //alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
})

export default OptionScreen