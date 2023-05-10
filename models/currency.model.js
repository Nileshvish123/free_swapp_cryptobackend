const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const currencySchema = mongoose.Schema({
    currency_id: {
        unique: true,
        type: Number
    },
    name: String,
    image: String,
    symbol:String,
    logo:String,
    is_active: {
        type: Boolean,
        default: false
    },
    is_user_active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
currencySchema.plugin(autoIncrement.plugin, {
    model: 'currency',
    field: 'currency_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('currency', currencySchema);