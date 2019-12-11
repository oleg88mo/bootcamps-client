import React, {useEffect, useState} from 'react';
import {Button, Icon, Row, Col, Switch} from 'antd';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {URL} from "../../../configKey";
import {setBootcampsData} from "../../../redux/bootcamps/actions";
// components
import DetailModePrice from './mode-detail-price';
import DetailModeRating from './mode-detail-rating';
import DetailModeCareers from './mode-detail-careers';
import DetailModeSearchByName from './mode-detail-search-by-name';
import DetailModeWithCheckbox from './mode-detail-with-checkbox';
import DetailModeSearchByRadius from './mode-detail-search-by-radius';

function DetailMode(p) {
    const dispatch = useDispatch();
    const pageSize = useSelector(state => state.Bootcamps.pagination);
    const filter = useSelector(state => state.Bootcamps.filter);

    const [onSearch, setOnSearch] = useState(false);
    const [loaderSearch, setLoaderSearch] = useState(false);
    const [searchUrl, setSearchUrl] = useState('');
    const [switchChecked, setSwitchChecked] = useState(false);
    const [radiusSearchParam, setRadiusSearchParam] = useState({
        zipCode: null,
        distance: null
    });
    const [radiusSearch, setRadiusSearch] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;

                try {
                    setLoaderSearch(true);
                    responseBootcamps = await axios.get(`${URL}/bootcamps?${searchUrl}`);

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setBootcampsData(responseBootcamps.data));
                        setLoaderSearch(false);
                    }
                } catch (e) {
                    setLoaderSearch(false);
                    console.log('error:', e);
                }
            }
        };

        if (onSearch) {
            loadData();
        }

        return () => {
            mounted = false;
            setOnSearch(false);
        }
    }, [onSearch]);

    // search by Radius
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;

                try {
                    // setLoaderSearch(true);
                    responseBootcamps = await axios.get(`${URL}/bootcamps/radius/${radiusSearchParam.zipCode}/${radiusSearchParam.distance}`);

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setBootcampsData(responseBootcamps.data));
                        // setLoaderSearch(false);
                    }
                } catch (e) {
                    // setLoaderSearch(false);
                    console.log('error:', e);
                }
            }
        };

        if (radiusSearchParam.zipCode && radiusSearchParam.distance) {
            loadData();
        }

        return () => {
            mounted = false;
            setRadiusSearch(false);
        }
    }, [radiusSearch]);

    let tempUrl;

    const handlerCreatedUrl = async () => {
        const limitSearchParam = () => {
            if (pageSize && pageSize.next) {
                tempUrl = `page=1&limit=${pageSize.next.limit}`;
            } else {
                tempUrl = `page=1&limit=${pageSize.prev.limit}`;
            }
        };

        const cycleSearchParam = () => {
            for (let i = 0; i < filter.length; i++) {
                const name = filter[i].name;
                const operator = filter[i].operator;
                const values = filter[i].values;

                if (name === 'priceFrom' || name === 'priceTo') {
                    tempUrl = tempUrl + `&averageCost[${operator}]=${values}`;
                } else if (name === 'ratingFrom' || name === 'ratingTo') {
                    tempUrl = tempUrl + `&averageRating[${operator}]=${values}`;
                } else if (name === 'careers') {
                    tempUrl = tempUrl + `&careers[${operator}]=${values}`;
                } else if (name === 'housing' || name === 'jobAssistance' || name === 'jobGuarantee' || name === 'acceptGi') {
                    tempUrl = tempUrl + `&${name}=${values}`;
                } else if (name === 'name' || name === 'phone') {
                    tempUrl = tempUrl + `&${name}=${values}`;
                }
            }
        };

        await limitSearchParam();
        await cycleSearchParam();
        await setSearchUrl(tempUrl)
    };

    const handlerClickFilterSearch = async () => {
        await handlerCreatedUrl();
        await setOnSearch(true);
        await p.handlerVisibleSmallModeFilter(true);
    };

    const changeSwitchChecked = val => setSwitchChecked(val);

    const handlerClickFilterSearchWithRadius = () => setRadiusSearch(true);

    const onChangeInputRadiusSearchParam = e => {
        const {name, value} = e.target;

        setRadiusSearchParam({
            ...radiusSearchParam,
            [name]: value ? value : null
        });
    };

    return (
        <div className="detail-mode">
            {loaderSearch && <p>Loading...</p>}

            <div className="panel">
                <h3>Filter</h3>
                <Icon type="close-circle" onClick={() => p.handlerVisibleSmallModeFilter(true)}/>
            </div>
            <Row type="flex">
                <Col span={24}>
                    <Switch onChange={changeSwitchChecked} checked={switchChecked}/> Search by ZipCode & Radius
                </Col>
            </Row>
            {!switchChecked ?
                <Row type="flex">
                    <Col span={8}>
                        <DetailModeSearchByName/>
                    </Col>
                    <Col span={8}>
                        <DetailModePrice/>
                    </Col>
                    <Col span={8}>
                        <DetailModeRating/>
                    </Col>
                    <Col span={8}>
                        <DetailModeWithCheckbox/>out
                    </Col>
                    <Col span={8}>
                        <DetailModeCareers/>
                    </Col>
                </Row>

                :
                <Row type="flex">
                    <Col span={24}>
                        <DetailModeSearchByRadius onChangeInputRadiusSearchParam={onChangeInputRadiusSearchParam}/>
                    </Col>
                </Row>
            }
            <footer>
                {!switchChecked ?
                    <Button type="primary" onClick={handlerClickFilterSearch} disabled={!filter.length}>Filter
                        Search</Button>
                    :
                    <Button type="primary" onClick={handlerClickFilterSearchWithRadius}
                            disabled={!radiusSearchParam.zipCode || !radiusSearchParam.distance}>Filter Search
                        2</Button>
                }
            </footer>
        </div>
    );
}

export default DetailMode;
