import React from 'react';
//import { useFalcor, Button } from 'modules/avl-components/src'
//import get from 'lodash.get'
// import { useParams } from 'react-router-dom'

import Create from './create'
//import config from "config.json"

// import { getAttributes } from 'pages/DataManager/components/attributes'
    


const Table = ({source}) => {
  return <div> Table View </div>  
}

const AddView = ({source}) => {
  return <div> Add View </div>  
}


const NceiStormEventsConfig = {
  table: {
    name: 'Table',
    path: '/table',
    component: Table
  },
  add_view: {
    name: 'Add View',
    path: '/add_view',
    component: AddView
  },
  sourceCreate: {
    name: 'Create',
    component: Create
  }

}

export default NceiStormEventsConfig
