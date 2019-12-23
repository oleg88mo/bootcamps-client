import React from "react";
import {Tag, Tooltip} from "antd";

export default function FromTo(p) {
    const {from, to, localeFrom, localeTo, closeTag} = p;

    return (
        <>
            {from ? (
                <Tag
                    closable
                    onClose={() => closeTag(from.name)}
                    key={from.name}
                    className="__filter tag__from"
                >
                    <Tooltip placement="top" title={localeFrom}>{from.values}</Tooltip>
                </Tag>
            ) : (
                <>
                    {to ? (<span className="ant-tag empty"><Tooltip placement="top" title={localeFrom}><span>Не вказано</span></Tooltip></span>) : null}
                </>
            )}

            {to ? (
                <Tag
                    closable
                    onClose={() => closeTag(to.name)}
                    key={to.name}
                    className="__filter tag_to"
                >
                    <Tooltip placement="top" title={localeTo}>{to.values}</Tooltip>
                </Tag>
            ) : (
                <>
                    {from ? (<span className="ant-tag empty"><Tooltip placement="top" title={localeTo}><span>Не вказано</span></Tooltip></span>) : null}
                </>
            )}
        </>
    )
}
