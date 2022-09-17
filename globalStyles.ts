import { StyleSheet } from "react-native";
import { black } from "react-native-paper/lib/typescript/styles/colors";

const globalStyles = StyleSheet.create({
  loader : {
    flex: 1,
    justifyContent : "center",
    alignItems: "center",
    width:"100%",
    height: "100%"
  }, 
  input : {
    marginBottom:10,
    fontSize:15, 
    padding:0,
    width: '100%'
  },

  screenTitle: {
    fontSize: 20,
    textAlign:"center",
    fontFamily:"Roboto_900Black"
  },
  infoQty: {
    width: "25%",
    justifyContent: "center",
    alignItems: 'center',
    fontFamily: "Rubik_300Light"
  },
  categorie: {
    fontSize: 12.5,
    fontFamily: "Inter_500Medium",
    marginVertical:2.5,
    alignSelf: 'center'
  },
  marque: {
    fontSize: 20,
    fontFamily: "Rubik_500Medium_Italic",
    marginVertical:2.5
  },
  nom: {
    fontSize: 17,
    fontFamily: "Rubik_600SemiBold_Italic",
    marginVertical:2.5,
    alignSelf: 'center'
  },
  qty: {
    fontFamily: "Rubik_600SemiBold",
  },
  inpuQty : {
    marginBottom:10,
    fontSize:15, 
    padding:0,
    width:175,
    textAlign: "center"
  },
  buttonRow:{
    flexDirection:"row",
    justifyContent:'space-around'
  },
  seeContainer: {
    borderColor: "black",
    borderWidth:1
  },
  roundButton: {
    width:75,
    height: 75,
    borderRadius:75,
    position: "absolute",
    right:50,
    bottom:20
  },
  flexRowButtons: {
    flexDirection:"row",
    marginHorizontal:10,
    marginVertical:15,
    justifyContent:"center"
  },
  flexRow : {
    flexDirection:"row",
  }
})

export default globalStyles