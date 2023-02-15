import React, {useState} from 'react'
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'

export async function loader({request}) {

    const lengthPath = ["dama", pgEnv, "sources", "length"];
    const resp = await falcor.get(lengthPath);
    const sourceData = await falcor.get([
        "dama", pgEnv, "sources", "byIndex",
        {from: 0, to: get(resp.json, lengthPath, 0) - 1},
        "attributes", Object.values(SourceAttributes),
    ]);

    const falcorCache = falcor.getCache()

    return Object.values(get(falcorCache, ["dama", pgEnv, 'sources', 'byIndex'], {}))
        .map(v => getAttributes(get(falcorCache, v.value, {'attributes': {}})['attributes']))


}

export default function Dama() {
    const data = useLoaderData();
    return (
        <div>
            {
                JSON.stringify(data)
            }
        </div>
    )
}
