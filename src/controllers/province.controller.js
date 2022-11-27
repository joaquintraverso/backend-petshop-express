const { response, query } = require('express');
const pool = require('../db');

const getAllProvince = async(req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM "province"')
    console.log(result)
    res.json(result.rows)
  } catch (error) {
    next(error);
  }

}

module.exports = {
  getAllProvince
}