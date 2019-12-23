import React, {useEffect, useState} from "react";
import {Empty, Row, Col, Button, Icon} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {PHOTO_URL, URL} from "../../../configKey";
// actions
import {setMyBootcamps, sortBootcamps} from "../../../redux/users/actions";
// components
import EditBootcamp from './edit-bootcamp';
import {openNotification, req} from "../../utils/usedFunctions";

function MyBootcamps({locale}) {
    const dispatch = useDispatch();

    const {me} = useSelector(state => state.Users);
    const myBootcamps = useSelector(state => state.Users.myBootcamps);
    const sort = useSelector(state => state.Users.sort);
    const [editedBootcampId, setEditedBootcampId] = useState(null);
    const [reloadedData, setReloadedData] = useState(false);
    const [uploadPhotoId, setUploadPhotoId] = useState(null);
    const [currentFormData, setCurrentFormData] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    const handlerSort = () => dispatch(sortBootcamps(sort === 'ASC' ? 'DESC' : 'ASC'));

    const deleteBootcamp = id => {
        const isLoggin = window.localStorage.getItem('bootcampAuthToken');
        const tokenRemoveFirstChar = isLoggin.substr(1);
        const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

        const options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            url: `${URL}/bootcamps/${id}`,
            method: 'delete',
        };

        req(options).then(
            () => {
                setReloadedData(true);
                openNotification('success', `${locale.delete} Bootcamp`, `Bootcamp ${locale.delete_bootcamp_was_successful}!`);
            },
            error => {
                openNotification('error', '/login', error.response && error.response.data.error);
            }
        );
    };

    const handleChangeFile = (e, id) => {
        setUploadPhotoId(id);

        const formdata = new FormData();
        const file = e.target.files[0];

        formdata.append('file', file);

        setCurrentFormData(formdata);
        setCurrentFile(file);
    };

    const handlerUploadPhoto = idBootcamp => {
        const isLoggin = window.localStorage.getItem('bootcampAuthToken');
        const tokenRemoveFirstChar = isLoggin.substr(1);
        const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);
        const options = {
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}`, "type": "formData"},
            data: currentFormData,
            url: `${URL}/bootcamps/${idBootcamp}/photo`,
            method: 'put',
        };

        req(options).then(
            () => {
                setReloadedData(true);
                setUploadPhotoId(null);
                setCurrentFile(null);
                openNotification('success', 'file', `${currentFile.name} ${locale.file_uploaded_successfully}`);
            },
            error => {
                openNotification('error', '/login', error.response && error.response.data.error);
            }
        );
    };

    const handlerReloadBootcamp = () => {
        setReloadedData(true);
        setEditedBootcampId(null);
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                const options = {
                    url: `${URL}/bootcamps?page=1&user=${me.id}`,
                    method: 'get',
                };

                req(options).then(
                    response => {
                        if (response && response.data.success) {
                            dispatch(setMyBootcamps(response.data));
                            setReloadedData(false);
                        }
                    },
                    error => {
                        openNotification('error', '/bootcamps', error.response && error.response.data.error);
                    }
                );
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
        <div className="my-bootcamp">
            <h1>{locale.my_bootcamps} Bootcamps</h1>
            <Button
                type="default"
                onClick={handlerSort}
                style={{marginBottom: 15}}
            >
                {sort === 'ASC' ? (<Icon type="sort-ascending"/>) : (
                    <Icon type="sort-descending"/>)} {locale.sort_by_name}
            </Button>
            <ul>
                {myBootcamps && myBootcamps.data && myBootcamps.data.map(b => (
                    <li key={b.id}>
                        <Row type="flex" align="middle">
                            <Col md={24} lg={5} xl={4}>
                                <div className="photo">
                                    {b.photo !== 'no-photo.jpg' ?
                                        <img src={`${PHOTO_URL}/${b.photo}`} alt='photo'/>
                                        :
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                    }
                                    <input name="file"
                                           type="file"
                                           style={{display: 'none'}}
                                           multiple
                                           id={`photo-${b.id}`}
                                           onChange={(e) => handleChangeFile(e, b.id)}
                                    />
                                    {currentFile === null && (<Button type="primary">
                                        <label htmlFor={`photo-${b.id}`}><Icon type="upload"/> {locale.select_photo}
                                        </label>
                                    </Button>)}
                                    {uploadPhotoId === b.id && (<Button
                                        onClick={() => handlerUploadPhoto(b.id)}>{locale.upload} ({currentFile.name})</Button>)}
                                </div>
                            </Col>
                            <Col md={24} lg={13} xl={14}>
                                <h3>{b.name}</h3>
                                <div>{b.description}</div>
                            </Col>
                            <Col md={24} lg={6}>
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => setEditedBootcampId(b.id)}
                                >{locale.edit} Bootcamp</Button>
                                <Button
                                    type="danger"
                                    block
                                    style={{marginTop: 10}}
                                    onClick={() => deleteBootcamp(b.id)}
                                >{locale.delete} Bootcamp</Button>
                            </Col>
                        </Row>
                        {editedBootcampId && editedBootcampId === b.id && (
                            <EditBootcamp
                                element={b}
                                handlerReloadBootcamp={handlerReloadBootcamp}
                                locale={locale}
                            />)
                        }
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MyBootcamps;
