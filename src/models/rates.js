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
    },
},
{
    timestamps: true,
},
);

ratesSchema.methods.toJSON = function() {
    let rate = this;
    let rateObject = rate.toObject();
    delete rateObject._id;
    delete rateObject.id;
    delete rateObject.timestamp;
    delete rateObject.createdAt;
    delete rateObject.updatedAt;
    delete rateObject.__v;

    return rateObject;
}

const Rates = mongoose.model('Rates', ratesSchema);
export default Rates;