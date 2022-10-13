import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Chip } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { changeFilters, resetFilters } from '../store/slices/filters'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
import SearchResult from './SearchResult'
import ResultWithText from './ResultWithText'
import { selectMarqueOrCategory } from '../store/slices/selectedMarqueOrCategory'

export type FilterProductsProps = {
  allProducts : Product[]
  allCategories : Category []
}

const FilterProducts: FC<FilterProductsProps> = ({allProducts, allCategories}: FilterProductsProps) => {

  const { filters } = useSelector((state: RootState) => state.filters)
  const { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock, searchByText } = filters

  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)

  const dispatch = useDispatch()

  const getAllMarqueOrCategories = (productList: any[], keyName: string)=>{
    let listMarque = [] 

    productList.forEach((prod: any) =>{
      listMarque =  [ ...listMarque, prod[keyName.toString()].trim()]
    })

    return Array.from((new Set(listMarque))).sort()
  } 


  const filteredResultForMarqueCategory = (liste: string[], recherche: string): string []=>{
    if(recherche.length>2){
      const result = liste.filter((nom: string) => {
        nom.includes(recherche)
      })
      return result

    } else {
      return liste

    }
  }

  return (
    <View style={styles.filterContainer}>
      <Text style={{textAlign:"center", fontFamily:"Inter_600SemiBold", fontSize:15, marginVertical:10}}>Afficher par :</Text>
      <View style={styles.filters}>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === ""} 
          icon="cancel" 
          onPress={() => dispatch(resetFilters())}
        >
          Sans
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={parType === "marque" && alertStock === false} 
          icon="watermark" 
          onPress={() => {
            dispatch(changeFilters({...filters, parType: "marque", ordreAlphabet: true, alphabetique:true, alertStock: false}))
            dispatch(selectMarqueOrCategory(null))
          }}
        >
          Marque
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={(parType === "categorie" && alertStock === false)} 
          icon="shape" 
          onPress={() => {
            dispatch(changeFilters({...filters, parType: "categorie", ordreAlphabet:true, alertStock: false}))
            dispatch(selectMarqueOrCategory(null))
          }}
        >
          Catégorie
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={alertStock === true} 
          icon="alert-outline" 
          onPress={() => dispatch(changeFilters({...filters, alertStock: !alertStock, parType: ""}))}
        >
          Critique
        </Chip>
      </View>
      <View style={{marginVertical:10, height:50}}>
        {
          parType === "" ?
          <SearchResult/> :
          <ResultWithText 
            listProduct={
              filteredResultForMarqueCategory(
                (
                  parType === "marque" ? 
                  getAllMarqueOrCategories(allProducts, "marque") : 
                  getAllMarqueOrCategories(allCategories, "nom")
                ), searchByText 
              )
            }
          />
        }
      </View>
      <Text style={{textAlign:"center", fontFamily:"Inter_600SemiBold", fontSize:15}}>Trier selon :</Text>
      <View style={styles.filters}>
        <Chip 
          style={styles.chipStyle} 
          selected={
            (dateEntree === true && recent === true && parType === ""  && selectedMarqueOrCategory === null) || 
            (dateEntree === true && recent === true && parType === "" && alertStock === true && selectedMarqueOrCategory === null)
          } 
          icon="sort-calendar-ascending"
          disabled={(parType !== "") && (selectedMarqueOrCategory !== null)}
          onPress={() => dispatch(changeFilters({...filters, recent:true, dateEntree: true, alphabetique:false, ordreAlphabet:null}))}
        >
          Récents
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={
            (dateEntree === true &&  recent === false && parType !== "marque" && parType !== "categorie" && selectedMarqueOrCategory === null)
          } 
          icon="sort-calendar-descending" 
          disabled={(parType !== "") && (selectedMarqueOrCategory !== null)}
          onPress={() => dispatch(changeFilters({...filters, recent:false, dateEntree: true, alphabetique:false, ordreAlphabet:null}))}
        >
          Anciens
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={
            alphabetique === true && 
            ordreAlphabet === true && 
            parType !== "" && 
            alertStock === false && 
            selectedMarqueOrCategory === null
          } 
          disabled={
            parType === "" || 
            alertStock === true ||
            selectedMarqueOrCategory !== null
          }
          icon="sort-alphabetical-ascending" 
          onPress={() => dispatch(changeFilters({...filters, recent:null, dateEntree: false, alphabetique: true, ordreAlphabet:true}))}
        >
          A à Z
        </Chip>
        <Chip 
          style={styles.chipStyle} 
          selected={
            alphabetique === true && 
            ordreAlphabet === false && 
            parType !== "" &&  
            alertStock === false &&
            selectedMarqueOrCategory === null
          } 
          disabled={
            parType === "" || 
            alertStock === true ||
            selectedMarqueOrCategory !== null
          }
          icon="sort-alphabetical-descending" 
          onPress={() => dispatch(changeFilters({...filters, recent:null, dateEntree: false, alphabetique: true, ordreAlphabet:false}))}
        >
          Z à A
        </Chip>
      </View>
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
    justifyContent: "center",
    marginBottom:5
  },
  chipStyle: {
    //marginRight:2
  }
})