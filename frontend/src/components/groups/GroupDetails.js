import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DeleteGroup from './DeleteGroup';
import EditGroups from './EditGroup';
import GroupTree from './GroupTree';

export default function GroupDetails() {
    //Keeping track on the 'collapse menu' of members and children-groups list
    const [showMembers, setShowMembers] = useState({
        members: 'collapse',
        childGroups: 'collapse'
    });
    //For showing the modal menu
    const [openBox, setOpenBox] = useState({
        editGroup: false,
        deleteGroup: false,
        familyTree: false
    });
    //For having all the details of all persons registerd in the database
    const [details, setDetails] = useState({
        members: [],
        childMembers: [],
        childGroups: [],
    });
    // For having a filtered data of the persons extracted from database
    const [allMembers, setAllMembers] = useState([]);
    //For keeping trach when to update the list of details
    const [updateList, setUpdateList] = useState(false);

    //A function tht we send to the child components mainly
    const updateTheList = () => {
        setUpdateList(prev => !prev);
    }

    //Fetching the data from the database(the members of the group(+ child-groups))
    const params = useParams();
    useEffect(() => {
        const takeData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/group/${params.id.split('-')[params.id.split('-').length - 1]}`);
                setDetails(await response.json());
            } catch (error) {
                console.error(error.message)
            }
        }
        takeData();
    }, [params.id, updateList]);

    //Function for the collapse menu
    const toggleCollapse = (showWhat) => {
        const newValue = showMembers[showWhat] === 'collapse' ? 'collapse show' : 'collapse';
        setShowMembers(prevStats => {
            return {
                ...prevStats, [showWhat]: newValue
            }
        });
    }

    //Filtering the obtained data from database
    useEffect(() => {
        const memberData = details.members.map(member => {
            const fullname = member.first_name + ' ' + member.last_name;
            const key = member.person_id;
            const outsider = false;
            return [fullname, key, outsider]
        });
        const childData = details.childMembers.map(member => {
            const fullname = member.first_name + ' ' + member.last_name;
            const key = member.person_id;
            const outsider = true;
            return [fullname, key, outsider]
        });
        setAllMembers([...memberData, ...childData])
    }, [details]);

    //Show the model box for (edit or delete button)
    const showTheBox = (whatToShow) => {
        setOpenBox(prevStats => {
            return {
                ...prevStats, [whatToShow]: !prevStats[whatToShow]
            }
        });
    }

    return (
        <div style={{ marginTop: '5%' }}>
            <div className='container'>
                <ul className="nav nav-pills nav-justified">
                    <li className="nav-item">
                        <button className='btn btn-primary btn-lg' onClick={() => showTheBox('editGroup')}>Edit Group</button>
                    </li>
                    <li className="nav-item">
                        <button className='btn btn-primary btn-lg' onClick={() => showTheBox('deleteGroup')}>Delete Group</button>
                    </li>
                </ul>
            </div>
            <div className='groupDetails'>
                <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center listText" onClick={() => toggleCollapse('members')}>
                        Members
                        <span className="badge bg-primary rounded-pill">{allMembers.length}</span>
                    </li>
                    <div className={showMembers.members}>
                        <div className="card card-body">
                            <ul className='memberList'>
                                {
                                    allMembers.map(member => {
                                        const theClass = member[2] ? 'outsider' : 'mainMember'
                                        return <li key={member[1]}>
                                            <button
                                                className={theClass}
                                            >
                                                {member[0]}
                                            </button>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <li className="list-group-item d-flex justify-content-between align-items-center listText" onClick={() => toggleCollapse('childGroups')}>
                        Children Groups
                        <span className="badge bg-primary rounded-pill">{details.childGroups.length}</span>
                    </li>
                    <div className={showMembers.childGroups}>
                        <div className="cardStyle card-body">
                            <ul className='memberList'>
                                {
                                    details.childGroups.map(group => {
                                        return <li key={group.group_id}>
                                            <button
                                                className='mainMember'
                                            >
                                                {group.name}
                                            </button>
                                        </li>
                                    })
                                }
                            </ul>
                            <button className='btn btn-outline-dark btn-sm' onClick={() => showTheBox('familyTree')}>See Full Details</button>
                        </div>
                    </div>
                </ul>
            </div>
            {openBox.editGroup && <EditGroups showTheBox={() => showTheBox('editGroup')} param={params.id} memberKeys={allMembers.map(member => member[2] === false ? member[1] : 'o' + member[1])}
                update={updateTheList} groupKeys={details.childGroups.map(group => group.group_id)} />}
            {openBox.deleteGroup && <DeleteGroup showTheBox={() => showTheBox('deleteGroup')} param={params.id} update={updateTheList} />}
            {openBox.familyTree && <GroupTree showTheBox={() => showTheBox('familyTree')} groupId={params.id} childGroups={details.childGroups} />}
        </div>
    );
}