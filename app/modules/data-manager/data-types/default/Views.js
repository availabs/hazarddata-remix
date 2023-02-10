import {deleteView} from "~/modules/data-manager/data-types/utils/utils";
import {DAMA_HOST} from "~/config";
import {pgEnv} from "~/modules/data-manager/attributes";
import {Link} from "@remix-run/react";
//import { useRevalidator } from "@remix-run/react";
import {useEffect} from "react";

const DeleteButton = ({text, viewId}) => (
    <Link className={'bg-red-50 hover:bg-red-400 hover:text-white p-2'} to={`/view/delete/${viewId}`}
    >
        {text}
    </Link>
)

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
            <div className="py-4 sm:py-2 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6 border-b-2">
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

                                    <div key={i} className="py-4 sm:py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
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
                                            <DeleteButton text={'delete'} viewId={view.view_id}/>
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