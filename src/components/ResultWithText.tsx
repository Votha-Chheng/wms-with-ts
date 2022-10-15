import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { selectMarqueOrCategory } from '../store/slices/selectedMarqueOrCategory'
import { Chip } from 'react-native-paper'
import { changeFilters } from '../store/slices/filters'

export type ResultWithTextProps = {
  listProduct: string []
}

const ResultWithText: FC<ResultWithTextProps> = ({listProduct}: ResultWithTextProps) => {

  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)
  const {filters} = useSelector((state: RootState)=> state.filters)
  const {parType} = filters

  const dispatch = useDispatch()

  const onPressToChooseItem = (item: any)=>{
    if(selectedMarqueOrCategory === item.item.toString()){
      dispatch(selectMarqueOrCategory(null))
      dispatch(changeFilters({...filters, dateEntree: false, recent: null}))    

    } else {
      dispatch(selectMarqueOrCategory(item.item.toString()))
      dispatch(changeFilters({...filters, dateEntree: true, recent: true}))
  
    }
  }

  return (
    <View>
      <FlatList
        data={listProduct}
        horizontal={true}
        renderItem = {item => (
          <Chip 
            style={{backgroundColor:`${(selectedMarqueOrCategory === item.item.toString()) || selectedMarqueOrCategory === null ? "#bac9c4" : "#dfe1e1"}` , marginHorizontal:5, borderColor: "grey"}}
            selectedColor={`${(selectedMarqueOrCategory === item.item.toString()) || selectedMarqueOrCategory === null ? "#343233" : "#95959d"}`}
            selected={selectedMarqueOrCategory === item.item.toString()}
            onPress = {()=> onPressToChooseItem(item)}
          >
            <Text>{item.item.toString()}</Text>
          </Chip>
        )}
        keyExtractor={item => item.toString()}
      />

    </View>
  )
}

export default ResultWithText

const styles = StyleSheet.create({})