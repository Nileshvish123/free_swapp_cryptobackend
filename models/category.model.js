const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const categorySchema = mongoose.Schema({
    category_id: {
        unique: true,
        type: Number
    },
    title: String,


}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
categorySchema.plugin(autoIncrement.plugin, {
    model: 'category',
    field: 'category_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('category', categorySchema);