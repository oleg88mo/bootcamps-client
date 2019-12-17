import React, {useEffect, useState} from "react";
import {Empty, Row, Col, Button, Icon, notification, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {PHOTO_URL, URL} from "../../../configKey";
// actions
import {setMyBootcamps, sortBootcamps} from "../../../redux/users/actions";
// components
import EditBootcamp from './edit-bootcamp';

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
        try {
            const isLoggin = window.localStorage.getItem('bootcampAuthToken');
            const tokenRemoveFirstChar = isLoggin.substr(1);
            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

            axios.delete(`${URL}/bootcamps/${id}`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setReloadedData(true);
                notification['success']({
                    message: `${locale.delete_bootcamp} Bootcamp`,
                    description: `Bootcamp ${locale.delete_bootcamp_was_successful}!`
                });
            });
        } catch (e) {
            console.log('error:', e);
        }
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
        try {
            const isLoggin = window.localStorage.getItem('bootcampAuthToken');
            const tokenRemoveFirstChar = isLoggin.substr(1);
            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

            axios.put(`${URL}/bootcamps/${idBootcamp}/photo`, currentFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                    "type": "formData"
                }
            })
                .then(() => {
                    setReloadedData(true);
                    setUploadPhotoId(null);
                    setCurrentFile(null);
                    message.success(`${currentFile.name} ${locale.file_uploaded_successfully}`);
                })
                .catch(e => console.log('e', e))
        } catch (e) {
            console.log('error:', e);
        }
    };

    const handlerReloadBootcamp = () => {
        setReloadedData(true);
        setEditedBootcampId(null);
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
                {sort === 'ASC' ? <Icon type="sort-ascending"/> : <Icon type="sort-descending"/>} {locale.sort_by_name}
            </Button>
            <ul>
                {myBootcamps && myBootcamps.data && myBootcamps.data.map(b => (
                    <li key={b.id}>
                        <Row type="flex" align="middle">
                            <Col span={3}>
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
                                {currentFile === null && <label htmlFor={`photo-${b.id}`}><Icon type="upload"/> {locale.select_photo}...</label>}
                                {uploadPhotoId === b.id && <Button onClick={() => handlerUploadPhoto(b.id)}>{locale.upload} ({currentFile.name})</Button>}
                            </Col>
                            <Col span={16}>
                                <h3>{b.name}</h3>
                                <div>{b.description}</div>
                            </Col>
                            <Col span={5}>
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => setEditedBootcampId(b.id)}
                                >{locale.edit_new_bootcamp} Bootcamp</Button>
                                <Button
                                    type="danger"
                                    block
                                    style={{marginTop: 10}}
                                    onClick={() => deleteBootcamp(b.id)}
                                >{locale.delete_bootcamp} Bootcamp</Button>
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
