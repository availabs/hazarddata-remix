import Pages from "./default";
import freight_atlas_shapefile from "./freight_atlas_shapefile";
import npmrdsTravelTime from "./npmrdsTravelTime";
import ncei_storm_events from './ncei_storm_events'
//import gis_dataset from "./gis_dataset";
import ncei_storm_events_enhanced from "./ncei_storm_events_enhanced";
import zone_to_county from "./zone_to_county";
import tiger_2017 from "./tiger_2017";
import open_fema_data from "./open_fema_data"
import usda_crop_insurance_cause_of_loss from "./usda"
import sba_disaster_loan_data_new from "./sba"
import nri from "./nri"
import per_basis_swd from "./per_basis_swd"
import hlr from "./hlr"

const DataTypes = {
  freight_atlas_shapefile,
  npmrdsTravelTime,
  ncei_storm_events,
  // gis_dataset,
  ncei_storm_events_enhanced,
  zone_to_county,
  tiger_2017,
  open_fema_data,
  usda_crop_insurance_cause_of_loss,
  sba_disaster_loan_data_new,
  nri,
  per_basis_swd,
  hlr
};

export { DataTypes, Pages };
