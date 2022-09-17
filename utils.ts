import { Alert } from "react-native"
import Toast from 'react-native-toast-message';


export const createButtonAlert = (titre: string, messageAlert:string, onPressFunction:any) : void => {
  Alert.alert(
    titre,
    messageAlert,
    [
      { 
        text: "OK", 
        onPress: () => {
          onPressFunction
        } }
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


