var mongoose  =  require('mongoose');

var csvSchema = new mongoose.Schema({
    userid:{
        type:String
    },
    ledger:{
        type:String
    },
    date:{
        type:String
    },
    amount:{
        type:Number
    },
    narration:{
        type:String
    }
});

module.exports = mongoose.model('expense',csvSchema);