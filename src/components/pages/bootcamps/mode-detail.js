import React, {useEffect, useState} from 'react';
import {Button, Icon, Row, Col} from 'antd';
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

function DetailMode(p) {
    const dispatch = useDispatch();
    const pageSize = useSelector(state => state.Bootcamps.pagination);
    const filter = useSelector(state => state.Bootcamps.filter);

    const [onSearch, setOnSearch] = useState(false);
    const [loaderSearch, setLoaderSearch] = useState(false);
    const [searchUrl, setSearchUrl] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;

                try {
                    setLoaderSearch(true);
                    responseBootcamps = await axios.get(`${URL}/bootcamps?${searchUrl}`);

                    // if (name) {
                    //     await handlerCreatedUrl()
                    //     responseBootcamps = await axios.get(`${URL}/bootcamps?page=1&limit=${pageSize}&averageCost[${priceFrom ? priceFrom.operator : 'gte'}]=${priceFrom ? priceFrom.values : '0'}&averageCost[${priceTo ? priceTo.operator : 'lte'}]=${priceTo ? priceTo.values : '0'}&name=${name.values}`);
                    // } else {
                    //     responseBootcamps = await axios.get(`${URL}/bootcamps?page=1&limit=${pageSize}&averageCost[${priceFrom ? priceFrom.operator : 'gte'}]=${priceFrom ? priceFrom.values : '0'}&averageCost[${priceTo ? priceTo.operator : 'lte'}]=${priceTo ? priceTo.values : '0'}`);
                    // }

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

    return (
        <div className="detail-mode">
            {loaderSearch && <p>Loading...</p>}
            <div className="panel">
                <h3>Filter</h3>
                <Icon type="close-circle" onClick={() => p.handlerVisibleSmallModeFilter(true)}/>
            </div>
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
                    <DetailModeWithCheckbox/>
                </Col>
                <Col span={8}>
                    <DetailModeCareers/>
                </Col>
            </Row>
            <footer>
                <Button type="primary" onClick={handlerClickFilterSearch} disabled={!filter.length}>Filter
                    Search</Button>
            </footer>
        </div>
    );
}

export default DetailMode;
