import React, {useEffect, useState} from 'react';
import {Button, Icon, Row, Col, Switch} from 'antd';
import {openNotification} from '../../utils/usedFunctions';
import axios from "axios";
import {useDispatch} from "react-redux";
import {URL} from "../../../configKey";
// actions
import {
    setBootcampsData,
    setBootcampsFilter,
    clearBootcampsFilter,
    clearAllBootcampsFilter
} from "../../../redux/bootcamps/actions";
// components
import DetailModePrice from './mode-detail-price';
import DetailModeRating from './mode-detail-rating';
import DetailModeCareers from './mode-detail-careers';
import DetailModeSearchByName from './mode-detail-search-by-name';
import DetailModeWithCheckbox from './mode-detail-with-checkbox';
import DetailModeSearchByRadius from './mode-detail-search-by-radius';

function DetailMode(p) {
    const {locale, handlerVisibleSmallModeFilter, handlerVisibleFilter, filter} = p;

    const dispatch = useDispatch();

    const [switchChecked, setSwitchChecked] = useState(false);
    const [radiusSearch, setRadiusSearch] = useState(false);
    const [radiusSearchParam, setRadiusSearchParam] = useState({
        zipCode: null,
        distance: null
    });

    const changeSwitchChecked = val => {
        setSwitchChecked(val);
        dispatch(clearAllBootcampsFilter())
    };

    const handlerClickFilterSearchWithRadius = () => setRadiusSearch(true);

    const onChangeInputRadiusSearchParam = e => {
        const {name, value} = e.target;

        setRadiusSearchParam({
            ...radiusSearchParam,
            [name]: value ? value : null
        });

        if (value !== '') {
            dispatch(setBootcampsFilter({
                name,
                values: value ? value : null,
            }));
        } else {
            dispatch(clearBootcampsFilter({name}))
        }
    };

    // search by Radius
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;

                try {
                    responseBootcamps = await axios.get(`${URL}/bootcamps/radius/${radiusSearchParam.zipCode}/${radiusSearchParam.distance}`);

                    if (responseBootcamps && responseBootcamps.data.success) {
                        dispatch(setBootcampsData(responseBootcamps.data));

                        if (filter && !filter.length) {
                            handlerVisibleSmallModeFilter(false);
                        } else {
                            handlerVisibleSmallModeFilter(true);
                        }
                    }
                } catch (error) {
                    openNotification('error', `${locale.search_by_radius}`,error.response && error.response.data.error);
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

    return (
        <div className="detail-mode">
            <div className="panel">
                <h3>{locale.filter}</h3>
                <Icon type="close-circle" onClick={() => handlerVisibleFilter(false)}/>
            </div>
            <Row type="flex" className="switch">
                <Col span={24}>
                    <Switch onChange={changeSwitchChecked} checked={switchChecked}/> {locale.search_by_zipCode_radius}
                </Col>
            </Row>
            {!switchChecked ? (
                <Row type="flex">
                    <Col span={8}>
                        <DetailModeSearchByName locale={locale}/>
                    </Col>
                    <Col span={8}>
                        <DetailModePrice locale={locale}/>
                    </Col>
                    <Col span={8}>
                        <DetailModeRating locale={locale}/>
                    </Col>
                    <Col span={8}>
                        <DetailModeWithCheckbox locale={locale}/>
                    </Col>
                    <Col span={8}>
                        <DetailModeCareers locale={locale}/>
                    </Col>
                </Row>
            ) : (
                <Row type="flex">
                    <Col span={24}>
                        <DetailModeSearchByRadius
                            onChangeInputRadiusSearchParam={onChangeInputRadiusSearchParam}
                            locale={locale}
                        />
                    </Col>
                </Row>
            )}
            <footer>
                {!switchChecked ?
                    <Button
                        type="primary"
                        onClick={p.handlerClickFilterSearch}
                        disabled={!p.filter.length}
                    >{locale.search}</Button>
                    :
                    <Button
                        type="primary"
                        onClick={handlerClickFilterSearchWithRadius}
                        disabled={!radiusSearchParam.zipCode || !radiusSearchParam.distance}
                    >{locale.search}</Button>
                }
            </footer>
        </div>
    );
}

export default DetailMode;
