const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const historySchema = mongoose.Schema({
    history_id: {
        unique: true,
        type: Number
    },
    user_id: Number,
    date: Date,
    from_amount: String,
    to_amount: String,
    transaction_id: String,
    from_symbol: String,
    to_symbol: String,
    wallet_address: String,
    status: Boolean,
    valuenow: String,

}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
historySchema.plugin(autoIncrement.plugin, {
    model: 'trade_history',
    field: 'history_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('trade_history', historySchema);