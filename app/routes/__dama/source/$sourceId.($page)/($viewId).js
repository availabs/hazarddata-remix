import React, {useState, useMemo} from 'react'
import {falcor} from '~/utils/falcor.server'
import {TopNav} from '~/modules/avl-components/src'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {Pages, DataTypes} from '~/modules/data-manager/data-types'
import {useLoaderData, Link, useParams, useOutletContext} from "@remix-run/react";

import get from 'lodash.get'

export async function loader({params, request}) {
    const {viewId} = params;

    const depData = await falcor.get(['dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId]);

    // collect all dependency sources, fetch meta for them.
    const tmpSrcIds = [];
    const tmpViewIds = [];
    Object.keys(get(depData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId'], {}))
        .forEach(viewId => {
            tmpSrcIds.push(
                ...get(depData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId, 'dependencies'], [])
                    .map(d => d.source_id)
                    .filter(d => d)
            );
            tmpViewIds.push(
                ...get(depData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId, 'dependencies'], [])
                    .map(d => d.view_id)
                    .filter(d => d)
            );
        });

    await falcor.get(['dama', pgEnv, 'sources', 'byId', tmpSrcIds, 'attributes', ['type', 'name']]);

    await falcor.get(['dama', pgEnv, 'views', 'byId', tmpViewIds, 'attributes', ['version', '_modified_timestamp', 'last_updated']]);

    // fin
    const falcorCache = falcor.getCache();

    return {
        dependencies: get(falcorCache, ['dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId, 'value'], {}),
        srcMeta: get(falcorCache, ['dama', pgEnv, 'sources', 'byId']),
        viewMeta: get(falcorCache, ['dama', pgEnv, 'views', 'byId']),
    }
}

// authoritative routes(copies) for viewIds on home page
// changelog.md for changes, and versionId goes in meta. start with ncei enhanced. nri cat mapping. coastal maps to hurricanes too.
// make authoritative button

// authoritative version auto selected in version dropdown.
// authoritative version always bold? or has an identifier.

// create EAL source
// create a page that pulls from a falcor route that takes in EAL viewId, and pulls all the dependencies, and rns a complex sql using them.
// make EALs come close to old data; compare ncei raw with mars raw.


const RenderDeps = ({dependencies, viewId, srcMeta, viewMeta}) => {
    const depViews = dependencies.dependencies.find(d => d.view_id.toString() === viewId.toString()).view_dependencies || [];

    return (
        <div className='w-full p-4 bg-white shadow mb-4'>
            <label className={'text-lg'}>Dependencies</label>
            <div className="py-4 sm:py-2 mt-2 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6 border-b-2">
                {
                    ['Source Name', 'Type', 'Version', 'Last Updated']
                        .map(key => (
                            <dt key={key} className="text-sm font-medium text-gray-600">
                                {key}
                            </dt>
                        ))
                }
            </div>
            <dl className="sm:divide-y sm:divide-gray-200">
                {
                    dependencies.dependencies
                        .filter(d => depViews.includes(d.view_id))
                        .map((d, i) => (
                                <div key={`${i}_0`} className="py-4 sm:py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                    <dd key={`${i}_1`} className="mt-1 text-sm text-gray-900 sm:mt-0 align-middle">
                                        <Link to={`/source/${d.source_id}/overview`}>
                                            {get(srcMeta, [d.source_id, 'attributes', 'name'])}
                                        </Link>
                                    </dd>

                                    <dd key={`${i}_2`} className="mt-1 text-sm text-gray-900 sm:mt-0 align-middle">
                                        <Link to={`/source/${d.source_id}/overview`}>
                                            {get(srcMeta, [d.source_id, 'attributes', 'type'])}
                                        </Link>
                                    </dd>

                                    <dd key={`${i}_3`} className="mt-1 text-sm text-gray-900 sm:mt-0 align-middle">
                                        <Link to={`/source/${d.source_id}/views/${d.view_id}`}>
                                            {get(viewMeta, [d.view_id, 'attributes', 'version'])}
                                        </Link>
                                    </dd>

                                    <dd key={`${i}_4`} className="mt-1 text-sm text-gray-900 sm:mt-0 align-middle">
                                        <Link to={`/source/${d.source_id}/views/${d.view_id}`}>
                                            {typeof get(viewMeta, [d.view_id, 'attributes', '_modified_timestamp', 'value']) === 'object' ? '' :
                                                get(viewMeta, [d.view_id, 'attributes', '_modified_timestamp', 'value'])
                                            }
                                        </Link>
                                    </dd>

                                    <dd key={`${i}_5`} className="mt-1 text-sm text-red-400 sm:mt-0">
                                        <sspan className={'float-right italic'}> outdated</sspan>
                                    </dd>
                                </div>

                            )
                        )
                }
            </dl>

        </div>
    )
}

export default function Dama() {
    const {dependencies, srcMeta, viewMeta} = useLoaderData();
    const {sourceId, page, viewId} = useParams();

    return (
        <div>
            <div className='text-xl font-medium overflow-hidden p-2 border-b '>
                {viewId}
            </div>

            <TopNav
                menuItems={
                    [{
                        name: 'Source',
                        path: `/source/${sourceId}`
                    },
                        {
                            name: 'View',
                            path: `/source/${sourceId}/views/${viewId}`
                        }]
                }
                themeOptions={{size: 'inline'}}
            />

            <RenderDeps viewId={viewId} dependencies={dependencies} srcMeta={srcMeta} viewMeta={viewMeta}/>
        </div>
    )
}
