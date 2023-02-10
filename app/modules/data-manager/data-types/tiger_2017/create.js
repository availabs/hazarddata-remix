import React from 'react'
// import { redirect } from '@remix-run/node';
import {DAMA_HOST} from "~/config";
import { pgEnv} from '~/modules/data-manager/attributes'
import {checkApiResponse, formatDate, newETL, getSrcViews, createNewDataSource, submitViewMeta} from "../utils/utils";
import {useNavigate} from "react-router-dom";
const CallServer = async ({rtPfx, source, etlContextId, userId, tigerTable, newVersion, navigate}) => {
    const { name: sourceName, display_name: sourceDisplayName } = source;

    const src =  source.source_id ? source : await createNewDataSource(rtPfx, source, `tl_${tigerTable.toLowerCase()}`);
    console.log('src?', src)
    const view = await submitViewMeta({rtPfx, etlContextId, userId, sourceName, src, newVersion})

    const url = new URL(
        `${rtPfx}/hazard_mitigation/tigerDownloadAction`
    );
    url.searchParams.append("etl_context_id", etlContextId);
    url.searchParams.append("table", tigerTable);
    // url.searchParams.append("table_name", 'tl_cousubs');
    url.searchParams.append("src_id", src.source_id);
    url.searchParams.append("view_id", view.view_id);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    console.log('res', stgLyrDataRes.body)
    navigate(`/source/${src.source_id}/views`);
}

const RenderTigerTables= ({value, setValue, domain}) => {
    return (
        <div  className='flex justify-between group'>
            <div  className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 py-5">Select Type: </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className='pt-3 pr-8'>
                        <select
                            className='w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300'
                            value={value || ''}
                            onChange={e => {
                                setValue(e.target.value)
                            }}>
                            <option value="" disabled >Select your option</option>
                            {domain
                                .map(v =>
                                    <option
                                        key={v}
                                        value={v} className='p-2'>
                                        {v}
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
    console.log(user)
    const navigate = useNavigate();
    const [etlContextId, setEtlContextId] = React.useState();
    const [tigerTable, setTigerTable] = React.useState();

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
    console.log('comes here')
    React.useEffect(() => {
        async function fetchData() {
            const etl = await newETL({rtPfx, setEtlContextId});
            setEtlContextId(etl);
        }
        fetchData();
    }, [])

    return (
        <div className='w-full'>
            {RenderTigerTables({value: tigerTable, setValue: setTigerTable, domain: ['STATE', 'COUNTY', 'COUSUB', 'TRACT']})}
            <button
                onClick={() =>
                    CallServer({
                        rtPfx, source, etlContextId, userId:user.id, tigerTable, newVersion, navigate})}
                disabled={!tigerTable}
            >
                Add New Source
            </button>
        </div>
    )
}

export default Create