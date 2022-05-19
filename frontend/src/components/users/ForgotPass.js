import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
    //nextStep is used for showing the email or the password label
    const [nextStep, setNextStep] = useState(false)
    const [user, setUser] = useState({
        email: '',
        newPassword: '',
        confirmNewPass: ''
    });

    //After the pass is updated if you click the toast message it will send you to the log in page
    const navigate = useNavigate();
    const notifySucces = () => {
        toast.success('Password Updated! Go To Log In', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClick: () => navigate('/logIn')
        });
    }

    const notifyError = (theErrorMessage) => {
        toast.error(theErrorMessage, {
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
        setUser({ ...user, [name]: value });
    }

    const theme = createTheme();

    //Check if the email sent by the user is good
    const checkEmail = async (e) => {
        e.preventDefault();
        if (user.email.trim() !== '') {
            const { email } = user;
            try {
                const response = await fetch('http://localhost:5000/api/users/forgotPass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const jsonResponse = await response.json();
                if (jsonResponse === 'Email is Good') {
                    setNextStep(true);
                } else {
                    notifyError(jsonResponse);
                }
            } catch (error) {
                console.error(error.message)
            }
        }
    }

    const sendNewPass = async (e) => {
        e.preventDefault();
        if (user.newPassword.trim() !== '' || user.confirmNewPass.trim() !== '') {
            if (user.newPassword === user.confirmNewPass) {
                const { email, newPassword } = user;
                try {
                    const response = await fetch('http://localhost:5000/api/users/forgotPass', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, newPassword })
                    });
                    const jsonResponse = await response.json();
                    if (jsonResponse === 'Password updated') {
                        notifySucces();
                    } else {
                        notifyError(jsonResponse);
                    }
                } catch (error) {
                    console.error(error.message)
                }
            } else {
                notifyError('The New Password and Confirm Password doesnt match');
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
                            {nextStep === false ? 'What is your email address?' : 'Set your new password'}
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {nextStep === false ?
                                <div>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={checkEmail}
                                    >
                                        Check Email
                                    </Button>
                                </div> :
                                <div>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="newPassword"
                                        label="New password"
                                        type="password"
                                        value={user.newPassword}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirmNewPass"
                                        label="Confirm new password"
                                        type="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={sendNewPass}
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            }
                            <Grid container>
                                <Grid item>
                                    <Link href="/SignIn" variant="body2">
                                        {"Don't have an account? Sign Up"}
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