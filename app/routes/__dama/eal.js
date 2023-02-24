import React, {useState} from 'react'
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'

export async function loader({request}) {

    const ealSourceId = 229;

    const ltsViews = ["dama", pgEnv, "sources", "byId", ealSourceId, "views", "lts"];

    const ltsViewData = await falcor.get(ltsViews);

    const ltsEalView = get(ltsViewData, ['json', 'dama', pgEnv, 'sources', 'byId', ealSourceId, 'views', 'lts']);

    await falcor.get(['comparative_stats', pgEnv, 'byEalIds', 'source', ealSourceId, 'view', ltsEalView]);

    const falcorCache = falcor.getCache();

    return {
        data: get(falcorCache, ['comparative_stats', pgEnv, 'byEalIds', 'source', ealSourceId, 'view', ltsEalView, 'value'], [])
    }

}

export default function Dama() {
    const {data} = useLoaderData();
    console.log('data', JSON.stringify(data, null, 5));
    return (
        <div>
            {
                JSON.stringify(data)
            }
        </div>
    )
}
