const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const faqSchema = mongoose.Schema({
    faq_id: {
        unique: true,
        type: Number
    },
    question: {type:String},
    answer:{type:String},
    is_active: { type: Boolean, default: false }
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
faqSchema.plugin(autoIncrement.plugin, {
    model: 'faqs',
    field: 'faq_id',
    startAt: 101,
    incrementBy: 1
});

let Module = mongoose.model('faqs', faqSchema)
Module.getListBywhere = (where = {}, page = '') => {
    if (page) {
        return Module.find(where).skip(10 * page).limit(10).sort({ faq_id: -1 })
    } else {
        return Module.find(where).sort({ faq_id: -1 })
    }
}
module.exports = Module;