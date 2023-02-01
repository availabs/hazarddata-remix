import React, {useState} from 'react'
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'
import {deleteSource} from "~/modules/data-manager/data-types/utils/utils";
import {DAMA_HOST} from "~/config";

export async function loader({params, request}) {
    // console.log('req', params)
    const {sourceId} = params;
    const data = await falcor.get(
        ['dama', pgEnv, 'sources', "byId", sourceId, 'dependents'],
        ['dama', pgEnv, 'sources', 'byId', sourceId, 'attributes', ['display_name']]
    );
    return {
        sourceId: sourceId,
        dependents: get(data, ['json', 'dama', pgEnv, 'sources', "byId", sourceId, 'dependents'], []),
        display_name: get(data, ['json', 'dama', pgEnv, 'sources', 'byId', sourceId, 'attributes', 'display_name'], '')
    };
}

const DeleteButton = ({text, sourceId}) => (
    <button
        className={'bg-red-50 hover:bg-red-400 hover:text-white p-2'}
        onClick={() => deleteSource(`${DAMA_HOST}/dama-admin/${pgEnv}`, sourceId)}
    >
        {text}
    </button>
)
const LoadDependentViews = (data, sourceId) => (
    <>
        <div className={'pb-4 flex justify-between'}>
            <label>The Source has following dependents:</label>

            <DeleteButton text={'Delete anyway'} sourceId={sourceId}/>
        </div>

        <div className={'p-4 bg-red-50'}>
            <div className="p-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2">
                {
                    ['view_id', 'created', 'updated']
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
                            .map((view, i) => (

                                    <div key={i} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        {
                                            ['view_id', '_created_timestamp', '_modified_timestamp']
                                                .map(key => (
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 ">
                                                        {view[key]}
                                                    </dd>
                                                ))
                                        }
                                    </div>

                                )
                            )}

                </dl>
            </div>
        </div>
    </>)

const LoadConfirmDelete = (sourceId) => (
        <div className={'pb-4 flex justify-between'}>
            <label>No dependents found.</label>

            <DeleteButton text={'Confirm Delete'} sourceId={sourceId}/>
        </div>
    )

export default function Popup() {
    const {sourceId, dependents, display_name} = useLoaderData();
    return (
        <div className='w-full p-4 bg-white my-1 block border shadow'>
            <div className={'pb-4 font-bold'}>Delete <i>{display_name}</i></div>
            {dependents.length ? LoadDependentViews(dependents, sourceId) : LoadConfirmDelete(sourceId)}
        </div>
    )
}