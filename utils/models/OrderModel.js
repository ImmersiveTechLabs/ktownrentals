import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    productId:{
        type:String,
    },
    orderNumber:{
        type:String,
    },
    variantId:{
        type:String,
    },
    productTitle:{
        type:String,
    },
    startTime:{
        type:String,
    },
    endTime:{
        type:String
    },
    duration:{
        type:Number
    },
    bookingDate:{
        type:String
    },
    createdAt:{
        type:Date,
    },
    email:{
        type:Object,
    },
    isWaiverFormFilled:{
        type:String,
    },
    price:{
        type:String,
    },
    licenseNumber:{
        type:String,
    },
})

export default mongoose.model('Order', orderSchema)
