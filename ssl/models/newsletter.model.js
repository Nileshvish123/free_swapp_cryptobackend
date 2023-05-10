const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const newsletterSchema = mongoose.Schema({
    newsletter_id: {
        unique: true,
        type: Number
    },
    fullname: { type: String },
    email: { type: String },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
newsletterSchema.plugin(autoIncrement.plugin, {
    model: 'newsletters',
    field: 'newsletter_id',
    startAt: 101,
    incrementBy: 1
});

let Module = mongoose.model('newsletters', newsletterSchema)
Module.getListBywhere = (where = {}, page = '') => {
    if (page) {
        return Module.find(where).skip(10 * page).limit(10).sort({ newsletter_id: -1 })
    } else {
        return Module.find(where).sort({ newsletter_id: -1 })
    }
}
module.exports = Module;