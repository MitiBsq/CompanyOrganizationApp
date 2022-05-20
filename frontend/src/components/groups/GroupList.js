import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../users/UserContext';

export default function GroupList(props) {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const { loggedIn } = useContext(UserContext);

    //Fetching all the groups from the database
    useEffect(() => {
        const getGroups = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/group', {
                    method: 'GET',
                    headers: { email: loggedIn.email }
                })
                const jsonData = await response.json();
                setGroups(jsonData);
                setLoading(false);
            } catch (error) {
                console.error(error.message);
            }
        }
        getGroups();
    }, [props.updateList, loggedIn]);

    return (
        <div className="list-group">
            {loading ? 'Loading...' : groups.length !== 0 ?
                groups.map(group => <Link key={group.group_id} to={`/group/${group.group_name}-${group.group_id}`} className="list-group-item list-group-item-action" aria-current="true">{group.group_name}</Link>) :
                <h6 style={{ fontSize: 'small' }}>There are no active groups...</h6>
            }
        </div>
    );
}