import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from './UserContext';

export default function SignIn() {
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        job_title: '',
        createNewPerson: false,
    });

    const { setLoggedIn } = useContext(UserContext);

    //You can click on the toast message to log the user automatically
    const notifySucces = () => {
        toast.success('Account Created! Go To Home Page', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClick: () => setLoggedIn({ value: true, email: newUser.email })
        });
    }

    const notifyError = () => {
        toast.error('The email you inserted is already used!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    }

    const theme = createTheme();

    //Checking the data sent by the user, if it is good then we create a new account using the verified data
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newUser.email.trim() !== '' || newUser.password.trim() !== '' || newUser.first_name.trim() !== '' || newUser.last_name.trim() !== '') {
            try {
                const response = await fetch('http://localhost:5000/api/users/SignIn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
                const jsonResponse = await response.json();
                if (jsonResponse === 'Account Created!') {
                    if (newUser.createNewPerson && newUser.job_title.trim() !== '') {
                        const first_name = newUser.first_name;
                        const last_name = newUser.last_name;
                        const job_title = newUser.job_title;
                        const email = newUser.email;
                        const respone = await fetch('http://localhost:5000/api/persons', {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ first_name, last_name, job_title, email })
                        });
                        if (respone.status !== 200) {
                            console.error("failed to create a user");
                        }
                    }
                    notifySucces();
                } else {
                    notifyError();
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Create Account
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={newUser.email}
                                onChange={handleChange}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="First Name"
                                name="first_name"
                                autoComplete="First Name"
                                value={newUser.first_name}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Last Name"
                                name="last_name"
                                autoComplete="Last Name"
                                value={newUser.last_name}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={newUser.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <TextField
                                style={{ display: newUser.createNewPerson ? 'block' : 'none' }}
                                margin="normal"
                                required
                                fullWidth
                                name="job_title"
                                label="Job Title"
                                value={newUser.job_title}
                                onChange={handleChange}
                            />
                            <FormControlLabel
                                control={<Checkbox value="newPerson" color="primary" />}
                                label="Create a new person with this data"
                                onClick={() => {
                                    setNewUser(prev => {
                                        return {
                                            ...prev,
                                            createNewPerson: !prev.createNewPerson
                                        }
                                    });
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/LogIn" variant="body2">
                                        {"Already have an account? Log In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            <ToastContainer />
        </div>
    );
}