import React, {useEffect, useState} from 'react';
import {Input, Button, Row, Col} from 'antd';
import axios from "axios";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {URL} from "../../../configKey";
// component
import DetailModeSearchByName from '../bootcamps/mode-detail-search-by-name';
// actions
import {setBootcampsData, setDisabledSearchForListComponent} from "../../../redux/bootcamps/actions";
import {changePageName} from "../../../redux/users/actions";
import {openNotification, req} from "../../utils/usedFunctions";

function SearchForm({locale}) {
    const dispatch = useDispatch();

    const filter = useSelector(state => state.Bootcamps.filter);
    const pageSize = useSelector(state => state.Bootcamps.pagination);

    const history = useHistory();

    const [onSearch, setOnSearch] = useState(false);
    const [loaderSearch, setLoaderSearch] = useState(false);
    const [searchUrl, setSearchUrl] = useState('');

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
        await window.localStorage.setItem('bootcampPage', '2');
        await dispatch(setDisabledSearchForListComponent(true));
        await handlerCreatedUrl();
        await setOnSearch(true);
        await dispatch(changePageName('2'));
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                setLoaderSearch(true);

                const options = {
                    url: `${URL}/bootcamps?${searchUrl}`,
                    method: 'get',
                };

                req(options).then(
                    response => {
                        if (response && response.data.success) {
                            dispatch(setBootcampsData(response.data));
                            setLoaderSearch(false);
                            history.push('/bootcamps');
                        }
                    },
                    error => {
                        setLoaderSearch(false);
                        console.log('error',error);
                    }
                )
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

    return (
        <div className="search-form">
            <h1>{locale.main_page.title}</h1>
            <h2>{locale.main_page.description}</h2>
            <Row>
                <Col span={12}>
                    <DetailModeSearchByName page={'home'} locale={locale}/>
                </Col>
                <Col span={12}>
                    <Input placeholder="Zipcode"/>
                </Col>
                <Col span={24}>
                    {loaderSearch && (<p>{locale.loading}...</p>)}
                    <Button
                        type="primary"
                        onClick={handlerClickFilterSearch}
                        disabled={!filter.length}
                    >{locale.search}</Button>
                </Col>
            </Row>
        </div>
    );
}

export default SearchForm;
