import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteGroup(props) {
    //React-router hook(After deleting the group this will send us back)
    const navigate = useNavigate();

    //Function for closing the modal menu;
    const closePanel = (e) => {
        if (e.target.className === 'backdrop') {
            props.showTheBox();
        }
    }

    //Fetching the data to delete the selected group
    const deleteGroup = async () => {
        try {
            const respone = await fetch(`http://localhost:5000/api/group/${props.param.split('-')[1]}`, {
                method: 'DELETE'
            });
            if (respone.status = 200) {
                props.update();
                //Sending the user back to the group list page
                navigate('/MainGroups');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className='backdrop' onClick={closePanel}>
            <div className='deleteGroupPanel'>
                <div className='advertiseMessage'>
                    <h3>Are you sure you want to DELETE this group?</h3>
                    <button className='btn btn-danger btn-lg' onClick={deleteGroup}>YES, Delete</button>
                </div>
            </div>
        </div>
    );
}