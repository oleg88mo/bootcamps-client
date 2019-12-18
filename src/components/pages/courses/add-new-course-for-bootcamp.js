import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, Checkbox, InputNumber} from 'antd';
import {URL} from '../../../configKey';
import {useDispatch, useSelector} from "react-redux";
import {openNotification} from '../../utils/usedFunctions';
// action
import {setMyBootcamps} from "../../../redux/users/actions";

function AddNewCourseForBootcamp(p) {
    const {locale, form} = p;
    const {getFieldDecorator, getFieldsError} = form;
    const {Option} = Select;
    const {TextArea} = Input;

    const dispatch = useDispatch();

    const {me} = useSelector(state => state.Users);
    const myBootcamps = useSelector(state => state.Users.myBootcamps);

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [selectedBootcamp, setSelectedBootcamp] = useState(false);
    const [reloadedData, setReloadedData] = useState(false);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const handleSubmit = e => {
        e.preventDefault();

        form.validateFields((err, values) => {
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
                            openNotification('success', 'Create New Bootcamp','Course was created');
                            handlerReset();
                        })
                        .catch(error => {
                            openNotification('error', null, error.response && error.response.data.error);
                            setLoading(false);
                            setDisabled(false);
                        });
                }
            }
        });
    };

    const handlerReset = () => form.resetFields();

    const handlerChangeBootcamp = value => {
        setSelectedBootcamp(value);
        setDisabled(false);
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                try {
                    let responseBootcamps;
                    responseBootcamps = await axios.get(`${URL}/bootcamps?page=1&user=${me.id}`);

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setMyBootcamps(responseBootcamps.data));
                        setReloadedData(false);
                    }
                } catch (e) {
                    console.log('error:', e);
                }
            }
        };

        if (me && me.id && !myBootcamps) {
            loadData();
        }

        return () => {
            mounted = false;
        }
    }, [reloadedData]);

    return (
        <div className="new-course-for-bootcamp">
            <h1>{locale.add_new_course} Course {locale.add_new_course_for} Bootcamp</h1>

            {myBootcamps && <div className="select-bootcamp">
                <Select
                    placeholder={locale.select_bootcamp_for_creating_course}
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
                        <Form.Item label={locale.title}>
                            {getFieldDecorator('title', {
                                rules: [{required: true, message: locale.message_enter_title_for_course}],
                            })(
                                <Input
                                    prefix={<Icon type="highlight" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.title}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.weeks}>
                            {getFieldDecorator('weeks', {
                                rules: [{required: true, message: locale.message_enter_weeks_for_course}],
                            })(
                                <InputNumber min={1}/>,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.tuition}>
                            {getFieldDecorator('tuition', {
                                rules: [{required: true, message: locale.message_enter_tuition_for_course}],
                            })(
                                <InputNumber min={1}/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('scholarhipsAvailable', {
                                initialValue: false
                            })(
                                <Checkbox>{locale.scholarhipsAvailable}</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={locale.minimum_skill} hasFeedback>
                            {getFieldDecorator('minimumSkill', {
                                rules: [{required: true, message: locale.message_enter_minimum_skill}],
                            })(
                                <Select placeholder={`${locale.select_careers} Careers`}>
                                    <Option value="beginner">{locale.beginner}</Option>
                                    <Option value="intermediate">{locale.intermediate}</Option>
                                    <Option value="advanced">{locale.advanced}</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.description}>
                            {getFieldDecorator('description', {
                                rules: [{required: true, message: locale.enter_description}],
                            })(
                                <TextArea rows={5} placeholder={locale.enter_description}/>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <span>*{locale.after_add_bootcamp}</span>
                    <Button style={{marginRight: 8}} onClick={handlerReset}>{locale.clear}</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        {locale.add_new_course} Course
                    </Button>
                </footer>
            </Form>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(AddNewCourseForBootcamp);

export default WrappedNormalLoginForm;
