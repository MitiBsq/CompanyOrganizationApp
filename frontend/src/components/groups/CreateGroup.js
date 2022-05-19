import React, { useState } from 'react';

export default function CreateGroup(props) {
  //For keeping track with the data (controlled-component)
  const [newGroup, setnewGroup] = useState('');

  const handleChange = (e) => {
    setnewGroup(e.target.value);
  }

  //Creating the group
  const handleClick = async (e) => {
    //If there is data inserted in the input(for not sending empty data)
    if (newGroup.trim() !== '') {
      try {
        const group_name = { newGroup }
        const respone = await fetch('http://localhost:5000/api/group', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(group_name)
        });
        props.showTheBox(true);
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