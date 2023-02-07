import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import {falcor} from '~/utils/falcor.server'
import {SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import {useLoaderData, Link} from "@remix-run/react";
import get from 'lodash.get'
import {deleteView} from "~/modules/data-manager/data-types/utils/utils";
import {DAMA_HOST} from "~/config";

export async function loader({params, request}) {
    // console.log('req', params)
    const {viewId} = params;
    const data = await falcor.get(
        ['dama', pgEnv, 'views', "byId", viewId, 'dependents']
    );
    return {
        viewId: viewId,
        dependents: get(data, ['json', 'dama', pgEnv, 'views', "byId", viewId, 'dependents'], [])
    };
}

const DeleteButton = ({text, viewId}) => {
    const navigate = useNavigate();
    return (
        <button
            className={'bg-red-50 hover:bg-red-400 hover:text-white p-2'}
            onClick={() => deleteView(`${DAMA_HOST}/dama-admin/${pgEnv}`, viewId) && navigate(-1)} >

            {text}
        </button>
    )
}
const LoadDependentViews = (data, viewId) => (
    <>
        <div className={'pb-4 flex justify-between'}>
            <label>The View has following dependents:</label>

            <DeleteButton text={'Delete anyway'} viewId={viewId}/>
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

const LoadConfirmDelete = (viewId) => (
        <div className={'pb-4 flex justify-between'}>
            <label>No dependents found.</label>

            <DeleteButton text={'Confirm Delete'} viewId={viewId}/>
        </div>
    )

export default function Popup() {
    const {viewId, dependents} = useLoaderData();
    return (
        <div className='w-full p-4 bg-white my-1 block border shadow'>
            <div className={'pb-4 font-bold'}>Delete <i>{viewId}</i></div>
            {dependents.length ? LoadDependentViews(dependents, viewId) : LoadConfirmDelete(viewId)}
        </div>
    )
}