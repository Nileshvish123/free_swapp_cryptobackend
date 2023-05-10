const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const adminMediaSchema = mongoose.Schema({
    media_id: {
        unique: true,
        type: Number
    },
    logo: String,
    heading_title:String,
    heading_description:String,
    service_benefites_heading:String,
    service_benefits_description:String,
    service_benefits_contantfirst_title:String,
    service_benefits_contantfirst_description:String,
    service_benefits_contantsecond_title:String,
    service_benefits_contantsecond_description:String,
    service_benefits_contantthird_title:String,
    service_benefits_contantthird_description:String,
    service_benefits_contantfourth_title:String,
    service_benefits_contantfourth_description:String,
    information_heading:String,
    information_description:String,
    information_contentone_title:String,
    information_contentone_description:String,
    information_contentone_image:String,
    information_contentsecond_title:String,
    information_contentsecond_description:String,
    information_contentsecond_image:String,
    information_contentthird_title:String,
    information_contentthird_description:String,
    information_contentthird_image:String,
    about: String,
    terms: String,
    home_banner:String,
    services: String,
    home_video:String,
    blog_title:String,
    blog_description:String,
    blog_video:String,
    contact:[]
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
adminMediaSchema.plugin(autoIncrement.plugin, {
    model: 'admin_media',
    field: 'media_id',
    startAt: 101,
    incrementBy: 1
});

const Module = mongoose.model('admin_media', adminMediaSchema)
Module.getListBywhere = (where = {}, page = '') => {
    if (page) {
        return Module.find(where).skip(10 * page).limit(10).sort({ media_id: -1 })
    } else {
        return Module.find(where).sort({ media_id: -1 })
    }
}
module.exports = Module;