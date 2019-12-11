import React, {useEffect, useState} from 'react';
import {Input, Button, Row, Col} from 'antd';
import axios from "axios";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {URL} from "../../../configKey";
import DetailModeSearchByName from '../bootcamps/mode-detail-search-by-name';
// action
import {setBootcampsData, setDisabledSearchForListComponent} from "../../../redux/bootcamps/actions";
import {changePageName} from "../../../redux/users/actions";

function SearchForm({locale}) {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.Bootcamps.filter);
    const pageSize = useSelector(state => state.Bootcamps.pagination);
    const history = useHistory();

    const [onSearch, setOnSearch] = useState(false);
    const [loaderSearch, setLoaderSearch] = useState(false);
    const [searchUrl, setSearchUrl] = useState('');
    let tempUrl;

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
                        history.push('/bootcamps');
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
        await window.localStorage.setItem('bootcampPage', '2');
        await dispatch(setDisabledSearchForListComponent(true));
        await handlerCreatedUrl();
        await setOnSearch(true);
        await dispatch(changePageName('2'));
    };

    return (
        <div className="search-form">
            <h1>{locale.main_page.title}</h1>
            <h2>{locale.main_page.description}</h2>
            <Row>
                <Col span={12}>
                    <DetailModeSearchByName page={'home'}/>
                </Col>
                <Col span={12}>
                    <Input placeholder="Zipcode"/>
                </Col>
                <Col span={24}>
                    {loaderSearch && <p>Loading...</p>}
                    <Button type="primary" onClick={handlerClickFilterSearch}
                            disabled={!filter.length}
                    >{locale.search}</Button>
                </Col>
            </Row>
        </div>
    );
}

export default SearchForm;
