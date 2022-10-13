import { Category } from "./Category"

export class Product {
  _id: string;
  codeBarType?: string;
  marque: string;
  nom: string;
  categorie: Category;
  telFournisseur?: string;
  siteFournisseur?: string;
  commandeEncours: boolean = false;
  qty: number;
  stockLimite: number;

  constructor(  
    _id: string,
    codeBarType: string,
    marque: string,
    nom: string,
    qty: number,
    stockLimite: number,
    categorie: {_id: any, nom: string},
    telFournisseur?: string,
    siteFournisseur?: string,
    commandeEncours: boolean = false
  ) {
    this._id = _id;
    this.codeBarType = codeBarType;
    this.marque = marque;
    this.nom = nom;
    this.qty = qty;
    this.stockLimite = stockLimite;
    this.categorie ={_id: categorie._id, nom: categorie.nom};
    this.telFournisseur = telFournisseur;
    this.siteFournisseur = siteFournisseur;
    this.commandeEncours = commandeEncours;

  }
}

const ProductSchema: Realm.ObjectSchema = {
  name: "Product",
  primaryKey: "_id",
  properties: {
    _id: "string",
    codeBarType: "string?",
    marque: "string",
    nom: "string",
    qty:"int",
    stockLimite:"int",
    categorie: "Category",
    telFournisseur:"string?",
    siteFournisseur : "string?",
    commandeEncours:{type:"bool", default: false}
  },
}

export default ProductSchema