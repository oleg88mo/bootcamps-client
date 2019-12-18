import React, {useState} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Form, Icon, Input, Button} from 'antd';
import {openNotification} from '../../utils/usedFunctions';
import {URL} from '../../../configKey';

function Login(p) {
    const {locale, form} = p;
    const {getFieldDecorator} = form;

    const [loading, setLoading] = useState(false);

    const handlerLoggedIn = values => axios.post(`${URL}/auth/login`, values)
        .then(response => {
            window.localStorage.setItem('bootcampAuthToken', JSON.stringify(response.data.token));
            window.location = '/';
            setLoading(false)
        })
        .catch(error => {
            openNotification('error', '/login',error.response && error.response.data.error);
            setLoading(false);
        });

    const handleSubmit = e => {
        e.preventDefault();

        form.validateFields((err, values) => {
            if (!err) {
                setLoading(true);
                handlerLoggedIn(values)
            }
        });
    };

    return (
        <div className="login-form-center">
            <div className="login-form">
                <h2><Icon type="login"/> {locale.login_in}</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [
                                {required: true, message: locale.enter_email},
                                {type: 'email', message: locale.not_valid_email}
                            ],
                        })(
                            <Input
                                prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder={locale.email}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: locale.message_enter_password}],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder={locale.password}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className="full-center">
                        <Button className="login-form-forgot">{locale.forgot_password}?</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                            className="login-form-button"
                        >
                            {loading ?
                                <Icon type="loading"/> :
                                <Icon type="login"/>
                            } {locale.login}</Button>
                        Or <Link to="/register">{locale.register_now}!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(Login);

export default WrappedNormalLoginForm;
