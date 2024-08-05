// src/components/UserForm.js
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const UserForm = ({ userId, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            setLoading(true);
            axios.get(`https://reqres.in/api/users/${userId}`)
                .then(response => {
                    setUser(response.data.data);
                    form.setFieldsValue(response.data.data);
                })
                .catch(err => message.error('Failed to fetch user data'))
                .finally(() => setLoading(false));
        } else {
            form.resetFields();
        }
    }, [userId, form]);


    const onFinish = (values) => {
        setLoading(true);
        // console.log(values);
       const request = userId
            ? axios.put(`https://reqres.in/api/users/${userId}`, values)
            : axios.post('https://reqres.in/api/users', values);

        request
            .then(response => {
                if (userId) {
                    // console.log('Response Data:', response.data);
                    dispatch({ type: "UPDATE_USER_SUCCESS", payload: { ...response.data, id: userId } });
                    // dispatch({ type: "UPDATE_USER_SUCCESS", payload: response.data });
                } else {
                    dispatch({ type: "CREATE_USER_SUCCESS", payload: response.data });
                }
                message.success(userId ? 'User updated successfully' : 'User created successfully');
                onClose();
            })
            .catch(err => {
                console.error('Error:', err);
                message.error(userId ? 'Failed to update user' : 'Failed to create user');
            }).finally(() => setLoading(false));
    };

    if (loading) return <Spin tip="Loading..." />;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={user}
        >
            <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar URL" rules={[{ required: true, message: 'Please input the avatar URL!' }]}>
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
