import React, {useState} from "react";
import {Row, Col, Form, Input, Button, Select} from 'antd';
import {openNotification, req} from '../../utils/usedFunctions';
import {URL} from '../../../configKey';
import {useSelector, useDispatch} from "react-redux";
// component
import UpdatePassword from './updatePassword';
import {updateUserInpormation} from "../../../redux/users/actions";

function MyInformation(p) {
    const {form, locale, setName} = p;
    const {getFieldDecorator, getFieldsError} = form;

    const dispatch = useDispatch();
    const me = useSelector(state => state.Users.me);

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [userInformation, setUserInformation] = useState(me);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const handleSubmit = e => {
        e.preventDefault();

        form.validateFields((err, values) => {
            if (!err) {
                setLoading(true);
                setDisabled(true);
                const isLoggin = window.localStorage.getItem('bootcampAuthToken');
                const tokenRemoveFirstChar = isLoggin.substr(1);
                const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                const removeEmpty = obj => {
                    Object.keys(obj).forEach(key => {
                        return (obj[key] === undefined) && delete obj[key]
                    });

                    return obj;
                };
                const data = removeEmpty(values);

                const options = {
                    headers: {'content-type': 'application/json', 'Authorization': `Bearer ${token}`},
                    data,
                    url: `${URL}/users/${userInformation.id}`,
                    method: 'put',
                };

                req(options).then(
                    response => {
                        setLoading(false);
                        setDisabled(false);
                        dispatch(updateUserInpormation(response.data));
                        const {name} = response.data.data;
                        setName(name);
                        openNotification('success', 'Message', `${locale.user_information} ${locale.was_updated}`);
                    },
                    error => {
                        openNotification('error', 'Message', error.response && error.response.data.error);
                        setLoading(false);
                        setDisabled(false);
                    }
                );
            }
        });
    };

    return (
        <div>
            <h1>{locale.user_information}</h1>

            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={24}>
                        <Form.Item label="role">
                            <Select
                                disabled
                                value={userInformation && userInformation.role}
                            />
                        </Form.Item>
                        <Form.Item label={locale.name}>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: locale.message_enter_name}],
                                initialValue: userInformation && userInformation.name,
                            })(<Input
                                onChange={(e) => setUserInformation({
                                    ...userInformation,
                                    'name': e.target.value
                                })}
                            />)}
                        </Form.Item>
                        <Form.Item label={locale.email}>
                            {getFieldDecorator('email', {
                                rules: [
                                    {type: 'email', message: locale.not_valid_email},
                                    {required: true, message: locale.enter_email},
                                ],
                                initialValue: userInformation && userInformation.email,
                            })(<Input
                                onChange={(e) => setUserInformation({
                                    ...userInformation,
                                    'email': e.target.value
                                })}
                            />)}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        {locale.edit}
                    </Button>
                </footer>
            </Form>

            <UpdatePassword/>

        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(MyInformation);

export default WrappedNormalLoginForm;
