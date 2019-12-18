import React, {useState} from 'react';
import axios from 'axios';
import {URL} from '../../../configKey';
import {Form, Input, Button} from 'antd';
import {openNotification} from '../../utils/usedFunctions';

function UpdatePassword(p) {
    const {getFieldDecorator} = p.form;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const handlerUpdate = e => {
        e.preventDefault();

        p.form.validateFieldsAndScroll(err => {
            if (!err) {
                const isLoggin = window.localStorage.getItem('bootcampAuthToken');
                const tokenRemoveFirstChar = isLoggin.substr(1);
                const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                axios.put(`${URL}/auth/updatepassword`, {
                    currentPassword,
                    newPassword,
                }, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (response && response.data) {
                            openNotification('success', '/UpdatePassword','User password was updated');
                        }
                    })
                    .catch(error => {
                        openNotification('error', '/UpdatePassword',error.response && error.response.data.error)
                    });
            }
        });
    };

    return (
        <div className="update-password">
            <h2>Update Password</h2>

            <Form onSubmit={handlerUpdate}>
                <Form.Item
                    label="Current Password"
                    hasFeedback={currentPassword.length > 5}
                >
                    {getFieldDecorator('currentPassword', {
                        rules: [
                            {required: true, message: 'Please input your currentPassword!'}
                        ],
                    })(<Input.Password
                        onChange={e => setCurrentPassword(e.target.value !== "" ? e.target.value : null)}
                    />)}
                </Form.Item>
                <Form.Item
                    label="New Password"
                    hasFeedback
                >
                    {getFieldDecorator('newPassword', {
                        rules: [
                            {required: true, message: 'Please confirm your password!'}
                        ],
                    })(<Input.Password
                        onChange={e => setNewPassword(e.target.value !== "" ? e.target.value : null)}
                    />)}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={currentPassword.length < 6 || newPassword.length < 6 || currentPassword === newPassword}
                    >
                        Update Password
                    </Button>
                </Form.Item>
            </Form>
        </div>)
}

const WrappedRegistrationForm = Form.create({name: 'updatePassword'})(UpdatePassword);
export default WrappedRegistrationForm;
