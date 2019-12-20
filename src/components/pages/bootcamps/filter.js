import React, {useEffect, useState} from 'react';
import {Button, Icon} from 'antd';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {URL} from "../../../configKey";
// actions
import {setBootcampsData, deleteElementFromFilter} from "../../../redux/bootcamps/actions";
// svg
import {setting} from '../../../components/img/iconSvg'
// components
import DetailMode from './mode-detail'
import SmallMode from './mode-small'

function Filter({locale}) {
    const dispatch = useDispatch();
    const pageSize = useSelector(state => state.Bootcamps.pagination);
    const filter = useSelector(state => state.Bootcamps.filter);

    const [visible, setVisible] = useState(false);
    const [smallMode, setSmallMode] = useState(false);
    const [onSearch, setOnSearch] = useState(false);
    const [loaderSearch, setLoaderSearch] = useState(false);
    const [searchSmallMode, setSearchSmallMode] = useState(false);
    const [searchUrl, setSearchUrl] = useState('');

    const handlerVisibleFilter = isVisible => {
        setVisible(isVisible);
        setSmallMode(false);
    };

    const handlerVisibleSmallModeFilter = isVisible => {
        setSmallMode(isVisible);
        setVisible(false)
    };

    let tempUrl;

    const handlerCreatedUrl = async () => {
        const limitSearchParam = () => {
            if (pageSize && pageSize.next) {
                tempUrl = `page=1&limit=${pageSize.next.limit}`;
            } else if (pageSize && pageSize.prev) {
                tempUrl = `page=1&limit=${pageSize.prev.limit}`;
            } else {
                tempUrl = ''
            }
        };

        const cycleSearchParam = () => {
            for (let i = 0; i < filter.length; i++) {
                const name = filter[i].name;
                const operator = filter[i].operator;
                const values = filter[i].values;

                if (name === 'priceFrom' || name === 'priceTo') {
                    tempUrl = tempUrl !== ''
                        ? tempUrl + `&averageCost[${operator}]=${values}`
                        : tempUrl + `averageCost[${operator}]=${values}`;
                } else if (name === 'ratingFrom' || name === 'ratingTo') {
                    tempUrl = tempUrl !== ''
                        ? tempUrl + `&averageRating[${operator}]=${values}`
                        : tempUrl + `averageRating[${operator}]=${values}`;
                } else if (name === 'careers') {
                    tempUrl = tempUrl !== ''
                        ? tempUrl + `&careers[${operator}]=${values}`
                        : tempUrl + `careers[${operator}]=${values}`;
                } else if (name === 'housing' || name === 'jobAssistance' || name === 'jobGuarantee' || name === 'acceptGi') {
                    tempUrl = tempUrl !== ''
                        ? tempUrl + `&${name}=${values}`
                        : tempUrl + `${name}=${values}`;
                } else if (name === 'name' || name === 'phone') {
                    tempUrl = tempUrl !== ''
                        ? tempUrl + `&${name}=${values}`
                        : tempUrl + `${name}=${values}`;
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
        await handlerVisibleSmallModeFilter(true);
    };

    const closeTag = removedFilterName => dispatch(deleteElementFromFilter(removedFilterName)).then(() => {
        setSearchSmallMode(true);
    });

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
                        setSearchSmallMode(false);
                        if (filter && !filter.length) {
                            setSmallMode(false);
                        }
                    }
                } catch (e) {
                    setLoaderSearch(false);
                    setSearchSmallMode(false);
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

    useEffect(() => {
        if (searchSmallMode) {
            handlerClickFilterSearch()
        }
    }, [searchSmallMode]);

    return (
        <div className="filter">
            {!visible && (<div className="action-panel">
                <span>
                    {loaderSearch && (<Icon type="loading"/>)}
                </span>
                <Button type="primary" onClick={() => handlerVisibleFilter(true)}>{setting} {locale.filter}</Button>
            </div>)}
            {visible && (<DetailMode
                handlerVisibleSmallModeFilter={handlerVisibleSmallModeFilter}
                handlerVisibleFilter={handlerVisibleFilter}
                handlerClickFilterSearch={handlerClickFilterSearch}
                filter={filter}
                locale={locale}
            />)}
            {smallMode && (<SmallMode locale={locale} closeTag={closeTag}/>)}
        </div>
    );
}

export default Filter;
