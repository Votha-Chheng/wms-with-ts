import { ScrollView } from 'react-native'
import React, { FC } from 'react'


import Realm from 'realm'
import ProductForm from './ProductForm'

type NewProductProps = {
  realm: Realm
  newProduct: boolean
}

const ModifyOrEnterNewProduct:FC<NewProductProps> = ({realm, newProduct}: NewProductProps) => {

  return (
    <ScrollView>
      <ProductForm newProduct={newProduct} realm={realm}/>
    </ScrollView>
  )
}

export default ModifyOrEnterNewProduct