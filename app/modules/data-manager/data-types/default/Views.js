import {Link, useFetcher} from "@remix-run/react";
import React from "react";
import {useNavigate} from "react-router-dom";
import { makeAuthoritative } from "../utils/utils";
import {DAMA_HOST} from "~/config";
import {pgEnv} from '~/modules/data-manager/attributes'
import get from 'lodash.get';

const DeleteButton = ({text, viewId, meta}) => {
    const navigate = useNavigate();
    return (
        <button
            disabled={get(meta, 'authoritative') === 'true'}
            className={`bg-red-50 p-2 ${get(meta, 'authoritative') === 'true' ? `cursor-not-allowed` : `hover:bg-red-400 hover:text-white`}`}
            onClick={() => navigate(`/view/delete/${viewId}`)}
        >
            {text}
        </button>
    )
}

const MakeAuthoritativeButton = ({viewId, source, meta}) => {
    const navigate = useNavigate();
    const fetcher = useFetcher();

    return (
        <button
            className={`bg-blue-50 ${get(meta, 'authoritative') === 'true' ? `cursor-not-allowed` : `hover:bg-blue-400 hover:text-white`} p-2`}
            disabled={get(meta, 'authoritative') === 'true'}
            onClick={async () => {
                await makeAuthoritative(`${DAMA_HOST}/dama-admin/${pgEnv}`, viewId)
                await fetcher.submit(
                    {},
                    {
                        method: "post",
                        action: `/source/${source.source_id}?index`,
                        formData: 'this is fd'
                    }
                );
                return navigate(`/source/${source.source_id}/views`, { replace: true })
            }
            } >

            {get(meta, 'authoritative') === 'true' ? 'Authoritative' : 'Make Authoritative'}
        </button>
    )
}

const RenderValue = ({value, isLink, source_id}) => {
    const processedValue = typeof value === 'object' ? '' : value;

    return isLink ? <Link to={`/source/${source_id}/views/${value}`}> {processedValue} </Link> : processedValue;
}

const Views = ({source, views, user, falcor}) => {
    console.log(source)
    /*let revalidator = useRevalidator();

    useEffect(() => {
        revalidator.revalidate();
    })*/
    return (
        <div>
            <div className="py-4 sm:py-2 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6 border-b-2">
                {
                    ['view_id', 'version', 'last_updated', '_modified_timestamp']
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
                        views
                            .map((view, i) => (

                                    <div key={i} className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                                        {
                                            ['view_id', 'version', 'last_updated', '_modified_timestamp']
                                                .map(key => (
                                                    <dd key={key}
                                                        className="mt-1 text-sm text-gray-900 sm:mt-0 align-middle">
                                                        <RenderValue value={view[key]} isLink={key === 'view_id'} source_id={source.source_id}/>
                                                    </dd>
                                                ))
                                        }
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 flex justify-end">
                                            <MakeAuthoritativeButton viewId={view.view_id} source={source} meta={view.metadata}/>
                                        </dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 flex justify-end">
                                            <DeleteButton text={'delete'} viewId={view.view_id} meta={view.metadata}/>
                                        </dd>
                                    </div>

                                )
                            )}

                </dl>
            </div>
        </div>
    )
}

export default Views;