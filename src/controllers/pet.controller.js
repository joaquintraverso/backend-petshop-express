const { response, query } = require('express');
const pool = require('../db');

const getAllPets = async(req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query('SELECT * FROM "pet" WHERE user_id = $1', [ user_id ])
    res.json(result.rows)
  } catch (error) {
    next(error);
  }

}

//Devuelve un json con la mascota igual al id buscado
const getPet = async(req, res, next) => {
  try {
    const {id} = req.params;
    const result = await pool.query('SELECT * FROM pet WHERE id = $1', [id])
    if (result.rows.length === 0) 
    return res.status(404).json({
      message: "pet not found"
    })
  
    res.json(result.rows);
  } catch (error) {
    next(error);
  }

}

//Crea una mascota en la tabla mascota
const createPet = async(req, res, next) => {
  try {
    const { name, user_id, type } = req.body;
    
    const resultId = await pool.query('SELECT * FROM "pet_type" WHERE name = $1', [type]);
    console.log(resultId);
    const type_id = resultId.rows[0].id;

    const resultPet = await pool.query('INSERT INTO "pet" (name, user_id, pet_type_id) VALUES($1, $2, $3) RETURNING *', 
    [
      name,
      user_id,
      type_id
    ])
      
    res.json(resultPet.rows);
    console.log(req.body);
  } catch (error) {
    next(error);
  }

}

const deletePet = async(req, res, next) => {
  try {
    //Traemos el id de la tarea desde req.params
    const { id } = req.params;

    //Obtenemos el id de la mascota
    const resultPet = await pool.query('SELECT * FROM "pet" WHERE id = $1',[id]);
    //Si no existe la mascota, retorna el siguiente error
    if (resultPet.rows.length === 0) 
    return res.status(404).json({
      message: 'pet not found'
    })

    //Eliminamos la mascota
    const result = await pool.query('DELETE FROM "pet" WHERE id = $1',[id]);

    // Devuelve un 204, si elimina algo el body viene vacio
    return res.sendStatus(204);
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPets,
  getPet,
  createPet,
  deletePet,
}