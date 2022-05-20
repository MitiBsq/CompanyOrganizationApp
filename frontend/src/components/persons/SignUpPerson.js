import React, { useContext, useState } from 'react';
import { UserContext } from '../users/UserContext';
import './personsStyles.css';

export default function SignUpPerson(props) {
  //For keeping track with the data (controlled-component)
  const [newPerson, setNewPerson] = useState({
    first_name: '',
    last_name: '',
    job_title: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPerson({ ...newPerson, [name]: value });
  }

  const { loggedIn } = useContext(UserContext);

  //Creating the person
  const handleClick = async (e) => {
    //If there is data inserted in the input(for not sending empty data)
    if (newPerson.first_name.trim() !== '' || newPerson.last_name.trim() !== '' || newPerson.job_title.trim() !== '') {
      try {
        const { first_name, last_name, job_title } = newPerson;
        const email = loggedIn.email
        const respone = await fetch('http://localhost:5000/api/persons', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first_name, last_name, job_title, email })
        });
        if (respone.status === 200) {
          props.updateList();
          props.showPanelNewPerson();
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  //Closing the menu
  const closePanel = (e) => {
    if (e.target.className === 'backdrop') {
      props.showPanelNewPerson();
    }
  }

  return (
    <div className='backdrop' onClick={closePanel}>
      <div className='addPanelPerson'>
        <div className='addBlock' style={{ whiteSpace: 'pre-line' }}>
          <h1>Sign Up a new Person </h1>
          <input type='text' value={newPerson.first_name} name='first_name' onChange={handleChange} className='form-control' placeholder='Enter First Name' />
          <input type='text' value={newPerson.last_name} name='last_name' onChange={handleChange} className='form-control' placeholder='Enter Last Name' />
          <input type='text' value={newPerson.job_title} name='job_title' onChange={handleChange} className='form-control' placeholder='Enter Job title' />
          <button className='btn btn-primary' onClick={handleClick}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}