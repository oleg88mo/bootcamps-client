import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, Checkbox, notification, InputNumber} from 'antd';
import {URL} from '../../../configKey';
import {setMyBootcamps} from "../../../redux/users/actions";
import {useDispatch, useSelector} from "react-redux";

function AddNewCourseForBootcamp(p) {
    const {getFieldDecorator, getFieldsError} = p.form;
    const {Option} = Select;
    const {TextArea} = Input;

    const dispatch = useDispatch();

    const {id} = useSelector(state => state.Users.me);
    const myBootcamps = useSelector(state => state.Users.myBootcamps);

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [selectedBootcamp, setSelectedBootcamp] = useState(false);

    const [reloadedData, setReloadedData] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                try {
                    let responseBootcamps;

                    responseBootcamps = await axios.get(`${URL}/bootcamps?page=1&user=${id}`);

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setMyBootcamps(responseBootcamps.data));
                        setReloadedData(false);
                    }
                } catch (e) {
                    console.log('error:', e);
                }
            }
        };

        if (id && !myBootcamps) {
            loadData();
        }

        return () => {
            mounted = false;
        }
    }, [reloadedData]);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const openNotificationWithIcon = (type, description) => {
        notification[type]({
            message: 'Create New Bootcamp',
            description
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        p.form.validateFields((err, values) => {
            if (!err) {
                if (selectedBootcamp) {
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

                    data && axios.post(`${URL}/bootcamps/${selectedBootcamp}/courses`, data, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            setLoading(false);
                            setDisabled(false);
                            openNotificationWithIcon('success', 'Course was created');
                            handlerReset();
                        })
                        .catch(error => {
                            openNotificationWithIcon('error', error.response.data.error);
                            setLoading(false);
                            setDisabled(false);
                        });
                }
            }
        });
    };
    const handlerReset = () => p.form.resetFields();

    const handlerChangeBootcamp = value => setSelectedBootcamp(value);

    return (
        <div className="new-course-for-bootcamp">
            <h1>Add New Course For Bootcamp</h1>

            {myBootcamps && <div className="select-bootcamp">
                <Select
                    placeholder="Виберіть Буткамп для якого буде створено курс"
                    onChange={handlerChangeBootcamp}
                    style={{width: 250}}
                >
                    {myBootcamps.data && myBootcamps.data.map(bootcamp => (
                        <Option value={bootcamp.id} key={bootcamp.id}>{bootcamp.name}</Option>)
                    )}
                </Select>
            </div>}

            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={12}>
                        <Form.Item label="Title">
                            {getFieldDecorator('title', {
                                rules: [{required: true, message: 'Please input title of course!'}],
                            })(
                                <Input
                                    prefix={<Icon type="highlight" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Title"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Weeks">
                            {getFieldDecorator('weeks', {
                                rules: [{required: true, message: 'Please input your weeks!'}],
                            })(
                                <InputNumber min={1}/>,
                            )}
                        </Form.Item>
                        <Form.Item label="Tuition">
                            {getFieldDecorator('tuition', {
                                rules: [{required: true, message: 'Please input your tuition!'}],
                            })(
                                <InputNumber min={1}/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('scholarhipsAvailable', {
                                initialValue: false
                            })(
                                <Checkbox>scholarhipsAvailable</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Minimum Skill" hasFeedback>
                            {getFieldDecorator('minimumSkill', {
                                rules: [{required: true, message: 'Please select your minimumSkill!'}],
                            })(
                                <Select placeholder="Please select a Careers">
                                    <Option value="beginner">beginner</Option>
                                    <Option value="intermediate">intermediate</Option>
                                    <Option value="advanced">advanced</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="Description">
                            {getFieldDecorator('description', {
                                rules: [{required: true, message: 'Please input your description!'}],
                            })(
                                <TextArea rows={5} placeholder="Enter your Description here..."/>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <span>*After you add the bootcamp, you can add the specific courses offered</span>
                    <Button style={{marginRight: 8}} onClick={handlerReset}>Clear</Button>
                    <Button type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        Add New Bootcamp
                    </Button>
                </footer>
            </Form>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(AddNewCourseForBootcamp);

export default WrappedNormalLoginForm;