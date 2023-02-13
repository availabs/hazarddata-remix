export const SourceAttributes = {
  "source_id": "source_id",
  "name": "name",
  "type": "type",
  "update_interval": "update_interval",
  "category": "category",
  "categories": "categories",
  "description": "description",
  "statistics": "statistics",
  "metadata": "metadata",
}

export const ViewAttributes = {
  "source_id": "source_id",
  "view_id": "view_id",
  "data_type": "data_type",
  "interval_version": "interval_version",
  "geography_version": "geography_version",
  "version": "version",
  "metadata": "metadata",
  "source_url": "source_url",
  "publisher": "publisher",
  "data_table": "data_table",
  "download_url": "download_url",
  "tiles_url": "tiles_url",
  "start_date": "start_date",
  "end_date": "end_date",
  "last_updated": "last_updated",
  "_created_timestamp": "_created_timestamp",
  "_modified_timestamp": "_modified_timestamp",
  "statistics": "statistics",
}

export const getAttributes = (data) => {
  return Object.entries(data)
    .reduce((out,attr) => {
      const [k,v] = attr
      typeof v.value !== 'undefined' ? 
        out[k] = v.value : 
        out[k] = v
      return out 
    },{})
}

export const getName = (source) => {
  return source.display_name && source.display_name.length > 0 ? 
  source.display_name : 
  source.name.split('/').pop().split('_').join(' ')
}

export const pgEnv = 'hazmit_dama' //'npmrds'

export const hazardsMeta2 = {
  // icy blue
  'hail':{color:'#027B8E', name:'Hail'},
  'winterweat':{color:'#3F92B7', name:'Snow Storm'},
  'icestorm':{color:'#6CC4DC', name:'Ice Storm'},
  'coldwave':{color:'#845EC2', name:'Coldwave'},

  // wetery blues
  'tsunami':{color:'#6545a4', name:'Tsunami/Seiche'},
  'coastal': {color:'#499894', name:'Coastal Hazards'},
  'riverine':{color:'#6388B4', name:'Flooding'},
  'tornado':{color:'#A0CBE8', name:'Tornado'},
  'hurricane':{color:'#8CD17D', name:'Hurricane'},

  // reds
  'wildfire':{color:'#E15759', name:'Wildfire'},
  'heatwave':{color:'#ff571a', name:'Heat Wave'},
  'volcano':{color:'#FF8066', name:'Volcano'},

  // earthy yellows/browns/
  'landslide':{color:'#C49C94', name:'Landslide'},
  'earthquake':{color:'#af9d43', name:'Earthquake'},
  'drought':{color:'#B0A8B9', name:'Drought'},
  'avalanche':{color:'#fae060', name:'Avalanche'},

  // silvery
  'wind':{color: '#ccc', name:'Wind'},
  'lightning':{color:'#e7daff', name:'Lightning'},
}

export const hazardsMeta3 = {
  // icy blue
  'hail':{color:'#B1D4E0', name:'Hail'},
  'winterweat':{color:'#3F92B7', name:'Snow Storm'},
  'icestorm':{color:'#6CC4DC', name:'Ice Storm'},
  'coldwave':{color:'#845EC2', name:'Coldwave'},

  // wetery blues
  'tsunami':{color:'#6545a4', name:'Tsunami/Seiche'},
  'coastal': {color:'#008E9B', name:'Coastal Hazards'},
  'riverine':{color:'#2C73D2', name:'Flooding'},
  'tornado':{color:'#4570a4', name:'Tornado'},
  'hurricane':{color:'#c6ea62', name:'Hurricane'},

  // reds
  'wildfire':{color:'#E15759', name:'Wildfire'},
  'heatwave':{color:'#ff571a', name:'Heat Wave'},
  'volcano':{color:'#FF8066', name:'Volcano'},

  // earthy yellows/browns/
  'landslide':{color:'#D5CABD', name:'Landslide'},
  'earthquake':{color:'#af9d43', name:'Earthquake'},
  'drought':{color:'#B0A8B9', name:'Drought'},
  'avalanche':{color:'#fae060', name:'Avalanche'},

  // silvery
  'wind':{color: '#ccc', name:'Wind'},
  'lightning':{color:'#e7daff', name:'Lightning'},
}

export const hazardsMeta = {
  // icy blue
  'hail':{color:'#027B8E', name:'Hail'},
  'winterweat':{color:'#76c8c8', name:'Snow Storm'},
  'icestorm':{color:'#98d1d1', name:'Ice Storm'},
  'coldwave':{color:'#badbdb', name:'Coldwave'},
  'coastal': {color:'#54bebe', name:'Coastal Hazards'},
  'riverine':{color:'#115f9a', name:'Flooding'},

  // watery blues
  'tsunami':{color:'#5e569b', name:'Tsunami/Seiche'},
  'avalanche':{color:'#776bcd', name:'Avalanche'},
  'tornado':{color:'#9080ff', name:'Tornado'},
  'lightning':{color:'#beb9db', name:'Lightning'},

  // reds
  'wildfire':{color:'#ff1a40', name:'Wildfire'},
  'heatwave':{color:'#ff571a', name:'Heat Wave'},
  'volcano':{color:'#FF8066', name:'Volcano'},

  // earthy yellows/browns/
  'landslide':{color:'#786028', name:'Landslide'},
  'earthquake':{color:'#a57c1b', name:'Earthquake'},
  'drought':{color:'#d2980d', name:'Drought'},
  'hurricane':{color:'#ffb400', name:'Hurricane'},

  // silvery
  'wind':{color: '#dedad2', name:'Wind'},
};

