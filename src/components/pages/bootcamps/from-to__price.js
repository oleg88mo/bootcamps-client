import React from "react";
import {Tag, Tooltip} from "antd";

export default function PriceComponent(p) {
    const {from, to, locale} = p;

    return (
        <>
            {from ? (
                <Tag
                    closable
                    onClose={() => p.closeTag(from.name)}
                    key={from.name}
                    className="__filter tag__from"
                >
                    <Tooltip placement="top" title={locale.price_from}>{from.values}</Tooltip>
                </Tag>
            ) : (
                <>
                    {to ? (<span className="ant-tag empty">
                        <Tooltip placement="top" title={locale.price_from}><span>Не вказано</span></Tooltip>
                    </span>) : null}
                </>
            )}

            {to ? (
                <Tag
                    closable
                    onClose={() => p.closeTag(to.name)}
                    key={to.name}
                    className="__filter tag_to"
                >
                    <Tooltip placement="top" title={locale.price_to}>{to.values}</Tooltip>
                </Tag>
            ) : (
                <>
                    {from ? (<span className="ant-tag empty">
                        <Tooltip placement="top" title={locale.price_to}><span>Не вказано</span></Tooltip>
                    </span>) : null}
                </>
            )}
        </>
    )
}
