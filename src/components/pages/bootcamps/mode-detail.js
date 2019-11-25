import React, {useEffect, useState} from 'react';
import {Button} from 'antd';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {URL} from "../../../configKey";
import {setBootcampsData} from "../../../redux/bootcamps/actions";
// components
import DetailModePrice from './mode-detail-price';

function DetailMode(p) {
    const dispatch = useDispatch();
    const pageSize = useSelector(state => state.Bootcamps.pagination.next.limit);
    const filter = useSelector(state => state.Bootcamps.filter);
    const priceFrom = filter && filter.find(f => f.name === 'priceFrom');
    const priceTo = filter && filter.find(f => f.name === 'priceTo');

    const [onSearch, setOnSearch] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;

                try {
                    responseBootcamps = await axios.get(`${URL}/bootcamps?page=1&limit=${pageSize}&averageCost[${priceFrom ? priceFrom.operator : 'gte'}]=${priceFrom ? priceFrom.values : '0'}&averageCost[${priceTo.operator}]=${priceTo.values}`);

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setBootcampsData(responseBootcamps.data));
                    }
                } catch (e) {
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

    const handlerClickFilterSearch = async () => {
        await setOnSearch(true);
        await p.handlerVisibleSmallModeFilter(true);
    };

    return (
        <div className="detail-mode">
            <h3>Filter</h3>
            <DetailModePrice/>
            <Button type="primary" onClick={handlerClickFilterSearch} disabled={!filter.length}>Filter Search</Button>
        </div>
    );
}

export default DetailMode;
