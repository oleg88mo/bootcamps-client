import React from "react";
import {Tag, Tooltip} from "antd";

export default function AdditionalComponent(p) {
    const {locale, el} = p;

    return (
        <>
            <Tag
                closable
                onClose={() => p.closeTag(el.name)}
                key={el.name}
                className="__filter"
            >
                <Tooltip placement="top" title={locale}>{el.name}</Tooltip>
            </Tag>
        </>
    )
}
