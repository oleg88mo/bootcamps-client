import React, {Component} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {URL} from '../../../configKey';
import {
    Form,
    Input,
    Checkbox,
    Radio,
    Button,
    Icon,
    Modal,
    notification
} from 'antd';

const openNotificationWithIcon = (type, description) => {
    notification[type]({
        message: '/register',
        description
    });
};

class Register extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        visible: false,
        agree: false,
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
        role: 'user',
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    handlerRegister = e => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll(err => {
            if (!err) {
                const {name, email, password, role} = this.state;

                axios.post(`${URL}/auth/register`, {
                    name,
                    email,
                    password,
                    role,
                })
                    .then(response => {
                        if (response && response.data) {
                            window.localStorage.setItem('bootcampAuthToken', JSON.stringify(response.data.token));
                            window.location = '/';
                        }
                    })
                    .catch(error => {
                        openNotificationWithIcon('error', error.response.data.error)
                    });
            }
        });
    };

    handleConfirmBlur = e => {
        const {value} = e.target;

        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;

        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, next) => {
        const {form} = this.props;

        if (value && value.length > 5 && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        next();
    };

    showModal = () => this.setState({visible: true});

    handleOk = () => this.setState({visible: false});

    handleCancel = () => this.setState({visible: false});

    onChange = e => this.setState({agree: e.target.checked});

    handlerSetUserValue = val => this.setState({...val});

    handlerChangeRole = role => this.setState({role: role.target.value});

    render() {
        const {getFieldDecorator, getFieldsError} = this.props.form;
        const {agree, password} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        return (
            <div className="register-form-center">
                <div className="register-form">
                    <h2><Icon type="user"/> Register</h2>
                    <Form {...formItemLayout} onSubmit={this.handlerRegister}>
                        <Form.Item label="Name">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ],
                            })(<Input
                                onChange={e => this.handlerSetUserValue({['name']: e.target.value !== "" ? e.target.value : null})}
                            />)}
                        </Form.Item>
                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<Input
                                onChange={e => this.handlerSetUserValue({['email']: e.target.value !== "" ? e.target.value : null})}
                            />)}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback={password && password.length > 5}>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password
                                onChange={e => this.handlerSetUserValue({['password']: e.target.value !== "" ? e.target.value : null})}
                            />)}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {
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
                                onChange={e => this.handlerSetUserValue({['confirmPassword']: e.target.value !== "" ? e.target.value : null})}
                            />)}
                        </Form.Item>
                        <Form.Item label="User Your Role">
                            {getFieldDecorator('role', {
                                valuePropName: 'checked',
                            })(
                                <>
                                    <Radio.Group onChange={this.handlerChangeRole} value={this.state.role}>
                                        <Radio value="user">Regular User (Browse, Write reviews, etc)</Radio>
                                        <Radio value="publisher">Bootcamp Publisher</Radio>
                                    </Radio.Group>
                                </>,
                            )}
                        </Form.Item>
                        <Form.Item className="full-center">
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                            })(
                                <>
                                    <Checkbox onChange={this.onChange}>
                                        I have read the
                                    </Checkbox>
                                    <a href="#" onClick={this.showModal}>agreement</a>
                                </>,
                            )}
                        </Form.Item>
                        <Form.Item className="full-center">
                            <Button type="primary" htmlType="submit"
                                    disabled={this.hasErrors(getFieldsError()) || !agree}>
                                Register
                            </Button>
                            <br/>
                            Or <Link to="/login">Logged in!</Link>
                        </Form.Item>
                    </Form>
                    <Modal
                        title="Basic Modal"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <p>Some contents...</p>
                    </Modal>
                </div>
            </div>)
    }
}

const WrappedRegistrationForm = Form.create({name: 'register'})(Register);

export default WrappedRegistrationForm;
