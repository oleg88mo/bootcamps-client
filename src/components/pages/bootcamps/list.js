import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom'
import {Row, Col, Empty, Tag} from 'antd';
import {URL} from '../../../configKey';
// component
import EmptyList from './emptyList'
// actions
import {
    setBootcampsReviewData,
    setBootcampsData,
} from '../../../redux/bootcamps/actions';

function List() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.Bootcamps.data);
    const reviews = useSelector(state => state.Bootcamps.reviews);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;
                let responseRating;

                try {
                    if (!data.length) {
                        responseBootcamps = await axios.get(`${URL}/bootcamps`);
                    }
                    if (!reviews.length) {
                        responseRating = await axios.get(`${URL}/reviews`);
                    }

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setBootcampsData(responseBootcamps.data));
                    }

                    if (responseRating && responseRating.data.success) {
                        dispatch(setBootcampsReviewData(responseRating.data));
                    }
                } catch (e) {
                    console.log('error:', e);
                }
            }
        };

        if (!data.length) {
            loadData();
        }

        return () => {
            mounted = false;
        }
    }, []);

    const handlerSetBootcampId = id => window.localStorage.setItem('bootcampId', id);

    const bootcampRatind = bootcampId => {
        const review = reviews.find(f => f.bootcamp.id === bootcampId);

        if (review) {
            return review.rating
        }
    };

    console.log('Bootcamps Data', data);

    return (
        <div className="list">

            <Row type="flex">
                {data && data.length > 0 ? data.map(bootcamp => (
                        <Col
                            span={6}
                            key={bootcamp.id}
                            className="bootcamp-item"
                        >
                            <div className="wrap">
                                <span className="rating"> <Tag color="green">{bootcampRatind(bootcamp.id)}</Tag></span>
                                <Link to={`/bootcamps/${bootcamp.slug}`} onClick={() => handlerSetBootcampId(bootcamp.id)}>
                                    {bootcamp.photo !== 'no-photo.jpg' ? <img src={bootcamp.photo}/> :
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                                </Link>
                                <Link to={`/bootcamps/${bootcamp.slug}`} onClick={() => handlerSetBootcampId(bootcamp.id)}>
                                    <span className="link">{bootcamp.name}</span>
                                </Link>
                                {bootcamp.location.city &&
                                <p className="city">{bootcamp.location.city}{bootcamp.location.country ? `, ${bootcamp.location.country}` : null}</p>}
                                {bootcamp.description && <span className="description">{bootcamp.description}</span>}
                            </div>
                        </Col>
                    )
                ) : <EmptyList/>}
            </Row>
        </div>
    );
}

export default List
