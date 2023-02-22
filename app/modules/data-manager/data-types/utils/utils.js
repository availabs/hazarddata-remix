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

export const makeAuthoritative = async (rtPfx, viewId) => {
    const url = new URL(`${rtPfx}/makeAuthoritativeDamaView`);

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

export const getSrcViews = async ({rtPfx, setVersions, type}) => {
    const url = new URL(
        `${rtPfx}/hazard_mitigation/versionSelectorUtils`
    );
    url.searchParams.append("type", type);

    const list = await fetch(url);

    await checkApiResponse(list);

    const {
        sources, views
    } = await list.json();
    setVersions({sources, views})

    return {sources, views}
}