import { createSlice} from "@reduxjs/toolkit"
import { getStoredAuth } from "../../utils/storage"

const initialState = getStoredAuth()

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setAuthData(state, action) {

            state.token = action.payload.token
            state.customer = action.payload.customer
            state.cart = action.payload.cart

        },

        logout(state) {

            state.token = null
            state.customer = null
            state.cart = []

        },
    },
})

export const { setAuthData, logout } = authSlice.actions
export default authSlice.reducer
