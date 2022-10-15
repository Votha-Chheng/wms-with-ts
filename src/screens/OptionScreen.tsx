import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { resetCodeBarData } from "../store/slices/dataBarCode"
import { hideModal } from "../store/slices/modal"
import { unscan } from "../store/slices/scanning"
import DeleteCategoryScreen from "./DeleteCategoryScreen"
import DeleteProductScreen from "./DeleteProductScreen"
import HomeScreen from "./HomeOptionScreen"

const Stack = createNativeStackNavigator()

type OptionScreenProps = {
  realm: Realm
}

export type OptionStackParams = {
  DeleteProduct : undefined
  "Gestion des catégories": undefined
  "Supprimer des produits": undefined
};

const OptionScreen: FC<OptionScreenProps> = ({realm}: OptionScreenProps) => {

  const dispatch = useDispatch()


  useEffect(()=>{
    dispatch(unscan())
    dispatch(hideModal())

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



  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeOptions" component={HomeScreen} options={{headerShown: false}} />
      <Stack.Screen name="Supprimer des produits" children={()=><DeleteProductScreen realm={realm} /> } />
      <Stack.Screen name="Gestion des catégories" children={()=><DeleteCategoryScreen realm={realm} />} />
    </Stack.Navigator>
  )
}

export default OptionScreen