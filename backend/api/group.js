const router = require("express").Router();
const pool = require('../db/index');
const { checkMembers, checkGroups, getChildrenGroups } = require('../helper/groups');

//Create a new group
router.post('/group', async (req, res) => {
    try {
        const group_name = req.body.group_name;
        const email = req.body.email;
        const newGroup = await pool.query('INSERT INTO groups(group_name, createdby) VALUES ($1, $2) RETURNING *', [group_name, email]);
        res.status(200).json(newGroup.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//Get all groups
router.get('/group', async (req, res) => {
    try {
        const getGroups = await pool.query('Select group_name, group_id FROM groups WHERE createdby = $1 ORDER BY date_created, group_id', [req.headers.email]);
        res.status(200).json(getGroups.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//Get the groups that dont have a parent(this means the group can be added) without the group that makes the request
router.get('/group/:id/availableGroups', async (req, res) => {
    try {
        const getGroups = await pool.query('SELECT * FROM groups WHERE (parent_group IS NULL OR parent_group = $1) AND NOT group_id = $1 AND createdby=$2', [req.params.id, req.headers.email]);
        res.status(200).json(getGroups.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//Update a group's name
router.put('/group/:id', async (req, res) => {
    try {
        const group_name = req.body.groupName;
        const updateGroup = await pool.query('UPDATE groups SET group_name = $1, date_updated = CURRENT_DATE WHERE group_id = $2 RETURNING *', [group_name, req.params.id]);
        res.status(200).json("Name Changed");
    } catch (error) {
        console.error(error.message);
    }
});

//Delete a group
router.delete('/group/:id', async (req, res) => {
    try {
        const deleteGroup = await pool.query('DELETE FROM groups WHERE group_id = $1', [req.params.id]);
        res.status(200).json('Group deleted!');
    } catch (error) {
        console.error(error.message);
    }
});

//Add e new person to the group
router.post('/group/:id/addPerson', async (req, res) => {
    try {
        const { person_id, group_id } = req.body;
        const unique_key = 'gr' + group_id.toString() + '-' + person_id.toString();
        const check = await checkMembers(person_id, group_id);
        if (check) {
            const addPerson = await pool.query('INSERT INTO group_members VALUES($1, $2, CURRENT_DATE, $3) RETURNING *', [group_id, person_id, unique_key]);
            res.status(200).json(addPerson.rows[0]);
        } else {
            res.json('This Person is already a member');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Remove a person from a group
router.delete('/group/:id/removeMember', async (req, res) => {
    try {
        const { unique_key } = req.body;
        const removeMember = await pool.query('DELETE FROM group_members WHERE check_unique = $1', [unique_key]);
        res.status(200).json('Person removed!');
    } catch (error) {
        console.error(error.message);
    }
});

//Add a child-group to the group
router.post('/group/:id/addGroup', async (req, res) => {
    try {
        const { parent_group_id, child_group_id } = req.body;
        const check = await checkGroups(parent_group_id, child_group_id);
        if (check) {
            const addGroup = await pool.query('UPDATE groups SET parent_group=$1 WHERE group_id=$2', [parent_group_id, child_group_id]);
            res.status(200).json(addGroup.rows[0]);
        } else {
            res.json('This Group is already a child group');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Remove a child-group from the group
router.delete('/group/:id/removeGroup', async (req, res) => {
    try {
        const { child_group_id } = req.body;
        const removeGroup = await pool.query('UPDATE groups SET parent_group = DEFAULT WHERE group_id=$1', [child_group_id]);
        res.status(200).json('Group removed!');
    } catch (error) {
        console.error(error.message);
    }
});

//Get Group details
router.get('/group/:id', async (req, res) => {
    try {
        //Get persons from the main group
        const getGroupMembers = await pool.query('SELECT person.first_name, person.last_name, person.job_title, person.person_id FROM person JOIN group_members ON person.person_id = group_members.person_id WHERE group_members.group_id = $1', [req.params.id]);
        //Get the main children groups of the main group
        const getGroupChildrenGroups = await pool.query('SELECT group_name, group_id FROM groups WHERE parent_group = $1', [req.params.id]);
        const theChildrenGroups = [];
        const getTheId = [];
        //Get all the children groups of the childrens of the main group(if there are)
        if (getGroupChildrenGroups.rows.length > 0) {
            for (let i = 0; i < getGroupChildrenGroups.rows.length; ++i) {
                theChildrenGroups.push({
                    group_id: getGroupChildrenGroups.rows[i].group_id,
                    name: getGroupChildrenGroups.rows[i].group_name
                });
                const element = await getChildrenGroups(getGroupChildrenGroups.rows[i].group_id);
                theChildrenGroups.push(...element);
            }
            for (let i = 0; i < theChildrenGroups.length; ++i) {
                getTheId.push(theChildrenGroups[i].group_id);
            }
        }
        //Get all the members and child members
        const getGroupChildrenMembers = await pool.query('SELECT person.first_name, person.last_name, person.job_title, person.person_id FROM person JOIN group_members ON person.person_id = group_members.person_id WHERE group_members.group_id = ANY($1::int[]) ', [getTheId]);
        const data = {
            members: await getGroupMembers.rows,
            childMembers: await getGroupChildrenMembers.rows,
            childGroups: await theChildrenGroups
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
    }
});

//Select last group created/updated
router.get('/groups/infoLast', async (req, res) => {
    try {
        const getData = await pool.query("SELECT group_name, date_created FROM groups WHERE createdby=$1 ORDER BY date_created DESC, group_id DESC LIMIT 1", [req.headers.email]);
        if (getData.rows.length > 0) {
            res.status(200).json(getData.rows[0]);
        } else {
            res.json('No Groups registered in the database');
        }
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;