// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
//import WebSocketService from "../services/WebSocketService.jsx";

function UserDashboard() {
    const navigate = useNavigate();
    const { name } = useParams();
    const userId = sessionStorage.getItem('userId'); // Get user ID from session storage
    const [devices, setDevices] = useState([]);
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        // Fetch user data based on the user ID
        axios.get(`http://localhost:8080/api/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
        //const webSocketService = WebSocketService();
        //webSocketService.initializeWebSocketConnection();
        axios.get(`http://localhost:8089/deviceApi/devices/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setDevices(response.data);
            })
            .catch((error) => {
                console.error('Error fetching devices:', error);
            });
    }, [userId]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = () => {
        // Update user data with the changes
        axios.put(`http://localhost:8080/api/user/update`, userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
                setEditing(false);
            })
            .catch((error) => {
                console.error('Error updating user data:', error);
            });
    };

    const handleChange = (field, value) => {
        // Update the user data when changes are made
        setUserData({ ...userData, [field]: value });
    };

    return (
        <div>
            <h1>Welcome to the User Dashboard</h1>
            {userData && (
                <div>
                    {editing ? (
                        <div>
                            <h2>Edit User Details</h2>
                            <Form>
                                <Form.Item label="Name">
                                    <Input
                                        value={userData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Password (hidden)">
                                    <Input.Password
                                        placeholder="********" // Display placeholder instead of actual password
                                        disabled // Disable password field for editing
                                    />
                                </Form.Item>
                                <Button type="primary" onClick={handleSave}>
                                    Save
                                </Button>
                                <Form.Item>
                                    <Button onClick={() => navigate('/chat')}>Chat</Button>
                                </Form.Item>

                            </Form>
                        </div>
                    ) : (
                        <div>
                            <p>Hello, User {name}!</p>
                            <p>Name: {userData.name}</p>
                            <p>Email: {userData.email}</p>
                            <Button onClick={handleEdit}>Edit</Button>
                            <Button onClick={() => navigate('/chat')}>Chat</Button>
                        </div>
                    )}
                    <h2>Your Devices</h2>
                    <ul>
                        {devices.map((device) => (
                            <li key={device.id}>{device.name}</li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
}

export default UserDashboard;
