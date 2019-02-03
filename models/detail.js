const mongoose = require('mongoose');

const DetailSchema = new mongoose.Schema({
    doctorname: {
      type: String,
      required: true
    },
    doctoremail: {
      type: String,
      required: true
    },
    disease: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {collection:'PatientDetails'});

const Detail = mongoose.model('Detail', DetailSchema);

module.exports = Detail;
