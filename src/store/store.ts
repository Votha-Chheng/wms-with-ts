import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import modalReducer from "./slices/modal"
import cameraPermissionReducer from "./slices/cameraPermission"
import scanningReducer from "./slices/scanning"
import codeBarDataTypeReducer from "./slices/dataBarCode"
import errorMessageReducer from './slices/errorMessage'
import filtersReducer from './slices/filters'

const store = configureStore({
  reducer: {
    modalVisible: modalReducer,
    cameraPermission : cameraPermissionReducer,
    scanning : scanningReducer,
    codeBarDataType : codeBarDataTypeReducer,
    errorMessage : errorMessageReducer,
    filters : filtersReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = ()=> useDispatch<AppDispatch>()

export default store