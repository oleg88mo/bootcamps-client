import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import {PageHeader, Row, Col, Tag, Button, Empty, Rate, Modal, Slider, Input, notification} from 'antd';
import axios from "axios";
import {URL} from '../../../configKey';
import {emptyData} from '../../../components/img/iconSvg'
import {bootcampRatind} from '../../utils/usedFunctions'
// actions
import {
    getReviewsForSingleBootcamp,
    getSingleBootcamp,
} from "../../../redux/bootcamps/actions";
import {
    getAllUsers,
} from "../../../redux/users/actions";

function ReviewsSingleBootcamp({locale}) {
    const id = window.localStorage.getItem('singleBootcampId');

    const dispatch = useDispatch();

    const bootcamp = useSelector(state => state.Bootcamps.singleBootcamp);
    const users = useSelector(state => state.Users.data);
    const me = useSelector(state => state.Users.me);

    const [middleRating, setMiddleRating] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [ratingNewReview, setRatingNewReview] = useState(0);
    const [titleNewReview, setTitleNewReview] = useState(null);
    const [textNewReview, setTextNewReview] = useState(null);
    const [deletedReview, setDeletedReview] = useState(false);
    const [reloaded, setReloaded] = useState(false);
    const [editedReview, setEditedReview] = useState(false);

    const openNotificationWithIcon = (type, description) => {
        notification[type]({
            message: 'Create New Review',
            description
        });
    };

    if (bootcamp) {
        bootcampRatind(bootcamp, setMiddleRating)
    }

    let history = useHistory();
    const {TextArea} = Input;

    const handlerGetAuthorReview = userId => {
        const user = !!users.length && users.find(u => u._id === userId);

        if (user) {
            return user.name
        }
    };

    const handlerVisibleModal = async visible => {
        await setModalVisible(visible);
        await setEditedReview(false);
    };

    const refreshBootcamp = () => {
        (async function () {
            let response;
            let responseReviews;

            try {
                response = await axios.get(`${URL}/bootcamps/${id}`);

                if (!bootcamp.reviews && !bootcamp.length) {
                    responseReviews = await axios.get(`${URL}/bootcamps/${id}/reviews`);
                }

                if (response && response.data.success) {
                    dispatch(getSingleBootcamp(response.data));

                }

                if (responseReviews && responseReviews.data.success) {
                    dispatch(getReviewsForSingleBootcamp(responseReviews.data));
                    setRatingNewReview(0);
                    setTitleNewReview(null);
                    setTextNewReview(null);
                }
            } catch (error) {
                openNotificationWithIcon('warning', error.response && error.response.data.error);
            }
        })();
    };

    const handlerAddNewReview = () => {
        const sendReview = async () => {
            const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

            try {
                if (isLoggin !== null) {
                    const tokenRemoveFirstChar = isLoggin.substr(1);
                    const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                    const responseUsers = await axios.post(`${URL}/bootcamps/${bootcamp.id}/reviews`, {
                        "title": titleNewReview,
                        "text": textNewReview,
                        "rating": ratingNewReview
                    }, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    if (responseUsers.data.success) {
                        await refreshBootcamp();
                        await setModalVisible(false);
                        setRatingNewReview(0);
                        setTitleNewReview(null);
                        setTextNewReview(null);
                    }
                }
            } catch (error) {
                openNotificationWithIcon('warning', error.response && error.response.data.error);
            }
        };

        sendReview();
    };

    const handlerUpdateReview = () => {
        const onEditReview = async () => {
            const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

            try {
                if (isLoggin !== null) {
                    const tokenRemoveFirstChar = isLoggin.substr(1);
                    const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                    const responseUsers = await axios.put(`${URL}/reviews/${editedReview._id}`, {
                        "title": editedReview.title,
                        "text": editedReview.text,
                        "rating": editedReview.rating
                    }, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    if (responseUsers.data.success) {
                        await refreshBootcamp();
                        await setModalVisible(false);
                        setRatingNewReview(0);
                        setTitleNewReview(null);
                        setTextNewReview(null);
                    }
                }
            } catch (error) {
                openNotificationWithIcon('warning', error.response && error.response.data.error);
            }
        };

        onEditReview();
    };

    const handlerSetEditedReview = async review => {
        await setEditedReview(review);
        await setModalVisible(true);
    };

    //delete Review
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

                if (isLoggin !== null) {
                    const tokenRemoveFirstChar = isLoggin.substr(1);
                    const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                    try {
                        await axios.delete(`${URL}/reviews/${deletedReview}`, {
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        }).then(() => refreshBootcamp())
                    } catch (e) {
                        console.log('error:', e);
                    }
                }
            }
        };

        if (id) {
            loadData();
        }

        return () => {
            mounted = false;
        }
    }, [deletedReview]);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let response;
                let responseReviews;
                let responseUsers;
                const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

                try {
                    setReloaded(false)

                    if (!bootcamp.name) {
                        response = await axios.get(`${URL}/bootcamps/${id}`);

                        if (isLoggin !== null) {
                            const tokenRemoveFirstChar = isLoggin.substr(1);
                            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                            try {
                                responseUsers = await axios.get(`${URL}/users`, {
                                    headers: {
                                        'content-type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    }
                                })
                            } catch (e) {
                                console.log('error:', e);
                            }
                        }
                    }

                    if (!bootcamp.reviews && !bootcamp.length) {
                        responseReviews = await axios.get(`${URL}/bootcamps/${id}/reviews`);
                    }

                    if (response && response.data.success) {
                        dispatch(getSingleBootcamp(response.data));
                    }

                    if (responseReviews && responseReviews.data.success) {
                        dispatch(getReviewsForSingleBootcamp(responseReviews.data));
                    }

                    if (responseUsers && responseUsers.data.success) {
                        dispatch(getAllUsers(responseUsers.data));
                    }
                } catch (e) {
                    console.log('error:', e);
                }
            }
        };

        if (id) {
            loadData();
        }

        return () => {
            mounted = false;
        }
    }, [bootcamp.length, bootcamp.name, bootcamp.reviews, dispatch, id, reloaded]);

    return (
        <div className="bootcamp-page">
            <div className="single-bootcamp __review-page">
                {bootcamp.name && (<PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    onBack={() => history.push(`/bootcamps/${bootcamp.slug}`)}
                    title="Bootcamps"
                    subTitle={bootcamp.name}
                />)}

                <Row type="flex">
                    <Col span={24} className="sticky-headr">
                        {bootcamp.name && (<>
                            <h1>{bootcamp.name}</h1>
                            <hr/>
                        </>)}
                        {middleRating && (<span className="rating">
                                <Tag color="green">{locale.rating} {middleRating.toFixed(2)}</Tag>
                                <span style={{marginRight: 12}}>|</span>
                            </span>)}
                        {bootcamp.name && (<Button type="primary"
                                                   onClick={() => handlerVisibleModal(true)}>{locale.add_new_review}</Button>)}
                    </Col>

                    {bootcamp.reviews && !!bootcamp.reviews.length
                        ? (<Col span={24}>
                            {bootcamp.reviews && bootcamp.reviews.map(review => (
                                <div key={review._id} className="review">
                                    <header>
                                        {review.title}
                                        {me && me.id === review.user && (<div>
                                            <Button
                                                type="primary"
                                                onClick={() => handlerSetEditedReview(review)}
                                                style={{marginRight: 10}}
                                            >{locale.edit_review}</Button>
                                            <Button
                                                type="danger"
                                                onClick={() => setDeletedReview(review._id)}
                                            >{locale.delete_review}</Button>
                                        </div>)}
                                    </header>
                                    <main>
                                        <div className="rating">
                                            <span>{locale.rating}:</span> <Rate value={review.rating} count={10}
                                                                                disabled/>
                                        </div>
                                        {review.text && (<div className="comment">{review.text}</div>)}
                                        {handlerGetAuthorReview(review.user) && (<div
                                            className="author">{locale.author}: <b>{handlerGetAuthorReview(review.user)}</b>
                                        </div>)}
                                    </main>
                                </div>
                            ))}
                        </Col>) :
                        bootcamp.name
                            ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>)
                            : (<Col span={24}>
                                <div className="__no-data">
                                    {emptyData}
                                    <h2>{locale.we_did_not_found_any_response}</h2>
                                    <Link to={`/`}>
                                        <Button type="primary">{locale.go_home}</Button>
                                    </Link>
                                </div>
                            </Col>)
                    }
                </Row>
            </div>
            <Modal
                title={bootcamp.name ? `${editedReview ? 'Edit review' : 'New review for'}: ${bootcamp.name}` : 'New Review'}
                style={{top: 100}}
                visible={modalVisible}
                onOk={editedReview ? handlerUpdateReview : handlerAddNewReview}
                onCancel={() => handlerVisibleModal(false)}
            >
                <div className="review-modal">
                    <Row type="flex" align="middle">
                        <Col span={6}>
                            <b>{locale.rating}:</b>
                        </Col>
                        <Col span={18}>
                            <Slider
                                value={editedReview ? editedReview.rating : ratingNewReview}
                                max={10}
                                onChange={value => editedReview ? setEditedReview({
                                    ...editedReview,
                                    rating: value
                                }) : setRatingNewReview(value)}
                            />
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6}>
                            <b>{locale.review_title}:</b>
                        </Col>
                        <Col span={18}>
                            <Input
                                placeholder={locale.add_review_title}
                                onChange={e => editedReview ? setEditedReview({
                                    ...editedReview,
                                    title: e.target.value
                                }) : setTitleNewReview(e.target.value)}
                                value={editedReview ? editedReview.title : titleNewReview}
                            />
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6}>
                            <b>{locale.your_review}:</b>
                        </Col>
                        <Col span={18}>
                            <TextArea
                                rows={6}
                                placeholder={locale.add_review_description}
                                onChange={e => editedReview ? setEditedReview({
                                    ...editedReview,
                                    text: e.target.value
                                }) : setTextNewReview(e.target.value)}
                                value={editedReview ? editedReview.text : textNewReview}
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
}

export default ReviewsSingleBootcamp;
