import React from 'react'
import get from 'lodash.get'
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'
import {checkApiResponse, getSrcViews, RenderVersions} from "../utils/utils";
import {useNavigate} from "react-router-dom";

const CallServer = async ({rtPfx, source, newVersion, navigate,
                              viewNCEI={}, viewNRI={}}) => {
    const viewMetadata = [viewNCEI.view_id, viewNRI.view_id];

    const url = new URL(
        `${rtPfx}/hazard_mitigation/pbSWDLoader`
    );
    
    url.searchParams.append("table_name", 'per_basis_swd');
    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.source_id);
    url.searchParams.append("view_dependencies", JSON.stringify(viewMetadata));
    url.searchParams.append("version", newVersion);
    
    url.searchParams.append("ncei_schema", viewNCEI.table_schema);
    url.searchParams.append("ncei_table", viewNCEI.table_name);
    url.searchParams.append("nri_schema", viewNRI.table_schema);
    url.searchParams.append("nri_table", viewNRI.table_name);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    const resJson = await stgLyrDataRes.json();

    console.log('res', resJson);

    navigate(`/source/${resJson.payload.source_id}/views`);
}

const Create = ({ source, user, newVersion }) => {
    const navigate = useNavigate();
   
    // selected views/versions
    const [viewNCEI, setViewNCEI] = React.useState();
    const [viewNRI, setViewNRI] = React.useState();
    // all versions
    const [versionsNCEI, setVersionsNCEI] = React.useState({sources:[], views: []});
    const [versionsNRI, setVersionsNRI] = React.useState({sources:[], views: []});

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

    React.useEffect(() => {
        async function fetchData() {
           
            await getSrcViews({rtPfx, setVersions: setVersionsNCEI,  type: 'ncei_storm_events_enhanced'});
            await getSrcViews({rtPfx, setVersions: setVersionsNRI,  type: 'nri'});
        }
        fetchData();
    }, [])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: 'NCEI Storm Events'})}
            {RenderVersions({value: viewNRI, setValue: setViewNRI, versions: versionsNRI, type: 'NRI'})}
            <button
                className={`align-right p-2 border-2 border-gray-200`}
                onClick={() =>
                    CallServer(
                        {rtPfx, source,
                            viewNCEI: versionsNCEI.views.find(v => v.view_id == viewNCEI),
                            viewNRI: versionsNRI.views.find(v => v.view_id == viewNRI),
                            newVersion, navigate
                        })}>
                Add New Source
            </button>
        </div>
    )
}

export default Create