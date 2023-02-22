import React from 'react'
import { useNavigate } from "react-router-dom";
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'
import get from "lodash.get";
import {checkApiResponse, formatDate, getSrcViews} from "../utils/utils";

const CallServer = async ({rtPfx, source, newVersion, navigate,
                              viewPB={}, viewNRI={}, viewState={}, viewCounty={}, viewNCEI={}}) => {
    const viewMetadata = [viewPB.view_id, viewNRI.view_id, viewState.view_id, viewCounty.view_id, viewNCEI.view_id];

    const url = new URL(
        `${rtPfx}/hazard_mitigation/hlrLoader`
    );
    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.id);
    url.searchParams.append("view_dependencies", JSON.stringify(viewMetadata));
    url.searchParams.append("version", newVersion);
    url.searchParams.append("table_name", 'hlr');


    url.searchParams.append("pb_schema", viewPB.table_schema);
    url.searchParams.append("pb_table", viewPB.table_name);
    url.searchParams.append("nri_schema", viewNRI.table_schema);
    url.searchParams.append("nri_table", viewNRI.table_name);
    url.searchParams.append("state_schema", viewState.table_schema);
    url.searchParams.append("state_table", viewState.table_name);
    url.searchParams.append("county_schema", viewCounty.table_schema);
    url.searchParams.append("county_table", viewCounty.table_name);
    url.searchParams.append("ncei_schema", viewNCEI.table_schema);
    url.searchParams.append("ncei_table", viewNCEI.table_name);

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

const Create = ({ source, user, newVersion = 1 }) => {
    const navigate = useNavigate();

    // selected views/versions
    const [viewPB, setViewPB] = React.useState();
    const [viewNRI, setViewNRI] = React.useState();
    const [viewState, setViewState] = React.useState();
    const [viewCounty, setViewCounty] = React.useState();
    const [viewNCEI, setViewNCEI] = React.useState();
    // all versions
    const [versionsPB, setVersionsPB] = React.useState({sources:[], views: []});
    const [versionsNRI, setVersionsNRI] = React.useState({sources:[], views: []});
    const [versionsState, setVersionsState] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});
    const [versionsNCEI, setVersionsNCEI] = React.useState({sources:[], views: []});

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, setVersions: setVersionsPB, type: 'per_basis'});
            await getSrcViews({rtPfx, setVersions: setVersionsNRI, type: 'nri'});
            await getSrcViews({rtPfx, setVersions: setVersionsState, type: `tl_state`});
            await getSrcViews({rtPfx, setVersions: setVersionsCounty, type: 'tl_county'});
            await getSrcViews({rtPfx, setVersions: setVersionsNCEI, type: 'ncei_storm_events_enhanced'});
        }
        fetchData();
    }, [])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewPB, setValue: setViewPB, versions: versionsPB, type: 'PB Storm Events'})}
            {RenderVersions({value: viewNRI, setValue: setViewNRI, versions: versionsNRI, type: 'NRI'})}
            {RenderVersions({value: viewState, setValue: setViewState, versions: versionsState, type: 'State'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}
            {RenderVersions({value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: 'NCEI Storm Events'})}
            <button
                className={`align-right`}
                onClick={() =>
                    CallServer(
                        {rtPfx, source, userId: user.id, newVersion,
                            viewPB: versionsPB.views.find(v => v.view_id == viewPB),
                            viewNRI: versionsNRI.views.find(v => v.view_id == viewNRI),
                            viewState: versionsState.views.find(v => v.view_id == viewState),
                            viewCounty: versionsCounty.views.find(v => v.view_id == viewCounty),
                            viewNCEI: versionsNCEI.views.find(v => v.view_id == viewNCEI),
                            navigate
                        })}>
                Add New Source
            </button>
        </div>
    )
}

export default Create