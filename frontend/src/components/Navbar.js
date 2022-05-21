import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UserContext } from './users/UserContext';
import './mainStyles.css';

export default function Navbar() {
    //For the dropdown menu
    const [openMenu, setOpenMenu] = useState(false);
    const handleClick = () => {
        setOpenMenu(prev => !prev);
    };

    const { setLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    const logOut = () => {
        setLoggedIn({
            value: false,
            email: null
        });
        localStorage.removeItem('jwtToken');
    }

    return (
        <div className="container">
            <header className="d-flex flex-wrap justify-content-center mb-4 border-bottom mt-2">
                <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32"></svg>
                    <span className="fs-4">CompanyOrganizationApp</span>
                </div>
                <div style={{ paddingTop: '0.5rem' }}>
                    <Button
                        id="basic-button"
                        aria-controls={openMenu ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleClick}
                        variant="text"
                        size="large"
                    >
                        Menu
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={document.getElementById('basic-button')}
                        open={openMenu}
                        onClose={handleClick}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => navigate('/home')}>Home</MenuItem>
                        <MenuItem onClick={() => navigate('/MainPersons')}>Persons</MenuItem>
                        <MenuItem onClick={() => navigate('/MainGroups')} style={{ borderBottom: '1px  gray dotted' }}>Groups</MenuItem>
                        <MenuItem onClick={logOut}>Logout</MenuItem>
                    </Menu>
                </div>
            </header>
        </div>
    );
}