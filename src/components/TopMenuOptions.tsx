import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Chip } from 'react-native-paper'

const TopMenuOptions = () => {
  const [optionSelected, setOptionSelected] = useState<string>("")

  return (
    <View style={styles.filterContainer}>
      <Text style={{textAlign:"center", fontFamily:"Inter_600SemiBold", backgroundColor:"white", fontSize:15}}>Filtrer par</Text>
      <View style={styles.filters}>
        <Chip style={styles.chipStyle} selected={optionSelected === ""} icon="cancel" onPress={() => setOptionSelected("")}>Aucun</Chip>
        <Chip style={styles.chipStyle} selected={optionSelected === "marque"} icon="watermark" onPress={() => setOptionSelected("marque")}>Marque</Chip>
        <Chip style={styles.chipStyle} selected={optionSelected === "catégorie"} icon="shape" onPress={() => setOptionSelected("catégorie")}>Catégorie</Chip>
        <Chip style={styles.chipStyle} selected={optionSelected === "nom"} icon="form-textbox" onPress={() => setOptionSelected("nom")}>Nom</Chip>
      </View>
    </View>
  )
}

export default TopMenuOptions

const styles = StyleSheet.create({
  filterContainer: {
    height: 80,
    paddingVertical:5
  },
  filters: {
    flexDirection: 'row',
    justifyContent: "center"
  },
  chipStyle: {
    marginRight:3
  }
})