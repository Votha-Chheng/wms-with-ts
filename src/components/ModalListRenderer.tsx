import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { Product } from '../models/Product'
import { Modal, Portal, Provider } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import DisplayProductInfos from './DisplayProductInfos'
import { hideModal } from '../store/slices/modal'
import { getSingleProduct } from '../store/slices/productsAndCategories'
import { renderColorText } from '../../utils'
import ModifyOrEnterNewProduct from './ModifyOrEnterNewProduct'

type ModalListRendererProps = {
  realm: Realm
  modify: boolean
  setModify: Function
  localSingleProduct: Product
}

const ModalListRenderer: FC<ModalListRendererProps> = ({realm, modify, setModify, localSingleProduct}: ModalListRendererProps) => {

  const {singleProduct} = useSelector((state: RootState)=> state.productAndCategories)

  const {visible} = useSelector((state: RootState) => state.modalVisible)

  const dispatch = useDispatch()

  const onDismissModal = ()=>{
    dispatch(hideModal())
    setModify(false)
    dispatch(getSingleProduct(null))
    
  }

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible} 
          dismissable={false}
          onDismiss={onDismissModal} 
          contentContainerStyle={[
            styles.modalStyle, 
            {
              justifyContent:"flex-start", 
              backgroundColor:`${
                modify ? "white" 
                : renderColorText(localSingleProduct || singleProduct, false, "red", "white", "orange")
              }`
            }
          ]}
        >
          {
            localSingleProduct !== null && modify === true
            ?
            <ModifyOrEnterNewProduct 
              realm={realm}
              newProduct={false}
            />
            :
            localSingleProduct !== null && modify === false 
            ? 
            <DisplayProductInfos 
              realm={realm} 
              setModify={setModify}
              localSingleProduct = {localSingleProduct}
            />
            :
            null
          }
        </Modal>
      </Portal>
    </Provider>
  )
}

export default ModalListRenderer

const styles = StyleSheet.create({
  modalStyle : {
    backgroundColor: 'white', 
    paddingVertical: 10,
    fontWeight: '900',
  }
})