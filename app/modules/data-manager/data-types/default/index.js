import Overview from "./Overview";
import Metadata from "./Metadata";
import AddView from "./AddView";
import Views from "./Views";

const Pages = {
  overview: {
    name: "Overview",
    path: "",
    component: Overview,
  },
  metadata: {
    name: "Metadata",
    path: "/metadata",
    component: Metadata,
  },
  add_view: {
    name: 'Add View',
    path: '/add_view',
    component: AddView
  },
  views: {
    name: 'Views',
    path: '/views',
    component: Views
  },
};

export default Pages;
