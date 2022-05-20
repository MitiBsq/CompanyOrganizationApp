import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from './users/UserContext';
import './mainStyles.css';

export default function Home(props) {
    //Keeping track of the latest news 
    const [details, setDetails] = useState({
        lastPerson: {
            name: null,
            data: null
        },
        lastGroup: {
            name: null,
            data: null
        },
        noPerson: null,
        noGroup: null,
    })

    const { loggedIn } = useContext(UserContext);

    useEffect(() => {
        const notifySucces = (name) => {
            toast.success(`Welcome`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        //Welocome only when the user just logged
        if (props.welcome) {
            notifySucces();
            props.setWelcome();
        }

        const getLastPersonGroup = async () => {
            try {
                const responePerson = await fetch('http://localhost:5000/api/persons/infoLast', {
                    method: "GET",
                    headers: { email: loggedIn.email }
                });
                const responeGroup = await fetch('http://localhost:5000/api/groups/infoLast', {
                    method: "GET",
                    headers: { email: loggedIn.email }
                });
                const jsonDataPerson = await responePerson.json();
                const jsonDataGroup = await responeGroup.json();
                if (jsonDataPerson === 'No Persons registered in the database') {
                    setDetails(prev => {
                        return { ...prev, noPerson: jsonDataPerson };
                    });
                } else {
                    setDetails(prev => {
                        //Converting ISO date to yyyy/mm/dd date type
                        const date = new Date(jsonDataPerson.date_created);
                        const year = date.getFullYear();
                        const month = date.getMonth();
                        const dt = date.getDate();
                        return {
                            ...prev, lastPerson: {
                                name: jsonDataPerson.name,
                                data: year + '-' + month + '-' + dt
                            }, noPerson: null
                        }
                    });
                }
                if (jsonDataGroup === 'No Groups registered in the database') {
                    setDetails(prev => {
                        return { ...prev, noGroup: jsonDataGroup }
                    });
                } else {
                    setDetails(prev => {
                        //Converting ISO date to yyyy/mm/dd date type
                        const date = new Date(jsonDataPerson.date_created);
                        const year = date.getFullYear();
                        const month = date.getMonth();
                        const dt = date.getDate();
                        return {
                            ...prev, lastGroup: {
                                name: jsonDataGroup.group_name,
                                data: year + '-' + month + '-' + dt
                            }, noGroup: null
                        }
                    });
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        getLastPersonGroup();
    }, [props, loggedIn]);

    return (
        <div>
            <div className='homePage'>
                <h1>Last Person Created:</h1>
                {details.noPerson === null ?
                    <div>
                        <h4>Name: {details.lastPerson.name}</h4>
                        <h4>Data: {details.lastPerson.data}</h4>
                    </div> :
                    <h4>{details.noPerson}</h4>
                }
                <h1>Last Group Created:</h1>
                {details.noGroup === null ?
                    <div>
                        <h4>Name: {details.lastGroup.name}</h4>
                        <h4>Data: {details.lastGroup.data}</h4>
                    </div> :
                    <h4>{details.noGroup}</h4>
                }
            </div>
            <ToastContainer />
        </div>
    );
}