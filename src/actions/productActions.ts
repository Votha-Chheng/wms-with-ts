import { Product } from "../models/Product";
import { showToast } from "../../utils";

export const fetchAllProducts = (realm: Realm)=>{
  try {
    const products = realm.objects("Product")
  
    const listProducts: Product[] = products.map((prod: any)=> (
  
      new Product (
        prod._id,
        prod.codeBarType.toString(),
        prod.marque,
        prod.nom,
        prod.qty,
        prod.stockLimite,
        {_id: prod.categorie._id, nom: prod.categorie.nom},
        prod.telFournisseur,
        prod.siteFournisseur,
        prod.commandeEncours,
      )
    ))
    
    return listProducts

  } catch (err){
    console.log(err)
  }
  
}

export const fetchProductById = (realm: Realm, id: string)=>{
  try {
    const product: any = realm.objectForPrimaryKey("Product", id)
  
    if(product !== null){
      const productToReturn: Product =  new Product (
        product._id,
        product.codeBarType,
        product.marque,
        product.nom,
        product.qty,
        product.stockLimite,
        {_id: product.categorie._id, nom: product.categorie.nom},
        product.telFournisseur,
        product.siteFournisseur,
        product.commandeEncours,
      )
      
      return productToReturn
    }

  } catch (err){
    console.log(err)

  }
}

export const fetchProductsAlert = (realm: Realm)=>{

  try {
    const products = 
      realm
        .objects("Product")
        .filtered("qty - stockLimite <= 0")
        .map((prod: any) => new Product (
          prod._id,
          prod.codeBarType,
          prod.marque,
          prod.nom,
          prod.qty,
          prod.stockLimite,
          {_id: prod.categorie._id, nom: prod.categorie.nom},
          prod.telFournisseur,
          prod.siteFournisseur,
          prod.commandeEncours,
        ))

    return products.length

  } catch (err) {
    console.log(err)

  }
}

export const createProduct = (realm: Realm, obj: Product)=>{

  try {
    realm.write(()=>{
      realm.create(
        "Product", 
        {
          _id: obj._id,
          codeBarType: obj.codeBarType.toString(),
          nom: obj.nom,
          marque: obj.marque,
          qty:obj.qty,
          stockLimite:obj.stockLimite,
          telFournisseur: obj.telFournisseur,
          siteFournisseur : obj.siteFournisseur
        },
      ) 

      const prod: any = realm.objectForPrimaryKey("Product", obj._id)
      prod.categorie = obj.categorie
    })  
  
    const productCreation:any = realm.objectForPrimaryKey("Product", obj._id)
  
    if(productCreation !== null || productCreation !== undefined){
      showToast("success","Succès", `${productCreation.nom} a été ajouté dans l'inventaire.`)

    }
  } catch (error) {
    console.log(error)

  }
}

export const updateProduct = (realm: Realm, obj: Product)=> {
  try {
    const productToUpdate: any = realm.objectForPrimaryKey("Product", obj._id)

    realm.write(()=>{
      productToUpdate.nom = obj.nom
      productToUpdate.marque = obj.marque
      productToUpdate.qty = obj.qty
      productToUpdate.categorie = obj.categorie
      productToUpdate.stockLimite = obj.stockLimite
      productToUpdate.telFournisseur = obj.telFournisseur
      productToUpdate.siteFournisseur = obj.siteFournisseur
      
      if(obj.qty>obj.stockLimite){
        productToUpdate.commandeEncours = false

      } else {
        productToUpdate.commandeEncours = obj.commandeEncours
        
      }
    })

    showToast("success","Succès", `Les infos de ${obj.nom} ont été modifiées.`)

  } catch (err){
    console.log(err)
    showToast("error","Une erreur est survenue",  "Impossible de mofier le produit.")

  }
}

export const deleteProduct = (realm: Realm, productToDeleteId: any)=>{
  try {
    let toDelete = realm.objectForPrimaryKey("Product", productToDeleteId)
  
    realm.write(()=>{
      realm.delete(toDelete)
  
      toDelete = null
    })
    
  } catch (error) {
    console.log(error)
    
  }
}



