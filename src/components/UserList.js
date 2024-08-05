// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal, message } from 'antd';
import UserForm from './UserForm';

const UserList = () => {
    const dispatch = useDispatch();
    const { loading, users, error, selectedUser } = useSelector((state) => state);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    // console.log(users);
    useEffect(() => {
        dispatch({ type: "FETCH_USERS_REQUEST" });
        axios.get('https://reqres.in/api/users')
            .then(response => dispatch({ type: "FETCH_USERS_SUCCESS", payload: response.data.data }))
            .catch(err => dispatch({ type: "FETCH_USERS_FAILURE", payload: err.message }));
    }, [dispatch]);

    const handleEdit = (userId) => {
        setSelectedUserId(userId);
        dispatch({ type: "FETCH_USER_REQUEST" });
        axios.get(`https://reqres.in/api/users/${userId}`)
            .then(response => dispatch({ type: "SET_ITEM", payload: response.data }))
            .catch(err => dispatch({ type: "SET_ITEM", payload: err.message }));
        setIsModalVisible(true);
    };

    const handleDelete = (userId) => {
        axios.delete(`https://reqres.in/api/users/${userId}`)
            .then(() => {
                dispatch({ type: "DELETE_USER_SUCCESS", payload: userId });
                message.success('User deleted successfully');
            })
            .catch(err => {
                console.error('Error deleting user:', err);
                message.error('Failed to delete user');
            });
    };

    const handleCreate = () => {
        setSelectedUserId(null);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedUserId(null);
    };

    if (loading) return <Spin tip="Loading..." />;
    if (error) return <Alert message="Error" description={error} type="error" />;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text) => <img src={text} alt="avatar" style={{ width: 50, borderRadius: '50%' }} />,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, user) => (
                <span>
                    <Button 
                        onClick={() => handleEdit(user.id)} 
                        type="primary" 
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button 
                        onClick={() => handleDelete(user.id)} 
                        danger
                    >
                        Delete
                    </Button>
                </span>
            ),
        }
    ];

    return (
        <>
            <Button 
                type="primary" 
                onClick={handleCreate}
                style={{ marginBottom: 16 }}
            >
                Create New User
            </Button>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 6 }}
            />
            <Modal
                title={selectedUserId ? "Edit User" : "Create User"}
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <UserForm userId={selectedUserId} onClose={handleCloseModal} />
            </Modal>
        </>
    );
};

export default UserList;
