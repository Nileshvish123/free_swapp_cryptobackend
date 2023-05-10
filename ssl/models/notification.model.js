const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const notificationSchema = mongoose.Schema({
    notification_id: {
        unique: true,
        type: Number
    },
    sender_id: {
        type: String
    },
    receiver_id: {
        type: String
    },
    message: {
        type: String
    }
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
notificationSchema.plugin(autoIncrement.plugin, {
    model: 'notifications',
    field: 'notification_id',
    startAt: 101,
    incrementBy: 1
});

const Module = mongoose.model('notifications', notificationSchema);

Module.getListBywhere = (where = {}, page = '') => {
    if (page) {
        return Module.find(where).skip(10 * page).limit(10).sort({ notification_id: -1 })
    } else {
        return Module.find(where).sort({ notification_id: -1 })
    }
}

module.exports = Module