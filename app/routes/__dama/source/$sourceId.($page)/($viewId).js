import React, {useState, useMemo} from 'react'
import {falcor} from '~/utils/falcor.server'
import {TopNav} from '~/modules/avl-components/src'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {Pages, DataTypes} from '~/modules/data-manager/data-types'
import {useLoaderData, Link, useParams, useOutletContext} from "@remix-run/react";

import get from 'lodash.get'

export async function loader({params, request}) {
    const {viewId} = params;

    const dependenciesData = await falcor.get(['dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId]);
    const dependentsData = await falcor.get(['dama', pgEnv, 'views', "byId", viewId, 'dependents']);


    // collect all dependency sources, fetch meta for them.
    const tmpSrcIds = [];
    const tmpViewIds = [];
    get(dependenciesData, ['json', 'dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId, 'dependencies'])
        .forEach(d => {
            tmpSrcIds.push(
                d.source_id
            );
            tmpViewIds.push(
                d.view_id
            );
        });

    get(dependentsData, ['json', 'dama', pgEnv, 'views', "byId", viewId, 'dependents'])
        .forEach(d => {
            tmpSrcIds.push(
                d.source_id
            );
            tmpViewIds.push(
                d.view_id
            );
        });

    await falcor.get(['dama', pgEnv, 'sources', 'byId', tmpSrcIds, 'attributes', ['type', 'name']]);

    await falcor.get(['dama', pgEnv, 'views', 'byId', tmpViewIds, 'attributes', ['version', 'metadata', '_modified_timestamp', 'last_updated']]);

    // fin
    const falcorCache = falcor.getCache();

    return {
        dependencies: get(falcorCache, ['dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', viewId, 'value'], {}),
        dependents: get(falcorCache, ['dama', pgEnv, 'views', "byId", viewId, 'dependents', 'value'], []),
        srcMeta: get(falcorCache, ['dama', pgEnv, 'sources', 'byId'], {}),
        viewMeta: get(falcorCache, ['dama', pgEnv, 'views', 'byId'], {}),
    }
}

const RenderDeps = ({dependencies = {}, viewId, srcMeta, viewMeta}) => {
    const depViews = get(dependencies.dependencies.find(d => d.view_id.toString() === viewId.toString()), 'view_dependencies') || [];

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
                                        <span className={'float-right italic'}> {
                                            get(viewMeta, [d.view_id, 'attributes', 'metadata', 'value', 'authoritative']) === 'true' ? ''
                                                : 'outdated'
                                        }</span>
                                    </dd>
                                </div>

                            )
                        )
                }
            </dl>

        </div>
    )
}

const RenderDependents = ({dependents = [], viewId, srcMeta, viewMeta}) => {
    return (
        <div className='w-full p-4 bg-white shadow mb-4'>
            <label className={'text-lg'}>Dependents</label>
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
                    dependents
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
                                        <span className={'float-right italic'}> {
                                            get(viewMeta, [d.view_id, 'attributes', 'metadata', 'value', 'authoritative']) === 'true' ? ''
                                                : 'outdated'
                                        }</span>
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
    const {dependencies, dependents, srcMeta, viewMeta} = useLoaderData();
    const {sourceId, page, viewId} = useParams();
    // render dependents as well.
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
            <RenderDependents viewId={viewId} dependents={dependents} srcMeta={srcMeta} viewMeta={viewMeta}/>
        </div>
    )
}
