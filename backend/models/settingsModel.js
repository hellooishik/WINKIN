const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
    {
        giftPackingRate: {
            type: Number,
            required: true,
            default: 2.00,
        },
        deliveryRate: {
            type: Number,
            required: true,
            default: 5.99,
        },
        freeDeliveryThreshold: {
            type: Number,
            required: true,
            default: 50.00,
        },
        promotionalOffers: {
            type: [String],
            required: true,
            default: ['£10 OFF Your First Order!', 'Spend £20 Get Free Milk!'],
        },
        serviceFee: {
            type: Number,
            required: true,
            default: 0.00,
        },
        bagCharges: {
            type: Number,
            required: true,
            default: 0.00,
        },
    },
    {
        timestamps: true,
    }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
