import React, {useState} from 'react'
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'
import {BarGraph, generateTestBarData} from "~/modules/avl-graph/src/BarGraph";

const getViews = (sourceId, falcorCache) => Object.values(
    get(
        falcorCache,
        ["dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex",],
        {}
    )
)
    .map(v => getAttributes(
            get(
                falcorCache,
                v.value,
                {'attributes': {}}
            )['attributes']
        )
    );

export async function loader({request}) {

    // get latest view of hlr, nri, and enhanced_ncei
    // chart 1: enhanced ncei: $loss X year; stacked by nri_type
    // chart 2: EAL hlr
    // chart 3: EAL nri
    const hlrSourceId = 218,
        enhancedNCEIhlrSourceId = 198;
    const lengthPath = ["dama", pgEnv, "sources", "byId", [hlrSourceId, enhancedNCEIhlrSourceId], "views", "length"];

    const resp = await falcor.get(lengthPath);

    await falcor.get(
        [
            "dama", pgEnv, "sources", "byId", hlrSourceId, "views", "byIndex",
            {from: 0, to: get(resp.json, ["dama", pgEnv, "sources", "byId", hlrSourceId, "views", "length"], 0) - 1},
            "attributes", Object.values(ViewAttributes)
        ],
        [
            "dama", pgEnv, "sources", "byId", enhancedNCEIhlrSourceId, "views", "byIndex",
            {from: 0, to: get(resp.json, ["dama", pgEnv, "sources", "byId", enhancedNCEIhlrSourceId, "views", "length"], 0) - 1},
            "attributes", Object.values(ViewAttributes)
        ]
    );

    const falcorCache = falcor.getCache();

    const hlrViews = getViews(hlrSourceId, falcorCache);
    const enhancedNCEIViews = getViews(enhancedNCEIhlrSourceId, falcorCache);

    const ltsHlrView = hlrViews[0].view_id;
    const ltsEnhancedNCEIView = enhancedNCEIViews[0].view_id;
    const sourceData = await falcor.get(
        ['hlr', pgEnv, 'source', hlrSourceId, 'view', ltsHlrView, 'eal'],
        ['nri', 'totals', 'detailed', 'all'],
        ['ncei_storm_events_enhanced', pgEnv, 'source', enhancedNCEIhlrSourceId, 'view', ltsEnhancedNCEIView, 'lossByYearByType']
    );
    console.log(['ncei_storm_events_enhanced', pgEnv, 'source', enhancedNCEIhlrSourceId, 'view', ltsEnhancedNCEIView, 'lossByYearByType'])
    return {
        avail: get(sourceData, ['json', 'hlr', pgEnv, 'source', hlrSourceId, 'view', ltsHlrView, 'eal'], [])
            .filter(d => !['Heavy Rain', 'Freezing Fog'].includes(d.nri_category)),
        nri: get(sourceData, ['json', 'nri', 'totals', 'detailed', 'all', 0], []),
        enhancedNCEILoss: get(sourceData, ['json', 'ncei_storm_events_enhanced', pgEnv, 'source', enhancedNCEIhlrSourceId, 'view', ltsEnhancedNCEIView, 'lossByYearByType'], [])
    };

}

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

const fnum = d => parseInt(d).toLocaleString();

const fnumIndex = (d) => {
    if (d >= 1000000000) {
        return `${d / 1000000000} B`
    } else if (d >= 1000000) {
        return `${d / 1000000} M`
    } else if (d >= 1000) {
        return `${d / 1000} K`
    } else {
        return `${d}`
    }
}

const reformatNRI = (data = {}) => React.useMemo(() => {
    const formattedData = []
    Object.keys(data)
        .filter(key => key !== 'group_by' && key.includes('_'))
        .forEach(key => {
            const [nri_category, ctype] = key.split('_');
            const tmpExisting = formattedData.find(f => f.nri_category === nri_category);
            if (tmpExisting){
                tmpExisting[ctype] = data[nri_category]
            }else{
                formattedData.push({nri_category, [ctype]: data[nri_category]})
            }
        });

    return formattedData;
}, [data])

const reformatEnhancedNCEI = (data = {}) => React.useMemo(() => {
    const formattedData = [];
    const nri_categories = new Set();
    console.log('data', data)
    data.forEach(row => {
        nri_categories.add(row.event_type_formatted)
        const tmpExisting = formattedData.find(f => f.year === row.year);
        if(tmpExisting){
            tmpExisting[row.event_type_formatted] = parseInt(row.total_damage);
        }else{
            formattedData.push({year: row.year, [row.event_type_formatted]: parseInt(row.total_damage)})
        }
    })
    return {formattedData, nri_categories: [...nri_categories]};
}, [data])

export default function SourceThumb({source}) {
    const {avail, nri, enhancedNCEILoss} = useLoaderData();
    const reformattedNRI = reformatNRI(nri);
    const {formattedData: reformattedEnhancedNCEI, nri_categories} = reformatEnhancedNCEI(enhancedNCEILoss);
    console.log('ncei', reformattedEnhancedNCEI, avail);
    return (
        <>
            <div className='w-full p-4 bg-white my-1 block border shadow flex flex-col' style={{height: '500px'}}>
                <label className={'text-lg'}>EALs (AVAIL) </label>
                <label className={'text-sm'}>using: </label>
                <BarGraph
                    data={avail}
                    keys={['swd_buildings', 'swd_crop', 'swd_population']}
                    indexBy={'nri_category'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex}}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnum
                    }}
                />
            </div>
            <div className='w-full p-4 bg-white my-1 block border shadow flex flex-col' style={{height: '500px'}}>
                <label className={'text-lg'}>EALs (NRI) </label>
                <label className={'text-sm'}>using: </label>
                <BarGraph
                    data={reformattedNRI}
                    keys={['buildings', 'crop', 'population']}
                    indexBy={'nri_category'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex}}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnum
                    }}
                />
            </div>
            <div className='w-full p-4 bg-white my-1 block border shadow flex flex-col' style={{height: '500px'}}>
                <label className={'text-lg'}>EALs (NRI) </label>
                <label className={'text-sm'}>using: </label>
                <BarGraph
                    data={reformattedEnhancedNCEI}
                    keys={nri_categories}
                    indexBy={'year'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex}}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnum
                    }}
                />
            </div>
        </>
    )
}