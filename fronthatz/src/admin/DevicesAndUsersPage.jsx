import React, { useEffect, useState } from 'react';
import { Table, Tabs, Button, Form, Input, Select } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

const DevicesAndUsersPage = () => {
    const [userData, setUserData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [editingDevice, setEditingDevice] = useState(null);
    const [editedDevice, setEditedDevice] = useState({
        userId: null, // Initialize user_id as null
        maxConsumption: null,
        address: '',
        description: '',
    });

    useEffect(() => {
        // Fetch user data
        console.log(localStorage.getItem('token'));
        axios.get('http://localhost:8089/deviceApi/users/all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });

        // Fetch device data
        axios.get('http://localhost:8089/deviceApi/devices/all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setDeviceData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching devices:', error);
            });
    }, []);

    const handleEditDevice = (device) => {
        setEditingDevice(device);
        console.log(device.maxConsumption);
        setEditedDevice({
            userId: device.userId, // Initialize user_id with the existing value
            maxConsumption: device.maxConsumption,
            address: device.address,
            description: device.description,
        });
    };
    const handleCreateDevice = (values)=>{
        axios.post('http://localhost:8089/deviceApi/devices/add', {...values}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                const createdDevice = response.data;
                setDeviceData([...deviceData, createdDevice]);
                setEditedDevice({
                    userId: null,
                    maxConsumption: null,
                    address: '',
                    description: '',
                });
            })
            .catch((error) => {
                console.error('Error creating device:', error);
            });
        };

    const handleDeleteDevice = (deviceId) => {
        // Send a DELETE request to delete the device
        axios.delete(`http://localhost:8089/deviceApi/devices/delete/${deviceId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                // Remove the device from the state
                const updatedDevices = deviceData.filter((device) => device.id !== deviceId);
                setDeviceData(updatedDevices);
            })
            .catch((error) => {
                console.error('Error deleting device:', error);
            });
    };


    const handleSaveDevice = () => {
        // Ensure that maxConsumption is a valid float
        const maxConsumption = parseFloat(editedDevice.maxConsumption);
        if (isNaN(maxConsumption)) {
            console.error('Invalid maxConsumption value');
            return;
        }

        // Create the updated device object
        const updatedDevice = {
            id: editingDevice.id,
            userId: editedDevice.userId,
            maxConsumption: maxConsumption,
            address: editedDevice.address,
            description: editedDevice.description,
        };
        console.log(updatedDevice);

        // Send a PUT request to update the device
        axios.put(`http://localhost:8089/deviceApi/devices/update`, updatedDevice, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                // Update the device data in the state
                const updatedDevices = deviceData.map((device) =>
                    device.id === editingDevice.id ? { ...device, ...updatedDevice } : device
                );
                setDeviceData(updatedDevices);
                setEditingDevice(null);
            })
            .catch((error) => {
                console.error('Error updating device:', error);
            });
    };

    return (
        <div>
            <h1>Devices and Users</h1>
            <Tabs defaultActiveKey="users">
                <TabPane tab="Users" key="users">
                    <Table dataSource={userData} columns={userColumns} />
                </TabPane>
                <TabPane tab="Devices" key="devices">
                    <Table dataSource={deviceData} columns={deviceColumns(handleEditDevice,handleDeleteDevice)} />
                </TabPane>
            </Tabs>

            {editingDevice && (
                <div>
                    <h2>Edit Device</h2>
                    <Form>
                        <Form.Item label="User ID">
                            <Select
                                value={editedDevice.userId}
                                onChange={(value) => setEditedDevice({ ...editedDevice, userId: value })}
                            >
                                {userData.map((user) => (
                                    <Select.Option key={user.id} value={user.id}>
                                        {user.id}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Max Consumption">
                            <Input
                                value={editedDevice.maxConsumption}
                                onChange={(e) => setEditedDevice({ ...editedDevice, maxConsumption: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Address">
                            <Input
                                value={editedDevice.address}
                                onChange={(e) => setEditedDevice({ ...editedDevice, address: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input
                                value={editedDevice.description}
                                onChange={(e) => setEditedDevice({ ...editedDevice, description: e.target.value })}
                            />
                        </Form.Item>
                        <Button type="primary" onClick={handleSaveDevice}>
                            Save
                        </Button>
                    </Form>

                </div>
            )}
            <div>
                <h2>Create Device</h2>
                <Form onFinish={handleCreateDevice}>
                    <Form.Item label="User ID">
                        <Select
                            onChange={(value) => setEditedDevice({ ...editedDevice, userId: value })}
                        >
                            {userData.map((user) => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.id}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Max Consumption"
                               name= "max">
                        <Input
                            onChange={(e) => setEditedDevice({ ...editedDevice, maxConsumption: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Address">
                        <Input
                            onChange={(e) => setEditedDevice({ ...editedDevice, address: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input
                            onChange={(e) => setEditedDevice({ ...editedDevice, description: e.target.value })}
                        />
                    </Form.Item>
                    <Button type="primary" onClick={handleSaveDevice}>
                        Create
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default DevicesAndUsersPage;

const userColumns = [
    {
        title: 'User ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'User Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    // Add more user columns as needed
];
// const createDeviceColumns=(handleCreateDevice)=[
//     {
//         title: 'User ID',
//         dataIndex: 'userId',
//         key: 'userId',
//     },
//     {
//         title: 'Max Consumption',
//         dataIndex: 'maxConsumption',
//         key: 'maxConsumption',
//     },
//     {
//         title: 'Address',
//         dataIndex: 'address',
//         key: 'address',
//     },
//     {
//         title: 'Description',
//         dataIndex: 'description',
//         key: 'description',
//     },
//     {
//         title: 'Actions',
//         dataIndex: 'id',
//         key: 'actions',
//         render: (text, record) => (
//             <span>
//             <Button onClick={() => handleCreateDevice(record)}>Edit</Button>
//                 </span>
//
// ),
//     },
//     // Add more device columns as needed
// ]

const deviceColumns = (handleEditDevice,handleDeleteDevice) => [
    {
        title: 'Device ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'User ID',
        dataIndex: 'userId',
        key: 'userId',
        render: (text, record) => (
            <Button onClick={() => handleEditDevice(record)}>Edit</Button>
        ),
    },
    {
        title: 'Max Consumption',
        dataIndex: 'maxConsumption',
        key: 'maxConsumption',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Actions',
        dataIndex: 'id',
        key: 'actions',
        render: (text, record) => (
            <span>
            <Button onClick={() => handleEditDevice(record)}>Edit</Button>
    <Button type="danger" onClick={() => handleDeleteDevice(record.id)}>Delete</Button>
                </span>

),
    },
    // Add more device columns as needed
];
