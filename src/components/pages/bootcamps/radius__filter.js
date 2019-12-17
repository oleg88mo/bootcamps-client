import React from "react";
import {Tag, Tooltip} from "antd";

export default function RadiusComponent(p) {
    const {locale, zipCode, distance} = p;
    const closeTagRadius = () => {
        p.closeTag(zipCode.name)
        p.closeTag(distance.name)
    };

    return (
        <>
            <Tag
                closable
                onClose={() => closeTagRadius()}
                key={zipCode.name}
                className="__filter"
            >
                <Tooltip placement="top" title={locale.search_by_radius}>{zipCode.values} - {distance.values}</Tooltip>
            </Tag>
        </>
    )
}
