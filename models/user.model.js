const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const UserSchema = mongoose.Schema({
    user_id:{
        unique:true,
        type:Number
    },
    first_name: String,
    last_name: String,
    email: {
        type:String,
    },
    password:{
        type:String
    },
    phone: String,
    user_role:{
        type:String,
        default:"user"
    },
    token:{
        type:String
    },
    passwordlink:{
     type:String
    },
    is_active:  { type: Boolean, default: true },
    is_verified:  { type: Boolean, default: false },
    is_deleted:  { type: Boolean, default: false }
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, {
    model: 'users',
    field: 'user_id',
    startAt: 101,
    incrementBy: 1
});

module.exports = mongoose.model('users', UserSchema);