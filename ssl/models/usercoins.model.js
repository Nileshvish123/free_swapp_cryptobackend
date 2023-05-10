const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const usercoinSchema = mongoose.Schema({
    user_id: {type:Number,required:true},
    coins:[{}]
});

// autoIncrement.initialize(mongoose.connection);
// currencySchema.plugin(autoIncrement.plugin, {
//     model: 'currency',
//     field: 'currency_id',
//     startAt: 101,
//     incrementBy: 1
// });

module.exports = mongoose.model('user_coins', usercoinSchema);