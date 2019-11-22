import React from 'react';
import {Tag, Tooltip} from 'antd';

function SmallMode(p) {
    // const from = p.filter.find(m => m.name === 'statsDateFrom');
    // const to = p.filter.find(m => m.name === 'statsDateTo');
    // const module = p.filter.find(m => m.name === 'module');

    return (
        <div className="small-mode">
            You select:

            <Tag closable
                 // onClose={() => p.closeTag(module.name)}
                 key={1}
            >
                <Tooltip
                    placement="top"
                    title={'rrr'}
                    className="rec-filter__tooltip"
                >
                   rrrr
                </Tooltip>
            </Tag>


            {/*<div className="date-bg">*/}
            {/*    {from ? (*/}
            {/*        <Tag*/}
            {/*            closable*/}
            {/*            onClose={() => p.closeTag(from.name)}*/}
            {/*            key={from.name}*/}
            {/*            className="date tag__from"*/}
            {/*        >*/}
            {/*            <Tooltip*/}
            {/*                placement="top"*/}
            {/*                title={p.locale.date_from}*/}
            {/*            >*/}
            {/*                /!*{formatDate(Number(from.values))}*!/*/}
            {/*            </Tooltip>*/}
            {/*        </Tag>*/}
            {/*    ) : (*/}
            {/*        <>*/}
            {/*            {to ? (*/}
            {/*                <span*/}
            {/*                    className={`ant-tag date empty from-before ${to ? '' : 'hide'}`}*/}
            {/*                >*/}
            {/*    <span>Не вказано</span>*/}
            {/*  </span>*/}
            {/*            ) : null}*/}
            {/*        </>*/}
            {/*    )}*/}

            {/*    {to ? (*/}
            {/*        <Tag*/}
            {/*            closable*/}
            {/*            onClose={() => p.closeTag(to.name)}*/}
            {/*            key={to.name}*/}
            {/*            className="date tag_to"*/}
            {/*        >*/}
            {/*            <Tooltip*/}
            {/*                placement="top"*/}
            {/*                title={p.locale.date_to}*/}
            {/*            >*/}
            {/*                /!*{formatDate(Number(to.values))}*!/*/}
            {/*            </Tooltip>*/}
            {/*        </Tag>*/}
            {/*    ) : (*/}
            {/*        <>*/}
            {/*            {from ? (*/}
            {/*                <span*/}
            {/*                    className={`ant-tag date empty to-before ${from ? '' : 'hide'}`}*/}
            {/*                >*/}
            {/*    <span>Не вказано</span>*/}
            {/*  </span>*/}
            {/*            ) : null}*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</div>*/}

            {/*{module && (*/}
            {/*    <Tag closable onClose={() => p.closeTag(module.name)} key={module.name}>*/}
            {/*        <Tooltip*/}
            {/*            placement="top"*/}
            {/*            title={p.locale.module_name}*/}
            {/*            className="rec-filter__tooltip"*/}
            {/*        >*/}
            {/*            {module.values}*/}
            {/*        </Tooltip>*/}
            {/*    </Tag>*/}
            {/*)}*/}

        </div>
    );
}

export default SmallMode;