import { View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ScanInScreen from './ScanInScreen'
import ScanOutScreen from './ScanOutScreen'
import { IconButton } from 'react-native-paper'
import ListeProduitsScreen from './ListeProduitsScreen'
import ProductSchema from '../models/Product'
import CategorySchema from '../models/Category'
import { showToast } from '../../utils'
import { fetchAllProducts, fetchProductsAlert } from '../actions/productActions'
import { fetchAllCategories } from '../actions/categoryActions'
import OptionScreen from './OptionScreen'
import { useDispatch } from 'react-redux'
import { hideModal } from '../store/slices/modal'
import Realm from 'realm'
import { getAllCategories, getAllProducts } from '../store/slices/productsAndCategories'


export type RootStackParams = {
  EntrerProduits: undefined,
  ConsommerProduits: undefined,
  ListeProduits: undefined,
  Options: undefined,
  DeleteProduct : undefined
};

const NavigationScreen:FC = () => {
  const [realm, setRealm] = useState<Realm>(null)
  const [badge, setBadge] = useState<number>(null)

  const RootTab = createBottomTabNavigator()

  const dispatch = useDispatch()

  const closeRealm = (realm: Realm)=>{
    if(realm !== null && !realm.isClosed){
      realm.close()

    }
  }

  useEffect(()=>{
    let productsList: any, categoryList: any

    Realm.open({
      path:"myrealm",
      schema: [ProductSchema, CategorySchema],
      deleteRealmIfMigrationNeeded: true,
    })
    .then(realm => {
      setRealm(realm)
      const products = fetchAllProducts(realm)
      const categories = fetchAllCategories(realm)
      dispatch(getAllProducts(products))
      dispatch(getAllCategories(categories))
      setBadge(fetchProductsAlert(realm))

      productsList = realm.objects("Product")
      categoryList = realm.objects("Category")

      try {    
        productsList.addListener(()=>{
          const products = fetchAllProducts(realm)
          dispatch(getAllProducts(products))
          setBadge(fetchProductsAlert(realm))
        })
        categoryList.addListener(()=>{
          const categories = fetchAllCategories(realm)
          dispatch(getAllCategories(categories))
        })
        
      } catch (err) {
        showToast("error", "Erreur : Mise à jour de l'inventaire", "L'inventaire n'a pas été mis à jour. Recommencez.")
        console.log(err.message)
        return err.message
      }
    })

    return()=>{
      productsList.removeAllListeners()
      categoryList.removeAllListeners()
      closeRealm(realm)
    }
  }, [])


  return (
    <NavigationContainer>
      <View>
        <StatusBar style="dark" />
      </View>
      <RootTab.Navigator
        initialRouteName='Rentrer'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string

            if (route.name === 'Rentrer') {

              if( focused){
                iconName = 'arrow-down-bold'
                color = "green"
                size = 30
              } else {
                iconName = 'arrow-down-bold-outline'
                color = "grey"
                size = 20
              }
                
            } else if (route.name === 'Consommer') {

              if(focused){
                iconName = 'arrow-up-bold'
                color = "orange"
                size = 30
              } else {
                iconName = 'arrow-up-bold-outline'
                color = "grey"
                size = 20
              }

            } else if (route.name === 'Inventaire') {
              iconName = 'clipboard-list-outline'

              if(focused){
                color = "purple"
                size = 25
              } else {
                color = "grey"
                size = 20
              }
            } else if (route.name === 'Options') {
              iconName = "dots-vertical"

              if(focused){
                color = "red"
                size = 25
              } else {
                color = "grey"
                size = 20
              }
            }

            // You can return any component that you like here!
            return <IconButton icon={iconName} color={color} size={size} animated={true}/>;
          },
          tabBarActiveTintColor : (route.name === "Rentrer" ? "green" : route.name === "Consommer" ? "orange" : route.name === "Inventaire" ? "purple" : "red"),
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle : {
            paddingBottom : 7.5,
            marginTop:-5,
            fontSize : 12,
            fontWeight: "bold",
            width:75
          }
        })}
      >
        <RootTab.Screen 
          name="Rentrer" 
          children={()=> <ScanInScreen realm={realm} /> }
          options={{title:"Rentrer", unmountOnBlur:true, headerShown: false}}
        />
        <RootTab.Screen 
          name="Consommer" 
          children={()=> <ScanOutScreen realm={realm} /> }
          options={{title:"Consommer", unmountOnBlur:true, headerShown: false}}
        />
        <RootTab.Screen 
          name="Inventaire"
          children={()=> <ListeProduitsScreen realm={realm}/> }
          options={badge>0 ? { tabBarBadge: badge, headerShown: false } : {headerShown: false}}
        />
        <RootTab.Screen 
          name="Options" 
          children={()=> <OptionScreen realm={realm} /> }
          options= {{headerShown: false}}
          listeners={({navigation}) => ({
            tabPress: () => {
              dispatch(hideModal())
              navigation.navigate("Options")
            }
          }) }
        />
      </RootTab.Navigator>
    </NavigationContainer>
  )
}

export default NavigationScreen