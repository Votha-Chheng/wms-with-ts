import { UpdateMode } from "realm";
import { Product } from "../models/Product";
import { showToast } from "../../utils";

export const fetchAllProducts = (realm: Realm)=>{
  const products = realm.objects("Product")

  const listProducts: Product[] = products.map((prod: any)=> (

    new Product (
      prod._id,
      prod.codeBarType.toString(),
      prod.marque,
      prod.nom,
      prod.qty,
      prod.stockLimite,
      {_id: prod.categorie.nom, nom: prod.categorie.nom},
      prod.telFournisseur,
      prod.siteFournisseur,
      prod.commandeEncours,
    )
  ))
  
  return listProducts
  
}

export const fetchProductById = (realm: Realm, id: string)=>{
  const product: any = realm.objectForPrimaryKey("Product", id)

  if(product !== null){
    const productToReturn: Product =  new Product (
      product._id,
      product.codeBarType,
      product.marque,
      product.nom,
      product.qty,
      product.stockLimite,
      {_id: product.categorie.nom, nom: product.categorie.nom},
      product.telFournisseur,
      product.siteFournisseur,
      product.commandeEncours,
    )
    
    return productToReturn
  }
}

export const fetchProductsAlert = (realm: Realm)=>{

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
        {_id: prod.categorie.nom, nom: prod.categorie.nom},
        prod.telFournisseur,
        prod.siteFournisseur,
        prod.commandeEncours,
      ))

  return products.length
}

export const createProduct = (realm: Realm, obj: Product)=>{

  realm.write(()=>{
    realm.create("Product", {
      _id: obj._id,
      codeBarType: obj.codeBarType.toString(),
      nom: obj.nom,
      marque: obj.marque,
      qty:obj.qty,
      stockLimite:obj.stockLimite,
      categorie: obj.categorie,
      telFournisseur: obj.telFournisseur,
      siteFournisseur : obj.siteFournisseur
    })  
  })  

  const productCreation:any = realm.objectForPrimaryKey("Product", obj._id)

  if(productCreation !== null || productCreation !== undefined){
    showToast("success","Succès", `${productCreation.nom} a été ajouté dans l'inventaire.`)
  
  }
}

export const updateProduct = (realm: Realm, obj:Product) : void =>{

  realm.write(()=>{  
    realm.create("Product", {
      _id: obj._id,
      codeBarType: obj.codeBarType,
      nom: obj.nom,
      marque: obj.marque,
      qty:obj.qty,
      stockLimite:obj.stockLimite,
      categorie: obj.categorie,
      telFournisseur: obj.telFournisseur,
      siteFournisseur : obj.siteFournisseur
    },
      UpdateMode.Modified
    )
  })
  
}

