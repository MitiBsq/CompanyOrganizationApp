import React, { useState, useEffect } from 'react';

export default function EditGroup(props) {
    //For showing the user that the group name has been successfully changed 
    const [colorSucces, setColorSucces] = useState('dark');
    //For keeping track of the group name before, during and after the edit is completed
    const [groupName, setGroupName] = useState(props.param.split('-')[0]);
    function handleGroupName(e) {
        setGroupName(e.target.value);
    }

    //Editing the group name (submiting)
    const handleClick = async () => {
        if (groupName.trim() === '' || groupName.trim() === props.param.split('-')[0]) {
            setGroupName(props.param.split('-')[0]);
        } else {
            try {
                const body = { groupName }
                const response = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const checkName = await response.json();
                if (checkName === 'Name Changed') {
                    setColorSucces('green');
                    props.update();
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    //Fetching all persons and groups registered in the database
    const [allData, setAllData] = useState({
        allPersons: [],
        allGroups: []
    });
    useEffect(() => {
        const getPersonsAndGroups = async () => {
            try {
                const responsePersons = await fetch('http://localhost:5000/api/persons')
                const responseGroups = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}/availableGroups`)
                const jsonDataPersons = await responsePersons.json();
                const jsonDataGroups = await responseGroups.json();
                setAllData({
                    allPersons: jsonDataPersons,
                    allGroups: jsonDataGroups
                });
            } catch (error) {
                console.error(error.message);
            }
        }
        getPersonsAndGroups();
    }, [props.param]);

    //Function for adding/removing a member
    const addRemovePerson = async (doWhat, person_id) => {
        if (doWhat === '+') {
            try {
                const group_id = props.param.split('-')[1];
                const body = { person_id, group_id }
                const respone = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}/addPerson`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                props.update();
            } catch (error) {
                console.error(error.message);
            }
        } else {
            try {
                const unique_key = 'gr' + props.param.split('-')[1] + '-' + person_id;
                const body = { unique_key }
                const respone = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}/removeMember`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                props.update();
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    //Function for adding/removing a child-group;
    const addRemoveGroup = async (doWhat, child_group_id) => {
        if (doWhat === '+') {
            try {
                const parent_group_id = props.param.split('-')[1];
                const body = { parent_group_id, child_group_id }
                const respone = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}/addGroup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                props.update();
            } catch (error) {
                console.error(error.message);
            }
        } else {
            try {
                const respone = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}/removeGroup`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ child_group_id })
                });
                props.update();
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    //Searching filter for groups and persons
    const [search, setSearch] = useState({
        persons: '',
        groups: ''
    });
    function handleSearchFilter(e) {
        const { value, name } = e.target
        setSearch(prev => { return { ...prev, [name]: value } });
    }

    //Function for closing the modal menu;
    const closePanel = (e) => {
        if (e.target.className === 'backdrop') {
            props.showTheBox();
        }
    }

    return (
        <div className='backdrop' onClick={closePanel}>
            <div className='editGroupPanel'>
                <div className='editNamePlace'>
                    <div className="input-group w-50">
                        <input type="text" className="theName" value={groupName} onChange={handleGroupName} />
                        <button type="button" className="btn-outline-secondary checkMark" onClick={handleClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16" color={colorSucces}>
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='editMembers'>
                    <input type='text' className='form-control' name='persons' placeholder='Search for a person to add or remove' onChange={handleSearchFilter} />
                    <div className='searchList'>
                        {/* Filtering the persons and members  */}
                        {allData.allPersons.map(person => {
                            return <div key={person.person_id} style={person.fullname.toUpperCase().indexOf(search.persons.toUpperCase()) > -1 ? { display: 'block', textAlign: 'center' } : { display: 'none' }}>
                                {person.fullname}{props.memberKeys.includes(person.person_id) ? <button type="button" className="btn btn-outline-success" onClick={() => addRemovePerson('-', person.person_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" ></path>
                                    </svg>
                                </button> :
                                    <button type="button" className="btn btn-outline-primary" onClick={() => addRemovePerson('+', person.person_id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                                        </svg>
                                    </button>
                                }
                            </div>
                        })}
                    </div>
                </div>
                <div className='editChildGroups'>
                    <input type='text' name='groups' onChange={handleSearchFilter} className='form-control' placeholder='Search for a group to add or remove' />
                    <div className='searchList'>
                        {allData.allGroups.map(group => {
                            return <div key={group.group_id} className='groups' style={group.group_name.toUpperCase().indexOf(search.groups.toUpperCase()) > -1 ? { display: 'block', textAlign: 'center' } : { display: 'none' }}>
                                {group.group_name}{props.groupKeys.includes(group.group_id) ? <button type="button" className="btn btn-outline-success" onClick={() => addRemoveGroup('-', group.group_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" ></path>
                                    </svg>
                                </button> :
                                    <button type="button" className="btn btn-outline-primary" onClick={() => addRemoveGroup('+', group.group_id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                                        </svg>
                                    </button>
                                }
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}