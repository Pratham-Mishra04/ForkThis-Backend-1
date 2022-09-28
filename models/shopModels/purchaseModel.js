import mongoose from "mongoose";
import Item from "./itemModel.js";

const purchaseSchema = mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    count:Number,
    totalCoins:Number,
    delivery:{
        deliverTo:{
            addressLine1:String,
            addressLine2:String,
            addressLine3:String,
        },
        isDelivered:{
            type:Boolean,
            default:false
        },
        deliveredAt:Date
    },
    purchasedAt:{
        type:Date,
        default:Date.now()
    }
})

purchaseSchema.pre(/^find/,function(next){
    this.populate('item');
    next()
})

purchaseSchema.post("save", async function(doc){
    const item = await Item.findById(doc.item)
    item.countInStock-=doc.count;
    item.save()
})

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;