
// Require mongoose module
const mongoose = require('mongoose');

const callie = new mongoose.Schema(
    { 
        
    callieId:String,
    callerId:String,
    candidateCallie: String, 
    AnswarCallieSDP: String,
    status: String,
    roomId:String	
}
)


const callieModel = mongoose.model(
    'callie', callie);


    module.exports=callieModel;

  