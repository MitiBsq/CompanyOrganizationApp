const router = require("express").Router();
const pool = require('../db/index');

//Add new person
router.post('/persons', async (req, res) => {
    try {
        const { first_name, last_name, job_title } = req.body;
        const newPerson = await pool.query('INSERT INTO person VALUES (DEFAULT, $1, $2, $3, CURRENT_DATE) RETURNING *', [first_name, last_name, job_title]);
        if (newPerson.rows.length > 0) {
            return res.status(200).json('merge');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Get all persons + details
router.get('/persons', async (req, res) => {
    try {
        const getPersons = await pool.query("Select CONCAT(first_name, ' ', last_name) AS Fullname, first_name, last_name, job_title, person_id FROM person");
        res.json(getPersons.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//Update a person
router.put('/persons/:id', async (req, res) => {
    try {
        const { first_name, last_name, job_title } = req.body;
        const updatePerson = await pool.query('UPDATE person SET first_name = $1, last_name=$2, job_title=$3 ,date_updated = CURRENT_DATE WHERE person_id = $4 RETURNING *', [first_name, last_name, job_title, req.params.id]);
        if (updatePerson.rows.length > 0) {
            res.json('Succes');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Delete a person
router.delete('/persons/:id', async (req, res) => {
    try {
        const deletePerson = await pool.query('DELETE FROM person WHERE person_id = $1', [req.params.id]);
        res.json('Person deleted!');
    } catch (error) {
        console.error(error.message);
    }
});

//Delete multiple persons
router.post('/persons/deleteAll', async (req, res) => {
    try {
        const thePersons = req.body.body
        const deletePerson = await pool.query('DELETE FROM person WHERE person_id = ANY($1::int[])', [thePersons]);
        res.json('Persons deleted!');
    } catch (error) {
        console.error(error.message);
    }
});

//Select last person created/updated
router.get('/persons/infoLast', async (req, res) => {
    try {
        const getData = await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS Name, date_created FROM person ORDER BY date_created DESC, person_id DESC LIMIT 1");
        if (getData.rows.length > 0) {
            res.json(getData.rows[0]);
        } else {
            res.json('No Persons registered in the database');
        }
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;