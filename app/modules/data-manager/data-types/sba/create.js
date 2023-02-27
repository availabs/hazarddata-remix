import React from 'react'
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'
import {checkApiResponse} from "../utils/utils";
import {useNavigate} from "react-router-dom";

const CallServer = async ({rtPfx, source,  table, newVersion, navigate}) => {
    const url = new URL(
        `${rtPfx}/hazard_mitigation/sbaLoader`
    );

    url.searchParams.append("table_name", table);
    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.source_id);
    url.searchParams.append("version", newVersion);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    const resJson = await stgLyrDataRes.json();

    console.log('res', resJson);

    navigate(`/source/${resJson.payload.source_id}/views`);
}

const Create = ({ source, user, newVersion }) => {
    const navigate = useNavigate();
    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

    return (
        <div className='w-full'>
            <button
                className={`align-right p-2 border-2 border-gray-200`}
                onClick={() => CallServer({
                rtPfx, source, userId: user.id, table: 'sba_disaster_loan_data_new', newVersion, navigate
            })}> Add New Source</button>
        </div>
    )
}

export default Create