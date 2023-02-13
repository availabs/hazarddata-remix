import React, {useState} from 'react'
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv, hazardsMeta} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'
import {BarGraph, generateTestBarData} from "~/modules/avl-graph-modified/src/BarGraph";

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
    // fetch meta for each view, show which views it depends upon, provide links to those views.
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
        ['ncei_storm_events_enhanced', pgEnv, 'source', enhancedNCEIhlrSourceId, 'view', ltsEnhancedNCEIView, 'lossByYearByType'],
        ['dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', [ltsHlrView, ltsEnhancedNCEIView]]
    );

    const tmpSrcIds = [];

    Object.keys(get(sourceData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId'], {}))
        .forEach(viewId => {
            tmpSrcIds.push(
                ...get(sourceData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId, 'dependencies'], [])
                .map(d => d.source_id)
                .filter(d => d)
            );
        });
    const srcMeta = await falcor.get(['dama', pgEnv, 'sources', 'byId', tmpSrcIds, 'attributes', 'type']);

    return {
        dama: get(sourceData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId']),
        avail: get(sourceData, ['json', 'hlr', pgEnv, 'source', hlrSourceId, 'view', ltsHlrView, 'eal'], [])
            .filter(d => !['Heavy Rain', 'Freezing Fog'].includes(d.nri_category)),
        availLTSViewId: ltsHlrView,
        enhancedNCEILTSViewId: ltsEnhancedNCEIView,
        nri: get(sourceData, ['json', 'nri', 'totals', 'detailed', 'all', 0], []),
        enhancedNCEILoss: get(sourceData, ['json', 'ncei_storm_events_enhanced', pgEnv, 'source', enhancedNCEIhlrSourceId, 'view', ltsEnhancedNCEIView, 'lossByYearByType'], []),
        srcMeta: get(srcMeta, ['json', 'dama', pgEnv, 'sources', 'byId'])

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

    data
        .filter(d => d.year >= 1996)
        .forEach(row => {
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

const RenderViewDependencies = ({dama, srcMeta, viewId}) => (
    get(get(dama, [viewId, 'dependencies'], [])
        .find(d => d.view_id === viewId), ['view_dependencies'], [])
        .map(id => {
            const tmpSrcId = get(get(dama, [viewId, 'dependencies'], [])
                                .find(d => d.view_id === id), 'source_id')
            return <Link to={`/sources/${tmpSrcId}/views/${id}`} className={'p-2'}>{get(srcMeta, [tmpSrcId, 'attributes', 'type'], id)}</Link>
        })
)

const RenderRangeSlider = ({range, from, setFrom, to, setTo}) => {
    console.log('rangeSlider', from, to)
}

export default function SourceThumb({source}) {
    const {avail, nri, enhancedNCEILoss, dama, availLTSViewId, enhancedNCEILTSViewId, srcMeta} = useLoaderData();
    const reformattedNRI = reformatNRI(nri);
    const {formattedData: reformattedEnhancedNCEI, nri_categories} = reformatEnhancedNCEI(enhancedNCEILoss);
    const range = [...new Set(reformattedEnhancedNCEI.map(d => d.year))].sort((a, b) => a - b);
    const [from, setFrom] = React.useState(range[0]);
    const [to, setTo] = React.useState(range[range.length - 1]);
    const blockClasses = `w-full p-4 my-1 block border flex flex-col`
    // legend, colors

    return (
        <>
            <div className={'flex grid grid-cols-9 text-white'}>
                {
                    Object.keys(hazardsMeta)
                        .map(key => <div style={{height: '50px', width: '120px', backgroundColor: hazardsMeta[key].color, textAlign: 'center'}}>
                           <span className={'align-middle m-4'} >{key}</span>
                        </div>)
                }
            </div>
            <div className={blockClasses} style={{height: '500px'}}>
                <label className={'text-lg'}> NCEI Losses </label>
                <label className={'text-sm'}>using: <RenderViewDependencies dama={dama} srcMeta={srcMeta} viewId={enhancedNCEILTSViewId}/></label>
                <RenderRangeSlider range={range} from={from} to={to} setFrom={setFrom} setTo={setTo} />
                <BarGraph
                    data={reformattedEnhancedNCEI}
                    keys={nri_categories}
                    indexBy={'year'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex, gridLineOpacity: 1, gridLineColor: '#9d9c9c'}}
                    paddingInner={0.05}
                    colors={(value, ii, d, key) => hazardsMeta[key].color}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnumIndex,
                        keyFormat: d => hazardsMeta[d].name
                    }}
                />
            </div>
            <div className={blockClasses} style={{height: '500px'}}>
                <label className={'text-lg'}>EALs (AVAIL) </label>
                <label className={'text-sm'}>using: <RenderViewDependencies dama={dama} srcMeta={srcMeta} viewId={availLTSViewId}/></label>
                <BarGraph
                    data={avail}
                    keys={['swd_buildings', 'swd_crop', 'swd_population']}
                    indexBy={'nri_category'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex, gridLineOpacity: 1, gridLineColor: '#9d9c9c'}}
                    paddingInner={0.05}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnumIndex
                    }}
                />
            </div>
            <div className={blockClasses} style={{height: '500px'}}>
                <label className={'text-lg'}>EALs (NRI) </label>
                <BarGraph
                    data={reformattedNRI}
                    keys={['buildings', 'crop', 'population']}
                    indexBy={'nri_category'}
                    axisBottom={d => d}
                    axisLeft={{format: fnumIndex, gridLineOpacity: 1, gridLineColor: '#9d9c9c'}}
                    paddingInner={0.05}
                    hoverComp={{
                        HoverComp: HoverComp,
                        valueFormat: fnumIndex
                    }}
                />
            </div>
        </>
    )
}