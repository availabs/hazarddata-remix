import React from 'react'
import get from "lodash.get";
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'

import {checkApiResponse, formatDate, getSrcViews, RenderVersions} from "../utils/utils";
import {useNavigate} from "react-router-dom";

const CallServer = async ({rtPfx, source, newVersion, navigate,
                              viewNCEI={},viewZTC={}, viewCousubs={}, viewTract={}}) => {
    const viewMetadata = [viewZTC.view_id, viewCousubs.view_id, viewTract.view_id, viewNCEI.view_id];

    const url = new URL(
        `${rtPfx}/hazard_mitigation/enhanceNCEI`
    );
    
    url.searchParams.append("table_name", 'details_enhanced');
    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.source_id);
    url.searchParams.append("view_dependencies", JSON.stringify(viewMetadata));
    url.searchParams.append("version", newVersion);
    
    url.searchParams.append("ncei_schema", viewNCEI.table_schema);
    url.searchParams.append("ncei_table", viewNCEI.table_name);
    url.searchParams.append("tract_schema", viewTract.table_schema);
    url.searchParams.append("tract_table", viewTract.table_name);
    url.searchParams.append("ztc_schema", viewZTC.table_schema);
    url.searchParams.append("ztc_table", viewZTC.table_name);
    url.searchParams.append("cousub_schema", viewCousubs.table_schema);
    url.searchParams.append("cousub_table", viewCousubs.table_name);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    const resJson = await stgLyrDataRes.json();

    console.log('res', resJson);

    navigate(`/source/${resJson.payload.source_id}/views`);
};

const Create = ({ source, user, newVersion }) => {
    const navigate = useNavigate();

    // selected views/versions
    const [viewZTC, setViewZTC] = React.useState();
    const [viewCousubs, setViewCousubs] = React.useState();
    const [viewTract, setViewTract] = React.useState();
    const [viewNCEI, setViewNCEI] = React.useState();
    // all versions
    const [versionsZTC, setVersionsZTC] = React.useState({sources:[], views: []});
    const [versionsCousubs, setVersionsCousubs] = React.useState({sources:[], views: []});
    const [versionsTract, setVersionsTract] = React.useState({sources:[], views: []});
    const [versionsNCEI, setVersionsNCEI] = React.useState({sources:[], views: []});

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, setVersions: setVersionsZTC, type: 'zone_to_county'});
            await getSrcViews({rtPfx, setVersions: setVersionsCousubs, type: 'tl_cousub'});
            await getSrcViews({rtPfx, setVersions: setVersionsTract, type: 'tl_tract'});
            await getSrcViews({rtPfx, setVersions: setVersionsNCEI, type: 'ncei_storm_events'});
        }
        fetchData();
    }, [])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: 'NCEI Storm Events'})}
            {RenderVersions({value: viewZTC, setValue: setViewZTC, versions: versionsZTC, type: 'Zone to County'})}
            {RenderVersions({value: viewCousubs, setValue: setViewCousubs, versions: versionsCousubs, type: 'Cousubs'})}
            {RenderVersions({value: viewTract, setValue: setViewTract, versions: versionsTract, type: 'Tracts'})}
            <button
                className={`align-right p-2 border-2 border-gray-200`}
                onClick={() =>
                    CallServer(
                        {rtPfx, source,
                            viewNCEI: versionsNCEI.views.find(v => v.view_id == viewNCEI),
                            viewZTC: versionsZTC.views.find(v => v.view_id == viewZTC),
                            viewCousubs: versionsCousubs.views.find(v => v.view_id == viewCousubs),
                            viewTract: versionsTract.views.find(v => v.view_id == viewTract),
                            newVersion, navigate
                        })}>
                Add New Source
            </button>
        </div>
    )
}

export default Create