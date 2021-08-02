const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let personalShema = new Schema({
    nombre: {
        type: String,
        required: false
    },
    codigo: {
        type: String,
        required: false
    },
    turno: {
        type: String,
        required: false
    },

});

personalShema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    personalShema
}
module.exports = mongoose.model('personal', personalShema);