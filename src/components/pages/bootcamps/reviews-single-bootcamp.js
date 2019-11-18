import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import {PageHeader, Row, Col, Tag} from 'antd';
import axios from "axios";
import {URL} from '../../../configKey';
import {bootcampRatind} from '../../utils/usedFunctions'
// actions
import {
    getReviewsForSingleBootcamp,
    getSingleBootcamp
} from "../../../redux/bootcamps/actions";

function ReviewsSingleBootcamp() {
    const id = window.localStorage.getItem('bootcampId');

    const dispatch = useDispatch();

    const bootcamp = useSelector(state => state.Bootcamps.singleBootcamp);
    const [middleRating, setMiddleRating] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let response;
                let responseReviews;

                try {
                    if (!bootcamp.name) {
                        response = await axios.get(`${URL}/bootcamps/${id}`);
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

    console.log('single --- bootcamp', bootcamp);

    return (
        <div className="bootcamp-page">
            <div className="single-bootcamp">
                {bootcamp.name && (<PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    onBack={() => history.push(`/bootcamps/${bootcamp.slug}`)}
                    title="Bootcamps"
                    subTitle={bootcamp.name}
                />)}

                <Row type="flex">
                    <Col span={16}>
                        <h1>{bootcamp.name}</h1>
                    </Col>
                    <Col span={8} className="column-right">
                        {middleRating && (
                            <span className="rating">
                                <Tag color="green">Rating {middleRating}</Tag>
                                <Link to={`/bootcamps/${bootcamp.name}/reviews`}>
                                    Review For Bootcamp \\\\\\\\\\\
                                </Link>
                            </span>)}
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ReviewsSingleBootcamp;
