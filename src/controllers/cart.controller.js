const { response, query } = require('express');
const pool = require('../db');

const getCart = async(req, res, next) => {
  try {
    //Recuperamos el user_id del req.params
    const { user_id } = req.params;
    //Recuperamos el id del carrito asociado al usuario
    const cart_id = await pool.query('SELECT * FROM "cart" WHERE user_id = $1', [user_id]);
    //Recuperamos los id de los productos agregados al carrito
    const result = await pool.query('SELECT * FROM "product_cart" WHERE cart_id = $1', [ cart_id ]);
    res.json(result.rows[0])
  } catch (error) {
    next(error);
  }
}

const addProductToCart = async(req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
  
}

const deleteCart = async(req, res, next) => {
  try {
   
  } catch (error) {
    next(error);
  }
  
}

module.exports = {
  getCart,
}