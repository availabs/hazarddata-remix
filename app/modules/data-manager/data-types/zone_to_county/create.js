import React from 'react'
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'
import {checkApiResponse, formatDate, newETL, getSrcViews, createNewDataSource, submitViewMeta} from "../utils/utils";
import {useNavigate} from "react-router-dom";


const CallServer = async ({rtPfx, source, etlContextId, userId, newVersion, navigate}) => {
    const { name: sourceName, display_name: sourceDisplayName } = source;

    const src = source.source_id ? source : await createNewDataSource(rtPfx, source, "zone_to_county");
    console.log('src?', src)
    const view = await submitViewMeta({rtPfx, etlContextId, userId, sourceName, src, newVersion})

    const url = new URL(
        `${rtPfx}/hazard_mitigation/csvUploadAction`
    );
    url.searchParams.append("etl_context_id", etlContextId);
    url.searchParams.append("table_name", 'zone_to_county');
    url.searchParams.append("src_id", src.source_id);
    url.searchParams.append("view_id", view.view_id);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    navigate(`/source/${src.source_id}/views`);
}

const Create =  ({ source, user, newVersion }) => {
    const navigate = useNavigate();
    const [etlContextId, setEtlContextId] = React.useState();

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

    React.useEffect(() => {
        async function fetchData() {
            const etl = await newETL({rtPfx, setEtlContextId});
            setEtlContextId(etl);
        }
        fetchData();
    }, [])

    return (
        <div className='w-full'>
            <button onClick={() => CallServer({
                rtPfx, source, etlContextId, userId: user.id, newVersion, navigate
            })}> Add New Source</button>
        </div>
    )
}

export default Create