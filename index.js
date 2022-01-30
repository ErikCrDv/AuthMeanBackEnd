const express = require('express');
const cors =    require('cors');
const path =    require('path');

const { dbConnection } = require('./database/config');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// DataBase
dbConnection();

// Directorio Publico
app.use( express.static('public') )

// Cors
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() )

// Rutas 
app.use('/api/auth', require('./routes/auth'));

// Manejo de rutas
app.get('*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname , 'public/index.html') )
});

// 
app.listen( process.env.PORT , () => {
    console.log(`Server runing on Port ${ process.env.PORT }`);
})