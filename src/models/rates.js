import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ratesSchema = new Schema({
    id: {
        type      : String,
        index     : true,
		trim      : true,
		required  : true,
        maxlength : 36
    },
    timestamp: {
        type: Number,
        required: [true, 'Timestamp is require']
    },
    base: {
        type: String,
        required: [true, 'Base is require']
    },
    date: {
        type: String,
        required: [true, 'Date is require']
    },
    originalRates: {
        type: Object,
        required: [true, 'OriginalRates is require']
    },
    fee: {
        type: Number,
        required: [true, 'Fee is require']
    },
    newRates: {
        type: Object,
    }
    
});

const Rates = mongoose.model('Rates', ratesSchema);
export default Rates;