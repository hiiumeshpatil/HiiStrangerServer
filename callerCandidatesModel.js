
// Require mongoose module
const mongoose = require('mongoose');

const caller = new mongoose.Schema(
    { 
     callerId: String, 
     callieId:String,  
     candidateCaller: String, 
     offerCallerSDP: String ,
     status:String,
	 roomId:String
}
)


const callerModel = mongoose.model(
    'caller', caller);


    module.exports=callerModel;

  