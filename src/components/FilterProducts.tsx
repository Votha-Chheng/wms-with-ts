import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Chip, IconButton, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { changeFilters } from '../store/slices/filters'
import globalStyles from '../../globalStyles'

const FilterProducts: FC = () => {

  const { filters } = useSelector((state: RootState) => state.filters)
  const { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock } = filters

  const dispatch = useDispatch()

  return (
    <View style={styles.filterContainer}>
      <Text style={{textAlign:"center", fontFamily:"Inter_600SemiBold", backgroundColor:"white", fontSize:15}}>Filtrer par</Text>
      <View style={styles.filters}>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === ""} 
          icon="cancel" 
          onPress={() => dispatch(changeFilters({...filters, parType: ""}))}
        >
          Aucun
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === "nom"} 
          icon="format-title" 
          onPress={() => dispatch(changeFilters({...filters, parType: "nom"}))}
        >
          Nom
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === "marque"} 
          icon="watermark" 
          onPress={() => dispatch(changeFilters({...filters, parType: "marque"}))}
        >
          Marque
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === "catégorie"} 
          icon="shape" 
          onPress={() => dispatch(changeFilters({...filters, parType: "catégorie"}))}
        >
          Catégorie
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === "A racheter"} 
          icon="form-textbox"
          onPress={() => dispatch(changeFilters({...filters, parType: "A racheter"}))}
        >
          Rupture
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={dateEntree === true && recent === true} 
          icon="sort-calendar-ascending"
          onPress={() => dispatch(changeFilters({...filters, recent:true, dateEntree: true, alphabetique:false}))}
        >
          Récents
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={dateEntree === true && recent === false} 
          icon="sort-calendar-descending" 
          onPress={() => dispatch(changeFilters({...filters, recent: false, dateEntree: true, alphabetique:false}))}
        >
          Anciens
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={alphabetique === true && ordreAlphabet === true} 
          icon="sort-alphabetical-ascending" 
          onPress={() => dispatch(changeFilters({...filters, alphabetique: true, ordreAlphabet:true, dateEntree: false}))}
        >
          A à Z
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={alphabetique === true && ordreAlphabet === false} 
          icon="sort-alphabetical-descending" 
          onPress={() => dispatch(changeFilters({...filters, alphabetique: true, ordreAlphabet:false, dateEntree: false}))}
        >
          Z à A
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={alertStock === true} 
          icon="alert-outline" 
          onPress={() => dispatch(changeFilters({...filters, alertStock: !alertStock}))}
        >
          A racheter
        </Chip>
      </View>

      <TextInput label="Chercher un nom" left={<TextInput.Icon name="magnify"/>} mode="outlined" style={{width:"95%", marginLeft:10}}/>

    </View>
  )
}

export default FilterProducts

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical:5,
    marginBottom:15
  },
  filters: {
    flexWrap: "wrap",
    flexDirection: 'row',
    justifyContent: "center"
  },
  chipStyle: {
    marginRight:3
  }
})