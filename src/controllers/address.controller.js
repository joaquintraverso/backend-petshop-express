const { response, query } = require('express');
const pool = require('../db');

const getAllAddress = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    //Obtenemos todas las direcciones que tiene cargadas el usuario.
    const resultAddress = await pool.query('SELECT * FROM "address" where user_id = $1', [ user_id ]);

    res.json(resultAddress.rows);
  } catch (error) {
    next(error);
  }
}

const getAddress = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    
    //Obtenemos el id del req.params
    const { id } = req.params;

    //Obtenemos la direccion en especifico.
    const resultAddress = await pool.query('SELECT * FROM "address" where user_id = $1 AND id = $2', 
    [ 
      user_id,
      id
    ]);

    res.json(resultAddress.rows)

  } catch (error) {
    next(error);
  }
}

const createAddress = async (req, res, next) => {
  try {
    const { street_name, house_number, user_id, location } = req.body;
    
    //Obtener el id de la localidad mediante location que viene del req.body
    const resultLocation = await pool.query('SELECT * FROM "location" WHERE name = $1', [location])
    const location_id = resultLocation.rows[0].id

    //Crear una nueva direccion
    const resultAddress = await pool.query('INSERT INTO address (street_name, house_number, user_id, location_id) VALUES ($1, $2, $3, $4) RETURNING *', [
      street_name,
      house_number,
      user_id,
      location_id
    ])

    res.json(resultAddress.rows);
  } catch (error) {
    next(error);
  }
}

const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {street_name, house_number, location } = req.body

    const resultLocation = await pool.query('SELECT * FROM "location" WHERE name = $1', [location])
    const location_id = resultLocation.rows[0].id

    const resultAddress = await pool.query('UPDATE address SET street_name = $1, house_number = $2, location_id = $3', [
      street_name,
      house_number,
      location
    ]) 
    res.json(resultAddress.rows)
  } catch (error) {
    next(error)
  }
}

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
  
      const resultAddress = await pool.query('SELECT * FROM address WHERE id = $1',[id]);
      //Si no existe la direccion, retorna el siguiente error
      if (resultAddress.rows.length === 0) 
      return res.status(404).json({
        message: 'address not found'
      })
  
      //Eliminamos la direccion
      const result = await pool.query('DELETE FROM address WHERE id = $1',[id]);
  
      // Devuelve un 204, si elimina algo el body viene vacio
      return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllAddress,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress
}