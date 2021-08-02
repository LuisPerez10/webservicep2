const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let nosocomioShema = new Schema({
    nombre: {
        type: String,
        required: false
    },
    telefono: {
        type: Number,
        required: false
    },
    direccion: {
        type: String,
        required: false
    },

});

nosocomioShema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    nosocomioShema
}
module.exports = mongoose.model('nosocomio', nosocomioShema);