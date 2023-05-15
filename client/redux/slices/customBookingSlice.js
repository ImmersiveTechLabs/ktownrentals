import { createSlice } from "@reduxjs/toolkit";


const customBookingSlice = createSlice({
    name:"Custom Booking",
    initialState:{
        selectedProduct:null,
        selectedVariant:null,
        selectedDate:null,
        times:null,
        selectedTime:null,
        customer:{
            firstName:'',
            lastName:'',
            email:'',
        }
    },
    reducers:{
        setSelectedProduct:(state,action)=>{
            state.selectedProduct = action.payload
        },
        setSelectedVariant:(state,action)=>{
            state.selectedVariant = action.payload
        },
        setSelectedDate:(state,action)=>{
            state.selectedDate = action.payload
        },
        setTimes:(state,action)=>{
            state.times = action.payload
        },
        setSelectedTime:(state,action)=>{
            state.selectedTime = action.payload
        },
        setCustomerFirstName:(state,action)=>{
            state.customer.firstName = action.payload
        },
        setCustomerLastName:(state,action)=>{
            state.customer.lastName = action.payload
        },
        setCustomerEmail:(state,action)=>{
            state.customer.email = action.payload
        },
        resetState:(state,action)=>{
            state.customer = {
                firstName:'',
                lastName:'',
                email:'',
            }
            state.selectedDate = null
            state.selectedProduct = null
            state.selectedTime = null
            state.selectedVariant = null
            state.times = null
        },

    }
})

export const  {setSelectedProduct,setSelectedVariant,setSelectedDate,setTimes,setSelectedTime,resetState, setCustomerFirstName,setCustomerLastName,setCustomerEmail} = customBookingSlice.actions;
export default customBookingSlice.reducer
