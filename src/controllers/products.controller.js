const { response, query } = require('express');
const pool = require('../db');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

//Devuelve un json de todos los productos
const getAllProducts = async(req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM product')
    res.json(result.rows)
  } catch (error) {
    next(error);
  }

}

//Devuelve un json con el producto igual al id buscado
const getProduct = async(req, res, next) => {
  try {
    const {id} = req.params;
    const result = await pool.query('SELECT * FROM product WHERE id = $1', [id])
    if (result.rows.length === 0) 
    return res.status(404).json({
      message: "product not found"
    })
  
    res.json(result.rows);
  } catch (error) {
    next(error);
  }

}

//Crea un producto en la tabla producto y agrega una imagen en la tabla imagen
const createProduct = async(req, res, next) => {
  try {
    const {title, description, price, stock} = req.body;

    const imagen = req.files.imagen;
    //Recuperamos el titulo de la imagen
    const title_img = req.files.imagen.name;
    //Subida de imagen a cludinary
    const cloudinary_id = (await uploader(imagen.tempFilePath)).public_id;
    
    const result = await pool.query('INSERT INTO "product" (title, description, price, stock, cloudinary_id, title_img) VALUES ($1, $2, $3, $4, $5, $6)  RETURNING *',
    [
      title, 
      description,
      price,
      stock,
      cloudinary_id,
      title_img
    ])

    res.json(result);
  } catch (error) {
    next(error);
  }

}

//Actualiza los registros de la tabla producto
const updateProduct = async(req, res, next) => {
  try {
      //Traemos el id de la tarea desde req.params
      const { id } = req.params
      
      //Traemos title, descripcion, price, stock desde req.body
      const {title, description, price, stock} = req.body;
      
      //Obtenemos el id de la imagen actual en cloudinary
      const resultProduct = await pool.query('SELECT * FROM "product" WHERE id = $1', [id])
      const cloudinary_id = resultProduct.rows[0].cloudinary_id;

      if (req.files && Object.keys(req.files).length > 0){
        //Traemos los datos de la imagen desde image
        const imagen = req.files.imagen;
        
        //Recuperamos el titulo de la imagen
        const title_img = req.files.imagen.name;

        await(destroy(cloudinary_id));
        const new_cloudinary_id = (await uploader(imagen.tempFilePath)).public_id;
        const resultNewImageProduct = await pool.query('UPDATE "product" SET cloudinary_id = $1, title_img = $2 WHERE id = $3 RETURNING *', [
          new_cloudinary_id,
          title_img,
          id
        ])
      }
      // Actualiza con los datos nuevos envia
      const result = await pool.query('UPDATE product SET title = $1, description = $2, price = $3,  stock = $4 WHERE id = $5 RETURNING *', [
        title,
        description,
        price,
        stock,
        id
      ])


      res.json(result);
  } catch (error) {
    next(error);
  }
}

const deleteProduct = async(req, res, next) => {
  try {
    //Traemos el id de la tarea desde req.params
    const { id } = req.params;

    //Obtenemos el id de la imagen del producto
    const resultProduct = await pool.query('SELECT * FROM product WHERE id = $1',[id]);
    //Si no existe el producto, retorna el siguiente error
    if (resultProduct.rows.length === 0) 
    return res.status(404).json({
      message: 'product not found'
    })
    const image_id = resultProduct.rows[0].image_id;

    //Eliminamos el producto
    const result = await pool.query('DELETE FROM product WHERE id = $1',[id]);

    //Eliminamos la imagen del producto
    const resultImage = await pool.query('DELETE FROM image WHERE id = $1',[image_id]);

    // Devuelve un 204, si elimina algo el body viene vacio
    return res.sendStatus(204);
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}