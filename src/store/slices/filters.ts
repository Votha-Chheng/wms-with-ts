import { createSlice } from "@reduxjs/toolkit";

export interface FilterState {
  filters : {
    parType: string
    alphabetique: boolean
    ordreAlphabet: boolean
    dateEntree : boolean
    recent: boolean
    searchInput: string
    alertStock: boolean
  }
}

const initialState: FilterState = {
  filters : {
    parType : "",
    alphabetique : false,
    ordreAlphabet: false,
    dateEntree : true,
    recent: true,
    searchInput : "",
    alertStock: false
  }
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.filters = {
        parType : "",
        recent: true,
        alphabetique : false,
        ordreAlphabet: false,
        dateEntree : true,
        searchInput: "",
        alertStock: false
      }
    },
    changeFilters : (state, action) =>{
      state.filters = action.payload
    }
  }
})

export const {resetFilters, changeFilters} = filterSlice.actions

export default filterSlice.reducer