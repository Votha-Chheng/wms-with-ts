import { Category } from "../models/Category";
import { setInitialToUpperCase, showToast } from "../../utils";

export const fetchAllCategories = (realm: Realm) : Category []=>{
  let finalArray: Category[]
  const categories = realm.objects("Category").sorted("nom")

  const categoriesList: Category[] = categories.map((cat: any)=> new Category(cat._id, cat.nom))
  
  finalArray = [...categoriesList]
  
  return finalArray
}



export const createNewCategory = (realm: Realm, categoryExisting: string)=>{
  realm.write(()=>{
    realm.create("Category", {
      _id: +Date.now(),
      nom : setInitialToUpperCase(categoryExisting.trim()) 
    })
  })

  const newCat: Category[] = fetchAllCategories(realm).filter((cat: Category) => cat.nom === setInitialToUpperCase(categoryExisting.trim()))

  if(newCat.length !== 0){
    showToast("success", "Parfait !", "Nouvelle catégorie créée.")
    return newCat[0]

  } else {
    console.log("NewCat is not created.")
    return null
  }
  
}
