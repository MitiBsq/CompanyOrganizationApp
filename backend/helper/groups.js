const pool = require('../db/index');

//For checking the person we want to add in the group
const checkMembers = async (person_id, group_id) => {
    try {
        const whereIsMember = await pool.query('SELECT group_id FROM group_members WHERE person_id = $1', [person_id]);
        //Check if he/she is member in any group
        if (whereIsMember.rows.length !== 0) {
            //Check if he/she is already a member in the group
            if (whereIsMember.rows.length === 1 && whereIsMember.rows[0].group_id === group_id) {
                return false;
            }
            //Getting all the child and parent groups of the group we want to move the person in
            const parentElement = await getParentGroups(group_id);
            const childElement = await getChildrenGroups(group_id);
            let getTheId = [];
            //Filter the data
            for (let i = 0; i < childElement.length; ++i) {
                getTheId.push(childElement[i].group_id);
            }
            let filteWhereIsMember = []
            for (let i = 0; i < whereIsMember.rows.length; ++i) {
                filteWhereIsMember.push(whereIsMember.rows[i].group_id);
            }
            //Kind of moving the person from the child group to the main group
            for (let i = 0; i < filteWhereIsMember.length; ++i) {
                if (getTheId.includes(filteWhereIsMember[i])) {
                    const removeFromChildGroups = await pool.query('DELETE FROM group_members WHERE person_id = $1 AND group_id = $2', [person_id, filteWhereIsMember[i]]);
                }
                if (parentElement.includes(filteWhereIsMember[i])) {
                    const removeFromParentGroups = await pool.query('DELETE FROM group_members WHERE person_id = $1 AND group_id = $2', [person_id, filteWhereIsMember[i]]);
                }
            }
            return true;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error.message);
    }
}

//Verifying if the group we want to add is not parent to that group_parent(fixing a buble)
const checkGroups = async (groupToVerify, groupToAdd) => {
    try {
        let condition = false;
        let result = null;
        do {
            const check = await pool.query('SELECT parent_group FROM groups WHERE group_id = $1', [result !== null ? result : groupToVerify]);
            if (check.rows.length === 0 || check.rows[0].parent_group === null) {
                if (result === groupToAdd) {
                    condition = true;
                    result = false;
                } else {
                    condition = true;
                    result = true;
                }
            } else {
                result = check.rows[0].parent_group;
                if (result === groupToAdd) {
                    condition = true;
                    result = false;
                }
            }
        } while (condition === false);
        return result;
    } catch (error) {
        console.error(error.message);
    }
}

//Get all the parent groups(tree) of the group-For checkMembers function
const getParentGroups = async (theMainGroup) => {
    try {
        let condition = false;
        let i = 0;
        let newChild = null;
        let parents = [];
        do {
            if (parents.length === 0) {
                newChild = theMainGroup
            } else {
                newChild = parents[i];
                ++i;
            }
            const check = await pool.query('SELECT parent_group FROM groups WHERE group_id= $1', [newChild]);
            if ((check.rows.length === 0 && i === parents.length) || check.rows[0].parent_group === null) {
                condition = true;
            } else {
                for (let i = 0; i < check.rows.length; ++i) {
                    if (!parents.includes(check.rows[i].parent_group)) {
                        parents.push(check.rows[i].parent_group);
                    }
                }
            }
        } while (condition === false);
        return parents
    } catch (error) {
        console.error(error.message);
    }
}

//Get all the children-groups of the group--For making the tree
const getChildrenGroups = async (theMainGroup) => {
    try {
        let condition = false;
        let i = 0;
        let newParent = null;
        let childrens = [];
        do {
            if (childrens.length === 0) {
                newParent = theMainGroup
            } else {
                newParent = childrens[i].group_id;
                ++i;
            }
            const check = await pool.query('SELECT group_id, group_name FROM groups WHERE parent_group = $1', [newParent]);
            if (check.rows.length === 0 && i === childrens.length) {
                condition = true;
            } else {
                for (let i = 0; i < check.rows.length; ++i) {
                    if (!childrens.includes(check.rows[i].group_id)) {
                        childrens.push({
                            group_id: check.rows[i].group_id,
                            name: check.rows[i].group_name,
                            parent: newParent
                        });
                    }
                }
            }
        } while (condition === false);
        return childrens;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { checkMembers, checkGroups, getChildrenGroups };