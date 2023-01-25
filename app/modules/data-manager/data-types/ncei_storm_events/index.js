import React, {useEffect, useState} from 'react';

import Create from './create'
import {useFalcor} from "~/modules/avl-falcor";
// import {BarGraph} from "../../../../modules/avl-graph/src/index";
import {pgEnv} from "~/modules/data-manager/attributes";
import get from "lodash.get";
import {DataTypes} from "~/modules/data-manager/data-types";


const Table = ({source}) => {
    return <div> Table View </div>
}

const AddView = ({source, views, user}) => {
    console.log(source);
    const CreateComp = React.useMemo(() =>
            get(DataTypes, `[${source.type}].sourceCreate.component`, () => <div/>)
        , [DataTypes, source.type]);

    return <CreateComp source={source} existingSource={source} user={user}/>
}

const RenderVersions = (domain, value, onchange) => (
    <select
        className={`w-1/2 pl-3 pr-4 py-3 bg-white mr-2 flex items-center text-sm`}
        value={value}
        onChange={(e) => onchange(e.target.value)
        }
    >
        {domain.map((v, i) => (
            <option key={i} value={v.view_id} className="ml-2  truncate">{v.version}</option>
        ))}
    </select>
)
const Metadata = ({source, views}) => {
    const {falcor, falcorCache} = useFalcor();
    const [activeView, setActiveView] = useState(views[0].view_id);
    const [compareView, setCompareView] = useState(views[0].view_id);
    const [compareMode, setCompareMode] = useState(undefined);

    useEffect(() => {
        falcor.get(['ncei_storm_events', pgEnv, 'source', source.source_id, 'view', [activeView, compareView], ['numRows', 'eventsByYear', 'eventsByType']])
    }, [activeView, compareView])

    const metadataActiveView = get(falcorCache, ['ncei_storm_events', pgEnv, 'source', source.source_id, 'view', activeView]);
    const metadataCompareView = get(falcorCache, ['ncei_storm_events', pgEnv, 'source', source.source_id, 'view', compareView]);
    if (!metadataActiveView || metadataActiveView.length === 0) return <div> Metadata Not Available </div>

    // const eventsByYear = get(metadataActiveView, ['eventsByYear', 'value'], [])

    return (
        <>
            <div key={'versionSelector'} className={'flex flex-row items-center'}>
                <label>Version</label>
                { RenderVersions(views, activeView, setActiveView) }
                { compareMode ? RenderVersions(views, compareView, setCompareView) : null }
                <button
                    className={'align-right border-2 border-gray-100 p-2 hover:bg-gray-100'}
                    disabled={views.length === 1}
                    onClick={() => setCompareMode(!compareMode)}
                >
                    {compareMode ? `Discard` : `Compare`}
                </button>
            </div>
            <div className="overflow-hidden">
                <div className="py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-600">
                        Total Number of Rows
                    </dt>
                    <dt className="text-sm text-gray-900">
                        {get(metadataActiveView, ['numRows', 'value'])}
                    </dt>

                    {
                        compareMode ? (
                            <dt className="text-sm text-gray-900">
                                {get(metadataCompareView, ['numRows', 'value'])}
                            </dt>
                        ) : null
                    }
                </div>
            </div>

            <div className="text-medium font-large text-gray-600 mt-5">
                Number of Rows/Events by Year
            </div>

            <div>
                <div>
                    <div className="py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2">
                        <dt className="text-sm font-medium text-gray-600">
                            Year
                        </dt>
                        <dd className="text-sm font-medium text-gray-600 ">
                            Count {compareMode ? `(${views.find(v => v.view_id.toString() === activeView.toString()).version})` : null}
                        </dd>

                        {
                            compareMode ? (
                                <dd className="text-sm font-medium text-gray-600 ">
                                    Count {`(${views.find(v => v.view_id.toString() === compareView.toString()).version})`}
                                </dd>
                            ) : null
                        }
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]">
                        <dl className="sm:divide-y sm:divide-gray-200">

                            {
                                get(metadataActiveView, ['eventsByYear', 'value'], [])
                                    .map((col, i) => (
                                        <div key={i} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm text-gray-900">
                                                {col.year}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 ">
                                                {col.num_events}
                                            </dd>

                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 ">
                                                {
                                                    compareMode ?
                                                        get(get(metadataCompareView, ['eventsByYear', 'value'], [])
                                                            .find(row => row.year === col.year), 'num_events') : null
                                                }
                                            </dd>
                                        </div>
                                    ))}

                        </dl>
                    </div>
                </div>
                {/*<BarGraph
              data={eventsByYear}
              keys={['num_events']}
              indexBy={'year'}
              axisBottom={d => d}
              // axisLeft={{format: fnum}}
              // indexFormat={fnum}
              // valueFormat={fnum}
              // hoverComp={{
              //   // HoverComp: HoverComp,
              //   // valueFormat: fnum
              // }}
              groupMode={'grouped'}
              // colors={colors}
          />*/}
            </div>
            <div className="text-medium font-large text-gray-600 mt-5">
                Number of Rows/Events by Type
            </div>
            <div>
                <div className="py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2">
                    <dt className="text-sm font-medium text-gray-600">
                        Event Type
                    </dt>
                    <dd className="text-sm font-medium text-gray-600 ">
                        Count {compareMode ? `(${views.find(v => v.view_id.toString() === activeView.toString()).version})` : null}
                    </dd>

                    {
                        compareMode ? (
                            <dd className="text-sm font-medium text-gray-600 ">
                                Count {`(${views.find(v => v.view_id.toString() === compareView.toString()).version})`}
                            </dd>
                        ) : null
                    }
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]">
                    <dl className="sm:divide-y sm:divide-gray-200">

                        {
                            get(metadataActiveView, ['eventsByType', 'value'], [])
                                .map((col, i) => (
                                    <div key={i} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm text-gray-900">
                                            {col.event_type}
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 ">
                                            {col.num_events}
                                        </dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 ">
                                            {
                                                compareMode ?
                                                    get(get(metadataCompareView, ['eventsByType', 'value'], [])
                                                        .find(row => row.event_type === col.event_type), 'num_events') : null
                                            }
                                        </dd>
                                    </div>
                                ))}

                    </dl>
                </div>
            </div>
        </>
    )
}

const NceiStormEventsConfig = {
    meta: {
        name: "Metadata",
        path: "/meta",
        component: Metadata,
    },
    table: {
        name: 'Table',
        path: '/table',
        component: Table
    },
    // add_view: {
    //   name: 'Add View',
    //   path: '/add_view',
    //   component: AddView
    // },
    sourceCreate: {
        name: 'Create',
        component: Create
    }

}

export default NceiStormEventsConfig
