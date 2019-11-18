import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import axios from "axios";
import mapboxgl from 'mapbox-gl';
import Pin from '../../../components/img/pin.png'
import {computer, check} from '../../../components/img/iconSvg'
import {PageHeader, Row, Col, Empty, Collapse, Icon, Tag, Skeleton} from 'antd';
import {bootcampRatind} from '../../utils/usedFunctions'
import {mapBoxKey, URL} from '../../../configKey';

// actions
import {
    getSingleBootcamp,
    getCoursesForSingleBootcamp,
    getReviewsForSingleBootcamp,
    clearSingleBootcamp,
} from "../../../redux/bootcamps/actions";

const {Panel} = Collapse;

function SingleBootcapm() {
    const id = window.localStorage.getItem('bootcampId');
    const [middleRating, setMiddleRating] = useState(null);
    const [loadingBootcampCourses, setLoadingBootcampCourses] = useState(true);
    const [loadingBootcamp, setLoadingBootcamp] = useState(true);

    let history = useHistory();

    const dispatch = useDispatch();
    const bootcamp = useSelector(state => state.Bootcamps.singleBootcamp);

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
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [bootcamp.location.coordinates[0], bootcamp.location.coordinates[1]]
                                }
                            }]
                        }
                    },
                    "layout": {
                        "icon-image": "icon",
                        "icon-size": 0.65
                    }
                });
            });
        });
    }

    bootcampRatind(bootcamp, setMiddleRating);

    const handlerBackToBootcamps = async () => {
        await dispatch(clearSingleBootcamp());
        await history.push("/bootcamps");
    };

    console.log('single --- bootcamp', bootcamp);

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
                    <Col span={16}>
                        {loadingBootcamp ? <Icon type="loading"/> : <h1>{bootcamp.name}</h1>}
                        {loadingBootcamp ? <Icon type="loading"/> : bootcamp.description ? <>
                            <h3>{bootcamp.description}</h3>
                            <hr/>
                        </> : null}

                        {loadingBootcampCourses ? <Skeleton active/> : bootcamp.courses && bootcamp.courses.length > 0 ?
                            <div>
                                <h2>Our Courses:</h2>
                                <Collapse
                                    bordered={false}
                                    accordion
                                    defaultActiveKey={['1']}
                                    expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
                                >
                                    {bootcamp.courses.map(course => (
                                        <Panel
                                            header={course.title}
                                            key={course._id}
                                        >
                                            <div className="course">
                                                <p><b>Duration: {course.weeks} Weeks</b></p>
                                                {course.description && <p>{course.description}</p>}
                                                <hr/>
                                                {course.tuition &&
                                                <p style={{marginTop: 20}}>{computer}<b>Cost:</b> ${course.tuition} USD
                                                </p>}
                                                {course.minimumSkill &&
                                                <p>{computer}<b>Minimum skill:</b> {course.minimumSkill}</p>}
                                                {course.scholarshipAvailable &&
                                                <p>{computer}<b>Scholarship Available:</b> {check}</p>}
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </div> : null}
                    </Col>
                    <Col span={8} className="column-right">
                        {bootcamp.photo !== 'no-photo.jpg' ? <img src={bootcamp.photo} alt={bootcamp.name}/> :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}

                        {bootcamp.averageCost && <>
                            <h2>Average Course Cost: ${bootcamp.averageCost} USD</h2>
                            <hr/>
                        </>}

                        {middleRating && (
                            <span className="rating">
                                <Tag color="green">Rating {middleRating}</Tag>
                                <Link to={`/bootcamps/${bootcamp.slug}/reviews`}>
                                    Review For Bootcamp
                                </Link>
                            </span>)}
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