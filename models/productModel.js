const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({


    productName: {
        type: String,
        require: true
    },
    skuCode: {
        type: String,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 10
    },
    priceAfterDiscount: {
        type: Number
    }
})

productSchema.pre('save', function (next) {
    this.priceAfterDiscount = parseInt(this.price * (1 - this.discount / 100));
    next();
});

module.exports = mongoose.model('product', productSchema);