import { Alert } from "react-native"
import Toast from 'react-native-toast-message';
import { Product } from "./src/models/Product";

export const createButtonAlert = (titre: string, messageAlert:string, onPressFunction:any, args:any[]) : void => {

  function callbackStarter () {
    const arg = [...arguments].concat(args)
    onPressFunction(...arg)
    console.log(arg)
  }

  Alert.alert(
    titre,
    messageAlert,
    [
      { 
        text: "Je confirme", 
        onPress: () => {
          callbackStarter()
        },
        style: "default"
      },
      { 
        text: "Annuler", 
        onPress: () => {
          null
        },
        style:"cancel" 
      }

    ]
  )
}


export const showToast = (type: string, message1: string, message2: string): void =>{
  Toast.show({
    type,
    text1: message1,
    text2:  message2,
    topOffset: 150,
    visibilityTime:2500
  });
}


export const newQtyToNumber = (qty: string) : number=>{
  return qty === "" ? 0 : parseInt(qty)
}

export const setInitialToUpperCase = (text: string): string =>{
  const bareText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  const initial = bareText.charAt(0).toUpperCase()
  const restOfString = bareText.slice(1).toLowerCase()

  return initial.concat('', restOfString)
}


export const resetStringInput = (setFunction: Function)=>{
  setFunction("")
}


export const spaceTelFournisseur = (tel: string): string => {
  let arrTel: string[] = []
  let num : string

  if(tel){
    for(let i = 0; i<=tel.length; i++){
      num = tel.charAt(i)
      if(i%2===0 && tel.length>1 && i>0){
        arrTel = [...arrTel, " ", num]

      } else {
        arrTel = [...arrTel, num]

      }
    }
  }
  
  return arrTel.join("")
}


export const onChangeSpaceTel = (tel: string): string=>{
  let arrTel: string[] = tel.split("").filter(item => item !== " ")
  return spaceTelFournisseur(arrTel.join(""))

}


export const renderColorText = (product: Product, forText: boolean, colorAlert: string, colorNormal: string, colorCommande: string = "orange") : string =>{
  if(forText === true){
    return product.qty <= product.stockLimite ? colorAlert : colorNormal
    
  } else {
    return (product.qty <= product.stockLimite) && product.commandeEncours === true ? colorCommande : product.qty <= product.stockLimite ? colorAlert : colorNormal

  }
}


export const sortHandle = (filters: any, a: any, b: any, typeSecond: string = "")=> {
  const {parType} = filters

  let x = typeSecond === "" ? a[parType.toString()] : a[parType.toString()][typeSecond]
  let y = typeSecond === "" ? b[parType.toString()] : b[parType.toString()][typeSecond]

  return ((x < y) ? -1 : ((x > y) ? 1 : 0))

}


export const replaceCollection = (elementToScan: any)=>{
  return (
    elementToScan
      .toLowerCase()
      .replace(/[û, ü, ù]/g, "u")
      .replace(/[é, è, ë, ê]/g, "e")
      .replace(/[â, ä, à]/g, "a")
      .replace(/[ô, ö, à]/g, "o")
      .replace(/[ï, î]/g, "i")
  )
    
}

export const matchingIncludes = (element: Product, keyName:string, textToScan:string)=>{
  const newResearch = replaceCollection(element[keyName])
  const newTextToScan = replaceCollection(textToScan)

  return newResearch.includes(newTextToScan)
}


const handleSearchChange = (text: string, productList: Product[]): Product[]=>{

  if(text.length>1){
    let result = []

    productList.forEach((element: Product) => {
      if(matchingIncludes(element, "nom", text) || matchingIncludes(element, "marque", text)){
        result.push(element)

      }
    })

    return result
  }
}


export const displayProductByFilters = (productList: Product[], filters: any, selectedMarqueOrCategory: string): Product[]=>{
  const { parType, ordreAlphabet, recent, alertStock, searchByText } = filters

  let temp : Product[] = [...productList]

  if(parType === ""){
    temp = recent ? temp.reverse() : temp

    if(searchByText.length>1){
      temp = handleSearchChange(searchByText, temp)

    }
  }

  if(parType === "marque"){
    temp = temp.sort((a,b) => sortHandle(filters, a, b)) 

    if(ordreAlphabet === false){
      temp = temp.reverse()
    }

    if(selectedMarqueOrCategory!==null){
      temp = temp.filter(prod => prod.marque.trim() === selectedMarqueOrCategory)

    } else {
      temp = temp

    }
  }

  if(parType === "categorie"){
    temp = temp.sort((a,b) => sortHandle(filters, a, b, "nom")) 
    
    if(ordreAlphabet === false){
      temp = temp.reverse()
    }

    if(selectedMarqueOrCategory!==null){
      temp = temp.filter(prod => prod.categorie.nom === selectedMarqueOrCategory)

    } else {
      temp = temp
      
    }
  }

  return alertStock === true ? temp.filter(p => p.qty <= p.stockLimite) : temp
}


