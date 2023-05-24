
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/videoapp", {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
mongoose.connection.on('connecting', () => { 
    console.log('connecting')
    console.log(mongoose.connection.readyState); //logs 2
  });
  mongoose.connection.on('connected', () => {
    console.log('connected to DB');
    console.log(mongoose.connection.readyState); //logs 1
  });
  mongoose.connection.on('disconnecting', () => {
    console.log('disconnecting');
    console.log(mongoose.connection.readyState); // logs 3
  });
  mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
    console.log(mongoose.connection.readyState); //logs 0
  });