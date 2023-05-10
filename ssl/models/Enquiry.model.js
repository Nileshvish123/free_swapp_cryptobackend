const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const enquirySchema = mongoose.Schema({
    enquiry_id: {
        unique: true,
        type: Number
    },
    fname: String,
    lname:String,
    phone:String,
    email:String,
    message:String
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
enquirySchema.plugin(autoIncrement.plugin, {
    model: 'enquiry',
    field: 'enquiry_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('enquiry', enquirySchema);