import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, IconButton, Modal, Portal, Provider, TextInput } from 'react-native-paper'
import React, { FC, useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { hideModal, showModal } from '../store/slices/modal'
import { getCameraPermission } from '../store/slices/cameraPermission'
import Loader from '../components/Loader'
import LaunchCam from '../components/LaunchCam'
import { scan, unscan } from '../store/slices/scanning'
import { getData, getType, resetCodeBarData } from '../store/slices/dataBarCode'
import { Product } from '../models/Product'
import EnterProduct from '../components/EnterProduct'
import ManualCodeBar from '../components/ManualCodeBar'
import RoundButton from '../components/RoundButton'
import { getSingleCategory, getSingleProduct } from '../store/slices/productsAndCategories'
import ModifyOrEnterNewProduct from '../components/ModifyOrEnterNewProduct'

type ScanInScreenProps = {
  realm: Realm
}

const ScanInScreen:FC<ScanInScreenProps> = ({realm}: ScanInScreenProps) => {
  
  const {visible} = useSelector((state: RootState) => state.modalVisible)
  const {cameraStatus, loading, errorCam} = useSelector((state: RootState) => state.cameraPermission)
  const {scanned} = useSelector((state: RootState) => state.scanning)
  const {allProducts, singleProduct} = useSelector((state: RootState) => state.productAndCategories)

  const [manualMode, setManualMode] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    dispatch(getCameraPermission())
    dispatch(unscan())
    dispatch(hideModal())

    return()=>{
      dispatch(resetCodeBarData())
      dispatch(hideModal())
      dispatch(unscan())
      dispatch(getSingleCategory(null))

    }
  }, [])


  const productExistOrNot = (codeBarData: string)=>{
    if(allProducts){
      const product: Product[] = allProducts.filter((prod: Product) => prod._id === codeBarData)

      if(product.length === 0){
        dispatch(getSingleProduct(null))
        

      } else {
        dispatch(getSingleProduct(product[0]))

        singleProduct !== null && console.log("SingleProduct: " + singleProduct.nom)
      }
    }
  }

  const handleBarCodeScanned = ({ type, data }) => {
    dispatch(scan())
    dispatch(getData(data))
    dispatch(getType(type))
    productExistOrNot(data)
    dispatch(showModal())
    console.log(singleProduct)
  }

  const handleBarManualCode = (barcode: string) => {
    dispatch(getData(barcode))
    productExistOrNot(barcode)
    setManualMode(false)
    dispatch(showModal())
  }

  if(loading){
    return (
      <Loader color='green'/>
    ) 

  } else if (cameraStatus === null){   
    return (
      <LaunchCam/>  
    )

  } else if(cameraStatus === "granted"){
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Provider>
          <Portal>
            <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modalStyle}>
              {
                singleProduct !== null ?
                <EnterProduct realm={realm} /> :
                <ModifyOrEnterNewProduct realm={realm} newProduct={true} />
              }
              
            </Modal>
          </Portal>
        </Provider>
        {
          visible === true ?
          null :
          manualMode === false ?
          <RoundButton setManualMode={setManualMode} backgroundColor='green' /> :
          manualMode === true ?
          <ManualCodeBar setManualMode={setManualMode} handleValidation={handleBarManualCode} /> :
          null
        }
      </View>
    )

  } else if(cameraStatus === "denied" || errorCam){
    return (
      <View>
        <Text style={{fontFamily:"Inter_900Black"}}>
          Un problème est survenu. Assurez-vous d'avoir donné la permission pour accéder à la caméra. Si le problème persiste, redémarrez l'application.
        </Text>
        <Button onPress={()=>dispatch(getCameraPermission())}>
          Relancer la caméra
        </Button>
      </View>
    )
  }
}


export default ScanInScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#11e48f',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  subContainer: {
    flex:1,
    alignSelf:"flex-end",
    width:"100%",
    height:100,
    backgroundColor: "#fff",
  },
  modalStyle : {
    backgroundColor: 'white', 
    paddingVertical: 10,
    fontWeight: '900'
  }
})