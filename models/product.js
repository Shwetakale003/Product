const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
    },
    descriprion:{
        type: String,
        required:true
    },
    richDescription: {
        type:String,
        default: ''
    },
    image: {
        type:String,
        default: ''
    },
    images:[{
        type:String
    }],
    brand:{
        type:String,
        default:''

    },
    price:{
        type:'Number',
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'

    },
    countInStock:{
        type:Number,
        require:true,
        min:0,
        max:255
    },
    numReviews:{
        type:Boolean,
        default:false,
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    dateCreated:{
        type:Date,
        default:Date.now,
    },
    
    
})
exports.Product = mongoose.model('Product',productSchema);