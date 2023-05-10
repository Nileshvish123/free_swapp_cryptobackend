const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const transactionSchema = mongoose.Schema({
    transaction_id: {
        unique: true,
        type: Number
    },
    user_id: Number,
    symbol: String,
    date: Date,
    transactionId:String,
    usdAmount: String,
    cryptoAmount: String,
    wallet_address:String,
    recipient_address: String,
    type: String,  //send and receive


}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
transactionSchema.plugin(autoIncrement.plugin, {
    model: 'transaction_history',
    field: 'transaction_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('transaction_history', transactionSchema);