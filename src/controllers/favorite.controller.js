const { response, query } = require('express');
const pool = require('../db');

const getFavorite = async(req, res, next) => {
  try {
    //Recuperamos el user_id del req.params
    const { user_id } = req.params;
    //Recuperamos el id del favorito asociado al usuario
    const favorite_id = await pool.query('SELECT * FROM "favorite" WHERE user_id = $1', [user_id]);
    //Recuperamos los id de los productos agregados al carrito
    const result = await pool.query('SELECT * FROM "product_favorite" WHERE favorite_id = $1', [ favorite_id ]);
    res.json(result.rows[0])
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFavorite,
}