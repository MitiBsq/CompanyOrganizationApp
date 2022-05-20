import React from 'react';
import './personsStyles.css';

export default function DeletePersons(props) {
    //Function for closing the modal menu;
    const closePanel = (e) => {
        if (e.target.className === 'backdrop') {
            props.showTheBox();
        }
    }

    //Fetching the data to delete the selected persons
    const deleteAll = async () => {
        try {
            const body = props.selectedPers
            const respone = await fetch(`http://localhost:5000/api/persons/deleteAll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body })
            });
            if (respone.status === 200) {
                props.updateList();
                props.showTheBox();
                props.notify();
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className='backdrop' onClick={closePanel}>
            <div className='deletePersonsPanel'>
                <h3>Are you sure you want to DELETE all selected persons?</h3>
                <button className='btn btn-danger btn-lg' onClick={deleteAll}>YES, Delete</button>
            </div>
        </div>
    );
}