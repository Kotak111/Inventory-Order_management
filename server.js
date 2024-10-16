const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const cookieParser=require("cookie-parser")
app.use(cookieParser())
require("dotenv").config();
require("./config/db")
const port = process.env.PORT
const UserRoutes=require("./routes/user.route")
const ProductRoutes=require("./routes/product.routes")
const OrderRoute=require("./routes/order.routes")
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Inventory&Order_management  API',
        version: '1.0.0',
        description: 'API for managing Inventory&Order_management App',
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Replace with your API base URL
        },
    ],
};
// Options for Swagger JSDoc
const options = {
    swaggerDefinition,
    // Path to the API docs
    apis: ['./routes/*.js'], // Path where API routes are defined
};

// Initialize SwaggerJSDoc
const swaggerSpec = swaggerJsdoc(options);

// Use Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth",UserRoutes)
app.use("/api/v1/product",ProductRoutes)
app.use("/api/v1/order",OrderRoute)

app.get("/",(req,res)=>{
    res.send("<center><h1>Inventory&Order_management All apis</h1><br>Get All Apis Use My Link <a href=https://github.com/Kotak111/Inventory&Order_management target=_blank>Repository :- Inventory&Order_management</a></center>")
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))