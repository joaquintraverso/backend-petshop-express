const { response, query } = require('express');
const pool = require('../db');
const { admin } = require('../config');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);

//Devuelve un json de todos los usuarios
const getAllUser = async(req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM "user"')
    res.json(result.rows)
  } catch (error) {
    next(error);
  }

}

//Devuelve un json con el usario igual al id buscado
const getUser = async(req, res, next) => {
  try {
    const {id} = req.params;
    const result = await pool.query('SELECT * FROM "user" WHERE id = $1', [id])
    if (result.rows.length === 0) 
    return res.status(404).json({
      message: "user not found"
    })
  
    res.json(result.rows);
  } catch (error) {
    next(error);
  }

}

//Crea un usario en la tabla usario y agrega una imagen en la tabla imagen
const createUser = async(req, res, next) => {
  try {
    const {dni, name, lastname, phone, email} = req.body;
    //Recuperamos la imagen desde req
    const imagen = req.files.imagen;
    //Recuperamos el titulo de la imagen
    const title_img = req.files.imagen.name;
    //Subida de imagen a cludinary
    const cloudinary_id = (await uploader(imagen.tempFilePath)).public_id;

    const is_admin = admin.email === email;
    console.log(admin.email);
    //consultar de la tabla email_isadmin todos los email de los usuarios admin.
    // select email from email_isadmin where email = $1 , [ email ]
    //Insertamos datos en el usuario
    const resultUser = await pool.query('INSERT INTO "user" (dni, name, lastname, phone, email, is_admin, cloudinary_id, title_img) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      dni, 
      name,
      lastname,
      phone,
      email,
      is_admin,
      cloudinary_id,
      title_img
    ])


    //Recuperamos el ID del user
    const user_id = resultUser.rows[0].id;

    //Creamos el carrito para el usuario
    const resultCart = await pool.query('INSERT INTO "cart" (user_id) VALUES($1)',[user_id]);

    //Creamos los favoritos para el usuario
    const resultFav = await pool.query('INSERT INTO "favorite" (user_id) VALUES($1)', [user_id]);
    
    res.json(resultUser.rows);
    console.log(req.body);
  } catch (error) {
    next(error);
  }

}

//Actualiza los registros de la tabla usuario
const updateUser = async(req, res, next) => {
  try {
      //Traemos el id del usuario desde req.params
      const { id } = req.params
      
      //Traemos title, lastname, phone req.body
      const {name , lastname, phone} = req.body;

      // Actualiza con los datos nuevos envia
      const result = await pool.query('UPDATE "user" SET name = $1, lastname = $2, phone = $3 WHERE id = $4 RETURNING *', [
        name,
        lastname,
        phone,
        id
      ])

      res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser
}