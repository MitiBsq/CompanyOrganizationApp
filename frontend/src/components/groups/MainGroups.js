import React, { useState } from 'react';
import CreateGroup from './CreateGroup';
import GroupList from './GroupList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './groupStyles.css';

export default function MainGroups() {
    //For showing the create model panel for one of the options 
    const [openBox, setOpenBox] = useState(false);

    //For 'alerting' React to update the interface
    const [updateList, setUpdate] = useState(false);

    //For toggling the menu
    const showTheBox = (justCreated) => {
        setOpenBox(prevStats => !prevStats);
        setUpdate(prev => !prev);
        justCreated === true && notifySucces();
    }

    const notifySucces = (name) => {
        toast.success(`Group created!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <div className='mainContent'>
            <div className='addData'>
                <button className='btn btn-outline-dark btn-lg' onClick={() => showTheBox('group')}>Create a new group</button>
            </div>
            <div className='groupList'>
                <h4>Active groups list</h4>
                <GroupList updateList={updateList} />
            </div>
            {openBox && <CreateGroup showTheBox={showTheBox} />}
            <ToastContainer />
        </div>
    );
}