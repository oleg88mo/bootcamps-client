import React from "react";
import {Tag, Tooltip} from "antd";

export default function NamePhoneComponent(p) {
    const {locale, el} = p;

    return(
        <>
            <Tag
                closable
                onClose={() => p.closeTag(el.name)}
                key={el.name}
                className="__filter"
            >
                <Tooltip placement="top" title={el.name === 'phone' ? locale.phone : locale.name}>{el.values}</Tooltip>
            </Tag>
        </>
    )
}
