import React, { useState, useMemo } from 'react'
import { falcor } from '~/utils/falcor.server'
import { TopNav } from '~/modules/avl-components/src'
import { SourceAttributes, ViewAttributes, getAttributes, pgEnv} from '~/modules/data-manager/attributes'
import { Pages, DataTypes } from '~/modules/data-manager/data-types'
import { useLoaderData, Link, useParams, useOutletContext } from "@remix-run/react";

import get from 'lodash.get'

export async function loader ({ params, request }) {
  const { sourceId } = params
  
  const lengthPath = ["dama", pgEnv, "sources","byId",sourceId,"views","length"]
  const resp = await falcor.get(lengthPath);
  let data =  await falcor.get(
    [
      "dama", pgEnv, "sources","byId",sourceId,"views","byIndex",
      {from:0, to:  get(resp.json, lengthPath, 0)-1},
      "attributes",Object.values(ViewAttributes)
    ],
    [
      "dama", pgEnv, "sources","byId",sourceId,
      "attributes",Object.values(SourceAttributes)
    ],
      [
      "dama", pgEnv, "sources", "byId", sourceId, 'meta'
    ]
  )
  
  const falcorCache = falcor.getCache();

  return {
      falcorCache,
      data,
    views:  Object.values(
        get(
          falcorCache,
          ["dama", pgEnv, "sources","byId", sourceId,"views","byIndex",],
          {}
        )
      )
      .map(v => getAttributes(
          get(
            falcorCache,
            v.value,
            {'attributes': {}}
          )['attributes']
        )
      ),
    source: getAttributes(
      get(
        falcorCache,
        ["dama", pgEnv,'sources','byId', sourceId],
        {'attributes': {}}
      )['attributes']
    ),
      meta:
      get(
        falcorCache,
        ["dama", pgEnv,'sources', "byId", sourceId, 'meta', 'value'],
        {}
      )

  }
}

export const action = async ({ request, params }) => {
    const { sourceId } = params
  console.log('gonna invalidate sources length');
  const fd = await request.formData();
  // console.log('fd', fd, params, request.target)
  // await falcor.invalidate(["dama", pgEnv, "sources", "length"]);
  // await falcor.invalidate(["dama", pgEnv,'sources','byId', sourceId],);
  const res = await falcor.call(["dama", pgEnv, "sources","byId",sourceId,"views","invalidate"]);
  // console.log('res?', res)
  // const data = await request.json();
  // let jsonData = json({ data });
    const falcorCache = falcor.getCache();

  // console.log('I am gonna action',data, 'params', params);
  return {falcorCache};
}


export default function Dama() {
    const {views,source,meta, falcorCache, data} = useLoaderData()
    const {sourceId, page, viewId} = useParams()
    const [ pages, setPages ] = useState(Pages)
    const { user } = useOutletContext()

    console.log('view params?', sourceId, page, viewId)
    React.useEffect(() => {

      if(DataTypes[source.type] ){
        let typePages = Object.keys(DataTypes[source.type]).reduce((a,c)=>{
          if(DataTypes[source.type][c].path) {
            a[c] = DataTypes[source.type][c]
          }
          return a
        },{})

        let allPages = {...Pages,...typePages}
          setPages(allPages)  
      } 
      /*else {
        setPages(Pages) 
      }*/
    }, [source.type])

    const Page = useMemo(() => {
      return page ? get(pages,`[${page}].component`,Pages['overview'].component) : Pages['overview'].component
    },[page,pages])
    
    return (
      <div>
        <div className='text-xl font-medium overflow-hidden p-2 border-b '>
          {source.display_name || source.name}
        </div>
        <TopNav 
          menuItems={Object.values(pages)
            .map(d => {
              return {
                name:d.name,
                path: `/source/${sourceId}${d.path}`
              }
            })}
          themeOptions={{size:'inline'}}
        />
        <div className='w-full p-4 bg-white shadow mb-4'>
          View details
        </div>
      </div>  
    )
}
