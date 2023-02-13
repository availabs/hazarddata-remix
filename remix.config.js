/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  serverDependenciesToBundle: ['d3-scale', 'd3-selection', 'd3-array', 'd3-format', 'd3-path', 'd3-transition', 'd3-axis',
    'd3-time', 'd3-interpolate', 'd3-time-format', 'd3-dispatch', 'd3-timer', 'd3-ease', 'd3-color',
    'internmap'],

  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
};
