const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const subcategorySchema = mongoose.Schema({
    subcategory_id: {
        unique: true,
        type: Number
    },
    title: String,
    category:[]
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
subcategorySchema.plugin(autoIncrement.plugin, {
    model: 'sub_category',
    field: 'subcategory_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('sub_category', subcategorySchema);