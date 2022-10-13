import { StyleSheet, View } from 'react-native'
import React, {FC} from 'react'
import globalStyles from '../../globalStyles'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import DeleteCategoryOption from '../components/DeleteCategoryOption'
import ModifyCategoryOption from '../components/ModifyCategoryOption'

export type DeleteCategoryScreenProps = {
  realm: Realm
}

const DeleteCategoryScreen: FC<DeleteCategoryScreenProps> = ({realm}: DeleteCategoryScreenProps) => {

  const {chosenOptionMenu} = useSelector((state: RootState)=> state.categoryTopMenu)

  return (
    <View style={globalStyles.container}>
      {
        chosenOptionMenu === "supprimer" ? 
        <DeleteCategoryOption realm={realm} /> : 
        <ModifyCategoryOption realm={realm}/>
      }
    </View>
  )
}

export default DeleteCategoryScreen

const styles = StyleSheet.create({
  title: {
    marginVertical:7.5, 
    fontSize:15, 
    fontFamily:"Inter_600SemiBold",
    textAlign: "center",
    padding:10
  },
  warning: {
    borderWidth:2, 
    borderColor: "#b20645",
    backgroundColor:"white",
    marginBottom:25,
    marginTop:10
  },
  warningText: {
    fontSize: 11.5, 
    fontFamily:"Inter_500Medium", 
    padding:10,
    color:"#b20645"
  }, 
  renderItem: {
    backgroundColor:"#ffad5c" ,
    borderRadius: 5,
    borderColor: "grey",
    borderWidth:2,
    marginVertical:7.5,
    flexDirection:"row",
    alignItems:"flex-start",
    justifyContent: "space-between"
  },
  renderItemText: {
    padding: 10
  }
})