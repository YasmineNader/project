const express = require('express')
const cors = require('cors')
require('../DBconnection/db')
const userRouters=require('../routes/user.routes')
const adminRouters=require('../routes/admin.routes')
const productRouters=require('../routes/product.routes')
const orderRouters=require('../routes/order.routes')
const app = express()
app.use(cors())
app.use(express.json())
app.use(userRouters)
app.use(adminRouters)
app.use(productRouters)
app.use(orderRouters)



module.exports=app