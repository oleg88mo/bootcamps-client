import React, {useEffect, useState} from "react";
import {Row, Col, Button, Icon, notification} from "antd";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {URL} from "../../../configKey";
// actions
import {setMyCourses, sortCourses} from "../../../redux/users/actions";
// component
import EditCourse from './edit-course';

function MyCourses({locale}) {
    const dispatch = useDispatch();

    const {me} = useSelector(state => state.Users);
    const myCourses = useSelector(state => state.Users.myCourses);
    const sort = useSelector(state => state.Users.sort);

    const [editedCourseId, setEditedCourseId] = useState(null);
    const [reloadedData, setReloadedData] = useState(false);

    const handlerSort = () => dispatch(sortCourses(sort === 'ASC' ? 'DESC' : 'ASC'));

    const deleteCourse = id => {
        try {
            const isLoggin = window.localStorage.getItem('bootcampAuthToken');
            const tokenRemoveFirstChar = isLoggin.substr(1);
            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

            axios.delete(`${URL}/courses/${id}`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                setReloadedData(true);
                notification['success']({
                    message: 'Delete Course',
                    description: 'Course was successful deleted!'
                });
            });
        } catch (e) {
            console.log('error:', e);
        }
    };

    const handlerReloadCourse = () => {
        setReloadedData(true);
        setEditedCourseId(null);
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                try {
                    let responseCourses;

                    responseCourses = await axios.get(`${URL}/bootcamps?page=1&user=${me.id}`);

                    if (responseCourses && responseCourses.data.success) {
                        dispatch(setMyCourses(responseCourses.data));
                        setReloadedData(false);
                    }
                } catch (e) {
                    console.log('error:', e);
                }
            }
        };

        if (me && me.id) {
            loadData();
        }

        return () => {
            mounted = false;
        }
    }, [reloadedData]);

    return (
        <div className="my-course">
            <h1>{locale.my_courses_list}</h1>
            <Button
                type="default"
                onClick={handlerSort}
                style={{marginBottom: 15}}
            >
                {sort === 'ASC' ? (<Icon type="sort-ascending"/>) : (
                    <Icon type="sort-descending"/>)} {locale.sort_by} {locale.title}
            </Button>
            <ul>
                {myCourses && myCourses.data && myCourses.data.map(b => (
                    <li key={b._id}>
                        <Row type="flex" align="middle">
                            <Col md={24} lg={19}>
                                <h3>{b.title}</h3>
                                <p>
                                    {locale.weeks}: <b>{b.weeks}</b>,
                                    {locale.tuition}: <b>{b.tuition}</b>
                                </p>
                                <div>{b.description}</div>
                            </Col>
                            <Col md={24} lg={5}>
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => setEditedCourseId(b._id)}
                                >{locale.edit} Course</Button>
                                <Button
                                    type="danger"
                                    block
                                    style={{marginTop: 10}}
                                    onClick={() => deleteCourse(b._id)}
                                >{locale.delete} Course</Button>
                            </Col>
                        </Row>
                        {editedCourseId && editedCourseId === b._id && (<EditCourse
                            element={b}
                            locale={locale}
                            handlerReloadCourse={handlerReloadCourse}
                        />)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MyCourses;
