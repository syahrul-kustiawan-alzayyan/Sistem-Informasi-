import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/KANTOR__2_-removebg-preview.png';
import vector from '../assets/10545730-removebg-preview.png';
import './register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState(''); // success or error
    const navigate = useNavigate();

    const showPopup = (message, type) => {
        setPopupMessage(message);
        setPopupType(type);
        setTimeout(() => {
            setPopupMessage('');
            setPopupType('');
        }, 2000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !phone || !password) {
            showPopup('Semua data harus diisi!', 'error');
            return;
        }

        axios
            .post('http://localhost:3001/register', { username, phone, password })
            .then((result) => {
                showPopup('Registrasi berhasil!', 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                showPopup('Registrasi gagal. Silakan coba lagi.', 'error');
            });
    };

    return (
        <div className="register-container">
            {popupMessage && (
                <div className={`popup ${popupType}`} style={{
                    position: 'fixed',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px 30px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: '9999',
                    color: 'white',
                    textAlign: 'center',
                    backgroundColor: popupType === 'success' ? '#28a745' : '#dc3545',
                }}>
                    {popupMessage}
                </div>
            )}
            <div className="register-card">
                <div className="register-left">
                    <h3>DAFTAR</h3>
                    <p>Selamat datang di aplikasi pengajuan majelis taklim kabupaten garut</p>
                    <Form onSubmit={handleRegister}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="username-addon">
                                <i className="fas fa-user"></i>
                            </InputGroup.Text>
                            <FormControl
                                placeholder="masukan username"
                                aria-label="Username"
                                aria-describedby="username-addon"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="phone-addon">
                                <i className="fas fa-phone"></i>
                            </InputGroup.Text>
                            <FormControl
                                placeholder="masukan nomor handphone"
                                aria-label="Phone"
                                aria-describedby="phone-addon"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="password-addon">
                                <i className="fas fa-lock"></i>
                            </InputGroup.Text>
                            <FormControl
                                type="password"
                                placeholder="masukan password"
                                aria-label="Password"
                                aria-describedby="password-addon"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>

                        <Button variant="success" type="submit" className="register-button">
                            Daftar
                        </Button>
                    </Form>
                    <div className="login-link">
                        <p>Sudah punya akun? <Link to="/login">masuk disini!</Link></p>
                    </div>
                </div>
                <div className="register-right">
                    <div className="register-logo">
                        <Link to="/">
                            <img src={logo} alt="Logo Kementerian Agama" />
                        </Link>
                        <img src={vector} alt="Vector" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
