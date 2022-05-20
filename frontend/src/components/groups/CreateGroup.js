import React, { useState, useContext } from 'react';
import { UserContext } from '../users/UserContext';

export default function CreateGroup(props) {
  //For keeping track with the data (controlled-component)
  const [newGroup, setnewGroup] = useState('');

  const handleChange = (e) => {
    setnewGroup(e.target.value);
  }

  const { loggedIn } = useContext(UserContext);

  //Creating the group
  const handleClick = async (e) => {
    //If there is data inserted in the input(for not sending empty data)
    if (newGroup.trim() !== '') {
      try {
        const body = {
          group_name: newGroup,
          email: loggedIn.email
        }
        const respone = await fetch('http://localhost:5000/api/group', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (respone.status === 200) {
          props.showTheBox(true);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  //Closing the menu
  const closePanel = (e) => {
    if (e.target.className === 'backdrop') {
      props.showTheBox();
    }
  }

  return (
    <div className='backdrop' onClick={closePanel}>
      <div className='addPanelGroup'>
        <div className='addBlock' style={{ whiteSpace: 'pre-line' }}>
          <h1>Create a new Group</h1>
          <input type='text' value={newGroup} name='first_name' onChange={handleChange} className='form-control' placeholder='Enter Group Name' />
          <button className='btn btn-primary' onClick={handleClick}>Create Group</button>
        </div>
      </div>
    </div>
  );
}