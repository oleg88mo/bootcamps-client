import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Row, Col, Empty, Tag, ConfigProvider, Pagination} from 'antd';
import {URL} from '../../../configKey';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import uk_UA from 'antd/lib/locale-provider/uk_UA';
import en_US from 'antd/lib/locale-provider/en_US';

// component
import EmptyList from './emptyList'
// actions
import {
    setBootcampsReviewData,
    setBootcampsData,
} from '../../../redux/bootcamps/actions';

const locales = {
    ru: ru_RU,
    en: en_US,
    ua: uk_UA,
};

function List() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.Bootcamps.data);
    const totalCount = useSelector(state => state.Bootcamps.totalCount);
    const reviews = useSelector(state => state.Bootcamps.reviews);
    const lang = useSelector(state => state.Users.lang);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (mounted) {
                let responseBootcamps;
                let responseRating;

                try {
                    // name=Codemasters
                    // averageCost[gte]=110000 >
                    // averageCost[lte]=110000 <

                    // 110000 ->    averageCost[gt]=120000  // 1 result
                    // 120000 ->    averageCost[gt]=120000  // 0 result

                    // 120000 ->    averageCost[lte]=120000  // 5 result
                    // 120000 ->    averageCost[lt]=120000  // 4 result


                    // 6340 ->    averageCost[in]=6340  // 1 result  ( === )


                    // averageCost[gte]=110000&averageCost[lte]=120000 // 1 result

                    responseBootcamps = await axios.get(`${URL}/bootcamps?page=${pageNumber}&limit=${pageSize}`);

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

        loadData();

        return () => {
            mounted = false;
        }
    }, [pageSize, pageNumber]);

    const handlerSetBootcampId = id => window.localStorage.setItem('singleBootcampId', id);

    const bootcampRatind = bootcampId => {
        const review = reviews.find(f => f.bootcamp.id === bootcampId);

        if (review) {
            return review.rating
        }
    };

    const onShowSizeChange = pageSizeNew => {
        setPageNumber(1);
        setPageSize(pageSizeNew);
    };

    const onChangePagination = pageNumberNew => setPageNumber(pageNumberNew);

    const showTotal = (total, range) => (
        <div className="table-showing__pagination">
            {/*{this.props.locale.pagination.showing}*/}
            showing:
            <b>
                {range[0]}-{range[1]}
            </b>
            {/*{this.props.locale.pagination.of}*/}
            of:
            <b> {total}</b>
        </div>
    );


    return (
        <div className="list">
            {data && data.length > 0
                ?
                <>
                    <Row type="flex">
                        {data.map(bootcamp => (
                                <Col
                                    span={8}
                                    key={bootcamp.id}
                                    className="bootcamp-item"
                                >
                                    <div className="wrap">
                                        {bootcampRatind(bootcamp.id) ?
                                            <span className="rating">
                                           <Tag color="green">{bootcampRatind(bootcamp.id)}</Tag>
                                       </span> :
                                            <span className="rating">
                                           <Tag color="red">no rating yet</Tag>
                                       </span>
                                        }
                                        <Link to={`/bootcamps/${bootcamp.slug}`}
                                              onClick={() => handlerSetBootcampId(bootcamp.id)}>
                                            {bootcamp.photo !== 'no-photo.jpg' ? <img src={bootcamp.photo}/> :
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                                        </Link>
                                        <Link to={`/bootcamps/${bootcamp.slug}`}
                                              onClick={() => handlerSetBootcampId(bootcamp.id)}>
                                            <span className="link">{bootcamp.name}</span>
                                        </Link>
                                        {bootcamp.location.city &&
                                        <p className="city">{bootcamp.location.city}{bootcamp.location.country ? `, ${bootcamp.location.country}` : null}</p>}
                                        {bootcamp.description &&
                                        <span className="description">{bootcamp.description}</span>}
                                    </div>
                                </Col>
                            )
                        )}
                    </Row>
                    <Row type="flex" justify="end" className="bootcamp-pagination">
                        <ConfigProvider locale={locales.hasOwnProperty(lang) ? locales[lang] : locales.en}>
                            <Pagination
                                showSizeChanger
                                showTotal={showTotal}
                                onShowSizeChange={(e, item) => onShowSizeChange(item)}
                                onChange={onChangePagination}
                                defaultCurrent={1}
                                className="pagination"
                                total={totalCount}
                                // defaultPageSize={pagination.pageSize}
                                // current={pagination.pageNumber}

                                // defaultPageSize={pageSize}
                                // current={pageNumber}
                                pageSizeOptions={['10', '25', '50']}
                            />
                        </ConfigProvider>
                    </Row>
                </>
                :
                <EmptyList data={data}/>}
        </div>
    );
}

export default List
