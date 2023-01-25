import Overview from "./Overview";
import AddView from "./AddView";

const Pages = {
  overview: {
    name: "Overview",
    path: "",
    component: Overview,
  },
  add_view: {
    name: 'Add View',
    path: '/add_view',
    component: AddView
  },
};

export default Pages;
