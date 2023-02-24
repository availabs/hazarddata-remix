import { falcor } from '~/utils/falcor.server'
import {pgEnv} from "~/modules/data-manager/attributes";
import get from "lodash.get";
import React from "react";

export const checkApiResponse = async(res) => {
    if (!res.ok) {
        let errMsg = res.statusText;
        try {
            const { message } = await res.json();
            errMsg = message;
        } catch (err) {
            console.error(err);
        }

        throw new Error(errMsg);
    }
}

export const formatDate = (dateString) => {
    const options = {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false};
    console.log('??', dateString, new Date(dateString).toLocaleDateString(undefined, options))

    return new Date(dateString).toLocaleDateString(undefined, options);
}


export const deleteView = async (rtPfx, viewId) => {
    const url = new URL(`${rtPfx}/deleteDamaView`);

    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({'view_id': viewId}),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await checkApiResponse(res);

    const viewMetaRes = await res.json();

    return viewMetaRes;
}

export const makeAuthoritative = async (rtPfx, viewId) => {
    const url = new URL(`${rtPfx}/makeAuthoritativeDamaView`);

    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({'view_id': viewId}),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await checkApiResponse(res);

    const viewMetaRes = await res.json();

    return viewMetaRes;
}

export const deleteSource = async (rtPfx, sourceId) => {
    const url = new URL(`${rtPfx}/deleteDamaSource`);

    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({'source_id': sourceId}),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await checkApiResponse(res);

    const sourceDelRes = await res.json();

    return sourceDelRes;
}

export const getSrcViews = async ({rtPfx, setVersions, type}) => {
    const url = new URL(
        `${rtPfx}/hazard_mitigation/versionSelectorUtils`
    );
    url.searchParams.append("type", type);

    const list = await fetch(url);

    await checkApiResponse(list);

    const {
        sources, views
    } = await list.json();
    setVersions({sources, views})

    return {sources, views}
}

export const RenderVersions = ({value, setValue, versions, type}) => {
    console.log('versions', versions)
    return (
        <div  className='flex justify-between group'>
            <div  className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 py-5">Select {type} version: </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className='pt-3 pr-8'>
                        <select
                            className='w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300'
                            value={value || ''}
                            onChange={e => {
                                setValue(e.target.value)
                            }}>
                            <option value="" disabled >Select your option</option>
                            {versions.views
                                .map(v =>
                                    <option
                                        key={v.view_id}
                                        value={v.view_id} className={`p-2 ${get(v, ['metadata', 'authoritative']) === 'true' ? `font-bold` : ``}`}>
                                        {get(versions.sources.find(s => s.source_id === v.source_id), 'name')}
                                        {` (${v.view_id} ${formatDate(v._modified_timestamp)})`}
                                    </option>)
                            }
                        </select>
                    </div>


                </dd>
            </div>
        </div>
    )
}