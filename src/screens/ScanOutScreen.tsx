import { StyleSheet, Text, View } from 'react-native'
import { Button, Modal, Portal, Provider } from 'react-native-paper'
import React, { FC, useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { hideModal, showModal } from '../store/slices/modal'
import { getCameraPermission } from '../store/slices/cameraPermission'
import Loader from '../components/Loader'
import LaunchCam from '../components/LaunchCam'
import ConsumeProduct from '../components/ConsumeProduct'
import { Product } from '../models/Product'
import { newQtyToNumber, showToast } from '../../utils'
import { scan, unscan } from '../store/slices/scanning'
import { getData, getType, resetCodeBarData } from '../store/slices/dataBarCode'
import RoundButton from '../components/RoundButton'
import ManualCodeBar from '../components/ManualCodeBar'

type ScanOutScreenProps = {
  realm: Realm
  allProducts: Product[]
}
const ScanOutScreen:FC<ScanOutScreenProps> = ({realm, allProducts}: ScanOutScreenProps) => {

  const [productExists, setProductExists] = useState<boolean>(false)
  const [productAsProp, setProductAsProp] = useState<any>(null)
  const [qtyOut, setQtyOut] = useState<string>("1")
  const [manualMode, setManualMode] = useState<boolean>(false)

  const {data, type} = useSelector((state: RootState) => state.codeBarDataType)
  const {scanned} = useSelector((state: RootState) => state.scanning)
  const {visible} = useSelector((state: RootState) => state.modalVisible)
  const {cameraStatus, loading, errorCam} = useSelector((state: RootState) => state.cameraPermission)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    dispatch(getCameraPermission())
    dispatch(unscan())
    dispatch(hideModal())

    return()=>{
      dispatch(resetCodeBarData())
      dispatch(hideModal())
      dispatch(unscan())

    }
  }, [])

  const productExistOrNot = (data: number)=>{
    const product = realm.objectForPrimaryKey("Product", data.toString())

    if(product === undefined || product === null){
      console.log("Product is undefined.")
      setProductExists(false)

    } else {
      console.log("From ScanInScreen : " + product)
      setProductExists(true)
      setProductAsProp(product)

    }  
  }

  const validateQtyOut = (): void=>{
    const product:any = realm.objectForPrimaryKey("Product", data)

    if(product.qty - newQtyToNumber(qtyOut) < 0) {
      showToast("error", `Quantité à retirer trop grande : ${qtyOut} !`, `Le stock actuel est de ${product.qty} unités.`)
    
    } else {
      realm.write(()=>{
        product.qty -= newQtyToNumber(qtyOut)
        setProductAsProp(product)

      })

      const productUpdated:any = realm.objectForPrimaryKey("Product", data)

      dispatch(hideModal())
      showToast("success", "Stock mis à jour", `${productUpdated.nom} : ${productUpdated.qty} unités.`)
          
      setTimeout(()=>{
        dispatch(unscan())
      }, 1500)

      dispatch(resetCodeBarData())
      setQtyOut("1")
    } 
  }

  const cancelQtyOut = ()=>{
    dispatch(hideModal())
    setTimeout(()=>{
      dispatch(unscan())
    }, 3000)
    dispatch(resetCodeBarData())
    setQtyOut("1")
    showToast("info", "Stock inchangé", "Mise à jour du stock annulée.")
  }

  const handleBarCodeScanned = ({ type, data }) => {
    dispatch(scan())
    dispatch(getData(data))
    dispatch(getType(type))
    dispatch(showModal())
    productExistOrNot(data)
  }

  const handleBarManualCode = (code: string) => {
    dispatch(getData(code))
    setManualMode(false)
    dispatch(showModal())
    productExistOrNot(+code)
  }

  if(loading){
    return (
      <Loader color='orange'/>
    ) 
  } else {
    if (cameraStatus === null) {
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
                  productExists
                  ?
                  <ConsumeProduct product={productAsProp} qtyOut={qtyOut} setQtyOut={setQtyOut} validateQtyOut={validateQtyOut} cancelQtyOut={cancelQtyOut} data={data} />
                  :
                  <View>
                    <Text style={styles.messageError}>Ce code-barre ne correspond à aucun produit dans l'inventaire. Rentrez-le dans l'inventaire d'abord.</Text>
                    <View style={{alignItems:'center'}}>
                      <Button 
                        style={{width:150}}
                        color="#1C9CEA" 
                        mode="contained" 
                        onPress={()=>{
                          dispatch(hideModal())
                          dispatch(unscan())
                        }}>
                        Retour
                      </Button>
                    </View>
                    
                  </View>
                }
              </Modal>
            </Portal>
          </Provider>
          {
            visible === true 
            ?
            null
            :
            manualMode === false
            ?
            <RoundButton setManualMode={setManualMode} backgroundColor='orange' />
            :
            manualMode === true 
            ?
            <ManualCodeBar setManualMode={setManualMode} handleValidation={handleBarManualCode} />
            :
            null
          }
        </View>
      )

    } else if(cameraStatus === "denied" || errorCam){
      return <Text>Un problème est survenu avec la caméra. Veuillez redémarrez l'application.</Text>

    }
  }
}

export default ScanOutScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'orange',
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
    padding: 20,
  },
  messageError: {
    fontFamily:"Inter_600SemiBold",
    fontSize:17.5,
    marginVertical:10,
    color:'#1C9CEA',
    letterSpacing:2
  }
})



