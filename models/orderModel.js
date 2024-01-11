const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const OrderSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    orderDetails: [{
        productId: {
            type: ObjectId,
            ref: 'Product'
        },
        userId: {
            type: ObjectId,
            ref: 'User'
        },
        orderedQuantity: {
            type: Number,
            required: true
        },
        totalSalePrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentStatus: {
            type: String,
        },
        orderedDate: {
            type: Date,
        },
        deliveryDate: {
            type: Date,
        },
        return: {
            type: Boolean,
        }
    }]
});

const Order = mongoose.model('order', OrderSchema);