const { response, query } = require('express');
const pool = require('../db');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


const getAllServices = async(req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM service')
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

const getService = async(req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM service WHERE id = $1',[ id ])
    res.json(result.rows);
  } catch (error) {
    console.log(error.message)
  }
}

const createService = async(req, res, next) => {
try {
  const {title, description, price} = req.body;
  //Recuperamos la imagen desde req
  const imagen = req.files.imagen;
  //Recuperamos el titulo de la imagen
  const title_img = req.files.imagen.name;
  //Subida de imagen a cludinary
  const cloudinary_id = (await uploader(imagen.tempFilePath)).public_id;
  
  const result = await pool.query('INSERT INTO service (title, description, price, cloudinary_id, title_img) VALUES ($1, $2, $3, $4, $5)  RETURNING *',
  [
    title, 
    description,
    price,
    cloudinary_id,
    title_img
  ])

  res.json(result);
  console.log(req.body);
} catch (error) {
  next(error);
}
}


//Actualiza los registros de la tabla service
const updateService = async(req, res, next) => {
  try {
    //Traemos el id de la tarea desde req.params
    const { id } = req.params
    
    //Traemos title, descripcion, price y image desde req.body
    const {title, description, price} = req.body;
    

    //Obtenemos el id de la imagen actual en cloudinary
    const resultService = await pool.query('SELECT * FROM "service" WHERE id = $1', [id])
    const cloudinary_id = resultService.rows[0].cloudinary_id;

    if (req.files && Object.keys(req.files).length > 0){
      //Traemos los datos de la imagen desde image
      const imagen = req.files.imagen;
      //Recuperamos el titulo de la imagen
      const title_img = req.files.imagen.name;

      await(destroy(cloudinary_id));
      const new_cloudinary_id = (await uploader(imagen.tempFilePath)).public_id;
      const resultNewImageService = await pool.query('UPDATE "service" SET cloudinary_id = $1, title_img = $2 WHERE id = $3 RETURNING *', [
        new_cloudinary_id,
        title_img,
        id
      ])
    }

    // Actualiza con los datos nuevos envia
    const result = await pool.query('UPDATE service SET title = $1, description = $2, price = $3 WHERE id = $4 RETURNING *', [
      title,
      description,
      price,
      id
    ])


    res.json(result);
  } catch (error) {
    next(error);
  }
}


const deleteService = async(req, res, next) => {
  try {
    //Traemos el id de la tarea desde req.params
    const { id } = req.params;
    //Obtenemos el id de la imagen del servicio
    const resultService = await pool.query('SELECT * FROM service WHERE id = $1',[id]);
    //Si no existe el servicio, retorna el siguiente error
    if (resultService.rows.length === 0) 
    return res.status(404).json({
      message: 'service not found'
    })
    const image_id = resultService.rows[0].image_id;

    //Eliminamos el servicio
    const result = await pool.query('DELETE FROM service WHERE id = $1',[id]);

    //Eliminamos la imagen del servicio
    const resultImage = await pool.query('DELETE FROM image WHERE id = $1',[image_id]);

    // Devuelve un 204, si elimina algo el body viene vacio
    return res.sendStatus(204);
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService
}