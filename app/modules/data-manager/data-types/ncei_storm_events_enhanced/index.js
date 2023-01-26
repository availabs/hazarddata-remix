import React from 'react';
import Create from './create'

const Table = ({source}) => {
  return <div> Table View </div>  
}

const NceiStormEventsConfig = {
  table: {
    name: 'Table',
    path: '/table',
    component: Table
  },
  sourceCreate: {
    name: 'Create',
    component: Create
  }

}

export default NceiStormEventsConfig
