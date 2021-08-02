const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let especialidadShema = new Schema({
    nombre: {
        type: String,
        required: false,
    },

});

especialidadShema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    especialidadShema
}
module.exports = mongoose.model('Especialidad', especialidadShema);