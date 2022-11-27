const { response, query } = require('express');
const pool = require('../db');

const getAllTypePet = async(req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM "pet_type"')
    console.log(result)
    res.json(result.rows)
  } catch (error) {
    next(error);
  }

}

module.exports = {
  getAllTypePet
}