import React, {useState} from 'react'
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv, ctypeColors} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'
import {formatDate} from "~/modules/data-manager/data-types/utils/utils";
import {BarGraph} from "~/modules/avl-graph-modified/src";

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

const RenderValue = ({value, isLink, isTimeStamp, source_id}) => {
    const processedValue =
        typeof value === 'object' ? '' :
            isTimeStamp ? formatDate(value) :
                value;

    return isLink ? <Link to={`/source/${source_id}/views/${value}`}> {processedValue} </Link> : processedValue;
}

const RenderTable = ({data, keys = []}) => (
    <div>
        <div className={`py-4 sm:py-2 sm:grid sm:grid-cols-${keys.length} sm:gap-4 sm:px-6 border-b-2`}>
            {
                keys
                    .map(key => (
                        <dt key={key} className="text-sm font-medium text-gray-600">
                            {key}
                        </dt>
                    ))
            }
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]">
            <dl className="sm:divide-y sm:divide-gray-200">
                {
                    data
                        .map((row, i) => (
                                <div key={i} className={`py-4 sm:py-5 sm:grid sm:grid-cols-${keys.length} sm:gap-4 sm:px-6`}>
                                    {
                                        Object.keys(row)
                                            .filter(key => keys.includes(key))
                                            .map(key => (
                                                <dd key={key}
                                                    className="mt-1 text-sm text-gray-900 sm:mt-0 align-middle">
                                                    <RenderValue value={row[key]}/>
                                                </dd>
                                            ))
                                    }
                                </div>

                            )
                        )}

            </dl>
        </div>
    </div>
)

const HoverComp = ({data, keys, indexFormat, keyFormat, valueFormat}) => {
    return (
        <div className={`
      flex flex-col px-2 pt-1 rounded bg-white
      ${keys.length <= 1 ? "pb-2" : "pb-1"}`}>
            <div className="font-bold text-lg leading-6 border-b-2 mb-1 pl-2">
                {indexFormat(get(data, "index", null))}
            </div>
            {keys.slice()
                // .filter(k => get(data, ["data", k], 0) > 0)
                .filter(key => data.key === key)
                .reverse().map(key => (
                    <div key={key} className={`
            flex items-center px-2 border-2 rounded transition
            ${data.key === key ? "border-current" : "border-transparent"}
          `}>
                        <div className="mr-2 rounded-sm color-square w-5 h-5"
                             style={{
                                 backgroundColor: get(data, ["barValues", key, "color"], null),
                                 opacity: data.key === key ? 1 : 0.2
                             }}/>
                        <div className="mr-4">
                            {keyFormat(key)}:
                        </div>
                        <div className="text-right flex-1">
                            {valueFormat(get(data, ["data", key], 0))}
                        </div>
                    </div>
                ))
            }
            {keys.length <= 1 ? null :
                <div className="flex pr-2">
                    <div className="w-5 mr-2"/>
                    <div className="mr-4 pl-2">
                        Total:
                    </div>
                    <div className="flex-1 text-right">
                        {valueFormat(keys.reduce((a, c) => a + get(data, ["data", c], 0), 0))}
                    </div>
                </div>
            }
        </div>
    )
}

const fnumIndex = (d) => {
    if (d >= 1000000000) {
        return `${parseInt(d / 1000000000)} B`
    } else if (d >= 1000000) {
        return `${parseInt(d / 1000000)} M`
    } else if (d >= 1000) {
        return `${parseInt(d / 1000)} K`
    } else {
        return `${d}`
    }
}

export default function Dama() {
    const {data} = useLoaderData();
    const blockClasses = `w-full my-2 block flex flex-col`
    console.log(data)
    return (
        <>
            <div className={blockClasses + ` mt-5`} style={{height: '500px'}}>
                <label key={'nceiLossesTitle'} className={'text-lg'}> EAL (SWD, NRI and AVAIL) </label>
                <BarGraph
                    key={'numEvents'}
                    data={data}
                    keys={Object.keys(data[0]).filter(key => key.includes('eal') || key.includes('annualized'))}
                    indexBy={'nri_category'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex, gridLineOpacity: 1, gridLineColor: '#9d9c9c'}}
                    paddingInner={0.1}
                    // colors={(value, ii, d, key) => ctypeColors[key]}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnumIndex
                    }}
                    groupMode={'grouped'}
                />
            </div>

            <div>
                <label key={'nceiLossesTitle'} className={'text-lg'}> Num events (SWD and Per Basis) </label>
                <RenderTable
                    key={'numEvents'}
                    data={data}
                    keys={Object.keys(data[0]).filter(key => (key.includes('num') && !key.includes('total')) || key.includes('nri_category'))}
                />
            </div>
        </>
    )
}
