import { falcor } from '~/utils/falcor.server'
import {pgEnv} from "~/modules/data-manager/attributes";

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
    const options = {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}
    return new Date(dateString).toLocaleDateString(undefined, options)
}

export const createNewDataSource = async (rtPfx, source, type) => {
    const { name: sourceName, display_name: sourceDisplayName } = source;
    const res = await fetch(`${rtPfx}/createNewDamaSource`, {
        method: "POST",
        body: JSON.stringify({
            name: sourceName,
            display_name: sourceDisplayName,
            type,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await checkApiResponse(res);

    const newSrcMeta = await res.json();

    return newSrcMeta;
};

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

export const submitViewMeta = async({rtPfx, etlContextId, userId, sourceName, src, metadata = {}, newVersion = 1}) => {
    // falcor.invalidate(["dama", pgEnv, "sources","byId",src.source_id,"views","length"]);
    const url = new URL(`${rtPfx}/createNewDamaView`);
    url.searchParams.append("etl_context_id", etlContextId);
    url.searchParams.append("user_id", userId);

    const viewMetadata = {
        source_id: src.source_id,
        data_source_name: sourceName,
        version: newVersion,
        view_dependencies: Object.values(metadata)
    };

    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(viewMetadata),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await checkApiResponse(res);

    const viewMetaRes = await res.json();

    return viewMetaRes;
}

export const newETL = async ({rtPfx, setEtlContextId}) => {
    const newEtlCtxRes = await fetch(`${rtPfx}/etl/new-context-id`);
    await checkApiResponse(newEtlCtxRes);

    const _etlCtxId = +(await newEtlCtxRes.text());
    setEtlContextId(_etlCtxId);
    return _etlCtxId
}

export const getSrcViews = async ({rtPfx, setVersions, etlContextId, type}) => {
    if(!etlContextId) return {}
    const url = new URL(
        `${rtPfx}/staged-geospatial-dataset/versionSelectorUtils`
    );
    url.searchParams.append("etl_context_id", etlContextId);
    url.searchParams.append("type", type);

    const list = await fetch(url);

    await checkApiResponse(list);

    const {
        sources, views
    } = await list.json();
    setVersions({sources, views})

    return {sources, views}
}