import { Category } from "../models/Category";
import { showToast } from "../../utils";

export const fetchAllCategories = (realm: Realm) : Category []=>{
  try {
    let finalArray: Category[]
    const categories = realm.objects("Category").sorted("nom")
  
    const categoriesList: Category[] = categories.map((cat: any)=> new Category(cat._id, cat.nom))
    
    finalArray = [...categoriesList]
    
    return finalArray
    
  } catch (error) {
    console.log(error)
  }
}

export const fetchCategoryById = (realm: Realm, catId: number) : Category=>{
  try {
    const category: any = realm.objectForPrimaryKey("Category", catId)

    if(category !== null || category !== undefined){
      const catInstance = new Category(category._id, category.nom)

      return catInstance

    } else {
      showToast("error", "Intouvable !", "La catégorie est introuvable dans la base de données.")
    }
    
  } catch (err){
    console.log(err)

  }
}

export const fetchCategoryByName = (realm: Realm, name: string) : Category=>{
  try {
    const category: any = realm.objects("Category").filtered(`nom == '${name.trim()}'`)
    console.log("category")

    if(category.length>0){
      const catInstance = new Category(category[0]._id, category[0].nom)

      return catInstance

    } else {
      showToast("error", "Intouvable !", "La catégorie est introuvable dans la base de données.")
    }
    
  } catch (err){
    console.log(err)

  }
}

export const createNewCategory = (realm: Realm, nomCategorie: string)=>{
  try {
    realm.write(()=>{
      realm.create("Category", {
        _id: +Date.now(),
        nom : (nomCategorie.trim().toUpperCase()) 
      })
    })

    showToast("success", "Catégorie créée !", "Une nouvelle catégorie a été ajoutée.")
    
  } catch (error) {
    console.log(error)
    showToast("error", "Echec", error.toString())
  }
  
}


export const changeCategory = (realm: Realm, catId: number, newNameCat: string)=>{
  try {
    const category: any = realm.objectForPrimaryKey("Category", catId)
  
    if(category === null || category === undefined){
      showToast("error", "Echec", "La catégorie semble déjà exister...")
      return null

    } else {
      realm.write(()=>{
        category.nom = newNameCat
      })
      showToast("success", "Parfait !", `Le nom de la catégorie a été modifiée.`)
    }
    
  } catch (error) {
    showToast("error", "Echec", "Une erreur du serveur est survenue ! Intitulé : " + error.toString())
  }
}

export const deleteCategory = (realm: Realm, categoryId: number)=>{
  try {
    realm.write(() => {
      let categoryToDelete = realm.objectForPrimaryKey("Category", categoryId)
  
      realm.delete(categoryToDelete);
  
      categoryToDelete = null

      showToast("success", "Catégorie supprimée !", "Cette catégorie n'existe plus.")
    })
    
  } catch (error) {
    showToast("error", "Echec", "Une erreur est survenue.")

  }
}
