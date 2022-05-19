import React, { useEffect, useState } from 'react';
import EditPerson from './EditPerson ';
import SignUpPerson from './SignUpPerson';
import { ToastContainer, toast } from 'react-toastify';
import './personsStyles.css';
import DeletePersons from './DeletePersons';

export default function MainPersons() {
    //To store the extracted data
    const [data, setData] = useState(null);
    //To update the components
    const [update, setUpdate] = useState(false);
    const [editPanel, setEditPanel] = useState({
        show: false,
        person: null
    });
    const [selectDelete, setSelectDelete] = useState({
        selectAll: false,
        selected: [],
    });
    const [showDelete, setShowDelete] = useState({
        button: false,
        panel: false
    });
    const [showNewPerson, setShowNewPerson] = useState(false);

    //Fetching the data from the database when the update is called(and the first time when rendered)
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/persons');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error(error.message);
            }
        }
        getData();
    }, [update]);

    //Delete a specific person from the database(single)
    const deletePerson = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/persons/${id}`, {
                method: 'DELETE'
            });
            updateList();
            notifySucces('Delete succeful');
        } catch (error) {
            console.error(error.message);
        }
    }

    const notifySucces = (value) => {
        toast.success(value, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const showEditPanel = (person) => {
        if (editPanel.show) {
            setEditPanel({
                show: false,
                person: null
            });
        } else {
            setEditPanel({
                show: true,
                person: person
            });
        }
    }

    const showPanelNewPerson = () => {
        if (showNewPerson) {
            setShowNewPerson(prev => !prev);
            notifySucces('Person Created Succesfully');
        } else {
            setShowNewPerson(prev => !prev);
        }
    }

    //Function that automatically updates the update-state
    const updateList = () => {
        setUpdate(prev => !prev);
        setSelectDelete({ selectAll: false, selected: [] });
    }

    //When we press the checkbox that selects all
    const selectAll = () => {
        if (selectDelete.selectAll === false) {
            const collectId = data.map(person => {
                return person.person_id;
            });
            setSelectDelete({ selectAll: true, selected: collectId });
        } else {
            setSelectDelete({ selectAll: false, selected: [] });
        }
    }

    //To check what button to show
    useEffect(() => {
        if (selectDelete.selected.length > 0) {
            setShowDelete(prev => {
                return { ...prev, button: true }
            })
        } else {
            setShowDelete(prev => {
                return { ...prev, button: false }
            })
        }
    }, [selectDelete]);

    //Show the delete-all panel
    const showDeletePanel = () => {
        setShowDelete(prev => {
            return { ...prev, panel: !prev.panel };
        })
    }

    return (
        <div className='personsTable'>
            {
                showDelete.button ? <button className='btn btn-outline-danger' onClick={showDeletePanel}>Delete All</button> : <button className='btn btn-outline-dark' onClick={showPanelNewPerson}>Sign up a new person</button>
            }
            {
                data !== null ?
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input
                                        type='checkbox'
                                        onChange={selectAll}
                                        checked={selectDelete.selectAll} />
                                </th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Job</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(person => {
                                return <tr key={person.person_id}>
                                    <th scope="row">
                                        <input type='checkbox' onChange={() => {
                                            if (selectDelete.selected.includes(person.person_id)) {
                                                const eliminate = selectDelete.selected.filter(nr => nr !== person.person_id);
                                                setSelectDelete(prev => {
                                                    return {
                                                        ...prev,
                                                        selected: eliminate
                                                    }
                                                })
                                            } else {
                                                setSelectDelete(prev => {
                                                    return {
                                                        ...prev,
                                                        selected: [...prev.selected, person.person_id]
                                                    }
                                                })
                                            }
                                        }}
                                            checked={selectDelete.selected.includes(person.person_id)}
                                        />
                                    </th>
                                    <td>{person.first_name}</td>
                                    <td>{person.last_name}</td>
                                    <td>{person.job_title}</td>
                                    <td>
                                        <button className='btn btn-danger btn-sm' onClick={() => deletePerson(person.person_id)}>Delete</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-primary btn-sm' onClick={() => showEditPanel(person)}>Edit</button>
                                    </td>
                                </tr>
                            }
                            )}
                        </tbody>
                    </table> :
                    'Loading...'
            }
            {editPanel.show && <EditPerson showEditPanel={showEditPanel} person={editPanel.person} updateList={updateList} />}
            {showNewPerson && <SignUpPerson showPanelNewPerson={showPanelNewPerson} updateList={updateList} />}
            {showDelete.panel && <DeletePersons selectedPers={selectDelete.selected} showTheBox={showDeletePanel} updateList={updateList} notify={() => notifySucces('Selected persons deleted ')} />}
            <ToastContainer />
        </div>
    );
}