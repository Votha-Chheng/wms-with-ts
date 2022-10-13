import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../../models/Category";
import { Product } from "../../models/Product";

export interface ProductsAndCategories {
  allProducts?: Product[]
  singleProduct?: {
    _id: string,
    codeBarType?: string,
    marque: string,
    nom: string,
    qty: number,
    stockLimite: number,
    categorie: {
      _id: number,
      nom: string
    },
    telFournisseur?: string,
    siteFournisseur?: string,
    commandeEncours: boolean
  },
  allCategories?: Category[]
  singleCategory?: {
    _id: number,
    nom: string
  }
}

const initialState: ProductsAndCategories = {
  allProducts: null,
  singleProduct : null,
  allCategories: null,
  singleCategory: null
}

const productsAndCategoriesSlice = createSlice({
  name: 'productsAndCategories',
  initialState,
  reducers: {
    getAllProducts: (state, action) => {
      state.allProducts = action.payload
    },
    getSingleProduct : (state, action) =>{
      state.singleProduct = action.payload
    },
    getAllCategories : (state, action)=> {
      state.allCategories = action.payload
    },
    getSingleCategory : (state, action)=> {
      state.singleCategory = action.payload
    }
  }
})

export const {getAllCategories, getAllProducts, getSingleCategory, getSingleProduct} = productsAndCategoriesSlice.actions

export default productsAndCategoriesSlice.reducer