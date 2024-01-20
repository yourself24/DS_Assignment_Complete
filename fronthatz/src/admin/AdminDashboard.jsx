import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';



const AdminDashboard = () => {
    const navigate = useNavigate();
    const { adminId } = useParams();
    const {userId} = useParams();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const{Option}=Select;
    const [editedUser, setEditedUser] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false,
    });

    useEffect(() => {
            fetchData();

    }, []);

    const handleCreateUserSubmit = (values) => {
        // Modify the isAdmin value to be a boolean
        const isAdmin = values.isAdmin === 'Yes'; // Convert 'Yes' to true, 'No' to false

        // Send a POST request to create a new user
        axios
            .post('http://localhost:8080/api/user/register', {
                ...values,
                isAdmin: isAdmin, // Send it as a boolean
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                const createdUser = response.data;
                setUsers([...users, createdUser]);
                setEditedUser({
                    name: '',
                    email: '',
                    password: '',
                    isAdmin: false,
                });
                const userIdOnly = { userid: createdUser.id }; // Create an object with just the id
                axios
                    .post('http://localhost:8089/deviceApi/users/add', userIdOnly, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    .then((addUserResponse) => {
                        // Handle the response from the /add endpoint if needed
                        console.log('User added:', addUserResponse.data);
                    })
                    .catch((addUserError) => {
                        console.error('Error adding user:', addUserError);
                    });
            })

            .catch((error) => {
                console.error('Error creating user:', error);
            });

    };


    const fetchData = () => {
        console.log(userId)
        if(adminId===sessionStorage.getItem('userId')) {

            axios
                .get('http://localhost:8080/api/user/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching users:', error);
                });
        }
        else{
            alert("You are not authorized to view this page");
            navigate(`/user-dashboard/${userId}`);
        }

    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handleEditSubmit = () => {
        const updatedUser = {
            id: editingUser.id,
            ...editedUser,
            is_admin: editedUser.isAdmin,
        };
        if (editedUser.isAdmin === 'Yes') {
            updatedUser.isAdmin = true;
        }
        else{
            updatedUser.isAdmin = false;
        }
        console.log(updatedUser.isAdmin);

        axios
            .put(`http://localhost:8080/api/user/update`, updatedUser,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                const updatedUsers = users.map((user) =>
                    user.id === editingUser.id ? { ...user, ...updatedUser } : user
                );

                setUsers(updatedUsers);
                setEditingUser(null);
                setEditedUser({ name: '', email: '', password: '', isAdmin: false });
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    };

    const handleEditChange = (field, value) => {
        setEditedUser((prevEditedUser) => ({ ...prevEditedUser, [field]: value }));
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditedUser({ name: '', email: '', password: '', isAdmin: false });
    };

    const handleDelete = (userId) => {
        console.log(userId);
        axios.delete(`http://localhost:8080/api/user/delete/${userId}`,{ headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,},

        })
            .then((response) => {
                // Remove the device from the state
                const updatedUsers = users.filter((user) => user.id !== userId);
                setUsers(updatedUsers);
            })
            .catch((error) => {
                console.error('Error deleting device:', error);
            });
        fetchData();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (text) => (text ? 'Yes' : 'No'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <h1>Welcome to the Admin Dashboard</h1>
            <Link to="/devices-and-users">
                <Button>View Devices and Users</Button>
            </Link>
            <Button onClick={() => navigate('/chat')}>Chat</Button>
            <Table dataSource={users} columns={columns} />

            {editingUser && (
                <div>
                    <h2>Edit User</h2>
                    <Form onFinish={handleEditSubmit}>
                        <Form.Item label="Name" name="name" initialValue={editingUser.name}>
                            <Input onChange={(e) => handleEditChange('name', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Email" name="email" initialValue={editingUser.email}>
                            <Input onChange={(e) => handleEditChange('email', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Password" name="password" initialValue={editingUser.password}>
                            <Input onChange={(e) => handleEditChange('password', e.target.value)} />
                        </Form.Item>

                        <Form.Item label="Admin" name="isAdmin" initialValue={editingUser.isAdmin ? 'Yes' : 'No'}> {/* Use initialValue to set the default value */}
                            <Select onChange={(value) => handleEditChange('isAdmin', value)}>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button onClick={cancelEdit}>Cancel</Button>
                    </Form>
                </div>
            )}
            <div>
                <h2>Create User</h2>
                <Form onFinish={handleCreateUserSubmit}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter a name' }]}
                    >
                        <Input onChange={(e) => handleEditChange('name', e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input onChange={(e) => handleEditChange('email', e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter a password' }]}
                    >
                        <Input.Password onChange={(e) => handleEditChange('password', e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Admin"
                        name="isAdmin"
                        rules={[{ required: true, message: 'Please select admin status' }]}
                    >
                        <Select onChange={(value) => handleEditChange('isAdmin', value)}>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create User
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default AdminDashboard;
