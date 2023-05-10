const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const articalSchema = mongoose.Schema({
    artical_id: {
        unique: true,
        type: Number
    },
    title: {type:String},
    category: [],
    description:String,
    artical_image:String,
    artical_date:Date,
    is_active: { type: Boolean, default: false }
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
articalSchema.plugin(autoIncrement.plugin, {
    model: 'articals',
    field: 'artical_id',
    startAt: 101,
    incrementBy: 1
});

let Module = mongoose.model('articals', articalSchema)
Module.getListBywhere = (where = {}, page = '') => {
    if (page) {
        return Module.find(where).skip(10 * page).limit(10).sort({ artical_id: -1 })
    } else {
        return Module.find(where).sort({ artical_id: -1 })
    }
}
module.exports = Module;