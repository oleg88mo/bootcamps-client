import React, {Component} from 'react';
import axios from 'axios';
import {URL} from '../../../configKey';

import {
    Form,
    Input,
    Button,
    notification
} from 'antd';

const openNotificationWithIcon = (type, description) => {
    notification[type]({
        message: '/UpdatePassword',
        description
    });
};


class UpdatePassword extends Component {
    state = {
        currentPassword: null,
        newPassword: null,
        confirmDirty: false,
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    handlerUpdate = e => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll(err => {
            if (!err) {
                const {currentPassword, newPassword} = this.state;
                console.log('currentPassword', currentPassword);
                console.log('newPassword', newPassword);

                // axios.post(`${URL}/auth/register`, {
                //     currentPassword,
                //     newPassword,
                // })
                //     .then(response => {
                //         if (response && response.data) {
                //             window.localStorage.setItem('bootcampAuthToken', JSON.stringify(response.data.token));
                //             window.location = '/';
                //         }
                //     })
                //     .catch(error => {
                //         openNotificationWithIcon('error', error.response.data.error)
                //     });
            }
        });
    };

    handleConfirmBlur = e => {
        const {value} = e.target;

        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;

        if (value && value !== form.getFieldValue('currentPassword')) {
            callback('Two passwords is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, next) => {
        const {form} = this.props;

        if (value && value.length > 5 && this.state.confirmDirty) {
            form.validateFields(['newPassword'], {force: true});
        }
        next();
    };

    handlerSetUserValue = val => this.setState({...val});

    render() {
        const {getFieldDecorator, getFieldsError} = this.props.form;
        const {currentPassword} = this.state;

        return (
            <div className="update-password">
                <h2>Update Password</h2>

                <Form onSubmit={this.handlerUpdate}>
                    <Form.Item
                        label="Current Password"
                        hasFeedback={currentPassword && currentPassword.length > 5}
                    >
                        {getFieldDecorator('currentPassword', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your currentPassword!',
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password
                            onChange={e => this.handlerSetUserValue({['currentPassword']: e.target.value !== "" ? e.target.value : null})}
                        />)}
                    </Form.Item>
                    <Form.Item label="New Password" hasFeedback>
                        {getFieldDecorator('newPassword', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password
                            onBlur={this.handleConfirmBlur}
                            onChange={e => this.handlerSetUserValue({['newPassword']: e.target.value !== "" ? e.target.value : null})}
                        />)}
                    </Form.Item>
                    <Form.Item className="full-center">
                        <Button type="primary"
                                htmlType="submit"
                                disabled={this.hasErrors(getFieldsError()) || this.state.newPassword && this.state.newPassword.length < 6}
                        >
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>)
    }
}

const WrappedRegistrationForm = Form.create({name: 'updatePassword'})(UpdatePassword);

export default WrappedRegistrationForm;

