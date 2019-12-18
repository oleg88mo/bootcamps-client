import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import axios from "axios";
import mapboxgl from 'mapbox-gl';
import Pin from '../../../components/img/pin.png'
import {computer, check, checkCancel} from '../../../components/img/iconSvg'
import {PageHeader, Row, Col, Empty, Collapse, Icon, Tag, Skeleton, Button} from 'antd';
import {mapBoxKey, PHOTO_URL, URL} from '../../../configKey';
import {bootcampRatind} from '../../utils/usedFunctions'
// actions
import {
    getSingleBootcamp,
    getCoursesForSingleBootcamp,
    getReviewsForSingleBootcamp,
    clearSingleBootcamp,
} from "../../../redux/bootcamps/actions";

function SingleBootcapm({locale}) {
    const {Panel} = Collapse;

    let history = useHistory();

    const dispatch = useDispatch();
    const bootcamp = useSelector(state => state.Bootcamps.singleBootcamp);

    const id = window.localStorage.getItem('singleBootcampId');

    const [middleRating, setMiddleRating] = useState(null);
    const [loadingBootcampCourses, setLoadingBootcampCourses] = useState(true);
    const [loadingBootcamp, setLoadingBootcamp] = useState(true);

    mapboxgl.accessToken = mapBoxKey;
    const mapContainer = useRef();
    let map;

    if (bootcamp && bootcamp.location && mapContainer.current) {
        map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [`${bootcamp.location.coordinates[0]}`, `${bootcamp.location.coordinates[1]}`],
            zoom: 15,
            pitch: 30
        });

        map.on('load', function () {
            map.loadImage(Pin, function (error, image) {
                if (error) throw error;
                map.addImage('icon', image);
                map.addLayer({
                    "id": "points",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": [{
                                "type": "Feature",
                                "geometry": {"type": "Point", "coordinates": [bootcamp.location.coordinates[0], bootcamp.location.coordinates[1]]}
                            }]
                        }
                    },
                    "layout": {"icon-image": "icon", "icon-size": 0.65}
                });
            });
        });
    }

    bootcampRatind(bootcamp, setMiddleRating);

    const handlerBackToBootcamps = async () => {
        await dispatch(clearSingleBootcamp());
        await history.push("/bootcamps");
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let response;
                let responseReviews;
                let responseCourses;

                try {
                    if (bootcamp.id !== id) {
                        response = await axios.get(`${URL}/bootcamps/${id}`);
                    }
                    if (!bootcamp.courses) {
                        responseCourses = await axios.get(`${URL}/bootcamps/${id}/courses`);
                    } else {
                        setLoadingBootcampCourses(false);
                    }
                    if (!bootcamp.reviews && !bootcamp.length) {
                        responseReviews = await axios.get(`${URL}/bootcamps/${id}/reviews`);
                    }

                    if (bootcamp.id !== id && response && response.data.success) {
                        dispatch(getSingleBootcamp(response.data));
                        setLoadingBootcamp(false);
                    } else {
                        setLoadingBootcamp(false);
                    }
                    if (responseCourses.data.success) {
                        dispatch(getCoursesForSingleBootcamp(responseCourses.data));
                        setLoadingBootcampCourses(false);
                    } else {
                        setLoadingBootcampCourses(false);
                    }
                    if (responseReviews.data.success) {
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

    return (
        <div className="bootcamp-page">
            <div className="single-bootcamp">
                {bootcamp.name && (<PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    onBack={() => handlerBackToBootcamps()}
                    title="Bootcamps"
                    subTitle={bootcamp.name}
                />)}
                <Row type="flex">
                    <Col md={24} lg={15} xl={16} className="column-left">
                        {loadingBootcamp ? (<Icon type="loading" className="loading"/>) : (<h1>{bootcamp.name}</h1>)}
                        {loadingBootcamp ? (<Icon type="loading" className="loading"/>) : bootcamp.description ? (<>
                            <h3>{bootcamp.description}</h3>
                            <hr/>
                        </>) : null}

                        {loadingBootcampCourses ? (<Skeleton active/>) : bootcamp.courses && bootcamp.courses.length > 0 ?
                            (<div>
                                <h2>{locale.our_courses}:</h2>
                                <Collapse
                                    bordered={false}
                                    accordion
                                    defaultActiveKey={[`${bootcamp.courses[0]._id}`]}
                                    expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
                                >
                                    {bootcamp.courses && bootcamp.courses.map(course => (<Panel
                                        header={course.title}
                                        key={course._id}
                                    >
                                        <div className="course">
                                            <p>
                                                <b>{locale.duration}: {course.weeks} {locale.weeks}</b>
                                            </p>
                                            {course.description && (<>
                                                <p>{course.description}</p>
                                                <hr/>
                                            </>)}
                                            {course.tuition && (<p style={{marginTop: 20}}>{computer}<b>{locale.cost}:</b> ${course.tuition} USD</p>)}
                                            {course.minimumSkill && (<p>{computer}<b>{locale.minimum_skill}:</b> {course.minimumSkill}</p>)}
                                            {course.scholarshipAvailable && (<p>{computer}<b>{locale.scholarship_available}:</b> {check}</p>)}
                                        </div>
                                    </Panel>))}
                                </Collapse>
                            </div>) : null}
                    </Col>
                    <Col md={24} lg={9} xl={8} className="column-right">
                        {bootcamp.photo !== 'no-photo.jpg' ? (<div className="image">
                            <img src={`${PHOTO_URL}/${bootcamp.photo}`} alt={bootcamp.name}/>
                        </div>) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>)}

                        {bootcamp.averageCost && (<>
                            <h2>{locale.average_course_cost}: ${bootcamp.averageCost} USD</h2>
                            <hr/>
                        </>)}

                        <div className="table">
                            <main>
                                {middleRating && (<div className="rating">
                                    <Row type="flex">
                                        <Col span={8}>{locale.rating}:</Col>
                                        <Col span={16}>
                                            <Tag color="green">{middleRating.toFixed(2)}</Tag>
                                        </Col>
                                    </Row>
                                </div>)}
                                {middleRating && (<Row type="flex">
                                    <Col span={8}>{locale.reviews}:</Col>
                                    <Col span={16}>
                                        <Link to={`/bootcamps/${bootcamp.slug}/reviews`}>
                                            <Button type="primary">{locale.read_reviews} Bootcamp</Button>
                                        </Link>
                                    </Col>
                                </Row>)}
                                {bootcamp.website && (<div className="website">
                                    <Row type="flex">
                                        <Col span={8}>{locale.website}:</Col>
                                        <Col span={16}>
                                            <a href={bootcamp.website} target="_blank">
                                                <Button type="primary">{bootcamp.website}</Button>
                                            </a>
                                        </Col>
                                    </Row>
                                </div>)}
                                <Row type="flex">
                                    <Col span={8}>{locale.housing}:</Col>
                                    <Col span={16}>{bootcamp.housing ? check : checkCancel}</Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={8}>{locale.job_assistance}:</Col>
                                    <Col span={16}>{bootcamp.jobAssistance ? check : checkCancel}</Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={8}>{locale.job_guarantee}:</Col>
                                    <Col span={16}>{bootcamp.jobGuarantee ? check : checkCancel}</Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={8}>{locale.accepts_gi_bill}:</Col>
                                    <Col span={16}>{bootcamp.acceptGi ? check : checkCancel}</Col>
                                </Row>
                            </main>
                        </div>
                    </Col>
                    <Col span={24}>
                        <div ref={mapContainer} className="map"/>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default SingleBootcapm;
