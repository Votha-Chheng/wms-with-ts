import { createSlice } from "@reduxjs/toolkit";

export interface FilterState {
  filters : {
    parType: string
    alphabetique: boolean
    ordreAlphabet?: boolean
    dateEntree : boolean
    recent?: boolean
    searchInput: string
    alertStock: boolean
    searchByText:string
  }
}

const initialState: FilterState = {
  filters : {
    parType : "",
    alphabetique : false,
    ordreAlphabet: null,
    dateEntree : true,
    recent: true,
    searchInput : "",
    alertStock: false,
    searchByText:""
  }
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.filters = {
        parType : "",
        alphabetique : false,
        ordreAlphabet: null,
        dateEntree : true,
        recent: true,
        searchInput : "",
        alertStock: false,
        searchByText:""
      }
    },
    changeFilters : (state, action) =>{
      state.filters = action.payload
    }
  }
})

export const {resetFilters, changeFilters} = filterSlice.actions

export default filterSlice.reducer