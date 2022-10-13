import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper';
import React, { FC } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionStackParams } from './OptionScreen';

export type HomeOptionsProps={
  realm: Realm
}

const HomeOptionScreen : FC<HomeOptionsProps> = ({realm}) => {

  const navigation = useNavigation<NativeStackNavigationProp<OptionStackParams>>()

  return (
    <View style={styles.container}>
      <Button 
        icon="arrow-down-bold" 
        color='red' 
        mode="contained" 
        onPress={() => navigation.navigate("Supprimer des produits")}
        style={styles.buttonStyle}
      >
        Supprimer produits
      </Button>
      <Button 
        icon="arrow-down-bold" 
        color='orange' 
        mode="contained" 
        onPress={() => navigation.navigate("Gestion des catégories")}
        style={styles.buttonStyle}
      >
        Gérer les catégories
      </Button>
    </View>
  )
}

export default HomeOptionScreen

const styles = StyleSheet.create({
  modalStyle : {
    backgroundColor: 'white', 
    paddingVertical: 10,
    fontWeight: '900',
    height:"100%",
  },
  container : {
    height:"100%",
    flex:1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  buttonStyle: {
    marginHorizontal:25,
    marginVertical:20,
    width:"80%",
    borderRadius:30
  }
})
