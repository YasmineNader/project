const mongoose = require('mongoose')
try{
 mongoose.connect(process.env.DBURL, {
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex:true,
    useNewUrlParser:true
   })
}catch(e){
    console.log(e)
}
