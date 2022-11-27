const { response, query } = require('express');
const pool = require('../db');

const getAllComments = async(req, res, next) => {
  try {
    const { product_id } = req.body;
    const result = await pool.query('SELECT * FROM "comment" WHERE product_id = $1', [ product_id ])
    res.json(result.rows)
  } catch (error) {
    next(error);
  }

}

//recuperamos un comentario
const getComment = async(req, res, next) => {
  try {

    const {id} = req.params;
    const result = await pool.query('SELECT * FROM "comment" WHERE id = $1', [id])
    if (result.rows.length === 0) 
    return res.status(404).json({
      message: "comment not found"
    })
    
    res.json(result.rows);
    console.log(req.body);
  } catch (error) {
    next(error);
  }

}


//Crea un comentario
const createComment = async(req, res, next) => {
  try {
    const { comment, user_id, product_id } = req.body;

    const result = await pool.query('INSERT INTO "comment" (comment, user_id, product_id) VALUES($1, $2, $3) RETURNING *', 
    [
      comment,
      user_id,
      product_id,
    ])
      
    res.json(result.rows);
    console.log(req.body);
  } catch (error) {
    next(error);
  }

}

const updateComment = async (req, res, next) => {
  try {

    //recuperamos la id del comentario
    const { id } = req.params;

    const { response } = req.body;

    const result = await pool.query('UPDATE comment SET response = $1, response_date =  CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', 
    [
      response,
      id
    ])
      
    res.json(result.rows);
    console.log(req.body);
  } catch (error) {
    next(error);
  }

}

module.exports = {
  getAllComments,
  getComment,
  createComment,
  updateComment,
}