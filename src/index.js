//Importamos express, morgan, cors y fileUpload
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

//Importamos las rutas del producto
const productsRoutes = require('./routes/products.routes');
//Importamos las rutas del service
const serviceRoutes = require('./routes/service.routes');
//Importamos las rutas del usario
const userRoutes = require('./routes/user.routes');
//Importamos las rutas de la mascota
const petRoutes = require('./routes/pet.routes');
//Importamos las rutas del tipo de mascota
const petTypeRoutes = require('./routes/pet_type.routes');
//Importamos las rutas de la provincia
const provinceRoutes = require('./routes/province.routes');
//Importamos las rutas de la localidad
const locationRoutes = require('./routes/location.routes');
//Importamos las rutas de la direccion
const addressRoutes = require('./routes/address.routes');
//Importamos las rutas de los comentarios
const commentRoutes = require('./routes/comment.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

//Usamos las rutas del producto
app.use(productsRoutes);
//Usamos las rutas del servicio
app.use(serviceRoutes);
//Usamos las rutas del usario
app.use(userRoutes);
//Usamos las rutas de la mascota
app.use(petRoutes);
//Usamos las rutas del tipo de mascota.
app.use(petTypeRoutes);
//Usamos las rutas de la provincia
app.use(provinceRoutes);
//Usamos las rutas de la localidad
app.use(locationRoutes);
//Usamos las rutas de la direccion
app.use(addressRoutes);
//Usamos las rutas de los comentarios
app.use(commentRoutes);

//Manejar errores con next de express
app.use((err, req, res, next) => {
  return res.json({
    message: err.message
  })
})

app.use(cors());

app.listen(4000);
console.log('Server on port 4000');