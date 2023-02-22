import React from 'react'
import { useNavigate } from "react-router-dom";
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'
import get from "lodash.get";
import {checkApiResponse, formatDate, getSrcViews} from "../utils/utils";

const CallServer = async ({rtPfx, source, newVersion, navigate, viewHlr={}, viewNRI={}}) => {
    const viewMetadata = [viewHlr.view_id, viewNRI.view_id];

    const url = new URL(
        `${rtPfx}/hazard_mitigation/ealLoader`
    );

    url.searchParams.append("table_name", 'eal');
    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.id);
    url.searchParams.append("view_dependencies", JSON.stringify(viewMetadata));
    url.searchParams.append("version", newVersion);

    url.searchParams.append("hlr_schema", viewHlr.table_schema);
    url.searchParams.append("hlr_table", viewHlr.table_name);
    url.searchParams.append("nri_schema", viewNRI.table_schema);
    url.searchParams.append("nri_table", viewNRI.table_name);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    const resJson = await stgLyrDataRes.json();

    console.log('res', resJson);

    navigate(`/source/${resJson.payload.source_id}/views`);
}

const RenderVersions = ({value, setValue, versions, type}) => {
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
                                        value={v.view_id} className='p-2'>
                                        {get(versions.sources.find(s => s.source_id === v.source_id), 'display_name')}
                                        {` (${v.view_id} ${formatDate(v.last_updated)})`}
                                    </option>)
                            }
                        </select>
                    </div>


                </dd>
            </div>
        </div>
    )
}

const Create = ({ source, user, newVersion }) => {
    const navigate = useNavigate();

    // selected views/versions
    const [viewHlr, setViewHlr] = React.useState();
    const [viewNRI, setViewNRI] = React.useState();
    // all versions
    const [versionsHlr, setVersionsHlr] = React.useState({sources:[], views: []});
    const [versionsNRI, setVersionsNRI] = React.useState({sources:[], views: []});

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, setVersions: setVersionsHlr, type: 'hlr'});
            await getSrcViews({rtPfx, setVersions: setVersionsNRI, type: 'nri'});
        }
        fetchData();
    }, [])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewHlr, setValue: setViewHlr, versions: versionsHlr, type: 'hlr'})}
            {RenderVersions({value: viewNRI, setValue: setViewNRI, versions: versionsNRI, type: 'NRI'})}
            <button
                className={`align-right`}
                onClick={() =>
                    CallServer(
                        {rtPfx, source, userId: user.id, newVersion,
                            viewHlr: versionsHlr.views.find(v => v.view_id == viewHlr),
                            viewNRI: versionsNRI.views.find(v => v.view_id == viewNRI),
                            navigate
                        })}>
                Add New Source
            </button>
        </div>
    )
}

export default Create