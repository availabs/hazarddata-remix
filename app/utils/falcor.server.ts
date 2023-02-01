import { falcorGraph } from '~/modules/avl-falcor/falcorGraph'
import {API_HOST} from "../config"
let falcor
declare global {
  var __falcor
}
// this makes the server keep the falcor object
// which stores its own cache
// so it doesn't make unneccary duplicate requets
if (!global.__falcor) {
	console.log('new falcor')
global.__falcor = falcorGraph(API_HOST);
}
falcor = global.__falcor;

export { falcor };