import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import {PageHeader, Row, Col, Tag, Button, Empty, Rate, Modal, Slider, Input} from 'antd';
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

function ReviewsSingleBootcamp() {
    const id = window.localStorage.getItem('singleBootcampId');

    const dispatch = useDispatch();

    const bootcamp = useSelector(state => state.Bootcamps.singleBootcamp);
    const users = useSelector(state => state.Users.data);
    const [middleRating, setMiddleRating] = useState(null);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [ratingNewReview, setRatingNewReview] = useState(0);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let response;
                let responseReviews;
                let responseUsers;
                const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

                try {
                    if (!bootcamp.name) {
                        response = await axios.get(`${URL}/bootcamps/${id}`);

                        if (isLoggin !== null) {
                            const tokenRemoveFirstChar = isLoggin.substr(1);
                            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                            responseUsers = await axios.get(`${URL}/users`, {
                                headers: {
                                    'content-type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            })
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
    }, [id]);


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

    const handlerVisibleModal = visible => setModal1Visible(visible);

    const handlerAddNewReview = () => {
        handlerVisibleModal(false)
    };

    const handlerChangeRatingReview = value => setRatingNewReview(value);

    console.log('single --- bootcamp ||||', bootcamp);
    console.log(' --- getAllUsers ||||', users);

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
                    <Col span={24}>
                        {bootcamp.name && <>
                            <h1>{bootcamp.name}</h1>
                            <hr/>
                        </>}

                        {middleRating && (
                            <span className="rating">
                                <Tag color="green">Rating {middleRating}</Tag> <span style={{marginRight: 12}}>|</span>
                            </span>)}
                        {bootcamp.name &&
                        <Button type="primary" onClick={() => handlerVisibleModal(true)}>Add new Review</Button>}
                    </Col>

                    {bootcamp.reviews && !!bootcamp.reviews.length ? <Col span={24}>
                        {bootcamp.reviews.map(review => (
                            <div key={review._id} className="review">
                                <header>{review.title}</header>
                                <main>
                                    <div className="rating">
                                        <span>Rating:</span><Rate value={review.rating} count={10} disabled/>
                                    </div>
                                    {review.text && <div className="comment">{review.text}</div>}
                                    <div className="author">Author: <b>{handlerGetAuthorReview(review.user)}</b></div>
                                </main>
                            </div>
                        ))}
                    </Col> : bootcamp.name ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> : <Col span={24}>
                        <div className="__no-data">
                            {emptyData}
                            <h2>Sorry, but we didn't found any response in this page</h2>
                            <Link to={`/`}>
                                <Button type="primary">Go Home</Button>
                            </Link>
                        </div>
                    </Col>}
                </Row>
            </div>
            <Modal
                title={bootcamp.name ? `New Review for: ${bootcamp.name}` : 'New Review'}
                style={{top: 100}}
                visible={modal1Visible}
                onOk={handlerAddNewReview}
                onCancel={() => handlerVisibleModal(false)}
            >
                <div className="review-modal">
                    <Row type="flex" align="middle">
                        <Col span={6}>
                            <b>Rating:</b>
                        </Col>
                        <Col span={18}>
                            <Slider defaultValue={ratingNewReview} max={10} onChange={handlerChangeRatingReview}/>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6}>
                            <b>Review Title:</b>
                        </Col>
                        <Col span={18}>
                            <Input placeholder="Add review title here..."/>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6}>
                            <b>Your Review:</b>
                        </Col>
                        <Col span={18}>
                            <TextArea rows={6} placeholder="Add your review here..."/>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
}

export default ReviewsSingleBootcamp;
