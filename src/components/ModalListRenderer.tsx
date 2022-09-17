import { StyleSheet } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Product } from '../models/Product'
import { Modal, Portal, Provider } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import DisplayProductInfos from './DisplayProductInfos'
import ModifyProductInfos from './ModifyProductInfos'
import { Category } from '../models/Category'
import { hideModal } from '../store/slices/modal'

type ModalListRendererProps = {
  displayProduct: Product
  allCategories: Category[]
  realm: Realm
  setDisplayProduct: Function
  modify: boolean
  setModify: Function
}

const ModalListRenderer: FC<ModalListRendererProps> = ({displayProduct, allCategories, realm, setDisplayProduct, modify, setModify}: ModalListRendererProps) => {

  const [modifyNom, setModifyNom] = useState<string>(null)
  const [modifyCategory, setModifyCategory] = useState<Category>(null)
  const [modifyMarque, setModifyMarque] = useState<string>(null)
  const [modifyQty, setModifyQty] = useState<number>(null)
  const [modifyStockLimite, setModifyStockLimite] = useState<number>(null)
  const [modifyTelFournisseur, setModifyTelFournisseur] = useState<string>(null)
  const [modifySiteWeb, setModifySiteWeb] = useState<string>(null)
  const [modifyCommandeEnCours, setModifyCommandeEnCours] = useState<boolean>(null)

  const {visible} = useSelector((state: RootState) => state.modalVisible)

  const dispatch = useDispatch()

  useEffect(()=>{
    if(displayProduct !==null){
      setModifyNom(displayProduct.nom)
      setModifyCategory(displayProduct.categorie)
      setModifyMarque(displayProduct.marque)
      setModifyQty(displayProduct.qty)
      setModifyStockLimite(displayProduct.stockLimite)
      setModifyTelFournisseur(displayProduct.telFournisseur)
      setModifySiteWeb(displayProduct.siteFournisseur)
      setModifyCommandeEnCours(displayProduct.commandeEncours)
    }
    
  }, [displayProduct])

  const onDismissModal = ()=>{
    dispatch(hideModal())
    setModify(false)
    
  }

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible} 
          dismissable={false}
          onDismiss={onDismissModal} 
          contentContainerStyle={[styles.modalStyle, {justifyContent:"flex-start"}]}
        >
          {
            displayProduct === null 
            ?
            null
            :
            modify 
            ?
            <ModifyProductInfos 
              realm={realm}
              displayProduct={displayProduct}
              modifyNom={modifyNom} 
              modifyCategory={modifyCategory}
              modifyMarque={modifyMarque}
              modifyQty={modifyQty}
              modifyStockLimite={modifyStockLimite}
              modifyTelFournisseur={modifyTelFournisseur}
              modifySiteWeb={modifySiteWeb}
              setModifyNom={setModifyNom}
              setModifyCategory={setModifyCategory}
              setModifyMarque={setModifyMarque}
              setModifyQty={setModifyQty}
              setModifyStockLimite={setModifyStockLimite}
              setModifyTelFournisseur={setModifyTelFournisseur}
              setModifySiteWeb={setModifySiteWeb}
              setModify={setModify}
              allCategories={allCategories}
            />
            :
            <DisplayProductInfos displayProduct={displayProduct} setModify={setModify}/>
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