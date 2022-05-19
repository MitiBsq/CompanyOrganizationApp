import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './personsStyles.css';

export default function EditPerson(props) {
    const [personDetails, setPersonDetails] = useState({
        first_name: '',
        last_name: '',
        job_title: ''
    });

    //Control components type
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonDetails(prev => {
            return { ...prev, [name]: value }
        });
    }

    //If the user does not edit all the fields we send back the initial field data
    const confirmEdit = async () => {
        try {
            const first_name = personDetails.first_name.trim().length > 0 ? personDetails.first_name : props.person.first_name
            const last_name = personDetails.last_name.trim().length > 0 ? personDetails.last_name : props.person.last_name
            const job_title = personDetails.job_title.trim().length > 0 ? personDetails.job_title : props.person.job_title
            const response = await fetch(`http://localhost:5000/api/persons/${props.person.person_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name, last_name, job_title })
            });
            const jsonRespone = await response.json();
            if (jsonRespone === 'Succes') {
                props.updateList();
                props.showEditPanel();
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const closePanel = (e) => {
        if (e.target.className === 'backdrop') {
            props.showEditPanel();
        }
    }

    return (
        <div className='backdrop' onClick={closePanel}>
            <div className='editPersonPanel'>
                <div>
                    <label htmlFor='first_name'>First Name</label>
                    <TextField
                        id="first_name"
                        label={props.person.first_name}
                        variant="standard"
                        name="first_name"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor='last_name'>Last Name</label>
                    <TextField
                        id="last_name"
                        label={props.person.last_name}
                        variant="standard"
                        name="last_name"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor='job_title'>Job Title</label>
                    <TextField
                        id="job_title"
                        label={props.person.job_title}
                        variant="standard"
                        name="job_title"
                        onChange={handleChange}
                    />
                </div>
                <button className='btn btn-outline-secondary btn-lg' onClick={confirmEdit}>Confirm</button>
            </div>
        </div>
    );
}