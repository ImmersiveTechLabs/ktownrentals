import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice";
import customBookingReducer from "./slices/customBookingSlice";
const rootReducer = combineReducers({
    orders:ordersReducer,
    customBooking:customBookingReducer,
})
export default  configureStore({
    reducer:rootReducer
})
