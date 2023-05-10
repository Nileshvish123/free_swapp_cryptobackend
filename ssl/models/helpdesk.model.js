const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const enquirySchema = mongoose.Schema({
    desk_id: {
        unique: true,
        type: Number
    },
    subject: String,
    email:String,
    verify_email:String,
    description:String,
    file:String
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
enquirySchema.plugin(autoIncrement.plugin, {
    model: 'helpdesk',
    field: 'desk_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('helpdesk', enquirySchema);