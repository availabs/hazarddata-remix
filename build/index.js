var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);
var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

// app/modules/avl-falcor/falcor-http-datasource/src/getXMLHttpRequest.js
var require_getXMLHttpRequest = __commonJS({
  "app/modules/avl-falcor/falcor-http-datasource/src/getXMLHttpRequest.js"(exports, module2) {
    "use strict";
    var xhr = require("xmlhttprequest");
    module2.exports = function() {
      var request = new xhr.XMLHttpRequest();
      return request.setDisableHeaderCheck(!0), request;
    };
  }
});

// app/modules/avl-falcor/falcor-http-datasource/src/getCORSRequest.js
var require_getCORSRequest = __commonJS({
  "app/modules/avl-falcor/falcor-http-datasource/src/getCORSRequest.js"(exports, module2) {
    "use strict";
    var xhr = require("xmlhttprequest");
    module2.exports = function() {
      var request = null;
      if (global.XMLHttpRequest ? request = new global.XMLHttpRequest() : request = new xhr.XMLHttpRequest(), "withCredentials" in request)
        return request;
      if (global.XDomainRequest)
        return new XDomainRequest();
      throw new Error("CORS is not supported by your browser");
    };
  }
});

// app/modules/avl-falcor/falcor-http-datasource/src/request.js
var require_request = __commonJS({
  "app/modules/avl-falcor/falcor-http-datasource/src/request.js"(exports, module2) {
    "use strict";
    var getXMLHttpRequest = require_getXMLHttpRequest(), getCORSRequest = require_getCORSRequest(), hasOwnProp = Object.prototype.hasOwnProperty, noop3 = function() {
    };
    function Observable() {
    }
    Observable.create = function(subscribe) {
      var o = new Observable();
      return o.subscribe = function(onNext, onError, onCompleted) {
        var observer, disposable;
        return typeof onNext == "function" ? observer = {
          onNext,
          onError: onError || noop3,
          onCompleted: onCompleted || noop3
        } : observer = onNext, disposable = subscribe(observer), typeof disposable == "function" ? {
          dispose: disposable
        } : disposable;
      }, o;
    };
    function request(method, options, context) {
      return Observable.create(function(observer) {
        var config = {
          method: method || "GET",
          crossDomain: !1,
          async: !0,
          headers: {},
          responseType: "json"
        }, xhr, isDone, headers, header, prop;
        for (prop in options)
          hasOwnProp.call(options, prop) && (config[prop] = options[prop]);
        !config.crossDomain && !config.headers["X-Requested-With"] && (config.headers["X-Requested-With"] = "XMLHttpRequest"), context.onBeforeRequest != null && context.onBeforeRequest(config);
        try {
          xhr = config.crossDomain ? getCORSRequest() : getXMLHttpRequest();
        } catch (err) {
          observer.onError(err);
        }
        try {
          config.user ? xhr.open(config.method, config.url, config.async, config.user, config.password) : xhr.open(config.method, config.url, config.async), xhr.timeout = config.timeout, xhr.withCredentials = config.withCredentials !== !1, headers = config.headers;
          for (header in headers)
            hasOwnProp.call(headers, header) && xhr.setRequestHeader(header, headers[header]);
          if (config.responseType)
            try {
              xhr.responseType = config.responseType;
            } catch (e) {
              if (config.responseType !== "json")
                throw e;
            }
          xhr.onreadystatechange = function(e) {
            xhr.readyState === 4 && (isDone || (isDone = !0, onXhrLoad(observer, xhr, e)));
          }, xhr.ontimeout = function(e) {
            isDone || (isDone = !0, onXhrError(observer, xhr, "timeout error", e));
          }, xhr.send(config.data);
        } catch (e) {
          observer.onError(e);
        }
        return function() {
          !isDone && xhr.readyState !== 4 && (isDone = !0, xhr.abort());
        };
      });
    }
    function _handleXhrError(observer, textStatus, errorThrown) {
      errorThrown || (errorThrown = new Error(textStatus)), observer.onError(errorThrown);
    }
    function onXhrLoad(observer, xhr, e) {
      var responseData, responseObject, responseType;
      if (xhr && observer) {
        responseType = xhr.responseType, responseData = "response" in xhr ? xhr.response : xhr.responseText;
        var status = xhr.status === 1223 ? 204 : xhr.status;
        if (status >= 200 && status <= 399) {
          try {
            responseType !== "json" && (responseData = JSON.parse(responseData || "")), typeof responseData == "string" && (responseData = JSON.parse(responseData || ""));
          } catch (e3) {
            _handleXhrError(observer, "invalid json", e3);
          }
          observer.onNext(responseData), observer.onCompleted();
          return;
        } else
          return status === 401 || status === 403 || status === 407 || status === 410 || status === 408 || status === 504 ? _handleXhrError(observer, responseData) : _handleXhrError(observer, responseData || "Response code " + status);
      }
    }
    function onXhrError(observer, xhr, status, e) {
      _handleXhrError(observer, status || xhr.statusText || "request error", e);
    }
    module2.exports = request;
  }
});

// app/modules/avl-falcor/falcor-http-datasource/src/buildQueryObject.js
var require_buildQueryObject = __commonJS({
  "app/modules/avl-falcor/falcor-http-datasource/src/buildQueryObject.js"(exports, module2) {
    "use strict";
    module2.exports = function(url, method, queryData) {
      var qData = [], keys, data = { url }, isQueryParamUrl = url.indexOf("?") !== -1, startUrl = isQueryParamUrl ? "&" : "?";
      return typeof queryData == "string" ? qData.push(queryData) : (keys = Object.keys(queryData), keys.forEach(function(k) {
        var value = typeof queryData[k] == "object" ? JSON.stringify(queryData[k]) : queryData[k];
        qData.push(k + "=" + encodeURIComponent(value));
      })), method === "GET" ? data.url += startUrl + qData.join("&") : data.data = qData.join("&"), data;
    };
  }
});

// app/modules/avl-falcor/falcor-http-datasource/src/XMLHttpSource.js
var require_XMLHttpSource = __commonJS({
  "app/modules/avl-falcor/falcor-http-datasource/src/XMLHttpSource.js"(exports, module2) {
    "use strict";
    var request = require_request(), buildQueryObject = require_buildQueryObject(), isArray = Array.isArray;
    function simpleExtend(obj, obj2) {
      var prop;
      for (prop in obj2)
        obj[prop] = obj2[prop];
      return obj;
    }
    function XMLHttpSource(jsongUrl, config) {
      if (this._jsongUrl = jsongUrl, typeof config == "number") {
        var newConfig = {
          timeout: config
        };
        config = newConfig;
      }
      this._config = simpleExtend({
        timeout: 15e3,
        headers: {}
      }, config || {});
    }
    XMLHttpSource.prototype = {
      constructor: XMLHttpSource,
      buildQueryObject,
      get: function(pathSet) {
        var method = "GET", queryObject = this.buildQueryObject(this._jsongUrl, method, {
          paths: pathSet,
          method: "get"
        }), config = simpleExtend(queryObject, this._config), context = this;
        return request(method, config, context);
      },
      set: function(jsongEnv) {
        var method = "POST", config, queryObject;
        !this._config.headers || !this._config.headers["Content-Type"] || !this._config.headers["Content-Type"].match(/application\/json/) ? (queryObject = this.buildQueryObject(this._jsongUrl, method, {
          jsonGraph: jsongEnv,
          method: "set"
        }), config = simpleExtend(queryObject, this._config), config.headers["Content-Type"] = "application/x-www-form-urlencoded") : config = simpleExtend({
          url: this._jsongUrl,
          data: JSON.stringify({
            jsonGraph: JSON.stringify(jsongEnv),
            method: "set"
          })
        }, this._config);
        var context = this;
        return request(method, config, context);
      },
      call: function(callPath, args, pathSuffix, paths) {
        args = args || [], pathSuffix = pathSuffix || [], paths = paths || [];
        var method = "POST", config, queryData = [], queryObject;
        !this._config.headers || !this._config.headers["Content-Type"] || !this._config.headers["Content-Type"].match(/application\/json/) ? (queryData.push("method=call"), queryData.push("callPath=" + encodeURIComponent(JSON.stringify(callPath))), queryData.push("arguments=" + encodeURIComponent(JSON.stringify(args))), queryData.push("pathSuffixes=" + encodeURIComponent(JSON.stringify(pathSuffix))), queryData.push("paths=" + encodeURIComponent(JSON.stringify(paths))), queryObject = this.buildQueryObject(this._jsongUrl, method, queryData.join("&")), config = simpleExtend(queryObject, this._config), config.headers["Content-Type"] = "application/x-www-form-urlencoded") : config = simpleExtend({
          url: this._jsongUrl,
          data: JSON.stringify({
            method: "call",
            callPath: JSON.stringify(callPath),
            arguments: JSON.stringify(args),
            pathSuffixes: JSON.stringify(pathSuffix),
            paths: JSON.stringify(paths)
          })
        }, this._config);
        var context = this;
        return request(method, config, context);
      }
    };
    XMLHttpSource.XMLHttpSource = XMLHttpSource;
    XMLHttpSource.default = XMLHttpSource;
    module2.exports = XMLHttpSource;
  }
});

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.jsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react"), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
      fileName: "app/entry.server.jsx",
      lineNumber: 11,
      columnNumber: 5
    }, this)
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
var import_react34 = require("@remix-run/react");

// app/modules/avl-components/src/ComponentFactory.js
var import_react4 = __toESM(require("react"));

// app/modules/avl-components/src/components/ComponentLibrary.js
var ComponentLibrary = {}, ComponentLibrary_default = ComponentLibrary;

// app/modules/avl-components/src/wrappers/with-theme.js
var import_react2 = __toESM(require("react"));

// app/modules/avl-components/src/Themes/utils.js
var compose = (themeType, theme) => {
  let [base, ...rest] = themeType.split(/(?<!^)(?=[A-Z])/);
  return !theme.$compositions || !theme.$compositions[base] ? theme[base] || "" : theme.$compositions[base].reduce((a, c) => {
    let option = c.$default || "";
    for (let opt of rest)
      opt in c && (option = c[opt]);
    return a.push(option), a;
  }, []).filter(Boolean).join(" ");
}, composeDefaults = (theme) => {
  let composedTheme = JSON.parse(JSON.stringify(theme));
  for (let key in composedTheme) {
    if (key === "$compositions")
      continue;
    let classNames2 = composedTheme[key].split(/\s+/), atRegex = /^[@](.+)$/;
    composedTheme[key] = classNames2.map((c) => {
      let match = atRegex.exec(c);
      if (match) {
        let [, key2] = match;
        return composedTheme[key2];
      }
      return c;
    }).join(" ");
  }
  if (composedTheme.$compositions) {
    let { $defaults = [], ...rest } = composedTheme.$compositions;
    for (let type in rest)
      composedTheme.$compositions[type].forEach((options) => {
        for (let option in options) {
          let atRegex = /^[@](.+)$/;
          options[option] = options[option].split(/\s+/).map((o) => {
            let match = atRegex.exec(o);
            if (match) {
              let [, key] = match;
              return composedTheme[key];
            }
            return o;
          }).join(" ");
          let $regex = /^\$(.+)$/, $match = $regex.exec(options[option]);
          if ($match) {
            let [, value] = $match;
            value in composedTheme && (options[option] = composedTheme[value], $defaults.push(value));
          }
        }
      });
    $defaults.forEach((themeType) => {
      composedTheme[themeType] = compose(themeType, composedTheme);
    });
  }
  return composedTheme;
}, handler = {
  get: (theme, definition, receiver) => (definition in theme || (theme[definition] = compose(definition, theme)), theme[definition])
}, makeProxy = (theme) => new Proxy(theme, handler), composeTheme = (theme) => new Proxy(composeDefaults(theme), handler);

// app/modules/avl-components/src/Themes/compositions/index.js
var button = [
  {
    $default: "rounded inline-flex items-center justify-center @transition disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50 focus:outline-none border",
    Text: "inline-flex items-center justify-center @transition disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none border"
  },
  {
    $default: "text-gray-400 disabled:text-gray-300",
    Primary: "text-blue-400 disabled:text-blue-300",
    Success: "text-green-400 disabled:text-green-300",
    Danger: "text-red-400 disabled:text-red-300",
    Info: "text-teal-400 disabled:text-teal-300"
  },
  {
    $default: "border-gray-400",
    Primary: "border-blue-400",
    Success: "border-green-400",
    Danger: "border-red-400",
    Info: "border-teal-400",
    Text: "border-none"
  },
  {
    $default: "hover:bg-gray-400 hover:text-white",
    Primary: "hover:bg-blue-400 hover:text-white",
    Success: "hover:bg-green-400 hover:text-white",
    Danger: "hover:bg-red-400 hover:text-white",
    Info: "hover:bg-teal-400 hover:text-white",
    Text: ""
  },
  {
    $default: "px-4 py-1 @textBase",
    Large: "px-6 py-2 @textLarge",
    Small: "px-2 py-0 @textSmall"
  },
  { Block: "w-full" }
], input = [
  { $default: "w-full block rounded cursor-pointer disabled:cursor-not-allowed @transition @text @placeholder @inputBg @inputBorder" },
  {
    $default: "@paddingBase @textBase",
    Large: "@paddingLarge @textLarge",
    Small: "@paddingSmall @textSmall"
  }
], navitem = [
  { $default: "border-transparent font-medium focus:outline-none @transition" },
  {
    Top: "h-16 flex flex-1 items-center px-4 text-base leading-5",
    Side: "h-12 mb-1 flex pl-3 pr-4 py-2 border-l-4 text-base"
  },
  {
    $default: "@menuBg @menuBgHover @menuText @menuTextHover",
    Active: "@menuBgActive @menuBgActiveHover @menuTextActive @menuTextActiveHover"
  }
], textbutton = [
  { $default: "@transition inline-flex px-2 hover:font-bold disabled:font-normal disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none" },
  {
    $default: "$textbutton",
    Info: "text-teal-400 hover:text-teal-500 disabled:text-teal-400"
  },
  {
    $default: "text-base",
    Large: "text-lg",
    Small: "text-sm"
  },
  {
    $default: "font-normal cursor-pointer",
    Active: "font-bold cursor-default"
  }
], list = [
  {
    $default: "@transition rounded"
  },
  {
    $default: "p-2 bg-opacity-50",
    Item: "py-1 px-3 bg-gray-300 mb-2"
  },
  {
    $default: "bg-opacity-50",
    Dragging: "bg-opacity-75"
  },
  {
    $default: "bg-gray-400",
    Success: "bg-green-400"
  }
], $compositions = {
  $defaults: [
    "input",
    "navitemTop",
    "navitemTopActive",
    "navitemSide",
    "navitemSideActive"
  ],
  button,
  input,
  navitem,
  textbutton,
  list
};

// app/modules/avl-components/src/Themes/avl-design.js
var avl_design = (colorname, size) => {
  let primary = "gray", highlight = "white", accent = "blue";
  return {
    sidenav: (opts = {}) => {
      let { color: color2 = "white", size: size2 = "compact", subMenuStyle = "inline" } = opts, colors = {
        white: {
          contentBg: `bg-${highlight}`,
          contentBgAccent: "bg-neutral-100",
          accentColor: `${accent}-600`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${primary}-100`,
          textColor: `text-${primary}-600`,
          textColorAccent: "text-slate-800",
          highlightColor: `text-${primary}-800`
        },
        dark: {
          contentBg: "bg-neutral-800",
          contentBgAccent: "bg-neutral-900",
          accentColor: "white",
          accentBg: "",
          borderColor: "border-neutral-700",
          textColor: "text-slate-300",
          textColorAccent: "text-slate-100",
          highlightColor: `text-${highlight}`
        },
        bright: {
          contentBg: `bg-${accent}-700`,
          accentColor: `${accent}-400`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${accent}-600`,
          textColor: `text-${highlight}`,
          highlightColor: `text-${highlight}`
        }
      }, sizes = {
        compact: {
          width: "44",
          wrapper: "w-44",
          sideItem: "flex mx-2 pr-4 py-2 text-base hover:pl-2",
          topItem: "flex items-center text-sm px-4 border-r h-12",
          icon: "mr-3 text-lg"
        },
        full: {
          width: "64",
          wrapper: "w-64",
          sideItem: "flex mx-4 pr-4 py-4 text-base font-base border-b hover:pl-4",
          topItem: "flex pr-4 py-2 text-sm font-light",
          icon: "mr-4 text-2xl"
        },
        mini: {
          width: "20",
          wrapper: "w-20 overflow-x-hidden",
          sideItem: "flex pr-4 py-4 text-base font-base border-b",
          topItem: "flex px-4 items-center text-sm font-light ",
          icon: "w-20 mr-4 text-5xl"
        },
        micro: {
          width: "14",
          wrapper: "w-14 overflow-x-hidden",
          sideItem: "flex pr-4 py-4 text-base font-base border-b",
          topItem: "flex mx-6 pr-4 py-2 text-sm font-light",
          icon: "w-14 mr-4 text-2xl",
          sideItemContent: "hidden"
        },
        none: {
          width: "0",
          wrapper: "w-0 overflow-hidden",
          sideItem: "flex mx-2 pr-4 py-2 text-base hover:pl-2",
          topItem: "flex items-center text-sm px-4 border-r h-12",
          icon: "mr-3 text-lg"
        }
      }, subMenuStyles = {
        inline: {
          indicatorIcon: "os-icon os-icon-arrow-down",
          subMenuWrapper: "ml-3 flex flex-col",
          subMenuParentWrapper: "flex flex-col"
        },
        flyout: {
          indicatorIcon: "os-icon os-icon-arrow-right2",
          subMenuWrapper: `absolute ml-${sizes[size2].width - 8}`,
          subMenuParentWrapper: "flex flex-row",
          subMenuWrapperTop: "absolute top-full"
        }
      };
      return {
        contentBg: `${colors[color2].contentBg}`,
        contentBgAccent: `${colors[color2].contentBgAccent}`,
        logoWrapper: `${sizes[size2].wrapper} ${colors[color2].contentBgAccent} ${colors[color2].textColorAccent}`,
        sidenavWrapper: `${colors[color2].contentBg} ${sizes[size2].wrapper} h-full hidden md:block z-20`,
        menuIconSide: `text-${colors[color2].accentColor} ${sizes[size2].icon} group-hover:${colors[color2].highlightColor}`,
        menuIconClosed: "fa fa-bars p-3 cursor-pointer",
        menuIconOpen: "fa fa-cancel",
        itemsWrapper: `p-4 border-t ${colors[color2].borderColor} ${sizes[size2].wrapper}`,
        navitemSide: ` 
	            group font-sans flex flex-col
	            ${sizes[size2].sideItem} ${colors[color2].textColor} ${colors[color2].borderColor} 
	            hover:${colors[color2].highlightColor} 
	            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 
	            transition-all cursor-pointer
	         `,
        navitemSideActive: `
	            group font-sans flex flex-col w-full
	            ${sizes[size2].sideItem} ${colors[color2].textColor} ${colors[color2].borderColor} 
	            hover:${colors[color2].highlightColor} 
	            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 
	            transition-all cursor-pointer
	          `,
        ...subMenuStyles[subMenuStyle],
        vars: {
          color: colors,
          size: sizes,
          subMenuStyle: subMenuStyles
        }
      };
    },
    topnav: (opts = {}) => {
      let { color: color2 = "white", size: size2 = "compact" } = opts, colors = {
        white: {
          contentBg: `bg-${highlight}`,
          accentColor: `${accent}-600`,
          accentBg: `hover:bg-${accent}-600`,
          borderColor: `border-${primary}-100`,
          textColor: `text-${primary}-600`,
          highlightColor: `text-${highlight}`
        },
        bright: {
          contentBg: `bg-${accent}-700`,
          accentColor: `${accent}-400`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${accent}-600`,
          textColor: `text-${highlight}`,
          highlightColor: `text-${highlight}`
        }
      }, sizes = {
        compact: {
          wrapper: "h-12",
          topItem: "flex items-center text-sm px-4 border-r h-12",
          icon: "mr-3 text-lg"
        },
        full: {
          wrapper: "h-16",
          topItem: "flex px-4 py-5 text-base font-light h-16",
          icon: "mr-4 -py-2 text-2xl"
        }
      };
      return {
        topnavWrapper: `w-full ${colors[color2].contentBg} ${sizes[size2].wrapper} `,
        topnavContent: "flex w-full h-full",
        topnavMenu: "hidden md:flex flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-sm",
        menuIconTop: `text-${colors[color2].accentColor} ${sizes[size2].icon} group-hover:${colors[color2].highlightColor}`,
        menuOpenIcon: "os-icon os-icon-menu",
        menuCloseIcon: "os-icon os-icon-x",
        navitemTop: `
				    group font-sans 
				    ${sizes[size2].topItem} ${colors[color2].textColor} ${colors[color2].borderColor} 
				    ${colors[color2].accentBg} hover:${colors[color2].highlightColor} 
				    focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 
				    transition cursor-pointer
				`,
        topmenuRightNavContainer: "hidden md:block h-full",
        navitemTopActive: `
					group font-sans
		    		${sizes[size2].topItem} ${colors[color2].textColor} ${colors[color2].borderColor} 
		    		${colors[color2].accentBg} hover:${colors[color2].highlightColor} 
		    		focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 
		    		transition cursor-pointer
		    	`,
        mobileButton: "md:hidden bg-white inline-flex items-center justify-center p-2  text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300",
        vars: {
          color: colors,
          size: sizes
        }
      };
    },
    select: (opts = {}) => {
      let { color: color2 = "white", size: size2 = "full", wrapStyle = "no-wrap" } = opts, colors = {
        white: "white",
        transparent: "gray-100"
      }, sizes = {
        mini: "px-0 py-0",
        compact: "px-0 py-1",
        full: "px-4 py-2"
      }, wrapStyles = {
        "no-wrap": "overflow-x-hidden",
        wrap: "whitespace-normal"
      };
      return {
        menuWrapper: `bg-${colors[color2]} my-1 text-sm`,
        menuItemActive: `px-2 py-2 cursor-not-allowed bg-${accent}-200 border-1 border-${colors[color2]} focus:border-${accent}-300`,
        menuItem: `px-2 py-2 cursor-pointer hover:bg-blue-100 border-1 border-${colors[color2]} focus:border-blue-300 flex-wrap`,
        valueItem: `max-w-full ${wrapStyles[wrapStyle]}`,
        itemText: "text-xl",
        select: `bg-${colors[color2]} w-full flex flex-1 flex-row justify-between truncate ${sizes[size2]} cursor-pointer border-2 border-${colors[color2]} focus:border-blue-300`,
        selectIcon: "self-center fa fa-angle-down text-gray-400 pt-2 px-2",
        vars: {
          color: colors,
          size: sizes,
          wrapStyle: wrapStyles
        }
      };
    },
    table: (opts = {}) => {
      let { color: color2 = "white", size: size2 = "compact" } = opts, colors = {
        white: "bg-white hover:bg-gray-100",
        gray: "bg-gray-100 hover:bg-gray-200",
        transparent: "gray-100"
      }, sizes = {
        compact: "px-4 py-1",
        full: "px-10 py-5"
      };
      return {
        tableHeader: `${sizes[size2]} pb-1 border-b-2 border-gray-300 bg-gray-200 text-left font-medium text-gray-700 uppercase first:rounded-tl-md last:rounded-tr-md`,
        tableInfoBar: "bg-white",
        tableRow: `${colors[color2]} transition ease-in-out duration-150`,
        tableRowStriped: "bg-gray-100 even:bg-gray-200 hover:bg-gray-300 transition ease-in-out duration-150",
        tableCell: `${sizes[size2]} whitespace-no-wrap`,
        inputSmall: "w-24",
        sortIconDown: "fas fa-sort-amount-down",
        sortIconUp: "fas fa-sort-amount-up",
        sortIconIdeal: "fas fa-sort-alt",
        vars: {
          color: colors,
          size: sizes
        }
      };
    },
    tabpanel: (opts = {}) => {
      let { tabLocation = "top" } = opts, tabLocations = {
        top: {
          tabpanelWrapper: "flex-col",
          tabWrapper: "flex-row",
          tab: "border-b-2"
        },
        left: {
          tabpanelWrapper: "flex-row",
          tabWrapper: "flex-col",
          tab: "border-r-2"
        }
      };
      return {
        tabpanelWrapper: `flex ${tabLocations[tabLocation].tabpanelWrapper} w-full h-full`,
        tabWrapper: `flex ${tabLocations[tabLocation].tabWrapper}`,
        tab: "px-4 py-2 hover:text-gray-800 cursor-pointer   text-center text-gray-500",
        tabActive: `px-4 py-2 text-${accent}-500 ${tabLocations[tabLocation].tab} border-blue-500 text-center`,
        icon: "",
        tabName: "",
        contentWrapper: "bg-white flex-1 h-full",
        vars: {
          tabLocation: tabLocations
        }
      };
    },
    button: (opts = {}) => {
      let { color: color2 = "white", size: size2 = "base", width = "block" } = opts, colors = {
        white: `
                    border border-gray-300  text-gray-700 bg-white hover:text-gray-500
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                    active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out
                    disabled:cursor-not-allowed
                `,
        transparent: `
                    border border-gray-300  text-gray-700 bg-white hover:text-gray-500
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                    active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out
                    disabled:cursor-not-allowed
                `,
        primary: "",
        danger: ""
      }, sizes = {
        base: "px-4 py-4 leading-5 font-medium",
        sm: "text-sm px-2 py-2 leading-5 font-medium",
        lg: "text-lg px-6 py-6 leading-5 font-medium",
        xl: "text-2xl px-12 py-8 leading-5 font-medium"
      }, widths = {
        block: "",
        full: "w-full"
      };
      return {
        button: `
                    inline-flex items-center justify-items-center text-center
                    ${colors[color2]} ${sizes[size2]} ${widths[width]}
                `,
        vars: {
          color: colors,
          size: sizes,
          width: widths
        }
      };
    },
    input: (opts = {}) => {
      let { color: color2 = "white", size: size2 = "small", width = "block" } = opts, colors = {
        white: "bg-white",
        gray: "bg-gray-100"
      }, sizes = {
        base: "px-4 py-4 font-medium",
        small: "text-sm px-2 py-2 font-medium text-xs",
        large: "text-lg px-6 py-6 font-medium text-xl"
      }, widths = {
        block: "",
        full: "w-full"
      };
      return {
        input: `
                 ${colors[color2]} ${sizes[size2]} ${widths[width]}
                `,
        vars: {
          color: colors,
          size: sizes,
          width: widths
        }
      };
    },
    modal: (opts = {}) => {
      let { size: size2 = "base", overlay = "default" } = opts, overlays = {
        default: "fixed  inset-0 bg-gray-500 opacity-75",
        none: ""
      }, sizes = {
        base: "sm:max-w-2xl",
        small: "w-64",
        large: "sm:max-w-4xl",
        xlarge: "sm:max-w-8xl"
      };
      return {
        modalContainer: `${overlay === "default" ? "" : "pointer-events-none"} fixed bottom-0 inset-x-0 px-4 pb-4 inset-0 flex items-center justify-center`,
        modalOverlay: overlays[overlay],
        modal: `${sizes[size2]}  pointer-events-auto bg-white rounded-lg overflow-hidden shadow-xl transform transition-all`,
        vars: {
          size: sizes,
          overlay: overlays
        }
      };
    },
    shadow: "shadow",
    ySpace: "py-thing",
    text: "text-gray-800",
    textContrast: "text-white",
    border: "broder-gray-400",
    textInfo: "text-blue-400",
    bgInfo: "bg-blue-400",
    borderInfo: "border-blue-400",
    textSuccess: "text-blue-400",
    bgSuccess: "bg-blue-400",
    borderSuccess: "border-blue-400",
    textDanger: "text-red-400",
    bgDanger: "bg-red-400",
    borderDanger: "border-red-400",
    textWarning: "text-yellow-400",
    bgWarning: "bg-yellow-400",
    borderWarning: "border-yellow-400",
    textLight: "text-gray-400",
    placeholder: "placeholder-gray-400",
    topMenuBorder: "border-b border-gray-200",
    topMenuScroll: "",
    headerShadow: "",
    navText: "text-gray-100",
    navMenu: "h-full relative",
    navMenuOpen: "bg-darkblue-500 text-white shadow-lg w-56 rounded-t-lg",
    navMenuBg: "bg-darkblue-500 bb-rounded-10 shadow-lg text-white rounded-b-lg",
    navMenuItem: "hover:font-medium cursor-pointer px-2 py-1 text-lg font-semibold",
    bg: "bg-gray-50",
    menuBg: "bg-white z-50",
    menuBgHover: "",
    menuBgActive: "bg-blue-200",
    menuBgActiveHover: "hover:bg-blue-300",
    menuText: "text-gray-100",
    menuTextHover: "hover:text-gray-700",
    menuTextActive: "text-blue-500",
    menuTextActiveHover: "hover:text-blue-700",
    headerBg: "bg-gray-200",
    headerBgHover: "hover:bg-gray-400",
    inputBg: "bg-white disabled:bg-gray-200 cursor-pointer focus:outline-none",
    inputBorder: "rounded border-0 border-transparent hover:border-gray-300 focus:border-gray-600 disabled:border-gray-200",
    inputBgDisabled: "bg-gray-200 cursor-not-allowed focus:outline-none",
    inputBorderDisabled: "rounded border-2 border-gray-200 hover:border-gray-200",
    inputBgFocus: "bg-white cursor-pointer focus:outline-none",
    inputBorderFocus: "rounded border-2 border-transparent hover:border-gray-600 focus:border-gray-600 border-gray-600",
    textBase: "text-base",
    textSmall: "text-sm",
    textLarge: "text-lg",
    paddingBase: "py-1 px-2",
    paddingSmall: "py-0 px-1",
    paddingLarge: "py-2 px-4",
    contentBg: "bg-white",
    accent1: "bg-blue-100",
    accent2: "bg-gray-300",
    accent3: "bg-gray-400",
    accent4: "bg-gray-500",
    highlight1: "bg-blue-200",
    highlight2: "bg-blue-300",
    highlight3: "bg-blue-400",
    highlight4: "bg-blue-500",
    width: "",
    transition: "transition ease-in-out duration-150"
  };
}, avl_design_default = avl_design;

// app/modules/avl-components/src/Themes/index.js
var flat_base = {
  bg: "custom-bg",
  ySpace: "py-4",
  contentPadding: "py-4",
  menuBg: "custom-bg",
  contentWidth: "",
  text: "text-blue-800",
  sidebarW: "64",
  sidebarBorder: "",
  menuIcon: "mr-3 h-5 w-5",
  navitemTop: "mr-4 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out",
  navitemTopActive: "mr-4 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out",
  navitemSide: "mb-1 group flex pl-3 pr-4 py-2 border-l-4 border-transparent text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out",
  navitemSideActive: "mb-1 group flex pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-sm font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out",
  headerBg: "custom-bg",
  headerShadow: "",
  contentBg: "",
  accent1: "bg-gray-200",
  accent2: "bg-gray-300",
  accent3: "bg-gray-400",
  accent4: "bg-gray-500",
  lighter: "bg-gray-50",
  button: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out",
  buttonPrimary: "inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out",
  textbutton: "text-sm text-blue-500 hover:text-blue-300 px-2",
  input: "block",
  tableRow: "bg-white border-b border-blue-100 hover:bg-blue-50",
  tableRowStriped: "bg-white even:bg-gray-50",
  tableCell: "px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-600",
  tableCellCondensed: "px-3 py-2 whitespace-no-wrap text-sm leading-5 text-gray-600",
  tableHeader: "px-6 pt-2 pb-1	border-b border-gray-400 bg-gray-200 text-left font-medium text-gray-700 uppercase first:rounded-tl-md last:rounded-tr-md"
}, flat = makeProxy(flat_base), dark_base = {
  bg: "bg-gray-300",
  menuBg: "bg-gray-800",
  sidebarW: "56",
  sidebarBorder: "",
  shadow: "",
  ySpace: "py-5",
  contentPadding: "py-5",
  text: "text-gray-300",
  contentWidth: "max-w-7xl mx-auto",
  menuIcon: "mr-3 h-4 w-4",
  navitemTop: "ml-3 my-3 px-3 py-1 inline-flex items-center rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700",
  navitemTopActive: "ml-3 my-3 px-3 py-1 inline-flex items-center rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700",
  navitemSide: "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150",
  navitemSideActive: "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md bg-gray-900 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150",
  headerBg: "bg-gray-800",
  headerShadow: "shadow",
  contentBg: "bg-gray-100",
  accent1: "bg-gray-600",
  accent2: "bg-gray-500",
  accent3: "bg-gray-400",
  lighter: "bg-gray-700",
  button: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out",
  buttonPrimary: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out",
  textbutton: "text-sm text-blue-500 hover:text-blue-300 px-2",
  tableRow: "bg-white border-b border-gray-200",
  tableRowStriped: "bg-white even:bg-gray-50"
}, dark = makeProxy(dark_base), blue_base = {
  bg: "bg-gray-200",
  menuBg: "bg-indigo-800",
  sidebarW: "56",
  sidebarBorder: "",
  shadow: "shadow",
  ySpace: "py-5",
  contentPadding: "py-5",
  text: "text-gray-300",
  contentWidth: "max-w-7xl mx-auto",
  menuIcon: "mr-3 h-4 w-4",
  navitemTop: "ml-3 my-3 px-3 py-1 inline-flex items-center rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700",
  navitemTopActive: "ml-3 my-3 px-3 py-1 inline-flex items-center rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700",
  navitemSide: "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150",
  navitemSideActive: "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md bg-gray-900 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150",
  headerBg: "bg-gray-800",
  headerShadow: "shadow",
  contentBg: "bg-gray-100",
  accent1: "bg-gray-200",
  accent2: "bg-gray-300",
  accent3: "bg-gray-400",
  light: "bg-gray-50",
  button: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out",
  buttonPrimary: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out",
  tableRow: "bg-white border-b border-gray-200",
  tableRowStriped: "bg-white even:bg-gray-50"
}, blue = makeProxy(blue_base), light_base = {
  shadow: "shadow",
  ySpace: "py-4",
  contentPadding: "py-4",
  sidebarBorder: "",
  text: "text-gray-800",
  textContrast: "text-white",
  border: "border-gray-400",
  textInfo: "text-teal-400",
  bgInfo: "bg-teal-400",
  borderInfo: "border-teal-400",
  textSuccess: "text-green-400",
  bgSuccess: "bg-green-400",
  borderSuccess: "border-green-400",
  textPrimary: "text-blue-400",
  bgPrimary: "bg-blue-400",
  borderPrimary: "border-blue-400",
  textDanger: "text-red-400",
  bgDanger: "bg-red-400",
  borderDanger: "border-red-400",
  textWarning: "text-yellow-400",
  bgWarning: "bg-yellow-400",
  borderWarning: "border-yellow-400",
  textLight: "text-gray-400",
  placeholder: "placeholder-gray-400",
  borderLight: "border-gray-400",
  bgLight: "bg-gray-400",
  menuIcon: "mr-3 h-6 w-6",
  topMenuBorder: "border-b border-gray-200",
  headerShadow: "",
  navitemTop: "mr-4 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out",
  navitemTopActive: "mr-4 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium leading-5 text-gray-900 bg-indigo-100 focus:outline-none hover:bg-indigo-200 focus:border-indigo-700 transition duration-150 ease-in-out",
  navitemSide: "mb-1 group flex pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-300 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out",
  navitemSideActive: "mb-1 group flex pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-600 bg-indigo-100 focus:outline-none hover:text-indigo-800 focus:text-indigo-800 hover:bg-indigo-200 focus:bg-indigo-200 focus:border-indigo-700 transition duration-150 ease-in-out",
  bg: "bg-gray-100",
  mobileButton: "md:hidden bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300",
  menuBg: "bg-gray-200",
  menuBgHover: "hover:bg-gray-300",
  menuBgActive: "bg-teal-200",
  menuBgActiveHover: "hover:bg-teal-300",
  menuText: "text-gray-500",
  menuTextHover: "hover:text-gray-700",
  menuTextActive: "text-teal-500",
  menuTextActiveHover: "hover:text-teal-700",
  topnavWrapper: "w-full bg-gray-100",
  topnavContent: "flex w-full ",
  topnavMenu: "hidden md:flex flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-sm",
  sidenavWrapper: "bg-gray-100 w-56 border-r border-gray-200 h-screen pt-16 z-50",
  headerBg: "bg-gray-200",
  headerBgHover: "hover:bg-gray-400",
  inputBg: "bg-white disabled:bg-gray-200 cursor-pointer focus:outline-none",
  inputBorder: "rounded border border-transparent hover:border-gray-300 focus:border-gray-600 disabled:border-gray-200",
  inputBgDisabled: "bg-gray-200 cursor-not-allowed focus:outline-none",
  inputBorderDisabled: "rounded border border-gray-200 hover:border-gray-200",
  inputBgFocus: "bg-white cursor-pointer focus:outline-none",
  inputBorderFocus: "rounded border border-transparent hover:border-gray-600 focus:border-gray-600 border-gray-600",
  textBase: "text-base",
  textSmall: "text-sm",
  textLarge: "text-lg",
  paddingBase: "py-1 px-2",
  paddingSmall: "py-0 px-1",
  paddingLarge: "py-2 px-4",
  contentBg: "bg-white",
  contentWidth: "max-w-7xl mx-auto",
  accent1: "bg-gray-200",
  accent2: "bg-gray-300",
  accent3: "bg-gray-400",
  accent4: "bg-gray-500",
  highlight1: "bg-teal-200",
  highlight2: "bg-teal-300",
  highlight3: "bg-teal-400",
  highlight4: "bg-teal-500",
  sidebarW: "56",
  transition: "transition ease-in-out duration-150",
  button: `
		inline-flex items-center
		px-4 py-2 border border-gray-300
		text-sm leading-5 font-medium
		rounded-md text-gray-700 bg-white
		hover:text-gray-500
		focus:outline-none focus:shadow-outline-blue focus:border-blue-300
		active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out
		disabled:cursor-not-allowed`,
  buttonPrimary: "inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out disabled:cursor-not-allowed",
  tableRow: "bg-gray-100 hover:bg-gray-200 transition ease-in-out duration-150",
  tableRowStriped: "bg-gray-100 even:bg-gray-200 hover:bg-gray-300 transition ease-in-out duration-150",
  tableCell: "px-4 py-1 whitespace-no-wrap",
  tableHeader: "px-4 py-2 pb-1 border-b-2 border-gray-300 bg-gray-200 text-left font-medium text-gray-700 uppercase first:rounded-tl-md last:rounded-tr-md"
}, light = makeProxy(light_base), TEST_THEME_BASE = {
  text: "text-gray-800",
  textContrast: "text-white",
  border: "border-gray-400",
  ySpace: "",
  textInfo: "text-teal-400",
  bgInfo: "bg-teal-400",
  borderInfo: "border-teal-400",
  textSuccess: "text-green-400",
  bgSuccess: "bg-green-400",
  borderSuccess: "border-green-400",
  textPrimary: "text-blue-400",
  bgPrimary: "bg-blue-400",
  borderPrimary: "border-blue-400",
  textDanger: "text-red-400",
  bgDanger: "bg-red-400",
  borderDanger: "border-red-400",
  textWarning: "text-yellow-400",
  bgWarning: "bg-yellow-400",
  borderWarning: "border-yellow-400",
  textLight: "text-gray-400",
  placeholder: "placeholder-gray-400",
  menuIcon: "mr-3 h-6 w-6",
  topMenuBorder: "border-b border-gray-200",
  headerShadow: "",
  bg: "bg-gray-100",
  menuBg: "bg-gray-200",
  menuBgHover: "hover:bg-gray-300",
  menuBgActive: "bg-teal-200",
  menuBgActiveHover: "hover:bg-teal-300",
  menuText: "text-gray-500",
  menuTextHover: "hover:text-gray-700",
  menuTextActive: "text-teal-500",
  menuTextActiveHover: "hover:text-teal-700",
  menuOpenIcon: "fas fa-bars",
  menuCloseIcon: "fas fa-times",
  topnavWrapper: "w-full bg-gray-200 h-16",
  topnavContent: "flex w-full max-w-7xl mx-auto h-full",
  topnavMenu: "hidden md:flex flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-sm",
  sidenavWrapper: "bg-gray-200 w-56 border-r border-gray-200 h-screen pt-16 z-50",
  topmenuRightNavContainer: "h-full",
  mobileButton: "md:hidden bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300",
  sidebarBg: "bg-gray-200",
  sidebarBorder: "",
  sidebarW: "56",
  headerBg: "bg-gray-200",
  headerBgHover: "hover:bg-gray-400",
  inputBg: "bg-white disabled:bg-gray-200 cursor-pointer focus:outline-none",
  inputBorder: "rounded border border-transparent hover:border-gray-300 focus:border-gray-600 disabled:border-gray-200",
  inputBgDisabled: "bg-gray-200 cursor-not-allowed focus:outline-none",
  inputBorderDisabled: "rounded border border-gray-200 hover:border-gray-200",
  inputBgFocus: "bg-white cursor-pointer focus:outline-none",
  inputBorderFocus: "rounded border border-transparent hover:border-gray-600 focus:border-gray-600 border-gray-600",
  booleanInputSlider: "bg-gray-300",
  textBase: "text-base",
  textSmall: "text-sm",
  textLarge: "text-lg",
  paddingBase: "py-1 px-2",
  paddingSmall: "py-0 px-1",
  paddingLarge: "py-2 px-4",
  accent1: "bg-gray-200",
  accent2: "bg-gray-300",
  accent3: "bg-gray-400",
  accent4: "bg-gray-500",
  highlight1: "bg-teal-200",
  highlight2: "bg-teal-300",
  highlight3: "bg-teal-400",
  highlight4: "bg-teal-500",
  contentBg: "bg-white",
  contentWidth: "w-full max-w-7xl mx-auto",
  contentPadding: "py-4",
  transition: "transition ease-in-out duration-150",
  tableInfoBar: "bg-white",
  tableRow: "bg-white hover:bg-gray-200 @transition",
  tableRowStriped: "bg-white even:bg-gray-100 hover:bg-gray-200 @transition",
  tableCell: "px-4 py-1 whitespace-no-wrap",
  tableHeader: "px-4 py-2 pb-1 border-b-2 border-gray-300 bg-gray-200 text-left font-medium text-gray-700 uppercase first:rounded-tl-md last:rounded-tr-md",
  $compositions
}, TEST_THEME = composeTheme(TEST_THEME_BASE), AVL_THEME = avl_design_default("white", "compact");

// app/modules/avl-components/src/wrappers/with-theme.js
var import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), ThemeContext = import_react2.default.createContext(light), useTheme = () => (0, import_react2.useContext)(ThemeContext), with_theme_default = (Component) => ({ ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ThemeContext.Consumer, { children: (theme) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Component, { ...props, theme }, void 0, !1, {
  fileName: "app/modules/avl-components/src/wrappers/with-theme.js",
  lineNumber: 12,
  columnNumber: 18
}, this) }, void 0, !1, {
  fileName: "app/modules/avl-components/src/wrappers/with-theme.js",
  lineNumber: 11,
  columnNumber: 5
}, this);

// app/modules/avl-components/src/wrappers/share-props.js
var import_react3 = __toESM(require("react")), import_lodash = __toESM(require("lodash.get")), import_jsx_dev_runtime3 = require("react/jsx-dev-runtime"), share_props_default = (Component, options = {}) => {
  let {
    propsToShare = {}
  } = options;
  return ({ children: children2, ...props }) => {
    let toShare = {};
    if (typeof propsToShare == "string") {
      let split = propsToShare.split(".");
      toShare[split.pop()] = (0, import_lodash.default)(props, propsToShare, propsToShare);
    } else if (Array.isArray(propsToShare))
      propsToShare.forEach((prop) => {
        let split = prop.split(".");
        toShare[split.pop()] = (0, import_lodash.default)(props, prop, prop);
      });
    else
      for (let prop in propsToShare)
        toShare[prop] = (0, import_lodash.default)(props, propsToShare[prop], propsToShare[prop]);
    return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Component, { ...props, children: import_react3.default.Children.map(children2, (child) => import_react3.default.cloneElement(child, toShare)) }, void 0, !1, {
      fileName: "app/modules/avl-components/src/wrappers/share-props.js",
      lineNumber: 27,
      columnNumber: 7
    }, this);
  };
};

// app/modules/avl-components/src/wrappers/index.js
var Wrappers = {
  "with-theme": with_theme_default,
  "share-props": share_props_default
};

// app/modules/avl-components/src/ComponentFactory.js
var import_lodash2 = __toESM(require("lodash.get")), import_jsx_dev_runtime4 = require("react/jsx-dev-runtime"), ComponentLibrary2 = {
  ...ComponentLibrary_default
}, WrapperLibrary = {
  ...Wrappers
};

// app/modules/avl-components/src/components/index.js
var import_react32 = require("react");

// app/modules/avl-components/src/components/Nav/Menu.js
var import_react7 = __toESM(require("react")), import_react_router_dom = require("react-router-dom");

// app/modules/avl-components/src/components/utils/index.js
var import_react6 = __toESM(require("react"));

// app/modules/avl-components/src/components/utils/color-ranges.js
var import_react5 = require("react");

// app/modules/avl-components/src/components/utils/colorbrewer.js
var colorbrewer_default = {
  schemeGroups: {
    sequential: ["BuGn", "BuPu", "GnBu", "OrRd", "PuBu", "PuBuGn", "PuRd", "RdPu", "YlGn", "YlGnBu", "YlOrBr", "YlOrRd"],
    singlehue: ["Blues", "Greens", "Greys", "Oranges", "Purples", "Reds"],
    diverging: ["BrBG", "PiYG", "PRGn", "PuOr", "RdBu", "RdGy", "RdYlBu", "RdYlGn", "Spectral"],
    qualitative: ["Accent", "Dark2", "Paired", "Pastel1", "Pastel2", "Set1", "Set2", "Set3"]
  },
  YlGn: {
    3: ["#f7fcb9", "#addd8e", "#31a354"],
    4: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
    5: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
    6: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
    7: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
    8: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
    9: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"]
  },
  YlGnBu: {
    3: ["#edf8b1", "#7fcdbb", "#2c7fb8"],
    4: ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"],
    5: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
    6: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
    7: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    8: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    9: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
  },
  GnBu: {
    3: ["#e0f3db", "#a8ddb5", "#43a2ca"],
    4: ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"],
    5: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
    6: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"],
    7: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
    8: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
    9: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
  },
  BuGn: {
    3: ["#e5f5f9", "#99d8c9", "#2ca25f"],
    4: ["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"],
    5: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
    6: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"],
    7: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
    8: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
    9: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"]
  },
  PuBuGn: {
    3: ["#ece2f0", "#a6bddb", "#1c9099"],
    4: ["#f6eff7", "#bdc9e1", "#67a9cf", "#02818a"],
    5: ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
    6: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
    7: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
    8: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
    9: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"]
  },
  PuBu: {
    3: ["#ece7f2", "#a6bddb", "#2b8cbe"],
    4: ["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"],
    5: ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
    6: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d"],
    7: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
    8: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
    9: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]
  },
  BuPu: {
    3: ["#e0ecf4", "#9ebcda", "#8856a7"],
    4: ["#edf8fb", "#b3cde3", "#8c96c6", "#88419d"],
    5: ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
    6: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c"],
    7: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
    8: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
    9: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]
  },
  RdPu: {
    3: ["#fde0dd", "#fa9fb5", "#c51b8a"],
    4: ["#feebe2", "#fbb4b9", "#f768a1", "#ae017e"],
    5: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
    6: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
    7: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
    8: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
    9: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"]
  },
  PuRd: {
    3: ["#e7e1ef", "#c994c7", "#dd1c77"],
    4: ["#f1eef6", "#d7b5d8", "#df65b0", "#ce1256"],
    5: ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
    6: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043"],
    7: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
    8: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
    9: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]
  },
  OrRd: {
    3: ["#fee8c8", "#fdbb84", "#e34a33"],
    4: ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
    5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
    6: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
    7: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
    8: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
    9: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]
  },
  YlOrRd: {
    3: ["#ffeda0", "#feb24c", "#f03b20"],
    4: ["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"],
    5: ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
    6: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
    7: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
    8: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
    9: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]
  },
  YlOrBr: {
    3: ["#fff7bc", "#fec44f", "#d95f0e"],
    4: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
    5: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
    6: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
    7: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
    8: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
    9: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
  },
  Purples: {
    3: ["#efedf5", "#bcbddc", "#756bb1"],
    4: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"],
    5: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
    6: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
    7: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
    8: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
    9: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"]
  },
  Blues: {
    3: ["#deebf7", "#9ecae1", "#3182bd"],
    4: ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
    5: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
    6: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
    7: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
    8: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
    9: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
  },
  Greens: {
    3: ["#e5f5e0", "#a1d99b", "#31a354"],
    4: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
    5: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
    6: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
    7: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
    8: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
    9: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]
  },
  Oranges: {
    3: ["#fee6ce", "#fdae6b", "#e6550d"],
    4: ["#feedde", "#fdbe85", "#fd8d3c", "#d94701"],
    5: ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
    6: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
    7: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
    8: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
    9: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"]
  },
  Reds: {
    3: ["#fee0d2", "#fc9272", "#de2d26"],
    4: ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
    5: ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
    6: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
    7: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
    8: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
    9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
  },
  Greys: {
    3: ["#f0f0f0", "#bdbdbd", "#636363"],
    4: ["#f7f7f7", "#cccccc", "#969696", "#525252"],
    5: ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
    6: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
    7: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    8: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    9: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"]
  },
  PuOr: {
    3: ["#f1a340", "#f7f7f7", "#998ec3"],
    4: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
    5: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
    6: ["#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788"],
    7: ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
    8: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
    9: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
    10: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
    11: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"]
  },
  BrBG: {
    3: ["#d8b365", "#f5f5f5", "#5ab4ac"],
    4: ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
    5: ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
    6: ["#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e"],
    7: ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
    8: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
    9: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
    10: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
    11: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]
  },
  PRGn: {
    3: ["#af8dc3", "#f7f7f7", "#7fbf7b"],
    4: ["#7b3294", "#c2a5cf", "#a6dba0", "#008837"],
    5: ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
    6: ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"],
    7: ["#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837"],
    8: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
    9: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
    10: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
    11: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"]
  },
  PiYG: {
    3: ["#e9a3c9", "#f7f7f7", "#a1d76a"],
    4: ["#d01c8b", "#f1b6da", "#b8e186", "#4dac26"],
    5: ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
    6: ["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"],
    7: ["#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221"],
    8: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
    9: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
    10: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
    11: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"]
  },
  RdBu: {
    3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
    4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
    5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
    7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
    8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
    9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
    10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
    11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
  },
  RdGy: {
    3: ["#ef8a62", "#ffffff", "#999999"],
    4: ["#ca0020", "#f4a582", "#bababa", "#404040"],
    5: ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d"],
    7: ["#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d"],
    8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
    9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
    10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
    11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"]
  },
  RdYlBu: {
    3: ["#fc8d59", "#ffffbf", "#91bfdb"],
    4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
    6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
    7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
    8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
    11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
  },
  Spectral: {
    3: ["#fc8d59", "#ffffbf", "#99d594"],
    4: ["#d7191c", "#fdae61", "#abdda4", "#2b83ba"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],
    6: ["#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd"],
    7: ["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
    8: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
    9: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
    10: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
    11: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"]
  },
  RdYlGn: {
    3: ["#fc8d59", "#ffffbf", "#91cf60"],
    4: ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
    6: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"],
    7: ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"],
    8: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
    9: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
    10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
    11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]
  },
  Accent: {
    3: ["#7fc97f", "#beaed4", "#fdc086"],
    4: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99"],
    5: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0"],
    6: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f"],
    7: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17"],
    8: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]
  },
  Dark2: {
    3: ["#1b9e77", "#d95f02", "#7570b3"],
    4: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
    5: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"],
    6: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
    7: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
    8: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]
  },
  Paired: {
    3: ["#a6cee3", "#1f78b4", "#b2df8a"],
    4: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"],
    5: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
    6: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"],
    7: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"],
    8: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00"],
    9: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6"],
    10: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"],
    11: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99"],
    12: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]
  },
  Pastel1: {
    3: ["#fbb4ae", "#b3cde3", "#ccebc5"],
    4: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"],
    5: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"],
    6: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc"],
    7: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"],
    8: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec"],
    9: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
  },
  Pastel2: {
    3: ["#b3e2cd", "#fdcdac", "#cbd5e8"],
    4: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4"],
    5: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
    6: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae"],
    7: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc"],
    8: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"]
  },
  Set1: {
    3: ["#e41a1c", "#377eb8", "#4daf4a"],
    4: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"],
    5: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
    6: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
    7: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"],
    8: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
    9: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]
  },
  Set2: {
    3: ["#66c2a5", "#fc8d62", "#8da0cb"],
    4: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
    5: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"],
    6: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"],
    7: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
    8: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]
  },
  Set3: {
    3: ["#8dd3c7", "#ffffb3", "#bebada"],
    4: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072"],
    5: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"],
    6: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"],
    7: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"],
    8: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"],
    9: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9"],
    10: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
    11: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5"],
    12: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
  }
};

// app/modules/avl-components/src/components/utils/color-ranges.js
var import_lodash3 = __toESM(require("lodash.get")), import_jsx_dev_runtime5 = require("react/jsx-dev-runtime"), ColorRanges = {};
for (let type in colorbrewer_default.schemeGroups)
  colorbrewer_default.schemeGroups[type].forEach((name) => {
    let group = colorbrewer_default[name];
    for (let length in group)
      length in ColorRanges || (ColorRanges[length] = []), ColorRanges[length].push({
        type: `${type[0].toUpperCase()}${type.slice(1)}`,
        name,
        category: "Colorbrewer",
        colors: group[length]
      });
  });
var getColorRange = (size, name, reverse = !1) => {
  let range2 = (0, import_lodash3.default)(ColorRanges, [size], []).reduce((a, c) => c.name === name ? c.colors : a, []).slice();
  return reverse && range2.reverse(), range2;
};

// app/modules/avl-components/src/components/utils/index.js
var composeOptions = ({ ...options }) => Object.keys(options).reduce((a, c) => (options[c] && a.push(c.split("").map((c2, i) => i === 0 ? c2.toUpperCase() : c2).join("")), a), []).join(""), useSetRefs = (...refs) => import_react6.default.useCallback((node) => {
  [...refs].forEach((ref) => {
    !ref || (typeof ref == "function" ? ref(node) : ref.current = node);
  });
}, [refs]), useClickOutside = (handleClick) => {
  let [node, setNode] = (0, import_react6.useState)(null);
  return (0, import_react6.useEffect)(() => {
    let checkOutside = (e) => {
      node.contains(e.target) || typeof handleClick == "function" && handleClick(e);
    };
    return node && document.addEventListener("mousedown", checkOutside), () => document.removeEventListener("mousedown", checkOutside);
  }, [node, handleClick]), [setNode, node];
}, getRect = (ref) => {
  let node = ref && ref.current;
  return node ? node.getBoundingClientRect() : { width: 0, height: 0 };
}, useSetSize = (ref, callback) => {
  let [size, setSize] = import_react6.default.useState({ width: 0, height: 0, x: 0, y: 0 }), doSetSize = import_react6.default.useCallback(() => {
    let rect = getRect(ref), { width, height, x, y } = rect;
    (width !== size.width || height !== size.height) && (typeof callback == "function" && callback({ width, height, x, y }), setSize({ width, height, x, y }));
  }, [ref, size, callback]);
  return import_react6.default.useEffect(() => (window.addEventListener("resize", doSetSize), () => {
    window.removeEventListener("resize", doSetSize);
  }), [doSetSize]), import_react6.default.useEffect(() => {
    doSetSize();
  }), size;
};

// app/modules/avl-components/src/components/Nav/Menu.js
var import_jsx_dev_runtime6 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Nav/Item.js
var import_react9 = __toESM(require("react")), import_react_router_dom2 = require("react-router-dom");

// app/modules/avl-components/src/components/Icons/index.js
var import_react8 = require("react"), import_jsx_dev_runtime7 = require("react/jsx-dev-runtime"), Icons_default = ({ icon, className }) => /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: `${className} flex justify-center items-center`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { className: icon }, void 0, !1, {
  fileName: "app/modules/avl-components/src/components/Icons/index.js",
  lineNumber: 5,
  columnNumber: 5
}, this) }, void 0, !1, {
  fileName: "app/modules/avl-components/src/components/Icons/index.js",
  lineNumber: 4,
  columnNumber: 3
}, this);

// app/modules/avl-components/src/components/Nav/Item.js
var import_jsx_dev_runtime8 = require("react/jsx-dev-runtime"), NavItem = ({
  children: children2,
  icon,
  to,
  onClick,
  className = null,
  type = "side",
  active = !1,
  subMenus = [],
  themeOptions,
  subMenuActivate = "onClick",
  subMenuOpen = !1
}) => {
  let theme = useTheme()[type === "side" ? "sidenav" : "topnav"](themeOptions), navigate = (0, import_react_router_dom2.useNavigate)(), To = import_react9.default.useMemo(() => Array.isArray(to) ? to : [to], [to]), subTos = import_react9.default.useMemo(() => {
    let subs = subMenus.reduce((a, c) => (Array.isArray(c.path) ? a.push(...c.path) : c.path && a.push(c.path), a), []);
    return [...To, ...subs];
  }, [To, subMenus]), routeMatch = Boolean((0, import_react_router_dom2.useMatch)({ path: subTos[0] })), linkClasses = type === "side" ? theme.navitemSide : theme.navitemTop, activeClasses = type === "side" ? theme.navitemSideActive : theme.navitemTopActive, navClass = routeMatch || active ? activeClasses : linkClasses, [showSubMenu, setShowSubMenu] = import_react9.default.useState(subMenuOpen || routeMatch);
  return (0, import_react9.useEffect)(() => {
    let localStorageToggled = localStorage.getItem(`${to}_toggled`);
    localStorageToggled ? setShowSubMenu(!!(localStorageToggled === "true" || routeMatch)) : localStorage.setItem(`${to}_toggled`, `${showSubMenu}`);
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: type === "side" ? theme.subMenuParentWrapper : null, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
      "div",
      {
        className: `${className || navClass}`,
        onClick: () => {
          if (onClick)
            return onClick;
          To[0] && navigate(To[0]);
        },
        onMouseLeave: () => subMenuActivate === "onHover" ? setShowSubMenu(!1) : "",
        onMouseOver: () => subMenuActivate === "onHover" ? setShowSubMenu(!0) : "",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "flex-1 flex", children: [
            icon ? /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
              Icons_default,
              {
                icon,
                className: type === "side" ? theme.menuIconSide : theme.menuIconTop
              },
              void 0,
              !1,
              {
                fileName: "app/modules/avl-components/src/components/Nav/Item.js",
                lineNumber: 87,
                columnNumber: 8
              },
              this
            ) : null,
            /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: theme.navItemContent, children: children2 }, void 0, !1, {
              fileName: "app/modules/avl-components/src/components/Nav/Item.js",
              lineNumber: 92,
              columnNumber: 7
            }, this)
          ] }, void 0, !0, {
            fileName: "app/modules/avl-components/src/components/Nav/Item.js",
            lineNumber: 85,
            columnNumber: 6
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
            "div",
            {
              onClick: () => {
                subMenuActivate === "onClick" && (localStorage.setItem(`${to}_toggled`, `${!showSubMenu}`), setShowSubMenu(!showSubMenu));
              },
              children: subMenus.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
                Icons_default,
                {
                  icon: showSubMenu ? theme.indicatorIconOpen : theme.indicatorIcon
                },
                void 0,
                !1,
                {
                  fileName: "app/modules/avl-components/src/components/Nav/Item.js",
                  lineNumber: 106,
                  columnNumber: 8
                },
                this
              ) : null
            },
            void 0,
            !1,
            {
              fileName: "app/modules/avl-components/src/components/Nav/Item.js",
              lineNumber: 96,
              columnNumber: 6
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/modules/avl-components/src/components/Nav/Item.js",
          lineNumber: 84,
          columnNumber: 5
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Nav/Item.js",
        lineNumber: 73,
        columnNumber: 4
      },
      this
    ),
    subMenus.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
      SubMenu,
      {
        showSubMenu,
        subMenus,
        type,
        themeOptions,
        className
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Nav/Item.js",
        lineNumber: 115,
        columnNumber: 5
      },
      this
    ) : ""
  ] }, void 0, !0, {
    fileName: "app/modules/avl-components/src/components/Nav/Item.js",
    lineNumber: 72,
    columnNumber: 3
  }, this);
}, Item_default = NavItem, SubMenu = ({ showSubMenu, subMenus, type, themeOptions }) => {
  let theme = useTheme()[type === "side" ? "sidenav" : "topnav"](themeOptions);
  return !showSubMenu || !subMenus.length ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
    "div",
    {
      className: type === "side" ? theme.subMenuWrapper : theme.subMenuWrapperTop,
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        "div",
        {
          className: `${theme.contentBg}
					flex
					${type === "side" ? "flex-col" : "flex-row"}
				`,
          children: subMenus.map((sm, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
            NavItem,
            {
              to: sm.path,
              icon: sm.icon,
              type,
              className: sm.className,
              onClick: sm.onClick,
              themeOptions,
              subMenus: sm.subMenus,
              children: sm.name
            },
            i,
            !1,
            {
              fileName: "app/modules/avl-components/src/components/Nav/Item.js",
              lineNumber: 146,
              columnNumber: 6
            },
            this
          ))
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-components/src/components/Nav/Item.js",
          lineNumber: 139,
          columnNumber: 4
        },
        this
      )
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Nav/Item.js",
      lineNumber: 135,
      columnNumber: 3
    },
    this
  );
};

// app/modules/avl-components/src/components/Dropdown/index.js
var import_react10 = __toESM(require("react"));
var import_jsx_dev_runtime9 = require("react/jsx-dev-runtime"), Dropdown = ({ control, children: children2, className, openType = "hover" }) => {
  let [open, setOpen] = import_react10.default.useState(!1), clickedOutside = import_react10.default.useCallback(() => setOpen(!1), []), [setRef] = useClickOutside(clickedOutside);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
    "div",
    {
      ref: setRef,
      className: `h-full relative cursor-pointer ${className}`,
      onMouseEnter: (e) => {
        openType === "hover" && setOpen(!0);
      },
      onMouseLeave: (e) => setOpen(!1),
      onClick: (e) => {
        setOpen(!open);
      },
      children: [
        control,
        open ? /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `shadow fixed w-full max-w-[193px] rounded-b-lg ${open ? "block" : "hidden"} z-10`, children: children2 }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Dropdown/index.js",
          lineNumber: 27,
          columnNumber: 17
        }, this) : ""
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/avl-components/src/components/Dropdown/index.js",
      lineNumber: 12,
      columnNumber: 9
    },
    this
  );
}, Dropdown_default = Dropdown;

// app/modules/avl-components/src/components/Menu/FlyoutMenu.js
var import_react11 = require("react"), import_jsx_dev_runtime10 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Nav/Side.js
var import_react13 = require("react"), import_react_router_dom3 = require("react-router-dom"), import_lodash5 = __toESM(require("lodash.get"));

// app/modules/avl-components/src/components/Nav/Top.js
var import_react12 = require("react"), import_lodash4 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime11 = require("react/jsx-dev-runtime"), MobileMenu = ({ open, toggle, menuItems = [], rightMenu = null, themeOptions = {} }) => {
  let theme = useTheme().topnav(themeOptions);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
    "div",
    {
      className: `${open ? "md:hidden" : "hidden"} ${theme.topnavMobileContainer}`,
      id: "mobile-menu",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "", children: menuItems.map((page2, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
          Item_default,
          {
            type: "top",
            to: page2.path,
            icon: page2.icon,
            themeOptions,
            subMenus: (0, import_lodash4.default)(page2, "subMenus", []),
            children: page2.name
          },
          i,
          !1,
          {
            fileName: "app/modules/avl-components/src/components/Nav/Top.js",
            lineNumber: 20,
            columnNumber: 11
          },
          this
        )) }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Nav/Top.js",
          lineNumber: 18,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "", children: rightMenu }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Nav/Top.js",
          lineNumber: 32,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/avl-components/src/components/Nav/Top.js",
      lineNumber: 12,
      columnNumber: 5
    },
    this
  );
}, DesktopMenu = ({
  open,
  toggle,
  menuItems = [],
  rightMenu = null,
  leftMenu = null,
  themeOptions = {}
}) => {
  let theme = useTheme().topnav(themeOptions);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: `${theme.topnavWrapper}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: `${theme.topnavContent} justify-between`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { children: leftMenu }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/Nav/Top.js",
      lineNumber: 49,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: `${theme.topnavMenu}`, children: menuItems.map((page2, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
      Item_default,
      {
        type: "top",
        to: page2.path,
        icon: page2.icon,
        themeOptions,
        subMenus: (0, import_lodash4.default)(page2, "subMenus", []),
        children: page2.name
      },
      i,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Nav/Top.js",
        lineNumber: 52,
        columnNumber: 13
      },
      this
    )) }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/Nav/Top.js",
      lineNumber: 50,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex items-center justify-center h-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: `${theme.topmenuRightNavContainer}`, children: rightMenu }, void 0, !1, {
        fileName: "app/modules/avl-components/src/components/Nav/Top.js",
        lineNumber: 66,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
        "button",
        {
          type: "button",
          className: `${theme.mobileButton} border-2`,
          onClick: () => toggle(!open),
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("span", { className: "sr-only", children: "Open main menu" }, void 0, !1, {
              fileName: "app/modules/avl-components/src/components/Nav/Top.js",
              lineNumber: 74,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex justify-center items-center text-2xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
              "span",
              {
                className: open ? theme.menuCloseIcon : theme.menuOpenIcon
              },
              void 0,
              !1,
              {
                fileName: "app/modules/avl-components/src/components/Nav/Top.js",
                lineNumber: 76,
                columnNumber: 15
              },
              this
            ) }, void 0, !1, {
              fileName: "app/modules/avl-components/src/components/Nav/Top.js",
              lineNumber: 75,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/modules/avl-components/src/components/Nav/Top.js",
          lineNumber: 69,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/modules/avl-components/src/components/Nav/Top.js",
      lineNumber: 65,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/avl-components/src/components/Nav/Top.js",
    lineNumber: 48,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/modules/avl-components/src/components/Nav/Top.js",
    lineNumber: 47,
    columnNumber: 5
  }, this);
}, TopNav = ({ ...props }) => {
  let [open, setOpen] = (0, import_react12.useState)(!1);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("nav", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(DesktopMenu, { open, toggle: setOpen, ...props }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/Nav/Top.js",
      lineNumber: 91,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(MobileMenu, { open, ...props }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/Nav/Top.js",
      lineNumber: 92,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/avl-components/src/components/Nav/Top.js",
    lineNumber: 90,
    columnNumber: 5
  }, this);
}, Top_default = TopNav;

// app/modules/avl-components/src/components/Nav/Side.js
var import_jsx_dev_runtime12 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Layouts/FixedLayout.js
var import_react14 = __toESM(require("react"));
var import_lodash6 = require("lodash.get"), import_jsx_dev_runtime13 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Layouts/SimpleLayout.js
var import_react15 = require("react");
var import_jsx_dev_runtime14 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Loading/index.js
var import_react16 = require("react"), import_jsx_dev_runtime15 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Sidebar/scrollSpy/scrollspy.js
var import_prop_types = __toESM(require("prop-types")), import_react17 = __toESM(require("react"));

// app/modules/avl-components/src/components/Sidebar/scrollSpy/throttle.js
var throttle = (fn, threshold = 100) => {
  let last, timer2;
  return () => {
    let now2 = +new Date();
    !!last && now2 < last + threshold ? (clearTimeout(timer2), timer2 = setTimeout(() => {
      last = now2, fn();
    }, threshold)) : (last = now2, fn());
  };
}, throttle_default = throttle;

// app/modules/avl-components/src/components/Sidebar/scrollSpy/scrollspy.js
var import_jsx_dev_runtime16 = require("react/jsx-dev-runtime"), import_react18 = require("react");
function classNames() {
  for (var classes = [], i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!!arg) {
      var argType = typeof arg;
      if (argType === "string" || argType === "number")
        classes.push(arg);
      else if (Array.isArray(arg)) {
        if (arg.length) {
          var inner = classNames.apply(null, arg);
          inner && classes.push(inner);
        }
      } else if (argType === "object") {
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          classes.push(arg.toString());
          continue;
        }
        for (var key in arg)
          hasOwn.call(arg, key) && arg[key] && classes.push(key);
      }
    }
  }
  return classes.join(" ");
}
function isEqualArray(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}
var Scrollspy = class extends import_react17.default.Component {
  static get propTypes() {
    return {
      items: import_prop_types.default.arrayOf(import_prop_types.default.string).isRequired,
      currentClassName: import_prop_types.default.string.isRequired,
      scrolledPastClassName: import_prop_types.default.string,
      style: import_prop_types.default.object,
      componentTag: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.elementType]),
      offset: import_prop_types.default.number,
      rootEl: import_prop_types.default.string,
      onUpdate: import_prop_types.default.func
    };
  }
  static get defaultProps() {
    return {
      items: [],
      currentClassName: "",
      style: {},
      componentTag: "ul",
      offset: 1e3,
      onUpdate() {
      }
    };
  }
  constructor(props) {
    super(props), this.state = {
      targetItems: [],
      inViewState: [],
      isScrolledPast: []
    }, this._handleSpy = this._handleSpy.bind(this);
  }
  _initSpyTarget(items) {
    return items.map((item) => document.getElementById(item));
  }
  _fillArray(array2, val) {
    let newArray = [];
    for (let i = 0, max = array2.length; i < max; i++)
      newArray[i] = val;
    return newArray;
  }
  _isScrolled() {
    return this._getScrollDimension().scrollTop > 0;
  }
  _getScrollDimension() {
    let doc = document, { rootEl } = this.props, scrollTop = rootEl ? doc.querySelector(rootEl).scrollTop : doc.documentElement.scrollTop || doc.body.parentNode.scrollTop || doc.body.scrollTop, scrollHeight = rootEl ? doc.querySelector(rootEl).scrollHeight : doc.documentElement.scrollHeight || doc.body.parentNode.scrollHeight || doc.body.scrollHeight;
    return {
      scrollTop,
      scrollHeight
    };
  }
  _getElemsViewState(targets) {
    let elemsInView = [], elemsOutView = [], viewStatusList = [], targetItems = targets || this.state.targetItems, hasInViewAlready = !1;
    for (let i = 0, max = targetItems.length; i < max; i++) {
      let currentContent = targetItems[i], isInView = hasInViewAlready ? !1 : this._isInView(currentContent);
      isInView ? (hasInViewAlready = !0, elemsInView.push(currentContent)) : elemsOutView.push(currentContent);
      let isLastItem = i === max - 1, isScrolled = this._isScrolled();
      this._isAtBottom() && this._isInView(currentContent) && !isInView && isLastItem && isScrolled && (elemsOutView.pop(), elemsOutView.push(...elemsInView), elemsInView = [currentContent], viewStatusList = this._fillArray(viewStatusList, !1), isInView = !0), viewStatusList.push(isInView);
    }
    return {
      inView: elemsInView,
      outView: elemsOutView,
      viewStatusList,
      scrolledPast: this.props.scrolledPastClassName && this._getScrolledPast(viewStatusList)
    };
  }
  _isInView(el) {
    if (!el)
      return !1;
    let { rootEl, offset } = this.props, rootRect;
    rootEl && (rootRect = document.querySelector(rootEl).getBoundingClientRect());
    let rect = el.getBoundingClientRect(), winH = rootEl ? rootRect.height : window.innerHeight, { scrollTop } = this._getScrollDimension(), scrollBottom = scrollTop + winH, elTop = rootEl ? rect.top + scrollTop - rootRect.top + offset : rect.top + scrollTop + offset, elBottom = elTop + el.offsetHeight;
    return elTop < scrollBottom && elBottom > scrollTop;
  }
  _isAtBottom() {
    let { rootEl } = this.props, { scrollTop, scrollHeight } = this._getScrollDimension(), winH = rootEl ? document.querySelector(rootEl).getBoundingClientRect().height : window.innerHeight;
    return scrollTop + winH >= scrollHeight;
  }
  _getScrolledPast(viewStatusList) {
    if (!viewStatusList.some((item) => item))
      return viewStatusList;
    let hasFoundInView = !1;
    return viewStatusList.map((item) => item && !hasFoundInView ? (hasFoundInView = !0, !1) : !hasFoundInView);
  }
  _spy(targets) {
    let elemensViewState = this._getElemsViewState(targets), currentStatuses = this.state.inViewState;
    this.setState({
      inViewState: elemensViewState.viewStatusList,
      isScrolledPast: elemensViewState.scrolledPast
    }, () => {
      this._update(currentStatuses);
    });
  }
  _update(prevStatuses) {
    isEqualArray(this.state.inViewState, prevStatuses) || this.props.onUpdate(this.state.targetItems[this.state.inViewState.indexOf(!0)]);
  }
  _handleSpy() {
    throttle_default(this._spy(), 100);
  }
  _initFromProps() {
    let targetItems = this._initSpyTarget(this.props.items);
    this.setState({
      targetItems
    }), this._spy(targetItems);
  }
  offEvent() {
    (this.props.rootEl ? document.querySelector(this.props.rootEl) : window).removeEventListener("scroll", this._handleSpy);
  }
  onEvent() {
    (this.props.rootEl ? document.querySelector(this.props.rootEl) : window).addEventListener("scroll", this._handleSpy);
  }
  componentDidMount() {
    this._initFromProps(), this.onEvent();
  }
  componentWillUnmount() {
    this.offEvent();
  }
  UNSAFE_componentWillReceiveProps() {
    this._initFromProps();
  }
  render() {
    let Tag = this.props.componentTag, {
      children: children2,
      className,
      scrolledPastClassName,
      style
    } = this.props, counter = 0, items = import_react17.default.Children.map(children2, (child, idx) => {
      if (!child)
        return null;
      let ChildTag = child.type, isScrolledPast = scrolledPastClassName && this.state.isScrolledPast[idx], childClass = classNames({
        [`${child.props.className}`]: child.props.className,
        [`${this.props.currentClassName}`]: this.state.inViewState[idx],
        [`${this.props.scrolledPastClassName}`]: isScrolledPast
      });
      return /* @__PURE__ */ (0, import_react18.createElement)(ChildTag, { ...child.props, className: childClass, key: counter++ }, child.props.children);
    }), itemClass = classNames({
      [`${className}`]: className
    });
    return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Tag, { className: itemClass, style, children: items }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/Sidebar/scrollSpy/scrollspy.js",
      lineNumber: 319,
      columnNumber: 7
    }, this);
  }
};

// app/modules/avl-components/src/components/TabPanel/TabPanel.js
var import_react19 = __toESM(require("react"));
var import_jsx_dev_runtime17 = require("react/jsx-dev-runtime"), TabPanel = (props) => {
  let { tabs, activeIndex = 0, setActiveIndex = null, themeOptions } = props, theme = useTheme().tabpanel(themeOptions), [activeTabIndex, setActiveTabIndex] = import_react19.default.useState(activeIndex);
  return import_react19.default.useEffect(() => {
    setActiveTabIndex(activeIndex);
  }, [activeIndex]), /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: `${theme.tabpanelWrapper}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: `${theme.tabWrapper}`, children: tabs.map(({ icon, name }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
      "div",
      {
        onClick: (e) => setActiveIndex ? setActiveIndex(i) : setActiveTabIndex(i),
        className: `${i === activeTabIndex ? theme.tabActive : theme.tab}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("span", { className: `${icon} ${theme.icon}` }, void 0, !1, {
            fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
            lineNumber: 27,
            columnNumber: 22
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("span", { className: `${theme.tabName}`, children: [
            " ",
            name,
            " "
          ] }, void 0, !0, {
            fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
            lineNumber: 28,
            columnNumber: 22
          }, this)
        ]
      },
      i,
      !0,
      {
        fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
        lineNumber: 22,
        columnNumber: 20
      },
      this
    )) }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
      lineNumber: 20,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: `${theme.contentWrapper}`, children: tabs.map(({ Component }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
      "div",
      {
        style: { display: i === activeTabIndex ? "block" : "none" },
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(Component, { ...props }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
          lineNumber: 39,
          columnNumber: 20
        }, this)
      },
      i,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
        lineNumber: 36,
        columnNumber: 18
      },
      this
    )) }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
      lineNumber: 34,
      columnNumber: 10
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/avl-components/src/components/TabPanel/TabPanel.js",
    lineNumber: 19,
    columnNumber: 3
  }, this);
}, TabPanel_default = TabPanel;

// app/modules/avl-components/src/components/Modal/Modal.js
var import_react20 = require("react");
var import_jsx_dev_runtime18 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Containers/index.js
var import_react21 = require("react");
var import_jsx_dev_runtime19 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Inputs/input.js
var import_react22 = __toESM(require("react"));

// app/modules/avl-components/src/components/Inputs/utils.js
var hasValue = (value) => value == null || typeof value == "string" && !value.length ? !1 : Array.isArray(value) ? value.reduce((a, c) => a || hasValue(c), !1) : typeof value == "number" && isNaN(value) ? !1 : typeof value == "object" ? Object.values(value).reduce((a, c) => a || hasValue(c), !1) : !0;

// app/modules/avl-components/src/components/Inputs/input.js
var import_jsx_dev_runtime20 = require("react/jsx-dev-runtime"), input_default = import_react22.default.forwardRef(
  ({
    large,
    small,
    className = null,
    onChange,
    value,
    showClear = !1,
    placeholder = "type a value...",
    themeOptions = { color: "white", size: "small", width: "block" },
    ...props
  }, ref) => {
    let theme = useTheme().input(themeOptions).input, doOnChange = import_react22.default.useCallback(
      (e) => {
        e.stopPropagation(), onChange(e.target.value, e);
      },
      [onChange]
    );
    return showClear ? /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(import_jsx_dev_runtime20.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(
        "input",
        {
          ...props,
          ref,
          onChange: doOnChange,
          value: hasValue(value) ? value : "",
          className: `${className || theme} `,
          placeholder
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-components/src/components/Inputs/input.js",
          lineNumber: 31,
          columnNumber: 9
        },
        this
      ),
      hasValue(value) ? /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(
        "div",
        {
          className: `absolute right-0 ${small ? "mr-1" : "mr-2"} top-0 bottom-0 flex items-center`,
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(
            "div",
            {
              className: `
                ${theme.menuBgActive} ${theme.menuBgActiveHover} ${theme.textContrast}
                p-1 flex justify-center items-center rounded cursor-pointer
              `,
              onClick: () => onChange(""),
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)("svg", { width: "8", height: "8", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(
                  "line",
                  {
                    x2: "8",
                    y2: "8",
                    style: { stroke: "currentColor", strokeWidth: 2 }
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/modules/avl-components/src/components/Inputs/input.js",
                    lineNumber: 53,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(
                  "line",
                  {
                    y1: "8",
                    x2: "8",
                    style: { stroke: "currentColor", strokeWidth: 2 }
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/modules/avl-components/src/components/Inputs/input.js",
                    lineNumber: 58,
                    columnNumber: 17
                  },
                  this
                )
              ] }, void 0, !0, {
                fileName: "app/modules/avl-components/src/components/Inputs/input.js",
                lineNumber: 52,
                columnNumber: 15
              }, this)
            },
            void 0,
            !1,
            {
              fileName: "app/modules/avl-components/src/components/Inputs/input.js",
              lineNumber: 45,
              columnNumber: 13
            },
            this
          )
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-components/src/components/Inputs/input.js",
          lineNumber: 40,
          columnNumber: 11
        },
        this
      ) : null
    ] }, void 0, !0, {
      fileName: "app/modules/avl-components/src/components/Inputs/input.js",
      lineNumber: 30,
      columnNumber: 7
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime20.jsxDEV)(
      "input",
      {
        ...props,
        ref,
        onChange: doOnChange,
        value: hasValue(value) ? value : "",
        className: `${className || theme} `,
        placeholder
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Inputs/input.js",
        lineNumber: 69,
        columnNumber: 7
      },
      this
    );
  }
);

// app/modules/avl-components/src/components/Inputs/textarea.js
var import_react23 = __toESM(require("react"));
var import_jsx_dev_runtime21 = require("react/jsx-dev-runtime"), textarea_default = import_react23.default.forwardRef(({ large, small, className = "", children: children2, onChange, value, ...props }, ref) => {
  let theme = useTheme(), inputTheme = theme[`input${composeOptions({ large, small })}`];
  return /* @__PURE__ */ (0, import_jsx_dev_runtime21.jsxDEV)(
    "textarea",
    {
      ...props,
      onChange: (e) => onChange(e.target.value),
      value: value || "",
      className: `${inputTheme} ${className}`,
      ref,
      rows: 6,
      children: children2
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Inputs/textarea.js",
      lineNumber: 10,
      columnNumber: 5
    },
    this
  );
});

// app/modules/avl-components/src/components/Inputs/array-input.js
var import_react26 = require("react");

// app/modules/avl-components/src/components/Button/index.js
var import_react24 = __toESM(require("react")), import_react_router_dom4 = require("react-router-dom");
var import_jsx_dev_runtime22 = require("react/jsx-dev-runtime"), ConfirmButton = ({
  onClick,
  children: children2,
  confirmMessage,
  type,
  ...props
}) => {
  let [canClick, setCanClick] = import_react24.default.useState(!1), timeout2 = import_react24.default.useRef(null), confirm = import_react24.default.useCallback(
    (e) => {
      e.preventDefault(), setCanClick(!0), timeout2.current = setTimeout(setCanClick, 5e3, !1);
    },
    [timeout2]
  ), doOnClick = import_react24.default.useCallback(
    (e) => {
      setCanClick(!1), onClick && onClick(e);
    },
    [onClick]
  );
  return import_react24.default.useEffect(() => () => clearTimeout(timeout2.current), [timeout2]), /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(
    "button",
    {
      onClick: canClick ? type === "submit" ? null : doOnClick : confirm,
      ...props,
      type: canClick ? type : "button",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { className: "relative w-full", children: [
        canClick ? /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { className: "absolute top-0 left-0 right-0 bottom-0 flex items-center overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { children: confirmMessage }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Button/index.js",
          lineNumber: 46,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Button/index.js",
          lineNumber: 45,
          columnNumber: 11
        }, this) : null,
        /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { style: { color: canClick ? "transparent" : null }, children: children2 }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Button/index.js",
          lineNumber: 49,
          columnNumber: 9
        }, this)
      ] }, void 0, !0, {
        fileName: "app/modules/avl-components/src/components/Button/index.js",
        lineNumber: 43,
        columnNumber: 7
      }, this)
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Button/index.js",
      lineNumber: 38,
      columnNumber: 5
    },
    this
  );
}, Button = ({
  children: children2,
  type = "button",
  showConfirm = !1,
  confirmMessage = "click to confirm",
  themeOptions = {},
  ...props
}) => {
  let theme = useTheme().button(themeOptions);
  return showConfirm ? /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(
    ConfirmButton,
    {
      type,
      ...props,
      confirmMessage,
      className: `${theme.button}`,
      children: children2
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Button/index.js",
      lineNumber: 68,
      columnNumber: 7
    },
    this
  ) : /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(
    "button",
    {
      type,
      ...props,
      className: `${theme.button}`,
      children: children2
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Button/index.js",
      lineNumber: 79,
      columnNumber: 5
    },
    this
  );
};

// app/modules/avl-components/src/components/Inputs/parts.js
var import_react25 = __toESM(require("react"));
var import_jsx_dev_runtime23 = require("react/jsx-dev-runtime");
var ValueContainer = import_react25.default.forwardRef(({ children: children2, hasFocus, large, small, disabled = !1, customTheme, className = "", ...props }, ref) => {
  let theme = { ...useTheme(), ...customTheme };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime23.jsxDEV)(
    "div",
    {
      ...props,
      ref,
      className: `
        w-full flex flex-row flex-wrap
        ${disabled ? `${theme.inputBgDisabled} ${theme.inputBorderDisabled}` : hasFocus ? `${theme.inputBgFocus} ${theme.inputBorderFocus}` : `${theme.inputBg} ${theme.inputBorder}`}
        ${large ? "pt-1 pb-2 px-4" : small ? "pb-1 px-1" : "pb-1 px-2"}
        ${large ? theme.textLarge : small ? theme.textSmall : theme.textBase}
        ${className}
      `,
      children: children2
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Inputs/parts.js",
      lineNumber: 47,
      columnNumber: 5
    },
    this
  );
});

// app/modules/avl-components/src/components/Inputs/array-input.js
var import_jsx_dev_runtime24 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Inputs/Select.js
var import_react27 = __toESM(require("react"));
var import_deep_equal = __toESM(require("deep-equal")), import_lodash7 = __toESM(require("lodash.get"));

// app/modules/avl-components/src/components/utils/match-sorter.ts
var characterMap = {
  \u00C0: "A",
  \u00C1: "A",
  \u00C2: "A",
  \u00C3: "A",
  \u00C4: "A",
  \u00C5: "A",
  \u1EA4: "A",
  \u1EAE: "A",
  \u1EB2: "A",
  \u1EB4: "A",
  \u1EB6: "A",
  \u00C6: "AE",
  \u1EA6: "A",
  \u1EB0: "A",
  \u0202: "A",
  \u00C7: "C",
  \u1E08: "C",
  \u00C8: "E",
  \u00C9: "E",
  \u00CA: "E",
  \u00CB: "E",
  \u1EBE: "E",
  \u1E16: "E",
  \u1EC0: "E",
  \u1E14: "E",
  \u1E1C: "E",
  \u0206: "E",
  \u00CC: "I",
  \u00CD: "I",
  \u00CE: "I",
  \u00CF: "I",
  \u1E2E: "I",
  \u020A: "I",
  \u00D0: "D",
  \u00D1: "N",
  \u00D2: "O",
  \u00D3: "O",
  \u00D4: "O",
  \u00D5: "O",
  \u00D6: "O",
  \u00D8: "O",
  \u1ED0: "O",
  \u1E4C: "O",
  \u1E52: "O",
  \u020E: "O",
  \u00D9: "U",
  \u00DA: "U",
  \u00DB: "U",
  \u00DC: "U",
  \u00DD: "Y",
  \u00E0: "a",
  \u00E1: "a",
  \u00E2: "a",
  \u00E3: "a",
  \u00E4: "a",
  \u00E5: "a",
  \u1EA5: "a",
  \u1EAF: "a",
  \u1EB3: "a",
  \u1EB5: "a",
  \u1EB7: "a",
  \u00E6: "ae",
  \u1EA7: "a",
  \u1EB1: "a",
  \u0203: "a",
  \u00E7: "c",
  \u1E09: "c",
  \u00E8: "e",
  \u00E9: "e",
  \u00EA: "e",
  \u00EB: "e",
  \u1EBF: "e",
  \u1E17: "e",
  \u1EC1: "e",
  \u1E15: "e",
  \u1E1D: "e",
  \u0207: "e",
  \u00EC: "i",
  \u00ED: "i",
  \u00EE: "i",
  \u00EF: "i",
  \u1E2F: "i",
  \u020B: "i",
  \u00F0: "d",
  \u00F1: "n",
  \u00F2: "o",
  \u00F3: "o",
  \u00F4: "o",
  \u00F5: "o",
  \u00F6: "o",
  \u00F8: "o",
  \u1ED1: "o",
  \u1E4D: "o",
  \u1E53: "o",
  \u020F: "o",
  \u00F9: "u",
  \u00FA: "u",
  \u00FB: "u",
  \u00FC: "u",
  \u00FD: "y",
  \u00FF: "y",
  \u0100: "A",
  \u0101: "a",
  \u0102: "A",
  \u0103: "a",
  \u0104: "A",
  \u0105: "a",
  \u0106: "C",
  \u0107: "c",
  \u0108: "C",
  \u0109: "c",
  \u010A: "C",
  \u010B: "c",
  \u010C: "C",
  \u010D: "c",
  C\u0306: "C",
  c\u0306: "c",
  \u010E: "D",
  \u010F: "d",
  \u0110: "D",
  \u0111: "d",
  \u0112: "E",
  \u0113: "e",
  \u0114: "E",
  \u0115: "e",
  \u0116: "E",
  \u0117: "e",
  \u0118: "E",
  \u0119: "e",
  \u011A: "E",
  \u011B: "e",
  \u011C: "G",
  \u01F4: "G",
  \u011D: "g",
  \u01F5: "g",
  \u011E: "G",
  \u011F: "g",
  \u0120: "G",
  \u0121: "g",
  \u0122: "G",
  \u0123: "g",
  \u0124: "H",
  \u0125: "h",
  \u0126: "H",
  \u0127: "h",
  \u1E2A: "H",
  \u1E2B: "h",
  \u0128: "I",
  \u0129: "i",
  \u012A: "I",
  \u012B: "i",
  \u012C: "I",
  \u012D: "i",
  \u012E: "I",
  \u012F: "i",
  \u0130: "I",
  \u0131: "i",
  \u0132: "IJ",
  \u0133: "ij",
  \u0134: "J",
  \u0135: "j",
  \u0136: "K",
  \u0137: "k",
  \u1E30: "K",
  \u1E31: "k",
  K\u0306: "K",
  k\u0306: "k",
  \u0139: "L",
  \u013A: "l",
  \u013B: "L",
  \u013C: "l",
  \u013D: "L",
  \u013E: "l",
  \u013F: "L",
  \u0140: "l",
  \u0141: "l",
  \u0142: "l",
  \u1E3E: "M",
  \u1E3F: "m",
  M\u0306: "M",
  m\u0306: "m",
  \u0143: "N",
  \u0144: "n",
  \u0145: "N",
  \u0146: "n",
  \u0147: "N",
  \u0148: "n",
  \u0149: "n",
  N\u0306: "N",
  n\u0306: "n",
  \u014C: "O",
  \u014D: "o",
  \u014E: "O",
  \u014F: "o",
  \u0150: "O",
  \u0151: "o",
  \u0152: "OE",
  \u0153: "oe",
  P\u0306: "P",
  p\u0306: "p",
  \u0154: "R",
  \u0155: "r",
  \u0156: "R",
  \u0157: "r",
  \u0158: "R",
  \u0159: "r",
  R\u0306: "R",
  r\u0306: "r",
  \u0212: "R",
  \u0213: "r",
  \u015A: "S",
  \u015B: "s",
  \u015C: "S",
  \u015D: "s",
  \u015E: "S",
  \u0218: "S",
  \u0219: "s",
  \u015F: "s",
  \u0160: "S",
  \u0161: "s",
  \u00DF: "ss",
  \u0162: "T",
  \u0163: "t",
  \u021B: "t",
  \u021A: "T",
  \u0164: "T",
  \u0165: "t",
  \u0166: "T",
  \u0167: "t",
  T\u0306: "T",
  t\u0306: "t",
  \u0168: "U",
  \u0169: "u",
  \u016A: "U",
  \u016B: "u",
  \u016C: "U",
  \u016D: "u",
  \u016E: "U",
  \u016F: "u",
  \u0170: "U",
  \u0171: "u",
  \u0172: "U",
  \u0173: "u",
  \u0216: "U",
  \u0217: "u",
  V\u0306: "V",
  v\u0306: "v",
  \u0174: "W",
  \u0175: "w",
  \u1E82: "W",
  \u1E83: "w",
  X\u0306: "X",
  x\u0306: "x",
  \u0176: "Y",
  \u0177: "y",
  \u0178: "Y",
  Y\u0306: "Y",
  y\u0306: "y",
  \u0179: "Z",
  \u017A: "z",
  \u017B: "Z",
  \u017C: "z",
  \u017D: "Z",
  \u017E: "z",
  \u017F: "s",
  \u0192: "f",
  \u01A0: "O",
  \u01A1: "o",
  \u01AF: "U",
  \u01B0: "u",
  \u01CD: "A",
  \u01CE: "a",
  \u01CF: "I",
  \u01D0: "i",
  \u01D1: "O",
  \u01D2: "o",
  \u01D3: "U",
  \u01D4: "u",
  \u01D5: "U",
  \u01D6: "u",
  \u01D7: "U",
  \u01D8: "u",
  \u01D9: "U",
  \u01DA: "u",
  \u01DB: "U",
  \u01DC: "u",
  \u1EE8: "U",
  \u1EE9: "u",
  \u1E78: "U",
  \u1E79: "u",
  \u01FA: "A",
  \u01FB: "a",
  \u01FC: "AE",
  \u01FD: "ae",
  \u01FE: "O",
  \u01FF: "o",
  \u00DE: "TH",
  \u00FE: "th",
  \u1E54: "P",
  \u1E55: "p",
  \u1E64: "S",
  \u1E65: "s",
  X\u0301: "X",
  x\u0301: "x",
  \u0403: "\u0413",
  \u0453: "\u0433",
  \u040C: "\u041A",
  \u045C: "\u043A",
  A\u030B: "A",
  a\u030B: "a",
  E\u030B: "E",
  e\u030B: "e",
  I\u030B: "I",
  i\u030B: "i",
  \u01F8: "N",
  \u01F9: "n",
  \u1ED2: "O",
  \u1ED3: "o",
  \u1E50: "O",
  \u1E51: "o",
  \u1EEA: "U",
  \u1EEB: "u",
  \u1E80: "W",
  \u1E81: "w",
  \u1EF2: "Y",
  \u1EF3: "y",
  \u0200: "A",
  \u0201: "a",
  \u0204: "E",
  \u0205: "e",
  \u0208: "I",
  \u0209: "i",
  \u020C: "O",
  \u020D: "o",
  \u0210: "R",
  \u0211: "r",
  \u0214: "U",
  \u0215: "u",
  B\u030C: "B",
  b\u030C: "b",
  \u010C\u0323: "C",
  \u010D\u0323: "c",
  \u00CA\u030C: "E",
  \u00EA\u030C: "e",
  F\u030C: "F",
  f\u030C: "f",
  \u01E6: "G",
  \u01E7: "g",
  \u021E: "H",
  \u021F: "h",
  J\u030C: "J",
  \u01F0: "j",
  \u01E8: "K",
  \u01E9: "k",
  M\u030C: "M",
  m\u030C: "m",
  P\u030C: "P",
  p\u030C: "p",
  Q\u030C: "Q",
  q\u030C: "q",
  \u0158\u0329: "R",
  \u0159\u0329: "r",
  \u1E66: "S",
  \u1E67: "s",
  V\u030C: "V",
  v\u030C: "v",
  W\u030C: "W",
  w\u030C: "w",
  X\u030C: "X",
  x\u030C: "x",
  Y\u030C: "Y",
  y\u030C: "y",
  A\u0327: "A",
  a\u0327: "a",
  B\u0327: "B",
  b\u0327: "b",
  \u1E10: "D",
  \u1E11: "d",
  \u0228: "E",
  \u0229: "e",
  \u0190\u0327: "E",
  \u025B\u0327: "e",
  \u1E28: "H",
  \u1E29: "h",
  I\u0327: "I",
  i\u0327: "i",
  \u0197\u0327: "I",
  \u0268\u0327: "i",
  M\u0327: "M",
  m\u0327: "m",
  O\u0327: "O",
  o\u0327: "o",
  Q\u0327: "Q",
  q\u0327: "q",
  U\u0327: "U",
  u\u0327: "u",
  X\u0327: "X",
  x\u0327: "x",
  Z\u0327: "Z",
  z\u0327: "z",
  \u0439: "\u0438",
  \u0419: "\u0418",
  \u0451: "\u0435",
  \u0401: "\u0415"
}, chars = Object.keys(characterMap).join("|"), allAccents = new RegExp(chars, "g"), firstAccent = new RegExp(chars, "");
function matcher(match) {
  return characterMap[match];
}
var removeAccents = function(string) {
  return string.replace(allAccents, matcher);
};
var rankings = {
  CASE_SENSITIVE_EQUAL: 7,
  EQUAL: 6,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
  CONTAINS: 3,
  ACRONYM: 2,
  MATCHES: 1,
  NO_MATCH: 0
};
matchSorter.rankings = rankings;
var defaultBaseSortFn = (a, b) => String(a.rankedValue).localeCompare(String(b.rankedValue));
function matchSorter(items, value, options = {}) {
  let {
    keys,
    threshold = rankings.MATCHES,
    baseSort = defaultBaseSortFn,
    sorter = (matchedItems2) => matchedItems2.sort((a, b) => sortRankedValues(a, b, baseSort))
  } = options, matchedItems = items.reduce(reduceItemsToRanked, []);
  return sorter(matchedItems).map(({ item }) => item);
  function reduceItemsToRanked(matches, item, index) {
    let rankingInfo = getHighestRanking(item, keys, value, options), { rank, keyThreshold = threshold } = rankingInfo;
    return rank >= keyThreshold && matches.push({ ...rankingInfo, item, index }), matches;
  }
}
function getHighestRanking(item, keys, value, options) {
  if (!keys) {
    let stringItem = item;
    return {
      rankedValue: stringItem,
      rank: getMatchRanking(stringItem, value, options),
      keyIndex: -1,
      keyThreshold: options.threshold
    };
  }
  return getAllValuesToRank(item, keys).reduce(
    ({ rank, rankedValue, keyIndex, keyThreshold }, { itemValue, attributes }, i) => {
      let newRank = getMatchRanking(itemValue, value, options), newRankedValue = rankedValue, { minRanking, maxRanking, threshold } = attributes;
      return newRank < minRanking && newRank >= rankings.MATCHES ? newRank = minRanking : newRank > maxRanking && (newRank = maxRanking), newRank > rank && (rank = newRank, keyIndex = i, keyThreshold = threshold, newRankedValue = itemValue), { rankedValue: newRankedValue, rank, keyIndex, keyThreshold };
    },
    {
      rankedValue: item,
      rank: rankings.NO_MATCH,
      keyIndex: -1,
      keyThreshold: options.threshold
    }
  );
}
function getMatchRanking(testString, stringToRank, options) {
  return testString = prepareValueForComparison(testString, options), stringToRank = prepareValueForComparison(stringToRank, options), stringToRank.length > testString.length ? rankings.NO_MATCH : testString === stringToRank ? rankings.CASE_SENSITIVE_EQUAL : (testString = testString.toLowerCase(), stringToRank = stringToRank.toLowerCase(), testString === stringToRank ? rankings.EQUAL : testString.startsWith(stringToRank) ? rankings.STARTS_WITH : testString.includes(` ${stringToRank}`) ? rankings.WORD_STARTS_WITH : testString.includes(stringToRank) ? rankings.CONTAINS : stringToRank.length === 1 ? rankings.NO_MATCH : getAcronym(testString).includes(stringToRank) ? rankings.ACRONYM : getClosenessRanking(testString, stringToRank));
}
function getAcronym(string) {
  let acronym = "";
  return string.split(" ").forEach((wordInString) => {
    wordInString.split("-").forEach((splitByHyphenWord) => {
      acronym += splitByHyphenWord.substr(0, 1);
    });
  }), acronym;
}
function getClosenessRanking(testString, stringToRank) {
  let matchingInOrderCharCount = 0, charNumber = 0;
  function findMatchingCharacter(matchChar, string, index) {
    for (let j = index, J = string.length; j < J; j++)
      if (string[j] === matchChar)
        return matchingInOrderCharCount += 1, j + 1;
    return -1;
  }
  function getRanking(spread2) {
    let spreadPercentage = 1 / spread2, inOrderPercentage = matchingInOrderCharCount / stringToRank.length;
    return rankings.MATCHES + inOrderPercentage * spreadPercentage;
  }
  let firstIndex = findMatchingCharacter(stringToRank[0], testString, 0);
  if (firstIndex < 0)
    return rankings.NO_MATCH;
  charNumber = firstIndex;
  for (let i = 1, I = stringToRank.length; i < I; i++) {
    let matchChar = stringToRank[i];
    if (charNumber = findMatchingCharacter(matchChar, testString, charNumber), !(charNumber > -1))
      return rankings.NO_MATCH;
  }
  let spread = charNumber - firstIndex;
  return getRanking(spread);
}
function sortRankedValues(a, b, baseSort) {
  let { rank: aRank, keyIndex: aKeyIndex } = a, { rank: bRank, keyIndex: bKeyIndex } = b;
  return aRank === bRank ? aKeyIndex === bKeyIndex ? baseSort(a, b) : aKeyIndex < bKeyIndex ? -1 : 1 : aRank > bRank ? -1 : 1;
}
function prepareValueForComparison(value, { keepDiacritics }) {
  return value = `${value}`, keepDiacritics || (value = removeAccents(value)), value;
}
function getItemValues(item, key) {
  typeof key == "object" && (key = key.key);
  let value;
  if (typeof key == "function")
    value = key(item);
  else if (item == null)
    value = null;
  else if (Object.hasOwnProperty.call(item, key))
    value = item[key];
  else {
    if (key.includes("."))
      return getNestedValues(key, item);
    value = null;
  }
  return value == null ? [] : Array.isArray(value) ? value : [String(value)];
}
function getNestedValues(path, item) {
  let keys = path.split("."), values = [item];
  for (let i = 0, I = keys.length; i < I; i++) {
    let nestedKey = keys[i], nestedValues = [];
    for (let j = 0, J = values.length; j < J; j++) {
      let nestedItem = values[j];
      if (nestedItem != null)
        if (Object.hasOwnProperty.call(nestedItem, nestedKey)) {
          let nestedValue = nestedItem[nestedKey];
          nestedValue != null && nestedValues.push(nestedValue);
        } else
          nestedKey === "*" && (nestedValues = nestedValues.concat(nestedItem));
    }
    values = nestedValues;
  }
  return Array.isArray(values[0]) ? [].concat(...values) : values;
}
function getAllValuesToRank(item, keys) {
  let allValues = [];
  for (let j = 0, J = keys.length; j < J; j++) {
    let key = keys[j], attributes = getKeyAttributes(key), itemValues = getItemValues(item, key);
    for (let i = 0, I = itemValues.length; i < I; i++)
      allValues.push({
        itemValue: itemValues[i],
        attributes
      });
  }
  return allValues;
}
var defaultKeyAttributes = {
  maxRanking: 1 / 0,
  minRanking: -1 / 0
};
function getKeyAttributes(key) {
  return typeof key == "string" ? defaultKeyAttributes : { ...defaultKeyAttributes, ...key };
}

// app/modules/avl-components/src/components/Inputs/Select.js
var import_jsx_dev_runtime25 = require("react/jsx-dev-runtime"), ValueItem2 = ({ isPlaceholder, children: children2, remove: remove2, edit, disabled = !1, themeOptions }) => {
  let theme = useTheme().select(themeOptions);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: `
        ${isPlaceholder ? theme.textLight : `${disabled ? theme.accent2 : remove2 || edit ? theme.menuBgActive : ""}
            mr-1 pl-2 ${!disabled && (remove2 || edit) ? "pr-1" : "pr-4"}
          `}
        ${theme.itemText}
         mt-1 flex items-center max-w-full
      `, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("span", { className: theme.valueItem, children: children2 }, void 0, !1, {
      fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
      lineNumber: 32,
      columnNumber: 7
    }, this),
    isPlaceholder || disabled || !edit ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
      "div",
      {
        className: `
            ${theme.menuBgActive} ${theme.menuBgActiveHover} ${theme.textContrast}
            ml-2 p-1 flex justify-center items-center rounded cursor-pointer
          `,
        onClick: edit,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("svg", { width: "8", height: "8", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("line", { x1: "0", y1: "6", x2: "4", y2: "2", style: { stroke: "currentColor", strokeWidth: 2 } }, void 0, !1, {
            fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
            lineNumber: 40,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("line", { x1: "4", y1: "2", x2: "8", y2: "6", style: { stroke: "currentColor", strokeWidth: 2 } }, void 0, !1, {
            fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
            lineNumber: 41,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
          lineNumber: 39,
          columnNumber: 11
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
        lineNumber: 34,
        columnNumber: 9
      },
      this
    ),
    isPlaceholder || disabled || !remove2 ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
      "div",
      {
        className: `
            ${theme.menuBgActive} ${theme.menuBgActiveHover} ${theme.textContrast}
            ${edit ? "ml-1" : "ml-2"} p-1 flex justify-center items-center rounded cursor-pointer
          `,
        onClick: remove2,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("svg", { width: "8", height: "8", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("line", { x2: "8", y2: "8", style: { stroke: "currentColor", strokeWidth: 2 } }, void 0, !1, {
            fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
            lineNumber: 52,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("line", { y1: "8", x2: "8", style: { stroke: "currentColor", strokeWidth: 2 } }, void 0, !1, {
            fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
            lineNumber: 53,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
          lineNumber: 51,
          columnNumber: 11
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
        lineNumber: 46,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
    lineNumber: 24,
    columnNumber: 5
  }, this);
}, Dropdown2 = import_react27.default.forwardRef(
  ({ children: children2, searchable, opened, direction, themeOptions = {} }, ref) => {
    let theme = useTheme().select(themeOptions);
    return /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
      "div",
      {
        className: `
      absolute left-0 z-40 overflow-hidden min-w-full
      ${opened ? "block" : "hidden"}
    `,
        style: direction === "down" ? { top: "100%" } : { bottom: "100%" },
        ref,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: `${theme.menuWrapper}`, children: children2 }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
          lineNumber: 73,
          columnNumber: 9
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
        lineNumber: 65,
        columnNumber: 7
      },
      this
    );
  }
), Identity = (i) => i, Select = (props) => {
  let {
    multi = !1,
    searchable = !1,
    domain = [],
    options = [],
    value = null,
    placeholder = "Select a value...",
    accessor = Identity,
    listAccessor = null,
    autoFocus = !1,
    disabled = !1,
    removable = !1,
    themeOptions = {},
    onChange = Identity,
    valueAccessor = Identity,
    className = ""
  } = props, theme = useTheme().select(themeOptions), node = import_react27.default.useRef(), vcNode = import_react27.default.useRef(), dropdown = import_react27.default.useRef(), optionRefs = import_react27.default.useRef([]), [opened, setOpened] = (0, import_react27.useState)(!1), [direction, setDirection] = (0, import_react27.useState)("down"), [, setHasFocus] = (0, import_react27.useState)(!1), [search, setSearch] = (0, import_react27.useState)(""), openDropdown = (e) => {
    e.stopPropagation(), setOpened(!0), setHasFocus(!0);
  }, closeDropdown = (e) => {
    opened && vcNode && vcNode.current.focus(), setOpened(!1);
  }, focus = () => {
    vcNode && vcNode.focus();
  };
  (0, import_react27.useEffect)(() => {
    autoFocus && focus();
  }, [autoFocus]), (0, import_react27.useEffect)(() => {
    let closeDropdownEffect = (e) => {
      opened && vcNode && vcNode.current.focus(), setOpened(!1);
    }, checkOutside = (e) => {
      node && node.current && node.current.contains(e.target) || closeDropdownEffect();
    };
    if (document.addEventListener("mousedown", checkOutside), dropdown && dropdown.current && opened && direction === "down") {
      let rect = dropdown.current.getBoundingClientRect();
      rect.top + rect.height > window.innerHeight && setDirection("up");
    }
    return () => {
      document.removeEventListener("mousedown", checkOutside);
    };
  }, [direction, opened]);
  let getValues = () => {
    let values2 = [];
    return hasValue(value) ? (Array.isArray(value) ? values2 = value : values2 = [value], getOptions().filter((option) => values2.reduce((a, c) => a || (0, import_deep_equal.default)(valueAccessor(option), c), !1))) : [];
  }, addItem = (e, v) => {
    e.stopPropagation(), closeDropdown(), v = valueAccessor(v), multi ? hasValue(value) ? value.reduce((a, c) => a && !(0, import_deep_equal.default)(c, v), !0) && onChange([...value, v]) : onChange([v]) : onChange(v);
  }, removeItem = (e, v) => {
    e.stopPropagation(), v = valueAccessor(v), onChange(multi ? value.filter((d) => !(0, import_deep_equal.default)(d, v)) : null);
  }, getOptions = () => options.length ? options : domain, handleKeyDown = (0, import_react27.useCallback)((e) => {
    switch (e.key) {
      case "Space":
      case "Enter":
      case "ArrowDown":
        e.preventDefault(), opened || setOpened(!0), console.log("set option focus", optionRefs), optionRefs[0] && optionRefs[0].current && optionRefs[0].current.focus();
        break;
      case "ArrowUp":
        e.preventDefault(), opened || setOpened(!0), optionRefs[0] && optionRefs[0].current && (console.log("set option focus", optionRefs[0].current, optionRefs), optionRefs[0].current.focus());
        break;
      case "Escape":
        e.preventDefault(), e.stopPropagation(), opened && setOpened(!1);
        break;
      default:
        break;
    }
  }, [opened]), values = getValues(), _options = getOptions(), activeOptions = _options.filter((d) => values.includes(d)), uselistAccessor = listAccessor || accessor, viewOptions = search ? matchSorter(_options, search, { keys: [uselistAccessor] }) : _options;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
    "div",
    {
      ref: node,
      onMouseLeave: (e) => closeDropdown(),
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: "cursor-pointer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
          "div",
          {
            id: props.id,
            ref: vcNode,
            onBlur: (e) => setHasFocus(!1),
            onFocus: (e) => setHasFocus(!0),
            onKeyDown: handleKeyDown,
            disabled,
            tabIndex: disabled ? -1 : 0,
            onClick: openDropdown,
            className: `${theme.select} ${className}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: "w-11/12 overflow-x-hidden", children: values.length ? values.map((v, i, a) => /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
                ValueItem2,
                {
                  disabled,
                  themeOptions,
                  remove: removable ? (e) => removeItem(e, v) : null,
                  children: accessor(v, a)
                },
                i,
                !1,
                {
                  fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                  lineNumber: 313,
                  columnNumber: 19
                },
                this
              )) : /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(ValueItem2, { isPlaceholder: !0, themeOptions, children: placeholder }, "placeholder", !1, {
                fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                lineNumber: 325,
                columnNumber: 17
              }, this) }, void 0, !1, {
                fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                lineNumber: 310,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: `${theme.selectIcon}` }, void 0, !1, {
                fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                lineNumber: 330,
                columnNumber: 11
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
            lineNumber: 299,
            columnNumber: 9
          },
          this
        ) }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
          lineNumber: 298,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: "relative", children: disabled || !opened ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
          Dropdown2,
          {
            opened,
            direction,
            searchable,
            ref: dropdown,
            themeOptions,
            children: [
              searchable ? /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: "p-2 pt-1 w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
                input_default,
                {
                  type: "text",
                  autoFocus: !0,
                  placeholder: "search...",
                  className: "w-full",
                  value: search,
                  onChange: (v) => setSearch(v)
                },
                void 0,
                !1,
                {
                  fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                  lineNumber: 345,
                  columnNumber: 15
                },
                this
              ) }, void 0, !1, {
                fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                lineNumber: 344,
                columnNumber: 13
              }, this) : null,
              viewOptions.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
                "div",
                {
                  className: "scrollbar overflow-y-auto",
                  style: { maxHeight: "15rem" },
                  children: viewOptions.map((d, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
                    "div",
                    {
                      ref: (element) => optionRefs.current.push(element),
                      onClick: activeOptions.includes(d) ? (e) => e.stopPropagation() : (e) => addItem(e, d),
                      className: `${activeOptions.includes(d) ? `${theme.menuItemActive}` : `${theme.menuItem}`}`,
                      children: (0, import_lodash7.default)(d, "OptionComponent") ? /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(d.OptionComponent, { option: d }, void 0, !1, {
                        fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                        lineNumber: 378,
                        columnNumber: 21
                      }, this) : uselistAccessor(d)
                    },
                    `${accessor(d)}-${i}`,
                    !1,
                    {
                      fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                      lineNumber: 363,
                      columnNumber: 17
                    },
                    this
                  ))
                },
                void 0,
                !1,
                {
                  fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                  lineNumber: 358,
                  columnNumber: 13
                },
                this
              ) : /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: "p-1 text-center", children: "No Selections" }, void 0, !1, {
                fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
                lineNumber: 356,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
            lineNumber: 336,
            columnNumber: 9
          },
          this
        ) }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
          lineNumber: 334,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/avl-components/src/components/Inputs/Select.js",
      lineNumber: 294,
      columnNumber: 5
    },
    this
  );
}, Select_default = Select;

// app/modules/avl-components/src/components/Inputs/object-input.js
var import_react28 = __toESM(require("react"));
var import_jsx_dev_runtime26 = require("react/jsx-dev-runtime");

// app/modules/avl-components/src/components/Inputs/boolean-input.js
var import_react29 = __toESM(require("react"));
var import_jsx_dev_runtime27 = require("react/jsx-dev-runtime"), boolean_input_default = import_react29.default.forwardRef(({
  large,
  small,
  className = "",
  labels = ["False", "True"],
  value,
  onChange,
  disabled = !1,
  autoFocus = !1,
  ...props
}, ref) => {
  let [hasFocus, setHasFocus] = import_react29.default.useState(!1), [thisRef, setRef] = import_react29.default.useState(null);
  import_react29.default.useEffect(() => {
    Boolean(thisRef) && autoFocus && thisRef.focus();
  }, [autoFocus, thisRef]);
  let theme = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)(
    "div",
    {
      ...props,
      onClick: disabled ? null : (e) => onChange(!value),
      onFocus: (e) => setHasFocus(!disabled),
      onBlur: (e) => setHasFocus(!1),
      className: `
        ${large ? `${theme.paddingLarge} ${theme.textLarge}` : small ? `${theme.paddingSmall} ${theme.textSmall}` : `${theme.paddingBase} ${theme.textBase}`}
        ${disabled ? `${theme.inputBgDisabled} ${theme.inputBorderDisabled}` : hasFocus ? `${theme.inputBgFocus} ${theme.inputBorderFocus}` : `${theme.inputBg} ${theme.inputBorder}`}
        ${className}
      `,
      ref: useSetRefs(ref, setRef),
      tabIndex: disabled ? "-1" : "0",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)("div", { className: "flex", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)("div", { className: "flex-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)(Slider, { value }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
          lineNumber: 44,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
          lineNumber: 43,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)("div", { className: "flex-1 ml-4", children: labels[+Boolean(value)] }, void 0, !1, {
          fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
          lineNumber: 46,
          columnNumber: 9
        }, this)
      ] }, void 0, !0, {
        fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
        lineNumber: 42,
        columnNumber: 7
      }, this)
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
      lineNumber: 22,
      columnNumber: 5
    },
    this
  );
}), Slider = ({ value }) => {
  let theme = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)("div", { className: "px-1 h-full flex justify-center items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)("div", { className: "relative h-3", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)("div", { className: "relative w-10 h-3 rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)(
        "div",
        {
          className: `absolute top-0 w-20 h-full ${theme.accent4}`,
          style: { left: value ? "100%" : "0", transition: "left 0.25s" }
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
          lineNumber: 61,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)(
        "div",
        {
          className: `absolute top-0 w-20 h-full ${theme.bgInfo}`,
          style: { right: value ? "0" : "100%", transition: "right 0.25s" }
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
          lineNumber: 63,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
      lineNumber: 60,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime27.jsxDEV)(
      "div",
      {
        className: `absolute h-4 w-4 rounded-lg ${theme.booleanInputSlider || theme.accent2}`,
        style: {
          top: "50%",
          left: value ? "calc(100% - 0.625rem)" : "-0.125rem",
          transform: "translateY(-50%)",
          transition: "left 0.25s"
        }
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
        lineNumber: 66,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
    lineNumber: 59,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/modules/avl-components/src/components/Inputs/boolean-input.js",
    lineNumber: 58,
    columnNumber: 5
  }, this);
};

// app/modules/avl-components/src/components/Sidebar/collapsible-sidebar.js
var import_react30 = __toESM(require("react"));
var import_jsx_dev_runtime28 = require("react/jsx-dev-runtime"), SidebarContext = import_react30.default.createContext({});
var Expandable = import_react30.default.forwardRef(({ open, transitioning, width, padding, children: children2, heightFull = !0 }, ref) => {
  let theme = useTheme(), hFull = heightFull ? "h-full" : "";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime28.jsxDEV)(
    "div",
    {
      className: `${hFull} w-full`,
      ref,
      style: {
        overflow: open && !transitioning ? "visible" : "hidden"
      },
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime28.jsxDEV)(
        "div",
        {
          className: `${hFull} scrollbar-sm overflow-y-auto`,
          style: {
            width: `${width - padding * 2}px`
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime28.jsxDEV)("div", { className: `
          absolute top-0 right-0 bottom-0 left-0 pointer-events-none z-10
          ${open ? "opacity-0" : "opacity-100"} ${theme.sidebarBg}
        `, style: { transition: "opacity 500ms" } }, void 0, !1, {
              fileName: "app/modules/avl-components/src/components/Sidebar/collapsible-sidebar.js",
              lineNumber: 234,
              columnNumber: 9
            }, this),
            children2
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/modules/avl-components/src/components/Sidebar/collapsible-sidebar.js",
          lineNumber: 229,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-components/src/components/Sidebar/collapsible-sidebar.js",
      lineNumber: 225,
      columnNumber: 5
    },
    this
  );
});

// app/modules/avl-components/src/components/Draggable/draggable.js
var import_react31 = __toESM(require("react"));
var import_jsx_dev_runtime29 = require("react/jsx-dev-runtime");

// app/modules/avl-falcor/index.js
var import_react33 = __toESM(require("react")), import_lodash9 = __toESM(require("lodash.debounce"));

// app/modules/avl-falcor/falcorGraph.js
var import_falcor = require("falcor"), import_ModelRoot = __toESM(require("falcor/lib/ModelRoot")), import_falcor_http_datasource = __toESM(require_XMLHttpSource()), import_bluebird = require("bluebird"), import_lodash8 = __toESM(require("lodash.throttle")), CustomSource = class extends import_falcor_http_datasource.default {
  onBeforeRequest(config) {
  }
};
function cacheFromStorage() {
  return {};
}
var noop = () => {
}, chunker = (values, request, options = {}) => {
  let {
    placeholder = "replace_me",
    chunkSize = 100
  } = options, requests = [];
  for (let n = 0; n < values.length; n += chunkSize)
    requests.push(request.map((r) => r === placeholder ? values.slice(n, n + chunkSize) : r));
  return requests.length ? requests : [request];
}, falcorChunker = (requests, options = {}) => {
  let {
    falcor: falcor3,
    onProgress = noop,
    concurrency = 5,
    ...rest
  } = options, throttledCB = (0, import_lodash8.default)(onProgress, 50), progress = 0, total = 0, chunks = requests.reduce((accum, [val, req]) => {
    let chunked = chunker(val, req, rest);
    return total += chunked.length, accum.push(...chunked), accum;
  }, []);
  return import_bluebird.Promise.map(
    chunks,
    (c) => falcor3.get(c).then(() => {
      throttledCB(++progress, total);
    }),
    { concurrency }
  );
}, getArgs = (args) => args.reduce((a, c) => (Array.isArray(c) ? a[0].push(c) : a[1] = c, a), [[], {}]), falcorChunkerNice = (...args) => {
  let [requests, options] = getArgs(args), {
    index = null,
    placeholder = "replace_me",
    ...rest
  } = options, reduced = requests.reduce((a, c) => {
    let values = [], found = !1, request = c.map((r, i) => Array.isArray(r) && r.length && !found && (index === null || index === i) ? (found = !0, values = r, placeholder) : r);
    return a.push([values, request]), a;
  }, []);
  return falcorChunker(reduced, { ...rest, placeholder });
}, MyModelRoot = class extends import_ModelRoot.default {
  constructor(...args) {
    super(...args), this.listeners = [], this.onChange = this.onChange.bind(this), this.listen = this.listen.bind(this), this.unlisten = this.unlisten.bind(this);
  }
  onChange() {
    this.listeners.forEach((func) => func());
  }
  listen(func) {
    this.listeners.includes(func) || this.listeners.push(func);
  }
  unlisten(func) {
    this.listeners = this.listeners.filter((f) => f !== func);
  }
}, MyModel = class extends import_falcor.Model {
  constructor(...args) {
    super(...args), this.onChange = this.onChange.bind(this), this.remove = this.remove.bind(this), this.chunk = this.chunk.bind(this);
  }
  onChange(listener, func) {
    this._root.listen(listener, func);
  }
  remove(listener) {
    this._root.unlisten(listener);
  }
  get(...args) {
    return super.get(...args).then((res) => res);
  }
  chunk(...args) {
    let [requests, options] = getArgs(args);
    return falcorChunkerNice(...requests, { falcor: this, ...options });
  }
}, falcorGraph = (API_HOST2) => new MyModel({
  _root: new MyModelRoot(),
  source: new CustomSource(API_HOST2 + "/graph", {
    crossDomain: !0,
    withCredentials: !1,
    timeout: 12e4
  }),
  errorSelector: (path, error) => (console.log("errorSelector", path, error), error),
  cache: cacheFromStorage()
}), falcor = falcorGraph("https://graph.availabs.org");

// app/modules/avl-falcor/index.js
var import_jsx_dev_runtime30 = require("react/jsx-dev-runtime"), FalcorContext = import_react33.default.createContext(), useFalcor = () => import_react33.default.useContext(FalcorContext), FalcorConsumer = FalcorContext.Consumer, FalcorProvider = ({ falcor: falcor3, children: children2 }) => {
  let [falcorCache, setFalcorCache] = import_react33.default.useState({}), updateCache = import_react33.default.useMemo(
    () => (0, import_lodash9.default)(() => {
      let cache = falcor3.getCache();
      setFalcorCache(cache);
    }, 250),
    [falcor3]
  );
  import_react33.default.useEffect(() => (falcor3.onChange(updateCache), () => {
    falcor3.remove(updateCache);
  }), [falcor3, updateCache]);
  let falcorValue = import_react33.default.useMemo(
    () => ({ falcor: falcor3, falcorCache }),
    [falcor3, falcorCache]
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime30.jsxDEV)(FalcorContext.Provider, { value: falcorValue, children: children2 }, void 0, !1, {
    fileName: "app/modules/avl-falcor/index.js",
    lineNumber: 35,
    columnNumber: 5
  }, this);
};

// app/styles/app.css
var app_default = "/build/_assets/app-3KPBKCS6.css";

// app/theme.js
var ppdaf = () => {
  let primary = "nuetral", highlight = "white", accent = "blue";
  return {
    graphColors: ["#1e40af", "#93c5fd", "#1d4ed8", "#bfdbfe"],
    graphCategorical: ["#fde72f", "#95d840", "#55a488", "#2f708e", "#453781", "#472354"],
    sidenav: (opts = {}) => {
      let { color: color2 = "white", size = "compact", subMenuStyle = "inline", responsive = "top" } = opts, mobile = {
        top: "hidden md:block",
        side: "hidden md:block",
        none: ""
      }, colors = {
        white: {
          contentBg: `bg-${highlight}`,
          contentBgAccent: "bg-neutral-100",
          accentColor: `${accent}-600`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${primary}-100`,
          textColor: `text-${primary}-600`,
          textColorAccent: "text-slate-800",
          highlightColor: `text-${primary}-800`
        },
        transparent: {
          contentBg: "bg-neutral-100",
          contentBgAccent: "bg-neutral-100",
          accentColor: `${accent}-600`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${primary}-100`,
          textColor: `text-${primary}-600`,
          textColorAccent: "text-slate-800",
          highlightColor: `text-${primary}-800`
        },
        dark: {
          contentBg: "bg-neutral-800",
          contentBgAccent: "bg-neutral-900",
          accentColor: "white",
          accentBg: "",
          borderColor: "border-neutral-700",
          textColor: "text-slate-300",
          textColorAccent: "text-slate-100",
          highlightColor: "text-slate-100",
          sideItem: "text-slate-300 hover:text-white",
          sideItemActive: "text-slate-300 hover:text-white"
        },
        bright: {
          contentBg: `bg-${accent}-700`,
          accentColor: `${accent}-400`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${accent}-600`,
          textColor: `text-${highlight}`,
          highlightColor: `text-${highlight}-500`
        }
      }, sizes = {
        none: {
          wrapper: "w-0 overflow-hidden",
          sideItem: "flex mx-2 pr-4 py-2 text-base ",
          topItem: "flex items-center text-sm px-4 border-r h-12",
          icon: "mr-3 text-lg"
        },
        compact: {
          fixed: "ml-0 md:ml-40",
          wrapper: "w-40",
          itemWrapper: "pt-5",
          sideItem: "flex pr-4 text-base hover:pl-2",
          sideItemActive: "",
          topItem: "flex items-center text-sm px-4 border-r h-12",
          icon: "pl-5  pr-1 py-1 text-[13px]",
          sideItemContent: "py-1 px-1 mt-0.5  text-[14px] "
        },
        full: {
          fixed: "",
          wrapper: "w-full",
          sideItem: "flex px-4 py-2 text-base font-base border-b ",
          topItem: "flex pr-4 py-2 text-sm font-light",
          icon: "mr-4 text-2xl"
        },
        mini: {
          fixed: "ml-0 md:ml-20",
          wrapper: "w-20 overflow-x-hidden  pt-4",
          sideItem: "flex pr-4 py-4 text-base font-base border-b",
          topItem: "flex px-4 items-center text-sm font-light ",
          icon: "w-20 mr-4 text-4xl",
          sideItemContent: "hidden"
        },
        micro: {
          fixed: "ml-0 md:ml-14",
          wrapper: "w-14 overflow-x-hidden",
          itemWrapper: "p-1",
          sideItem: "flex text-base font-base",
          topItem: "flex mx-6 pr-4 py-2 text-sm font-light",
          icon: "w-12 text-2xl hover:bg-neutral-900 px-1 py-3 my-2 rounded-lg mr-4 hover:text-blue-500",
          sideItemContent: "hidden"
        }
      }, subMenuStyles = {
        inline: {
          indicatorIcon: "fa fa-caret-right pt-2.5",
          indicatorIconOpen: "fa fa-caret-down pt-2.5",
          subMenuWrapper: "pl-2 w-full",
          subMenuParentWrapper: "flex flex-col w-full"
        },
        flyout: {
          indicatorIcon: "fa fa-caret-down",
          indicatorIconOpen: "fa fa-caret-right",
          subMenuWrapper: `absolute ml-${sizes[size].width - 8}`,
          subMenuParentWrapper: "flex flex-row",
          subMenuWrapperTop: "absolute top-full"
        }
      };
      return {
        fixed: `md:${sizes[size].fixed}`,
        logoWrapper: `${sizes[size].wrapper} ${colors[color2].contentBgAccent} ${colors[color2].textColorAccent}`,
        sidenavWrapper: `${mobile[responsive]} ${colors[color2].contentBg} ${sizes[size].wrapper} h-full z-20`,
        menuIconSide: `${sizes[size].icon} group-hover:${colors[color2].highlightColor}`,
        itemsWrapper: `${colors[color2].borderColor} ${sizes[size].itemWrapper}  `,
        navItemContent: `${sizes[size].sideItemContent}`,
        navitemSide: `
            group font-sans flex flex-col
            ${sizes[size].sideItem} ${colors[color2].sideItem}
            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
            transition-all cursor-pointer
         `,
        navitemSideActive: `
            group font-sans flex flex-col
            ${sizes[size].sideItem} ${sizes[size].sideItemActive} ${colors[color2].sideItemActive} 
            hover:${colors[color2].highlightColor}
            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
            transition-all cursor-pointer

          `,
        ...subMenuStyles[subMenuStyle],
        vars: {
          colors,
          sizes,
          mobile
        }
      };
    },
    topnav: ({ color: color2 = "white", size = "compact" }) => {
      let colors = {
        white: {
          contentBg: "bg-slate-100",
          accentColor: `${accent}-500`,
          accentBg: `hover:bg-${accent}-500`,
          borderColor: `border-${primary}-100`,
          textColor: `text-${primary}-500`,
          highlightColor: `text-${highlight}`
        },
        bright: {
          contentBg: `bg-${accent}-700`,
          accentColor: `${accent}-400`,
          accentBg: `hover:bg-${accent}-400`,
          borderColor: `border-${accent}-600`,
          textColor: `text-${highlight}`,
          highlightColor: `text-${highlight}`
        }
      }, sizes = {
        compact: {
          menu: "hidden md:flex flex-1 justify-end",
          sideItem: "flex mx-6 pr-4 py-2 text-sm font-light hover:pl-4",
          topItem: `flex items-center text-sm px-4 border-r h-12 ${colors[color2].textColor} ${colors[color2].borderColor}
            ${colors[color2].accentBg} hover:${colors[color2].highlightColor}`,
          activeItem: `flex items-center text-sm px-4 border-r h-12 ${colors[color2].textColor} ${colors[color2].borderColor}
            ${colors[color2].accentBg} hover:${colors[color2].highlightColor}`,
          icon: "mr-3 text-lg",
          responsive: "md:hidden"
        },
        inline: {
          menu: "flex flex-1",
          sideItem: "flex mx-4 pr-4 py-4 text-base font-base border-b hover:pl-4",
          topItem: `flex px-4 py-2 mx-2 font-medium text-gray-400 border-b-2 ${colors[color2].textColor} ${colors[color2].borderColor}
          hover:border-gray-300 hover:text-gray-700 border-gray-100 `,
          activeItem: `flex px-4 py-2 mx-2 font-medium text-blue-600 border-b-2 ${colors[color2].textColor} ${colors[color2].borderColor} border-blue-600 `,
          icon: "mr-4 text-2xl",
          responsive: "hidden"
        }
      };
      return {
        topnavWrapper: `w-full ${colors[color2].contentBg} border-b border-gray-200`,
        topnavContent: "flex w-full h-full",
        topnavMenu: `${sizes[size].menu} h-full overflow-x-auto overflow-y-hidden scrollbar-sm`,
        menuIconTop: `text-${colors[color2].accentColor} ${sizes[size].icon} group-hover:${colors[color2].highlightColor}`,
        menuOpenIcon: "fa fa-bars",
        menuCloseIcon: 'fa fa-xmark fa-fw"',
        navitemTop: `
            group font-sans
            ${sizes[size].topItem}
            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
            transition cursor-pointer
        `,
        topmenuRightNavContainer: "hidden md:block h-full",
        navitemTopActive: ` group font-sans
            ${sizes[size].activeItem}
            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
            transition cursor-pointer
          `,
        mobileButton: `${sizes[size].responsive} ${colors[color2].contentBg} inline-flex items-center justify-center p-2  text-gray-400 hover:bg-gray-100 `,
        vars: {
          colors,
          sizes
        }
      };
    },
    select: (opts = {}) => {
      let { color: color2 = "white" } = opts, colors = {
        white: "white",
        transparent: "gray-100 border border-gray-200 shadow-sm"
      };
      return {
        menuWrapper: `bg-${colors[color2]} my-1`,
        menuItemActive: `px-4 py-2 cursor-not-allowed bg-${accent}-200 border-1 focus:border-${accent}-300`,
        menuItem: `px-4 py-2 cursor-pointer hover:bg-blue-100 border-1 border-${colors[color2]} focus:border-blue-300`,
        select: `bg-${colors[color2]} w-full flex flex-row flex-wrap justify-between px-4 py-2 cursor-pointer focus:border-blue-300`,
        selectIcon: "fal fa-angle-down text-gray-400 pt-2"
      };
    },
    table: (opts = {}) => {
      let { color: color2 = "white", size = "compact" } = opts, colors = {
        white: "bg-white hover:bg-gray-100",
        gray: "bg-gray-100 hover:bg-gray-200",
        transparent: "gray-100"
      }, sizes = {
        compact: "px-2 ",
        full: "px-10 py-5"
      };
      return {
        tableHeader: `${sizes[size]} py-1 border-b-2 bg-gray-100 border-gray-200 text-left font-medium text-gray-600  first:rounded-tl-md last:rounded-tr-md`,
        tableInfoBar: "bg-white",
        tableRow: `${colors[color2]} transition ease-in-out duration-150 border-b border-gray-100`,
        tableRowStriped: "bg-gray-100 even:bg-gray-200 hover:bg-gray-300 transition ease-in-out duration-150",
        tableCell: `${sizes[size]} whitespace-no-wrap`,
        inputSmall: "w-24",
        sortIconDown: "px-2 text-sm fa fa-chevron-down",
        sortIconUp: "px-2 text-sm fa fa-chevron-up",
        vars: {
          color: colors,
          size: sizes
        }
      };
    },
    tabpanel: (opts = {}) => {
      let { tabLocation = "top" } = opts, tabLocations = {
        top: {
          tabpanelWrapper: "flex-col",
          tabWrapper: "flex-row",
          tab: "border-b-2"
        },
        left: {
          tabpanelWrapper: "flex-row",
          tabWrapper: "flex-col",
          tab: "border-r-2"
        }
      };
      return {
        tabpanelWrapper: `flex ${tabLocations[tabLocation].tabpanelWrapper} w-full h-full`,
        tabWrapper: `flex ${tabLocations[tabLocation].tabWrapper}`,
        tab: "px-4 py-2 hover:text-gray-800 cursor-pointer   text-center text-gray-500",
        tabActive: `px-4 py-2 text-${accent}-500 ${tabLocations[tabLocation].tab} border-blue-500 text-center`,
        icon: "",
        tabName: "",
        contentWrapper: "bg-white flex-1 h-full",
        vars: {
          tabLocation: tabLocations
        }
      };
    },
    button: (opts = {}) => {
      let { color: color2 = "white", size = "base", width = "block" } = opts, colors = {
        white: `
                    border border-gray-300  text-gray-700 bg-white hover:text-gray-500
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                    active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out
                    disabled:cursor-not-allowed
                `,
        cancel: `
                    border border-red-300  text-red-700 bg-white hover:text-red-500
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                    active:text-red-800 active:bg-gray-50 transition duration-150 ease-in-out
                    disabled:cursor-not-allowed
                `,
        transparent: `
                    border border-gray-300  text-gray-700 bg-white hover:text-gray-500
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                    active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out
                    disabled:cursor-not-allowed
                `,
        primary: `
                    border border-transparent shadow
                    text-sm leading-4 rounded-sm text-white bg-blue-600 hover:bg-blue-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`,
        danger: ""
      }, sizes = {
        base: "px-4 py-4 leading-5 font-medium",
        sm: "text-sm px-2 py-2 leading-5 font-medium",
        lg: "text-lg px-6 py-6 leading-5 font-medium",
        xl: "text-2xl px-12 py-8 leading-5 font-medium"
      }, widths = {
        block: "",
        full: "w-full"
      };
      return {
        button: `
                  ${colors[color2]} ${sizes[size]} ${widths[width]}
                `,
        vars: {
          color: colors,
          size: sizes,
          width: widths
        }
      };
    },
    input: (opts = {}) => {
      let { color: color2 = "white", size = "small", width = "block" } = opts, colors = {
        white: "bg-white focus:outline-none",
        gray: "bg-gray-100"
      }, sizes = {
        base: "px-4 py-4 font-medium",
        small: "text-sm px-2 py-2 font-medium text-xs",
        large: "text-lg px-6 py-6 font-medium text-xl"
      }, widths = {
        block: "",
        full: "w-full"
      };
      return {
        input: `
                 ${colors[color2]} ${sizes[size]} ${widths[width]}
                `,
        vars: {
          color: colors,
          size: sizes,
          width: widths
        }
      };
    },
    modal: (opts = {}) => {
      let { size = "base", overlay = "default" } = opts, overlays = {
        default: "fixed  inset-0 bg-gray-500 opacity-75",
        none: ""
      }, sizes = {
        base: "sm:max-w-2xl",
        small: "w-64",
        large: "sm:max-w-5xl",
        xlarge: "sm:max-w-8xl"
      };
      return {
        modalContainer: `${overlay === "default" ? "" : "pointer-events-none"} fixed bottom-0 inset-x-0 px-4 pb-4 inset-0 flex items-center justify-center z-50`,
        modalOverlay: overlays[overlay],
        modal: `${sizes[size]} w-full  pointer-events-auto bg-white rounded-lg overflow-hidden shadow-xl transform transition-all`,
        vars: {
          size: sizes,
          overlay: overlays
        }
      };
    },
    shadow: "shadow",
    ySpace: "py-4",
    text: "text-gray-800",
    textContrast: "text-white",
    border: "broder-gray-400",
    textInfo: "text-blue-400",
    bgInfo: "bg-blue-400",
    borderInfo: "border-blue-400",
    textSuccess: "text-blue-400",
    bgSuccess: "bg-blue-400",
    borderSuccess: "border-blue-400",
    textDanger: "text-red-400",
    bgDanger: "bg-red-400",
    borderDanger: "border-red-400",
    textWarning: "text-yellow-400",
    bgWarning: "bg-yellow-400",
    borderWarning: "border-yellow-400",
    textLight: "text-gray-400",
    placeholder: "placeholder-gray-400",
    topMenuBorder: "border-b border-gray-200",
    topMenuScroll: "",
    headerShadow: "",
    navText: "text-gray-100",
    navMenu: "h-full relative",
    navMenuOpen: "bg-darkblue-500 text-white shadow-lg w-56 rounded-t-lg",
    navMenuBg: "bg-darkblue-500 bb-rounded-10 shadow-lg text-white rounded-b-lg",
    navMenuItem: "hover:font-medium cursor-pointer px-2 py-1 text-lg font-semibold",
    bg: "bg-gray-50",
    menuBg: "bg-white z-50",
    menuBgHover: "",
    menuBgActive: "bg-blue-200",
    menuBgActiveHover: "hover:bg-blue-300",
    menuText: "text-gray-100",
    menuTextHover: "hover:text-gray-700",
    menuTextActive: "text-blue-500",
    menuTextActiveHover: "hover:text-blue-700",
    headerBg: "bg-gray-200",
    headerBgHover: "hover:bg-gray-400",
    inputBg: "bg-white disabled:bg-gray-200 cursor-pointer focus:outline-none",
    inputBorder: "rounded border-0 border-transparent hover:border-gray-300 focus:border-gray-600 disabled:border-gray-200",
    inputBgDisabled: "bg-gray-200 cursor-not-allowed focus:outline-none",
    inputBorderDisabled: "rounded border-2 border-gray-200 hover:border-gray-200",
    inputBgFocus: "bg-white cursor-pointer focus:outline-none",
    inputBorderFocus: "rounded border-2 border-transparent hover:border-gray-600 focus:border-gray-600 border-gray-600",
    textBase: "text-base",
    textSmall: "text-sm",
    textLarge: "text-lg",
    paddingBase: "py-1 px-2",
    paddingSmall: "py-0 px-1",
    paddingLarge: "py-2 px-4",
    contentBg: "bg-white",
    accent1: "bg-blue-100",
    accent2: "bg-gray-300",
    accent3: "bg-gray-400",
    accent4: "bg-gray-500",
    highlight1: "bg-blue-200",
    highlight2: "bg-blue-300",
    highlight3: "bg-blue-400",
    highlight4: "bg-blue-500",
    width: "",
    transition: "transition ease-in-out duration-150",
    tableRow: "bg-gray-100 hover:bg-gray-200 transition ease-in-out duration-150",
    tableRowStriped: "bg-gray-100 even:bg-gray-200 hover:bg-gray-300 transition ease-in-out duration-150",
    tableCell: "px-4 py-1 whitespace-no-wrap",
    tableHeader: "px-4 py-2 pb-1 border-b-2 border-gray-300 bg-gray-200 text-left font-medium text-gray-700 uppercase first:rounded-tl-md last:rounded-tr-md"
  };
}, PPDAF_THEME = ppdaf(), theme_default = PPDAF_THEME;

// app/config.js
var API_HOST = "https://graph.availabs.org/";
var CLIENT_HOST = "transportny.org", DAMA_HOST = "https://dama-dev.availabs.org";
API_HOST = "http://localhost:4444", CLIENT_HOST = "localhost:3000", DAMA_HOST = "http://localhost:3369";

// app/root.jsx
var import_jsx_dev_runtime31 = require("react/jsx-dev-runtime");
function links() {
  return [{ rel: "stylesheet", href: app_default }];
}
var meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(import_react34.Meta, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(import_react34.Links, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 38,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.jsx",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)("body", { className: "bg-gray-100", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(ThemeContext.Provider, { value: theme_default, children: /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(FalcorProvider, { falcor: falcorGraph(API_HOST), children: /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(import_react34.Outlet, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 43,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 42,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(import_react34.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 46,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(import_react34.Scripts, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 47,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime31.jsxDEV)(import_react34.LiveReload, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 48,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.jsx",
      lineNumber: 40,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.jsx",
    lineNumber: 35,
    columnNumber: 5
  }, this);
}

// app/routes/__auth.jsx
var auth_exports = {};
__export(auth_exports, {
  default: () => Index,
  loader: () => loader
});
var import_react35 = require("@remix-run/react");

// app/utils/session.server.js
var import_node = require("@remix-run/node"), sessionSecret = "foobar";
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set");
var storage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "availauth_session",
    secure: !1,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: !0
  }
});
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function checkAuth(request, redirectTo) {
  redirectTo || (redirectTo = new URL(request.url).pathname);
  let userSession = (await getUserSession(request)).get("user"), user = null;
  return userSession && (user = JSON.parse(userSession)), user;
}
async function createUserSession(user, redirectTo = "/") {
  let session = await storage.getSession();
  return session.set("user", JSON.stringify(user.user)), (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
async function logout(request) {
  let session = await getUserSession(request);
  return console.log(new URL(request.url).pathname), (0, import_node.redirect)("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

// app/routes/__auth.jsx
var import_jsx_dev_runtime32 = require("react/jsx-dev-runtime");
async function loader({ request }) {
  return await checkAuth(request);
}
function Index() {
  let user = (0, import_react35.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "bg-gray-100 px-4 text-gray-500 min-h-screen", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "flex p-2 text-gray-800 border-b w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)(import_react35.NavLink, { to: "/", className: "p-4", children: "Home" }, void 0, !1, {
        fileName: "app/routes/__auth.jsx",
        lineNumber: 20,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "flex flex-1 justify-end ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "p-4", children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "flex", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("div", { className: "px-4", children: [
          " ",
          user.id,
          " "
        ] }, void 0, !0, {
          fileName: "app/routes/__auth.jsx",
          lineNumber: 25,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("form", { action: "/logout", method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)("button", { type: "submit", className: "", children: "Logout" }, void 0, !1, {
          fileName: "app/routes/__auth.jsx",
          lineNumber: 27,
          columnNumber: 19
        }, this) }, void 0, !1, {
          fileName: "app/routes/__auth.jsx",
          lineNumber: 26,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__auth.jsx",
        lineNumber: 24,
        columnNumber: 16
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)(import_react35.Link, { to: "/login", children: "Login" }, void 0, !1, {
        fileName: "app/routes/__auth.jsx",
        lineNumber: 33,
        columnNumber: 16
      }, this) }, void 0, !1, {
        fileName: "app/routes/__auth.jsx",
        lineNumber: 22,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/__auth.jsx",
        lineNumber: 21,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__auth.jsx",
      lineNumber: 19,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime32.jsxDEV)(import_react35.Outlet, {}, void 0, !1, {
      fileName: "app/routes/__auth.jsx",
      lineNumber: 38,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__auth.jsx",
    lineNumber: 18,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__auth.jsx",
    lineNumber: 17,
    columnNumber: 5
  }, this);
}

// app/routes/__auth/logout.js
var logout_exports = {};
__export(logout_exports, {
  action: () => action
});
var import_node2 = require("@remix-run/node");
var action = async ({
  request
}) => logout(request);

// app/routes/__auth/login.js
var login_exports = {};
__export(login_exports, {
  action: () => action2,
  default: () => LoginComp
});
var import_react36 = require("react"), import_react37 = require("@remix-run/react"), import_node3 = require("@remix-run/node");
var import_jsx_dev_runtime33 = require("react/jsx-dev-runtime"), AUTH_HOST = "https://availauth.availabs.org", PROJECT_NAME = "NPMRDS";
var badRequest = (data) => (0, import_node3.json)(data, { status: 400 }), action2 = async ({
  request
}) => {
  let form = await request.formData(), email = form.get("email"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof email != "string" || typeof password != "string" || typeof redirectTo != "string")
    return badRequest({
      formError: "Form not submitted correctly."
    });
  let res = await (await fetch(`${AUTH_HOST}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, project: PROJECT_NAME })
  })).json();
  return res.error ? badRequest({
    formError: `AUTH Failure : ${res.error}`
  }) : createUserSession(res, redirectTo);
};
function LoginComp() {
  let actionData = (0, import_react37.useActionData)(), [searchParams] = (0, import_react37.useSearchParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "flex-1 bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("pre", { children: JSON.stringify(actionData, null, 3) }, void 0, !1, {
      fileName: "app/routes/__auth/login.js",
      lineNumber: 78,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "bg-white py-8 px-4 shadow-lg sm:rounded-md sm:px-10", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "sm:mx-auto sm:w-full sm:max-w-md border-b border-gray-200", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("h2", { className: "text-xl font-medium text-gray-900" }, void 0, !1, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 81,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("p", { className: "text-lg font-thin text-gray-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("span", { href: "#", className: "font-thin text-blue-400 hover:text-blue-500", children: "Login" }, void 0, !1, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 83,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 82,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__auth/login.js",
        lineNumber: 80,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("form", { className: "space-y-6", method: "post", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)(
          "input",
          {
            type: "hidden",
            name: "redirectTo",
            value: searchParams.get("redirectTo") ?? void 0
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 89,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "pt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("label", { htmlFor: "email", className: "block text-sm font-thin text-gray-700", children: "Email" }, void 0, !1, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 97,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)(
            "input",
            {
              id: "email",
              name: "email",
              type: "email",
              autoComplete: "email",
              placeholder: "Enter your email",
              required: !0,
              className: "appearance-none block w-full px-3 py-2 border-b border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/__auth/login.js",
              lineNumber: 101,
              columnNumber: 17
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 100,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 96,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("label", { htmlFor: "password", className: "block text-sm font-thin text-gray-700", children: "Password" }, void 0, !1, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 114,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)(
            "input",
            {
              id: "password",
              name: "password",
              type: "password",
              autoComplete: "current-password",
              placeholder: "Enter your password",
              required: !0,
              className: "appearance-none block w-full px-3 py-2 border-b border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/__auth/login.js",
              lineNumber: 118,
              columnNumber: 17
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 117,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 113,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "flex items-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)(
              "input",
              {
                id: "remember-me",
                name: "remember-me",
                type: "checkbox",
                className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/__auth/login.js",
                lineNumber: 132,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Remember me" }, void 0, !1, {
              fileName: "app/routes/__auth/login.js",
              lineNumber: 138,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 131,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { className: "text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)(import_react37.Link, { to: "/auth/login", className: "font-medium text-blue-600 hover:text-blue-500", children: "Forgot your password?" }, void 0, !1, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 144,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 143,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 130,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime33.jsxDEV)(
          "button",
          {
            type: "submit",
            className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            children: "Sign in"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__auth/login.js",
            lineNumber: 151,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/__auth/login.js",
          lineNumber: 150,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__auth/login.js",
        lineNumber: 88,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__auth/login.js",
      lineNumber: 79,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__auth/login.js",
    lineNumber: 77,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__auth/login.js",
    lineNumber: 75,
    columnNumber: 5
  }, this);
}

// app/routes/__dama.jsx
var dama_exports = {};
__export(dama_exports, {
  default: () => Index2,
  loader: () => loader2
});
var import_react40 = require("@remix-run/react");

// app/modules/auth/AuthMenu.js
var import_react38 = require("react");
var import_react39 = require("@remix-run/react"), import_jsx_dev_runtime34 = require("react/jsx-dev-runtime"), UserMenu = ({ user }) => /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "flex justify-column align-middle py-1 px-4", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "pt-[4px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("span", { className: `rounded-full border-2 border-blue-400
                    inline-flex items-center justify-center 
                    h-6 w-6 sm:h-8 sm:w-8 ring-white text-white 
                    bg-blue-500 overflow-hidden`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("i", { className: "fa-duotone fa-user fa-fw pt-2 text-2xl", "aria-hidden": "true" }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 14,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 10,
    columnNumber: 17
  }, this) }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 9,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("span", { className: "pl-2", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "text-md font-thin tracking-tighter  text-left text-blue-600 group-hover:text-white ", children: user.email ? user.email : "" }, void 0, !1, {
      fileName: "app/modules/auth/AuthMenu.js",
      lineNumber: 19,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "text-xs font-medium -mt-1 tracking-widest text-left text-gray-500 group-hover:text-gray-200", children: [
      user.groups[0] ? user.groups[0] : "",
      " ",
      user.authLevel
    ] }, void 0, !0, {
      fileName: "app/modules/auth/AuthMenu.js",
      lineNumber: 20,
      columnNumber: 17
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 18,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/auth/AuthMenu.js",
  lineNumber: 8,
  columnNumber: 9
}, this), Item = (to, icon, span, condition) => condition === void 0 || condition ? /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)(import_react39.Link, { to, children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "px-6 py-2 bg-blue-500 text-white hover:text-blue-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "hover:translate-x-2 transition duration-100 ease-out hover:ease-in", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("i", { className: `${icon} ` }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 31,
    columnNumber: 21
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("span", { className: "pl-2", children: span }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 32,
    columnNumber: 21
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/auth/AuthMenu.js",
  lineNumber: 30,
  columnNumber: 17
}, this) }, void 0, !1, {
  fileName: "app/modules/auth/AuthMenu.js",
  lineNumber: 29,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/auth/AuthMenu.js",
  lineNumber: 28,
  columnNumber: 9
}, this) : null, AuthMenu_default = ({ user, items = [] }) => {
  let theme = useTheme(), fetcher = (0, import_react39.useFetcher)(), logout2 = (e) => {
    console.log("onclick logout", e), fetcher.submit(
      {},
      {
        method: "post",
        action: "/logout"
      }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "h-full w-full", children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)(Dropdown_default, { control: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)(UserMenu, { user }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 59,
    columnNumber: 36
  }, this), className: "hover:bg-blue-500 group ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "p-1 bg-blue-500", children: [
    items.filter((item) => !item.auth || user.authLevel).map(
      (item, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "py-1", children: Item(item.to, item.icon, item.text) }, i, !1, {
        fileName: "app/modules/auth/AuthMenu.js",
        lineNumber: 64,
        columnNumber: 33
      }, this)
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "border-t border-blue-400", children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("form", { action: "/logout", method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("button", { type: "submit", onClick: logout2, className: "px-6 py-2 bg-blue-500 text-white hover:text-blue-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "hover:translate-x-2 transition duration-100 ease-out hover:ease-in", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("i", { className: "fad fa-sign-out-alt pb-2" }, void 0, !1, {
        fileName: "app/modules/auth/AuthMenu.js",
        lineNumber: 72,
        columnNumber: 41
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("span", { className: "pl-2", children: "Logout" }, void 0, !1, {
        fileName: "app/modules/auth/AuthMenu.js",
        lineNumber: 73,
        columnNumber: 41
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/auth/AuthMenu.js",
      lineNumber: 71,
      columnNumber: 37
    }, this) }, void 0, !1, {
      fileName: "app/modules/auth/AuthMenu.js",
      lineNumber: 70,
      columnNumber: 33
    }, this) }, void 0, !1, {
      fileName: "app/modules/auth/AuthMenu.js",
      lineNumber: 69,
      columnNumber: 29
    }, this) }, void 0, !1, {
      fileName: "app/modules/auth/AuthMenu.js",
      lineNumber: 68,
      columnNumber: 25
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 60,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 59,
    columnNumber: 17
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)(import_react39.Link, { className: `${theme.topnav({}).navitemTop}`, to: "/login", children: "Login" }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 58,
    columnNumber: 17
  }, this) }, void 0, !1, {
    fileName: "app/modules/auth/AuthMenu.js",
    lineNumber: 56,
    columnNumber: 9
  }, this);
};

// app/routes/__dama.jsx
var import_jsx_dev_runtime35 = require("react/jsx-dev-runtime");
async function loader2({ request }) {
  return await checkAuth(request);
}
function Index2() {
  let user = (0, import_react40.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "bg-gray-100 p-1 text-gray-500 min-h-screen", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "flex p-1 text-gray-800 border-b w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)(import_react40.NavLink, { to: "/", className: "p-4", children: "HAZARDS.ORG" }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 21,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)(import_react40.NavLink, { to: "/datasources", className: "p-4", children: "Data Sources" }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 22,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "flex flex-1 justify-end ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)(
        AuthMenu_default,
        {
          user,
          items: [{
            to: "/source/create",
            text: "New Data Source",
            icon: "fa fa-database"
          }]
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__dama.jsx",
          lineNumber: 25,
          columnNumber: 15
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 24,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 23,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama.jsx",
      lineNumber: 20,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "w-full border-b p-2" }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 37,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)(import_react40.Outlet, { context: { user } }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 38,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama.jsx",
      lineNumber: 36,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama.jsx",
    lineNumber: 19,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dama.jsx",
    lineNumber: 18,
    columnNumber: 5
  }, this);
}

// app/routes/__dama/source/$sourceId.($page)/($viewId).js
var viewId_exports = {};
__export(viewId_exports, {
  action: () => action3,
  default: () => Dama,
  loader: () => loader3
});
var import_react78 = __toESM(require("react"));

// app/utils/falcor.server.ts
var falcor2;
global.__falcor || (console.log("new falcor"), global.__falcor = falcorGraph(API_HOST));
falcor2 = global.__falcor;

// app/modules/data-manager/attributes.js
var SourceAttributes = {
  source_id: "source_id",
  name: "name",
  type: "type",
  update_interval: "update_interval",
  category: "category",
  categories: "categories",
  description: "description",
  statistics: "statistics",
  metadata: "metadata"
}, ViewAttributes = {
  source_id: "source_id",
  view_id: "view_id",
  data_type: "data_type",
  interval_version: "interval_version",
  geography_version: "geography_version",
  version: "version",
  metadata: "metadata",
  source_url: "source_url",
  publisher: "publisher",
  data_table: "data_table",
  download_url: "download_url",
  tiles_url: "tiles_url",
  start_date: "start_date",
  end_date: "end_date",
  last_updated: "last_updated",
  _created_timestamp: "_created_timestamp",
  _modified_timestamp: "_modified_timestamp",
  statistics: "statistics"
}, getAttributes = (data) => Object.entries(data).reduce((out, attr) => {
  let [k, v] = attr;
  return typeof v.value < "u" ? out[k] = v.value : out[k] = v, out;
}, {});
var pgEnv = "hazmit_dama";
var hazardsMeta = {
  hail: { color: "#027B8E", name: "Hail" },
  winterweat: { color: "#76c8c8", name: "Snow Storm" },
  icestorm: { color: "#98d1d1", name: "Ice Storm" },
  coldwave: { color: "#badbdb", name: "Coldwave" },
  coastal: { color: "#54bebe", name: "Coastal Hazards" },
  riverine: { color: "#115f9a", name: "Flooding" },
  tsunami: { color: "#5e569b", name: "Tsunami/Seiche" },
  avalanche: { color: "#776bcd", name: "Avalanche" },
  tornado: { color: "#9080ff", name: "Tornado" },
  lightning: { color: "#beb9db", name: "Lightning" },
  wildfire: { color: "#ff1a40", name: "Wildfire" },
  heatwave: { color: "#ff571a", name: "Heat Wave" },
  volcano: { color: "#FF8066", name: "Volcano" },
  landslide: { color: "#786028", name: "Landslide" },
  earthquake: { color: "#a57c1b", name: "Earthquake" },
  drought: { color: "#d2980d", name: "Drought" },
  hurricane: { color: "#ffb400", name: "Hurricane" },
  wind: { color: "#dedad2", name: "Wind" }
}, ctypeColors = {
  buildings: "#54bebe",
  population: "#115f9a",
  crop: "#ffb400"
};

// app/modules/data-manager/data-types/default/Overview.js
var import_react41 = __toESM(require("react"));
var import_lodash10 = __toESM(require("lodash.get")), import_react42 = require("@remix-run/react");
var import_jsx_dev_runtime36 = require("react/jsx-dev-runtime"), Edit = ({ startValue, attr, sourceId, cancel = () => {
} }) => {
  let [value, setValue] = (0, import_react41.useState)(""), fetcher = (0, import_react42.useFetcher)();
  (0, import_react41.useEffect)(() => {
    setValue(startValue);
  }, [startValue]);
  let save = async (attr2, value2) => {
    if (sourceId) {
      console.log("this is save");
      let res = await fetcher.submit(
        { newData: "newData" },
        {
          method: "post",
          action: `/source/${sourceId}`,
          formData: "this is fd"
        }
      );
      console.log("res?", res);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "w-full flex", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(input_default, { className: "flex-1 px-2 shadow bg-blue-100 focus:ring-blue-700 focus:border-blue-500  border-gray-300 rounded-none rounded-l-md", value, onChange: (e) => setValue(e) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 54,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(Button, { themeOptions: { size: "sm", color: "primary" }, onClick: (e) => save(attr, value), children: " Save " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 55,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(Button, { themeOptions: { size: "sm", color: "cancel" }, onClick: (e) => cancel(), children: " Cancel " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 56,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/Overview.js",
    lineNumber: 53,
    columnNumber: 5
  }, this);
}, OverviewEdit = ({ source, views, user }) => {
  let [editing, setEditing] = import_react41.default.useState(null);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "pl-4 py-6 hover:py-6 sm:pl-6 flex justify-between group", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "flex-1 mt-1 max-w-2xl text-sm text-gray-500", children: editing === "description" ? /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(
        Edit,
        {
          startValue: (0, import_lodash10.default)(source, "description", ""),
          attr: "description",
          sourceId: source.source_id,
          cancel: () => setEditing(null)
        },
        void 0,
        !1,
        {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 69,
          columnNumber: 13
        },
        this
      ) : (0, import_lodash10.default)(source, "description", !1) || "No Description" }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 67,
        columnNumber: 9
      }, this),
      user.authLevel > 5 ? /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "hidden group-hover:block text-blue-500 cursor-pointer", onClick: (e) => setEditing("description"), children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("i", { className: "fad fa-pencil absolute -ml-12  p-2 hover:bg-blue-500 rounded focus:bg-blue-700 hover:text-white " }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 78,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 77,
        columnNumber: 9
      }, this) : ""
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 66,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: [
      Object.keys(SourceAttributes).filter((d) => !["source_id", "metadata", "description", "statistics", "category"].includes(d)).map((attr, i) => {
        let val = typeof source[attr] == "object" ? JSON.stringify(source[attr]) : source[attr];
        return /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "flex justify-between group", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: attr }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 90,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: editing === attr ? /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(
              Edit,
              {
                startValue: val,
                attr,
                sourceId: source.source_id,
                cancel: () => setEditing(null)
              },
              void 0,
              !1,
              {
                fileName: "app/modules/data-manager/data-types/default/Overview.js",
                lineNumber: 94,
                columnNumber: 27
              },
              this
            ) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 93,
              columnNumber: 25
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "py-5 px-2", children: val }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 101,
              columnNumber: 25
            }, this) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 91,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/modules/data-manager/data-types/default/Overview.js",
            lineNumber: 89,
            columnNumber: 19
          }, this),
          user.authLevel > 5 ? /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "hidden group-hover:block text-blue-500 cursor-pointer", onClick: (e) => setEditing(editing === attr ? null : attr), children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("i", { className: "fad fa-pencil absolute -ml-12 mt-3 p-2.5 rounded hover:bg-blue-500 hover:text-white " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/default/Overview.js",
            lineNumber: 107,
            columnNumber: 21
          }, this) }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/default/Overview.js",
            lineNumber: 106,
            columnNumber: 19
          }, this) : ""
        ] }, i, !0, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 88,
          columnNumber: 17
        }, this);
      }),
      /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Versions" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 114,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("ul", { className: "border border-gray-200 rounded-md divide-y divide-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("select", { className: "pl-3 pr-4 py-3 w-full bg-white mr-2 flex items-center justify-between text-sm", children: views.map((v, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("option", { className: "ml-2  truncate", children: v.version }, i, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 120,
          columnNumber: 25
        }, this)) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 117,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 116,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 115,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 113,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 82,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 81,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/Overview.js",
    lineNumber: 65,
    columnNumber: 5
  }, this);
}, Overview_default = OverviewEdit;

// app/modules/data-manager/data-types/default/Metadata.js
var import_react43 = require("react"), import_lodash11 = require("lodash.get"), import_jsx_dev_runtime37 = require("react/jsx-dev-runtime"), Metadata = ({ source, meta: meta2 }) => (console.log("meta", meta2), !meta2 || Object.keys(meta2).length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { children: " Metadata Not Available " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/default/Metadata.js",
  lineNumber: 8,
  columnNumber: 55
}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { className: "overflow-hidden", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Column" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Metadata.js",
      lineNumber: 12,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600", children: "Type" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Metadata.js",
      lineNumber: 15,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/Metadata.js",
    lineNumber: 11,
    columnNumber: 7
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: meta2.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.column_name }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Metadata.js",
      lineNumber: 26,
      columnNumber: 15
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { className: "text-gray-400 italic", children: col.data_type }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Metadata.js",
      lineNumber: 30,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Metadata.js",
      lineNumber: 29,
      columnNumber: 15
    }, this)
  ] }, i, !0, {
    fileName: "app/modules/data-manager/data-types/default/Metadata.js",
    lineNumber: 25,
    columnNumber: 13
  }, this)) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Metadata.js",
    lineNumber: 20,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Metadata.js",
    lineNumber: 19,
    columnNumber: 7
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/default/Metadata.js",
  lineNumber: 10,
  columnNumber: 5
}, this)), Metadata_default = Metadata;

// app/modules/data-manager/data-types/default/AddView.js
var import_react44 = __toESM(require("react")), import_lodash12 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime38 = require("react/jsx-dev-runtime"), AddView = ({ source, views, user }) => {
  let newVersion = Math.max(...views.map((v) => parseInt(v.version))) + 1, [versionName, setVersionName] = (0, import_react44.useState)(newVersion), sourceTypeToFileNameMapping = source.type.substring(0, 3) === "tl_" ? "tiger_2017" : source.type, CreateComp = import_react44.default.useMemo(
    () => (0, import_lodash12.default)(DataTypes, `[${sourceTypeToFileNameMapping}].sourceCreate.component`, () => /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)("div", {}, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/AddView.js",
      lineNumber: 10,
      columnNumber: 93
    }, this)),
    [DataTypes, source, views, user]
  );
  return console.log("??", newVersion, source), /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)(import_jsx_dev_runtime38.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-sm font-medium text-gray-500 ", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)("label", { children: "Version Name:" }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/AddView.js",
        lineNumber: 16,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)(
        "input",
        {
          className: "p-2",
          placeholder: versionName,
          onChange: (e) => setVersionName(e.target.value)
        },
        "versionName",
        !1,
        {
          fileName: "app/modules/data-manager/data-types/default/AddView.js",
          lineNumber: 17,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/default/AddView.js",
      lineNumber: 15,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)(CreateComp, { source, existingSource: source, user, newVersion: versionName }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/AddView.js",
      lineNumber: 23,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/AddView.js",
    lineNumber: 14,
    columnNumber: 12
  }, this);
}, AddView_default = AddView;

// app/modules/data-manager/data-types/utils/utils.js
var checkApiResponse = async (res) => {
  if (!res.ok) {
    let errMsg = res.statusText;
    try {
      let { message } = await res.json();
      errMsg = message;
    } catch (err) {
      console.error(err);
    }
    throw new Error(errMsg);
  }
}, formatDate = (dateString) => {
  let options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: !1 };
  return new Date(dateString).toLocaleDateString(void 0, options);
}, createNewDataSource = async (rtPfx, source, type) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, res = await fetch(`${rtPfx}/createNewDamaSource`, {
    method: "POST",
    body: JSON.stringify({
      name: sourceName,
      display_name: sourceDisplayName,
      type
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await checkApiResponse(res), await res.json();
}, deleteView = async (rtPfx, viewId) => {
  let url = new URL(`${rtPfx}/deleteDamaView`), res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ view_id: viewId }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await checkApiResponse(res), await res.json();
}, deleteSource = async (rtPfx, sourceId) => {
  let url = new URL(`${rtPfx}/deleteDamaSource`), res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ source_id: sourceId }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await checkApiResponse(res), await res.json();
}, submitViewMeta = async ({ rtPfx, etlContextId, userId, sourceName, src, metadata = {}, newVersion = 1 }) => {
  let url = new URL(`${rtPfx}/createNewDamaView`);
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("user_id", userId);
  let viewMetadata = {
    source_id: src.source_id,
    data_source_name: sourceName,
    version: newVersion,
    view_dependencies: Object.values(metadata)
  }, res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(viewMetadata),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await checkApiResponse(res), await res.json();
}, newETL = async ({ rtPfx, setEtlContextId }) => {
  let newEtlCtxRes = await fetch(`${rtPfx}/etl/new-context-id`);
  await checkApiResponse(newEtlCtxRes);
  let _etlCtxId = +await newEtlCtxRes.text();
  return setEtlContextId(_etlCtxId), _etlCtxId;
}, getSrcViews = async ({ rtPfx, setVersions, etlContextId, type }) => {
  if (!etlContextId)
    return {};
  let url = new URL(
    `${rtPfx}/hazard_mitigation/versionSelectorUtils`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("type", type);
  let list2 = await fetch(url);
  await checkApiResponse(list2);
  let {
    sources,
    views
  } = await list2.json();
  return setVersions({ sources, views }), { sources, views };
};

// app/modules/data-manager/data-types/default/Views.js
var import_react45 = require("@remix-run/react"), import_react46 = require("react"), import_react_router_dom5 = require("react-router-dom"), import_jsx_dev_runtime39 = require("react/jsx-dev-runtime"), DeleteButton = ({ text, viewId }) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(
  import_react45.Link,
  {
    className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
    to: `/view/delete/${viewId}`,
    children: text
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 10,
    columnNumber: 5
  },
  this
), MakeAuthoritativeButton = ({ text, viewId }) => {
  let navigate = (0, import_react_router_dom5.useNavigate)(), fetcher = (0, import_react45.useFetcher)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(
    "button",
    {
      className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
      onClick: async () => {
      },
      children: "Make Authoritative"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/data-types/default/Views.js",
      lineNumber: 21,
      columnNumber: 9
    },
    this
  );
}, RenderValue = ({ value, isLink, source_id }) => {
  let processedValue = typeof value == "object" ? "" : value;
  return isLink ? /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(import_react45.Link, { to: `/source/${source_id}/views/${value}`, children: [
    " ",
    processedValue,
    " "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 36,
    columnNumber: 21
  }, this) : processedValue;
}, Views = ({ source, views, user, falcor: falcor3 }) => (console.log(source), /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6 border-b-2", children: ["view_id", "version", "last_updated", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: key }, key, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 52,
    columnNumber: 29
  }, this)) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 48,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: views.map(
    (view, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6", children: [
      ["view_id", "version", "last_updated", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(
        "dd",
        {
          className: "mt-1 text-sm text-gray-900 sm:mt-0 align-middle",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(RenderValue, { value: view[key], isLink: key === "view_id", source_id: source.source_id }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/default/Views.js",
            lineNumber: 71,
            columnNumber: 57
          }, this)
        },
        key,
        !1,
        {
          fileName: "app/modules/data-manager/data-types/default/Views.js",
          lineNumber: 69,
          columnNumber: 53
        },
        this
      )),
      /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 flex justify-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(MakeAuthoritativeButton, { viewId: view.view_id }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 76,
        columnNumber: 45
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 75,
        columnNumber: 41
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 flex justify-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(DeleteButton, { text: "delete", viewId: view.view_id }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 79,
        columnNumber: 45
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 78,
        columnNumber: 41
      }, this)
    ] }, i, !0, {
      fileName: "app/modules/data-manager/data-types/default/Views.js",
      lineNumber: 65,
      columnNumber: 37
    }, this)
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 59,
    columnNumber: 17
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 58,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/default/Views.js",
  lineNumber: 47,
  columnNumber: 9
}, this)), Views_default = Views;

// app/modules/data-manager/data-types/default/index.js
var Pages = {
  overview: {
    name: "Overview",
    path: "",
    component: Overview_default
  },
  metadata: {
    name: "Metadata",
    path: "/metadata",
    component: Metadata_default
  },
  add_view: {
    name: "Add View",
    path: "/add_view",
    component: AddView_default
  },
  views: {
    name: "Views",
    path: "/views",
    component: Views_default
  }
}, default_default = Pages;

// app/modules/data-manager/data-types/freight_atlas_shapefile/index.js
var import_react56 = __toESM(require("react"));
var import_lodash18 = __toESM(require("lodash.get"));

// app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js
var import_react53 = __toESM(require("react"));

// app/modules/avl-map/src/avl-map.js
var import_react50 = __toESM(require("react")), import_maplibre_gl = __toESM(require("maplibre-gl")), import_lodash14 = __toESM(require("lodash.get"));

// app/modules/avl-map/src/components/utils.js
var import_react47 = __toESM(require("react")), getRect2 = (ref) => {
  let node = ref && ref.current;
  return node ? node.getBoundingClientRect() : { width: 0, height: 0 };
}, useSetSize2 = (ref, callback) => {
  let [size, setSize] = import_react47.default.useState({ width: 0, height: 0, x: 0, y: 0 }), doSetSize = import_react47.default.useCallback(() => {
    let rect = getRect2(ref), { width, height, x, y } = rect;
    (width !== size.width || height !== size.height) && (typeof callback == "function" && callback({ width, height, x, y }), setSize({ width, height, x, y }));
  }, [ref, size, callback]);
  return import_react47.default.useEffect(() => (window.addEventListener("resize", doSetSize), () => {
    window.removeEventListener("resize", doSetSize);
  }), [doSetSize]), import_react47.default.useEffect(() => {
    doSetSize();
  }), size;
}, hasValue2 = (value) => value == null || typeof value == "string" && !value.length ? !1 : Array.isArray(value) ? value.reduce((a, c) => a || hasValue2(c), !1) : typeof value == "number" && isNaN(value) ? !1 : typeof value == "object" ? Object.values(value).reduce((a, c) => a || hasValue2(c), !1) : !0;

// app/modules/avl-map/src/components/HoverCompContainer.js
var import_react48 = __toESM(require("react")), import_jsx_dev_runtime40 = require("react/jsx-dev-runtime"), Icon = ({
  onClick,
  cursor = "cursor-pointer",
  className = "",
  style = {},
  children: children2
}) => /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
  "div",
  {
    onClick,
    className: `
        ${cursor} ${className} transition h-6 w-6
        hover:text-blue-500 flex items-center justify-center
      `,
    style: { ...style },
    children: children2
  },
  void 0,
  !1,
  {
    fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
    lineNumber: 11,
    columnNumber: 5
  },
  this
), getTranslate = (pos, { width, height }) => {
  let { x, y } = pos, yMax = height, yTrans = `max(
      ${10}px,
      min(calc(${y}px - 50%), calc(${yMax - 10}px - 100%))
    )`;
  return x < width * 0.5 ? `translate(
      ${x + 30}px,
      ${yTrans}
    )` : `translate(
    calc(-100% + ${x - 30}px),
    ${yTrans}
  )`;
}, getPinnedTranslate = ({ x, y }, orientation) => {
  let yTrans = `calc(${y}px - 50%)`;
  return orientation === "right" ? `translate(
      ${x + 30}px,
      ${yTrans}
    )` : `translate(
    calc(-100% + ${x - 30}px),
    ${yTrans}
  )`;
}, getTransform = ({ x }, orientation) => orientation === "right" ? "translate(-50%, -50%) rotate(45deg) skew(-15deg, -15deg)" : "translate(50%, -50%) rotate(45deg) skew(-15deg, -15deg)", RemoveButton = ({ orientation, children: children2 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
  "div",
  {
    style: {
      transform: orientation === "left" ? "translate(-0.75rem, -0.75rem)" : "translate(0.75rem, -0.75rem)"
    },
    className: `
        bg-white
        rounded absolute inline-block top-0 z-20
        ${orientation === "left" ? "left-0" : "right-0"}
      `,
    children: children2
  },
  void 0,
  !1,
  {
    fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
    lineNumber: 76,
    columnNumber: 5
  },
  this
), PinnedHoverComp = ({ children: children2, remove: remove2, id: id3, project, lngLat, width }) => {
  let pos = project(lngLat), orientation = import_react48.default.useRef(pos.x < width * 0.5 ? "right" : "left"), style = import_react48.default.useMemo(() => ({
    top: "50%",
    transform: getTransform(pos, orientation.current)
  }), [pos]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
    "div",
    {
      className: `
        absolute top-0 left-0 z-20 inline-block
        rounded whitespace-nowrap hover-comp
        pointer-events-auto
        bg-white
        grid grid-cols-1 gap-1
      `,
      style: {
        transform: getPinnedTranslate(pos, orientation.current),
        boxShadow: "2px 2px 8px 0px rgba(0, 0, 0, 0.75)"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
          "div",
          {
            className: `
          absolute w-6 h-6bg-white rounded-bl rounded-tr
          ${orientation.current === "left" ? "right-0" : "left-0"}
        `,
            style
          },
          void 0,
          !1,
          {
            fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
            lineNumber: 117,
            columnNumber: 7
          },
          this
        ),
        children2,
        /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(RemoveButton, { orientation: orientation.current, children: /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(Icon, { onClick: (e) => remove2(id3), children: /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)("span", { className: "fa fa-times" }, void 0, !1, {
          fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
          lineNumber: 127,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
          lineNumber: 126,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
          lineNumber: 125,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
      lineNumber: 105,
      columnNumber: 5
    },
    this
  );
}, HoverCompContainer = ({ show, children: children2, lngLat, project, ...rest }) => {
  let pos = project(lngLat);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
    "div",
    {
      className: `
        absolute top-0 left-0 z-20
        rounded whitespace-nowrap hover-comp
        pointer-events-none
        grid grid-cols-1 gap-1
      `,
      style: {
        display: show ? "grid" : "none",
        transform: getTranslate(pos, rest),
        boxShadow: "2px 2px 8px 0px rgba(0, 0, 0, 0.75)"
      },
      children: children2
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
      lineNumber: 140,
      columnNumber: 5
    },
    this
  );
};

// app/modules/avl-map/src/components/InfoBoxContainer.js
var import_react49 = __toESM(require("react")), import_lodash13 = __toESM(require("lodash.get")), import_jsx_dev_runtime41 = require("react/jsx-dev-runtime"), InfoBoxContainer = ({
  activeLayers,
  width = 320,
  padding = 8,
  MapActions,
  ...props
}) => {
  let [infoBoxLayers, infoBoxWidth] = import_react49.default.useMemo(() => activeLayers.reduce(
    (a, c) => {
      let shownInfoBoxes = c.infoBoxes.filter(({ show = !0 }) => {
        let bool = show;
        return typeof show == "function" && (bool = show(c)), bool;
      });
      return shownInfoBoxes.length && (a[0].push([c, shownInfoBoxes]), a[1] = Math.max(
        a[1],
        c.infoBoxes.reduce((aa, cc) => Math.max(aa, (0, import_lodash13.default)(cc, "width", 0)), 0)
      )), a;
    },
    [[], [], width]
  ), [activeLayers, width]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)(
    "div",
    {
      className: `
        flex flex-col items-end z-30
        pointer-events-none
      `,
      style: { padding: `${padding}px` },
      children: infoBoxLayers.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)(
        "div",
        {
          style: {
            width: `${infoBoxWidth - padding * 2}px`
          },
          children: infoBoxLayers.map(([layer, infoBoxes], y) => /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)("div", { children: infoBoxes.map((box, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)(
            InfoBox,
            {
              ...props,
              ...box,
              layer,
              MapActions,
              activeLayers
            },
            i,
            !1,
            {
              fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
              lineNumber: 53,
              columnNumber: 17
            },
            this
          )) }, y, !1, {
            fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
            lineNumber: 51,
            columnNumber: 13
          }, this))
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
          lineNumber: 45,
          columnNumber: 9
        },
        this
      ) : null
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
      lineNumber: 36,
      columnNumber: 5
    },
    this
  );
}, InfoBoxContainer_default = InfoBoxContainer, InfoBox = ({
  layer,
  Component,
  MapActions,
  ...props
}) => /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)(import_jsx_dev_runtime41.Fragment, { children: Component ? /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)(import_jsx_dev_runtime41.Fragment, { children: typeof Component == "function" ? /* @__PURE__ */ (0, import_jsx_dev_runtime41.jsxDEV)(Component, { layer, MapActions, ...props }, void 0, !1, {
  fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
  lineNumber: 82,
  columnNumber: 13
}, this) : Component }, void 0, !1, {
  fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
  lineNumber: 80,
  columnNumber: 9
}, this) : null }, void 0, !1, {
  fileName: "app/modules/avl-map/src/components/InfoBoxContainer.js",
  lineNumber: 78,
  columnNumber: 5
}, this);

// app/modules/avl-map/src/avl-map.js
var import_jsx_dev_runtime42 = require("react/jsx-dev-runtime"), import_react51 = require("react"), DefaultStyles = [
  { name: "Dark", style: "mapbox://styles/am3081/ckm85o7hq6d8817nr0y6ute5v" },
  { name: "Light", style: "mapbox://styles/am3081/ckm86j4bw11tj18o5zf8y9pou" },
  {
    name: "Satellite",
    style: "mapbox://styles/am3081/cjya6wla3011q1ct52qjcatxg"
  },
  {
    name: "Satellite Streets",
    style: "mapbox://styles/am3081/cjya70364016g1cpmbetipc8u"
  }
], DefaultMapOptions = {
  center: [-74.180647, 42.58],
  minZoom: 2,
  zoom: 10,
  preserveDrawingBuffer: !0,
  styles: DefaultStyles,
  attributionControl: !1,
  maplibreLogo: !1,
  logoPosition: "bottom-left"
}, idCounter = 0, getUniqueId = () => `unique-id-${++idCounter}`, DefaultStaticOptions = {
  size: [80, 50],
  center: [-74.180647, 42.58],
  zoom: 2.5
}, getStaticImageUrl = (style, options = {}) => {
  let { size, center: center2, zoom } = { ...DefaultStaticOptions, ...options };
  return `https://api.mapbox.com/styles/v1/${style.slice(16)}/static/${center2},${zoom}/${size.join("x")}?attribution=false&logo=false&access_token=${import_maplibre_gl.default.accessToken}`;
}, InitialState = {
  map: null,
  initializedLayers: [],
  activeLayers: [],
  dynamicLayers: [],
  layersLoading: {},
  hoverData: {
    data: /* @__PURE__ */ new Map(),
    pos: [0, 0],
    lngLat: {}
  },
  pinnedHoverComps: [],
  pinnedMapMarkers: [],
  mapStyles: [],
  styleIndex: 0,
  sidebarTabIndex: 0,
  modalData: [],
  prevLayerStates: {},
  layerStates: {},
  prevLayerProps: {}
}, Reducer = (state, action7) => {
  let { type, ...payload } = action7;
  switch (type) {
    case "init-layer":
      return {
        ...state,
        initializedLayers: [...state.initializedLayers, payload.layer.id]
      };
    case "loading-start":
      return {
        ...state,
        layersLoading: {
          ...state.layersLoading,
          [payload.layerId]: (0, import_lodash14.default)(state, ["layersLoading", payload.layerId], 0) + 1
        }
      };
    case "loading-stop":
      return {
        ...state,
        layersLoading: {
          ...state.layersLoading,
          [payload.layerId]: Math.max(
            0,
            state.layersLoading[payload.layerId] - 1
          )
        }
      };
    case "activate-layer":
      return {
        ...state,
        activeLayers: [payload.layer, ...state.activeLayers],
        layerStates: {
          ...state.layerStates,
          [payload.layer.id]: payload.layer.state
        }
      };
    case "deactivate-layer":
      return {
        ...state,
        activeLayers: state.activeLayers.filter(
          ({ id: id3 }) => id3 !== payload.layerId
        ),
        layerStates: {
          ...state.layerStates,
          [payload.layerId]: {}
        },
        prevLayerStates: {
          ...state.layerStates,
          [payload.layerId]: {}
        }
      };
    case "hover-layer-move": {
      let { data, layer, HoverComp: HoverComp3, pinnable, sortOrder, ...rest } = payload;
      return state.hoverData.data.set(layer.id, {
        data,
        HoverComp: HoverComp3,
        layer,
        pinnable,
        sortOrder
      }), {
        ...state,
        hoverData: {
          ...state.hoverData,
          ...rest
        }
      };
    }
    case "hover-layer-leave": {
      let { layer } = payload;
      return state.hoverData.data.delete(layer.id), {
        ...state,
        hoverData: {
          ...state.hoverData
        }
      };
    }
    case "pin-hover-comp": {
      if (!state.hoverData.data.size)
        return state;
      let newPinned = {
        id: getUniqueId(),
        HoverComps: [...state.hoverData.data.values()].filter(({ pinnable }) => pinnable).sort((a, b) => a.sortOrder - b.sortOrder),
        ...payload
      };
      return newPinned.HoverComps.length ? {
        ...state,
        pinnedHoverComps: [...state.pinnedHoverComps, newPinned]
      } : state;
    }
    case "remove-pinned":
      return {
        ...state,
        pinnedHoverComps: state.pinnedHoverComps.filter((phc) => phc.id !== payload.id ? !0 : (phc.marker.remove(), !1))
      };
    case "add-dynamic-layer":
      return {
        ...state,
        dynamicLayers: [...state.dynamicLayers, payload.layer]
      };
    case "remove-dynamic-layer":
      return {
        ...state,
        dynamicLayers: state.dynamicLayers.filter(
          ({ id: id3 }) => id3 !== payload.layer.id
        )
      };
    case "show-modal": {
      let { layerId, modalKey } = payload;
      return state.modalData.reduce(
        (a, c) => a || c.layerId === layerId && c.modalKey === modalKey,
        !1
      ) ? state : {
        ...state,
        modalData: [...state.modalData, { layerId, modalKey, zIndex: 0 }]
      };
    }
    case "bring-modal-to-front": {
      let { layerId, modalKey } = payload;
      return {
        ...state,
        modalData: state.modalData.map((md) => ({
          ...md,
          zIndex: md.layerId === layerId && md.modalKey === modalKey ? 10 : 0
        }))
      };
    }
    case "close-modal":
      return {
        ...state,
        modalData: state.modalData.filter(
          ({ layerId, modalKey }) => !(layerId === payload.layerId && modalKey === payload.modalKey)
        )
      };
    case "layer-update": {
      let { layer, newState } = payload;
      return {
        ...state,
        layerStates: {
          ...state.layerStates,
          [layer.id]: newState
        }
      };
    }
    case "update-prev": {
      let { layerProps, updateProps, updateStates } = payload, prevLayerProps = state.prevLayerProps;
      updateProps.length && (prevLayerProps = {
        ...state.prevLayerProps,
        ...updateProps.reduce((a, c) => (a[c.id] = (0, import_lodash14.default)(layerProps, c.id, {}), a), {})
      });
      let prevLayerStates = state.prevLayerStates;
      return updateStates.length && (prevLayerStates = {
        ...state.prevLayerStates,
        ...updateStates.reduce((a, c) => (a[c.id] = (0, import_lodash14.default)(state.layerStates, c.id, {}), a), {})
      }), {
        ...state,
        prevLayerProps,
        prevLayerStates
      };
    }
    case "set-map-style":
    case "switch-tab":
    case "map-loaded":
    case "update-state":
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}, EmptyArray = [], EmptyObject = {}, AvlMap = (props) => {
  let {
    accessToken,
    mapOptions = EmptyObject,
    layers = EmptyArray,
    Sidebar = null,
    layerProps = EmptyObject,
    navigationControl = "bottom-right",
    falcor: falcor3 = () => {
    }
  } = props, [state, dispatch2] = import_react50.default.useReducer(Reducer, InitialState), updateHover = import_react50.default.useCallback((hoverData2) => {
    dispatch2(hoverData2);
  }, []), projectLngLat = import_react50.default.useCallback(
    (lngLat) => state.map.project(lngLat),
    [state.map]
  ), updateFilter = import_react50.default.useCallback(
    (layer, filterName, value) => {
      if (!(0, import_lodash14.default)(layer, ["filters", filterName], null))
        return;
      dispatch2({ type: "loading-start", layerId: layer.id });
      let prevValue = layer.filters[filterName].value;
      layer.filters = {
        ...layer.filters,
        [filterName]: {
          ...layer.filters[filterName],
          prevValue,
          value
        }
      };
      let props2 = (0, import_lodash14.default)(layerProps, layer.id, {});
      Promise.resolve(layer.onFilterChange(filterName, value, prevValue, props2)).then(() => layer.fetchData(falcor3, props2)).then(() => layer.render(state.map, falcor3, props2)).then(() => {
        dispatch2({ type: "loading-stop", layerId: layer.id });
      });
    },
    [state.map, falcor3, layerProps]
  ), fetchData = import_react50.default.useCallback(
    (layer) => {
      dispatch2({ type: "loading-start", layerId: layer.id }), Promise.resolve(layer.fetchData(falcor3)).then(() => layer.render(state.map, falcor3)).then(() => {
        dispatch2({ type: "loading-stop", layerId: layer.id });
      });
    },
    [state.map, falcor3]
  ), updateLegend = import_react50.default.useCallback(
    (layer, update) => {
      !(0, import_lodash14.default)(layer, "legend", null) || (layer.legend = {
        ...layer.legend,
        ...update
      }, layer.render(state.map, falcor3), dispatch2({ type: "update-state" }));
    },
    [state.map, falcor3]
  ), addDynamicLayer = import_react50.default.useCallback((layer) => {
    layer.isDynamic = !0, dispatch2({
      type: "add-dynamic-layer",
      layer
    });
  }, []), removeDynamicLayer = import_react50.default.useCallback(
    (layer) => {
      layer._onRemove(state.map), dispatch2({
        type: "remove-dynamic-layer",
        layer
      });
    },
    [state.map]
  ), toggleVisibility = import_react50.default.useCallback(
    (layer) => {
      layer.toggleVisibility(state.map), dispatch2({ type: "update-state" });
    },
    [state.map]
  ), addLayer = import_react50.default.useCallback(
    (layer) => {
      layer._onAdd(state.map, falcor3, updateHover), dispatch2({
        type: "activate-layer",
        layer
      });
    },
    [state.map, falcor3, updateHover]
  ), removeLayer = import_react50.default.useCallback(
    (layer) => {
      layer._onRemove(state.map), dispatch2({
        type: "deactivate-layer",
        layerId: layer.id
      });
    },
    [state.map]
  ), setSidebarTab = import_react50.default.useCallback((sidebarTabIndex) => {
    dispatch2({
      type: "switch-tab",
      sidebarTabIndex
    });
  }, []), showModal = import_react50.default.useCallback((layerId, modalKey) => {
    dispatch2({
      type: "show-modal",
      layerId,
      modalKey
    });
  }, []), closeModal = import_react50.default.useCallback((layerId, modalKey) => {
    dispatch2({
      type: "close-modal",
      layerId,
      modalKey
    });
  }, []), bringModalToFront = import_react50.default.useCallback((layerId, modalKey) => {
    dispatch2({
      type: "bring-modal-to-front",
      layerId,
      modalKey
    });
  }, []), removePinnedHoverComp = import_react50.default.useCallback((id4) => {
    dispatch2({
      type: "remove-pinned",
      id: id4
    });
  }, []), addPinnedHoverComp = import_react50.default.useCallback(
    ({ lngLat, hoverData: hoverData2 }) => {
      if (hoverData2.pinnable) {
        let marker = new import_maplibre_gl.default.Marker().setLngLat(lngLat).addTo(state.map);
        dispatch2({
          type: "pin-hover-comp",
          marker,
          lngLat
        });
      }
    },
    [state.map]
  ), saveMapAsImage = import_react50.default.useCallback(
    (fileName = "map.png") => {
      let canvas = state.map.getCanvas(), a = document.createElement("a");
      a.download = fileName, a.href = canvas.toDataURL(), a.click();
    },
    [state.map]
  ), setMapStyle = import_react50.default.useCallback(
    (styleIndex) => {
      state.map.once("style.load", (e) => {
        state.activeLayers.slice().reverse().reduce((promise, layer) => promise.then(
          () => layer.onMapStyleChange(state.map, falcor3, updateHover)
        ), Promise.resolve());
      }), state.activeLayers.forEach((layer) => {
        layer._onRemove(state.map);
      }), state.map.setStyle(state.mapStyles[styleIndex].style), dispatch2({
        type: "set-map-style",
        styleIndex
      });
    },
    [state.map, state.mapStyles, state.activeLayers, updateHover, falcor3]
  ), MapActions = import_react50.default.useMemo(
    () => ({
      toggleVisibility,
      addLayer,
      removeLayer,
      addDynamicLayer,
      removeDynamicLayer,
      updateLegend,
      setSidebarTab,
      showModal,
      closeModal,
      updateFilter,
      fetchData,
      removePinnedHoverComp,
      addPinnedHoverComp,
      bringModalToFront,
      projectLngLat,
      saveMapAsImage
    }),
    [
      toggleVisibility,
      addLayer,
      removeLayer,
      addDynamicLayer,
      removeDynamicLayer,
      updateLegend,
      setSidebarTab,
      fetchData,
      saveMapAsImage,
      showModal,
      closeModal,
      updateFilter,
      bringModalToFront,
      removePinnedHoverComp,
      addPinnedHoverComp,
      projectLngLat
    ]
  ), MapOptions = import_react50.default.useRef({ ...DefaultMapOptions, ...mapOptions }), id3 = import_react50.default.useRef(props.id || getUniqueId());
  import_react50.default.useEffect(() => {
    if (!accessToken)
      return;
    import_maplibre_gl.default.accessToken = accessToken;
    let regex = /^mapbox:\/\/styles\//, { style, styles, ...Options } = MapOptions.current, mapStyles = styles.map((style2) => ({
      ...style2,
      imageUrl: getStaticImageUrl(style2.style, { center: Options.center })
    })), styleIndex = 0;
    if (regex.test(style)) {
      let index = mapStyles.reduce((a, c, i) => c.style === style ? i : a, -1);
      index === -1 ? mapStyles.unshift({
        name: "Unspecified Style",
        style,
        imageUrl: getStaticImageUrl(style, Options)
      }) : styleIndex = index;
    }
    let map2 = new import_maplibre_gl.default.Map({
      container: id3.current,
      logoControl: !1,
      ...Options,
      style: mapStyles[styleIndex].style
    });
    return navigationControl && map2.addControl(new import_maplibre_gl.default.NavigationControl(), navigationControl), map2.on("move", (e) => {
      dispatch2({ type: "update-state", mapMoved: performance.now() });
    }), map2.once("load", (e) => {
      dispatch2({ type: "map-loaded", map: map2, mapStyles, styleIndex });
    }), () => map2.remove();
  }, [accessToken, navigationControl]), import_react50.default.useEffect(() => {
    !state.map || [...layers, ...state.dynamicLayers].filter(({ id: id4 }) => !state.initializedLayers.includes(id4)).reverse().reduce((promise, layer) => {
      dispatch2({ type: "init-layer", layer }), layer.dispatchStateUpdate = (layer2, newState) => {
        dispatch2({
          type: "layer-update",
          newState,
          layer: layer2
        });
      }, layer.props = (0, import_lodash14.default)(layerProps, layer.id, {});
      for (let filterName in layer.filters)
        layer.filters[filterName].onChange = (v) => updateFilter(layer, filterName, v);
      return layer.toolbar.forEach((tool) => {
        typeof tool.action == "function" && (tool.actionFunc = tool.action.bind(layer));
      }), layer.mapActions.forEach((action7) => {
        action7.actionFunc = action7.action.bind(layer);
      }), promise.then(() => layer._init(state.map, falcor3, MapActions)).then(() => {
        layer.setActive && layer.fetchData(falcor3).then(() => layer._onAdd(state.map, falcor3, updateHover)).then(() => dispatch2({ type: "activate-layer", layer }));
      });
    }, Promise.resolve());
  }, [
    state.map,
    state.dynamicLayers,
    falcor3,
    layers,
    MapActions,
    updateFilter,
    updateHover,
    state.initializedLayers,
    layerProps
  ]);
  let pinHoverComp = import_react50.default.useCallback(
    ({ lngLat }) => {
      if (state.hoverData.pinnable) {
        let marker = new import_maplibre_gl.default.Marker().setLngLat(lngLat).addTo(state.map);
        dispatch2({
          type: "pin-hover-comp",
          marker,
          lngLat
        });
      }
    },
    [state.map, state.hoverData.pinnable]
  ), hovering = Boolean(state.hoverData.data.size);
  import_react50.default.useEffect(() => {
    if (!!hovering)
      return state.map.on("click", pinHoverComp), () => state.map.off("click", pinHoverComp);
  }, [state.map, pinHoverComp, hovering]);
  let loadingLayers = import_react50.default.useMemo(() => [...layers, ...state.dynamicLayers].filter(
    (layer) => Boolean(state.layersLoading[layer.id])
  ), [layers, state.dynamicLayers, state.layersLoading]), { HoverComps, ...hoverData } = import_react50.default.useMemo(() => {
    let HoverComps2 = [...state.hoverData.data.values()].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    return { ...state.hoverData, show: Boolean(HoverComps2.length), HoverComps: HoverComps2 };
  }, [state.hoverData]), inactiveLayers = import_react50.default.useMemo(() => [...layers, ...state.dynamicLayers].filter((layer) => !state.initializedLayers.includes(layer.id) || !state.activeLayers.includes(layer)), [
    layers,
    state.dynamicLayers,
    state.initializedLayers,
    state.activeLayers
  ]);
  import_react50.default.useEffect(() => {
    let needsFetch = [], needsRender = [];
    state.activeLayers.forEach((layer) => {
      layer.props = (0, import_lodash14.default)(layerProps, layer.id, {});
      let props2 = (0, import_lodash14.default)(layerProps, layer.id, null), prevProps = (0, import_lodash14.default)(state.prevLayerProps, layer.id, null);
      if (props2 !== prevProps) {
        needsFetch.push(layer);
        return;
      }
      let layerState = (0, import_lodash14.default)(state.layerStates, layer.id, null), prevLayerState = (0, import_lodash14.default)(state.prevLayerStates, layer.id, null);
      layerState !== prevLayerState && needsRender.push(layer);
    }), needsFetch.forEach((layer) => {
      fetchData(layer);
    }), needsRender.forEach((layer) => {
      layer.render(state.map, falcor3);
    }), (needsFetch.length || needsRender.length) && dispatch2({
      type: "update-prev",
      layerProps,
      updateProps: needsFetch,
      updateStates: needsRender
    });
  }, [
    state.activeLayers,
    layerProps,
    state.prevLayerProps,
    state.layerStates,
    state.prevLayerStates,
    state.map,
    falcor3,
    fetchData
  ]);
  let ref = import_react50.default.useRef(null), size = useSetSize2(ref), AllMapActions = import_react50.default.useMemo(() => ({ ...MapActions, setMapStyle }), [MapActions, setMapStyle]), getRect3 = import_react50.default.useCallback(() => ref.current ? ref.current.getBoundingClientRect() : { width: 0, height: 0 }, []), { width, height } = getRect3();
  return import_react50.default.useEffect(() => {
    state.map && state.map.resize();
  }, [width, height, state.map]), /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)("div", { ref, className: "w-full h-full relative focus:outline-none", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)("div", { id: id3.current, className: "w-full h-full relative" }, void 0, !1, {
      fileName: "app/modules/avl-map/src/avl-map.js",
      lineNumber: 915,
      columnNumber: 7
    }, this),
    Sidebar ? /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
      Sidebar,
      {
        mapboxMap: state.map,
        layerStates: state.layerStates,
        sidebarTabIndex: state.sidebarTabIndex,
        mapStyles: state.mapStyles,
        styleIndex: state.styleIndex,
        layersLoading: state.layersLoading,
        inactiveLayers,
        activeLayers: state.activeLayers,
        loadingLayers,
        MapActions: AllMapActions
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-map/src/avl-map.js",
        lineNumber: 918,
        columnNumber: 9
      },
      this
    ) : /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)("span", {}, void 0, !1, {
      fileName: "app/modules/avl-map/src/avl-map.js",
      lineNumber: 930,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
      InfoBoxContainer_default,
      {
        activeLayers: state.activeLayers,
        layersLoading: state.layersLoading,
        loadingLayers,
        inactiveLayers,
        MapActions: AllMapActions,
        mapboxMap: state.map,
        layerStates: state.layerStates
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-map/src/avl-map.js",
        lineNumber: 932,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
      "div",
      {
        className: `
        absolute top-0 bottom-0 left-0 right-0 z-50
        pointer-events-none overflow-hidden
      `,
        children: [
          state.pinnedHoverComps.map(
            ({ HoverComps: HoverComps2, data, id: id4, ...hoverData2 }) => /* @__PURE__ */ (0, import_react51.createElement)(
              PinnedHoverComp,
              {
                ...hoverData2,
                ...size,
                remove: removePinnedHoverComp,
                project: projectLngLat,
                key: id4,
                id: id4
              },
              HoverComps2.map(({ HoverComp: HoverComp3, data: data2, layer }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
                HoverComp3,
                {
                  layer,
                  data: data2,
                  activeLayers: state.activeLayers,
                  layersLoading: state.layersLoading,
                  loadingLayers,
                  inactiveLayers,
                  MapActions: AllMapActions,
                  mapboxMap: state.map,
                  layerStates: state.layerStates,
                  pinned: !0
                },
                layer.id,
                !1,
                {
                  fileName: "app/modules/avl-map/src/avl-map.js",
                  lineNumber: 975,
                  columnNumber: 17
                },
                this
              ))
            )
          ),
          Boolean(state.hoverData.data.size) ? /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(HoverCompContainer, { ...hoverData, ...size, project: projectLngLat, children: HoverComps.map(({ HoverComp: HoverComp3, data, layer }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
            HoverComp3,
            {
              layer,
              data,
              activeLayers: state.activeLayers,
              layersLoading: state.layersLoading,
              loadingLayers,
              inactiveLayers,
              MapActions: AllMapActions,
              mapboxMap: state.map,
              layerStates: state.layerStates,
              pinned: !1
            },
            layer.id,
            !1,
            {
              fileName: "app/modules/avl-map/src/avl-map.js",
              lineNumber: 996,
              columnNumber: 15
            },
            this
          )) }, void 0, !1, {
            fileName: "app/modules/avl-map/src/avl-map.js",
            lineNumber: 994,
            columnNumber: 11
          }, this) : null
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/modules/avl-map/src/avl-map.js",
        lineNumber: 942,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/avl-map/src/avl-map.js",
    lineNumber: 914,
    columnNumber: 5
  }, this);
};

// app/modules/avl-map/src/LayerContainer.js
var import_maplibre_gl2 = __toESM(require("maplibre-gl"));

// app/modules/avl-map/src/components/DefaultHoverComp.js
var import_react52 = require("react"), import_jsx_dev_runtime43 = require("react/jsx-dev-runtime"), DefaultHoverComp = ({ data, layer }) => {
  let groups = data.reduce((a, c, i) => {
    (i === 0 || c.length === 1) && a.push([]);
    let ii = a.length - 1;
    return a[ii].push(c), a;
  }, []);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime43.jsxDEV)("div", { className: `
      bg-white p-1 rounded relative z-20 grid grid-cols-1 gap-1
    `, children: groups.map((rows, g) => /* @__PURE__ */ (0, import_jsx_dev_runtime43.jsxDEV)("div", { className: "rounded relative px-1 bg-white", children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime43.jsxDEV)("div", { className: "flex", children: row.map(
    (d, ii) => /* @__PURE__ */ (0, import_jsx_dev_runtime43.jsxDEV)(
      "div",
      {
        className: `
                          ${ii === 0 ? "flex-1 font-bold" : "flex-0"}
                          ${row.length > 1 && ii === 0 ? "mr-4" : ""}
                          ${row.length === 1 && ii === 0 ? `border-b-2 text-lg ${i > 0 ? "mt-1" : ""}` : ""}
                        `,
        children: d
      },
      ii,
      !1,
      {
        fileName: "app/modules/avl-map/src/components/DefaultHoverComp.js",
        lineNumber: 24,
        columnNumber: 23
      },
      this
    )
  ) }, i, !1, {
    fileName: "app/modules/avl-map/src/components/DefaultHoverComp.js",
    lineNumber: 22,
    columnNumber: 17
  }, this)) }, g, !1, {
    fileName: "app/modules/avl-map/src/components/DefaultHoverComp.js",
    lineNumber: 20,
    columnNumber: 11
  }, this)) }, void 0, !1, {
    fileName: "app/modules/avl-map/src/components/DefaultHoverComp.js",
    lineNumber: 16,
    columnNumber: 5
  }, this);
}, DefaultHoverComp_default = DefaultHoverComp;

// app/modules/avl-map/src/LayerContainer.js
var import_lodash15 = __toESM(require("lodash.get"));
var id = -1, getLayerId = () => `avl-layer-${++id}`, DefaultCallback = () => null, DefaultOptions = {
  setActive: !0,
  isDynamic: !1,
  filters: {},
  modals: {},
  mapActions: [],
  sources: [],
  layers: [],
  isVisible: !0,
  toolbar: ["toggle-visibility"],
  legend: null,
  infoBoxes: [],
  props: {},
  state: {},
  mapboxMap: null,
  onHover: !1,
  onClick: !1,
  onBoxSelect: !1
}, LayerContainer = class {
  constructor(options = {}) {
    let Options = { ...DefaultOptions, ...options };
    for (let key in Options)
      this[key] = Options[key];
    this.id = getLayerId(), this.layerVisibility = {}, this.needsRender = this.setActive, this.callbacks = [], this.hoveredFeatures = /* @__PURE__ */ new Map(), this.dispatchStateUpdate = () => {
    }, this.updateState = this.updateState.bind(this);
  }
  _init(mapboxMap, falcor3) {
    return this.mapboxMap = mapboxMap, this.falcor = falcor3, this.init(mapboxMap, falcor3);
  }
  init(mapboxMap, falcor3) {
    return Promise.resolve();
  }
  updateState(newState) {
    typeof newState == "function" ? this.state = newState(this.state) : this.state = { ...this.state, ...newState }, this.dispatchStateUpdate(this, this.state);
  }
  _onAdd(mapboxMap, falcor3, updateHover) {
    return this.sources.forEach(({ id: id3, source }) => {
      mapboxMap.getSource(id3) || mapboxMap.addSource(id3, source);
    }), this.layers.forEach((layer) => {
      mapboxMap.getLayer(layer.id) || (layer.beneath && mapboxMap.getLayer(layer.beneath) ? mapboxMap.addLayer(layer, layer.beneath) : mapboxMap.addLayer(layer), this.isVisible || this._setVisibilityNone(mapboxMap, layer.id), this.layerVisibility[layer.id] = mapboxMap.getLayoutProperty(layer.id, "visibility"));
    }), this.onHover && this.addHover(mapboxMap, updateHover), this.onClick && this.addClick(mapboxMap), this.onBoxSelect && (this.state = {
      ...this.state,
      selection: []
    }, this.addBoxSelect(mapboxMap)), this.onAdd(mapboxMap, falcor3);
  }
  onAdd(mapboxMap, falcor3) {
    return Promise.resolve();
  }
  addClick(mapboxMap) {
    function click(layerId, { point: point2, features, lngLat }) {
      this.onClick.callback.call(this, layerId, features, lngLat, point2);
    }
    this.onClick.layers.forEach((layerId) => {
      if (layerId === "mapboxMap") {
        let callback = click.bind(this, layerId);
        this.callbacks.push({
          action: "click",
          callback
        }), mapboxMap.on("click", callback);
      } else {
        let callback = click.bind(this, layerId);
        this.callbacks.push({
          action: "click",
          callback,
          layerId
        }), mapboxMap.on("click", layerId, callback);
      }
    });
  }
  hoverLeave(mapboxMap, layerId) {
    !this.hoveredFeatures.has(layerId) || (this.hoveredFeatures.get(layerId).forEach((value) => {
      mapboxMap.setFeatureState(value, { hover: !1 });
    }), this.hoveredFeatures.delete(layerId));
  }
  addHover(mapboxMap, updateHover) {
    let callback = (0, import_lodash15.default)(this, ["onHover", "callback"], DefaultCallback).bind(this), HoverComp3 = (0, import_lodash15.default)(this, ["onHover", "HoverComp"], DefaultHoverComp_default), property = (0, import_lodash15.default)(this, ["onHover", "property"], null), filterFunc = (0, import_lodash15.default)(this, ["onHover", "filterFunc"], null), pinnable = (0, import_lodash15.default)(this, ["onHover", "pinnable"], !0), sortOrder = (0, import_lodash15.default)(this, ["onHover", "sortOrder"], 1 / 0), mousemove = (layerId, { point: point2, features, lngLat }) => {
      let hoveredFeatures = this.hoveredFeatures.get(layerId) || /* @__PURE__ */ new Map();
      this.hoveredFeatures.set(layerId, /* @__PURE__ */ new Map());
      let hoverFeatures = (features2) => {
        features2.forEach(({ id: id3, source, sourceLayer }) => {
          if (id3 != null)
            if (hoveredFeatures.has(id3))
              this.hoveredFeatures.get(layerId).set(id3, hoveredFeatures.get(id3)), hoveredFeatures.delete(id3);
            else {
              let value = { id: id3, source, sourceLayer };
              this.hoveredFeatures.get(layerId).set(id3, value), mapboxMap.setFeatureState(value, { hover: !0 });
            }
        });
      }, featuresMap = /* @__PURE__ */ new Map();
      if (property) {
        let properties = features.reduce((a, c) => {
          let prop = (0, import_lodash15.default)(c, ["properties", property], null);
          return prop && (a[prop] = !0), a;
        }, {});
        mapboxMap.queryRenderedFeatures({
          layers: [layerId],
          filter: ["in", ["get", property], ["literal", Object.keys(properties)]]
        }).forEach((feature) => {
          featuresMap.set(feature.id, feature);
        });
      }
      if (filterFunc) {
        let filter2 = filterFunc.call(this, layerId, features, lngLat, point2);
        hasValue2(filter2) && mapboxMap.queryRenderedFeatures({ layers: [layerId], filter: filter2 }).forEach((feature) => {
          featuresMap.set(feature.id, feature);
        });
      }
      features.forEach((feature) => {
        featuresMap.set(feature.id, feature);
      }), hoverFeatures([...featuresMap.values()]), hoveredFeatures.forEach((value) => {
        mapboxMap.setFeatureState(value, { hover: !1 });
      });
      let data = callback(layerId, features, lngLat, point2);
      hasValue2(data) && updateHover({
        pos: [point2.x, point2.y],
        type: "hover-layer-move",
        HoverComp: HoverComp3,
        layer: this,
        pinnable,
        sortOrder,
        lngLat,
        data
      });
    }, mouseleave = (layerId, e) => {
      this.hoverLeave(mapboxMap, layerId), updateHover({
        type: "hover-layer-leave",
        layer: this
      });
    };
    this.onHover.layers.forEach((layerId) => {
      let callback2 = mousemove.bind(this, layerId);
      this.callbacks.push({
        action: "mousemove",
        callback: callback2,
        layerId
      }), mapboxMap.on("mousemove", layerId, callback2), callback2 = mouseleave.bind(this, layerId), this.callbacks.push({
        action: "mouseleave",
        callback: callback2,
        layerId
      }), mapboxMap.on("mouseleave", layerId, callback2);
    }, this);
  }
  addBoxSelect(mapboxMap) {
    let start2, current, box, canvasContainer = mapboxMap.getCanvasContainer(), getPos = (e) => {
      let rect = canvasContainer.getBoundingClientRect();
      return new import_maplibre_gl2.default.Point(
        e.clientX - rect.left - canvasContainer.clientLeft,
        e.clientY - rect.top - canvasContainer.clientTop
      );
    }, mousemove = (e) => {
      if (e.preventDefault(), current = getPos(e), !box) {
        let className = (0, import_lodash15.default)(this, ["onBoxSelect", "className"], "bg-black bg-opacity-50 border-2 border-black");
        box = document.createElement("div"), box.className = "absolute top-0 left-0 w-0 h-0 " + className, canvasContainer.appendChild(box);
      }
      var minX = Math.min(start2.x, current.x), maxX = Math.max(start2.x, current.x), minY = Math.min(start2.y, current.y), maxY = Math.max(start2.y, current.y);
      box.style.transform = `translate( ${minX}px, ${minY}px)`, box.style.width = `${maxX - minX}px`, box.style.height = `${maxY - minY}px`;
    }, mouseup = (e) => {
      finish([start2, getPos(e)]);
    }, keyup = (e) => {
      (e.keyCode === 27 || e.which === 27 || e.code === "Escape") && finish();
    }, finish = (bbox) => {
      if (document.removeEventListener("mousemove", mousemove), document.removeEventListener("mouseup", mouseup), document.removeEventListener("keydown", keyup), mapboxMap.dragPan.enable(), box && (box.parentNode.removeChild(box), box = null), bbox) {
        let featureMap = mapboxMap.queryRenderedFeatures(bbox, {
          layers: (0, import_lodash15.default)(this, ["onBoxSelect", "layers"]),
          filter: (0, import_lodash15.default)(this, ["onBoxSelect", "filter"])
        }).reduce((a, c) => (a[c.id] = c, a), {}), features = Object.values(featureMap), values = [];
        features.forEach((feature) => {
          values.push({
            id: feature.id,
            source: feature.source,
            sourceLayer: feature.sourceLayer
          });
        }), (0, import_lodash15.default)(this, ["onBoxSelect", "selectedValues"], []).forEach((value) => {
          mapboxMap.setFeatureState(value, { select: !1 });
        }), this.onBoxSelect.selectedValues = values, values.forEach((value) => {
          mapboxMap.setFeatureState(value, { select: !0 });
        }), this.updateState({ selection: features });
      }
    }, mousedown = (e) => {
      !(e.shiftKey && e.button === 0) || (document.addEventListener("mousemove", mousemove), document.addEventListener("mouseup", mouseup), document.addEventListener("keydown", keyup), mapboxMap.dragPan.disable(), start2 = getPos(e));
    };
    this.callbacks.push({
      action: "mousemove",
      callback: mousemove,
      element: canvasContainer
    }), canvasContainer.addEventListener("mousedown", mousedown, !0), mapboxMap.boxZoom.disable(), this.onBoxSelect.selectedValues = [];
  }
  _onRemove(mapboxMap) {
    for (; this.callbacks.length; ) {
      let { action: action7, layerId, callback, element } = this.callbacks.pop();
      element ? element.removeEventListener(action7, callback) : layerId ? this.mapboxMap.off(action7, layerId, callback) : this.mapboxMap.off(action7, callback);
    }
    this.layers.forEach(({ id: id3 }) => {
      this.mapboxMap.removeLayer(id3);
    }), this.onRemove(this.mapboxMap);
  }
  onRemove(mapboxMap) {
  }
  fetchData(falcor3) {
    return Promise.resolve();
  }
  render(mapboxMap, falcor3) {
  }
  toggleVisibility(mapboxMap) {
    this.isVisible = !this.isVisible, this.layers.forEach(({ id: id3 }) => {
      this.isVisible ? this._setVisibilityVisible(mapboxMap, id3) : this._setVisibilityNone(mapboxMap, id3);
    });
  }
  _setVisibilityVisible(mapboxMap, layerId) {
    this.layerVisibility[layerId] !== "none" && mapboxMap.setLayoutProperty(layerId, "visibility", "visible");
  }
  _setVisibilityNone(mapboxMap, layerId) {
    mapboxMap.getLayoutProperty(layerId, "visibility") === "none" ? this.layerVisibility[layerId] = "none" : mapboxMap.setLayoutProperty(layerId, "visibility", "none");
  }
  setLayerVisibility(mapboxMap, layer, visibility) {
    let isVisible = this.isVisible && visibility === "visible";
    this.layerVisibility[layer.id] = visibility, visibility = isVisible ? "visible" : "none", mapboxMap.setLayoutProperty(layer.id, "visibility", visibility);
  }
  onFilterChange(filterName, newValue, prevValue) {
  }
  onMapStyleChange(mapboxMap, falcor3, updateHover) {
    this._onAdd(mapboxMap, falcor3, updateHover).then(() => this.render(mapboxMap, falcor3));
  }
};

// app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js
var import_lodash16 = __toESM(require("lodash.get")), import_jsx_dev_runtime44 = require("react/jsx-dev-runtime"), HoverComp = ({ data, layer }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), { layerName, version } = layer, id3 = import_react53.default.useMemo(() => (0, import_lodash16.default)(data, "[0]", null), [data]), attributes = import_react53.default.useMemo(
    () => (0, import_lodash16.default)(layer.source, "metadata", []).map((d) => d.name).filter((d) => !["wkb_geometry", "objectid", "objectid_1"].includes(d)),
    [layer.source]
  );
  import_react53.default.useEffect(() => {
    falcor3.get(
      [
        "nysdot-freight-atlas",
        layerName,
        "byVersion",
        version,
        "byId",
        id3,
        attributes
      ]
    );
  }, [id3, layerName, version, attributes, falcor3]);
  let AttrInfo = import_react53.default.useMemo(() => (0, import_lodash16.default)(falcorCache, [
    "nysdot-freight-atlas",
    layerName,
    "byVersion",
    version,
    "byId",
    id3
  ], {}), [id3, falcorCache, layerName, version]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "bg-white p-4 max-h-64 scrollbar-xs overflow-y-scroll", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "font-medium pb-1 w-full border-b ", children: layer.source.display_name }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    Object.keys(AttrInfo).length === 0 ? `Fetching Attributes ${id3}` : "",
    Object.keys(AttrInfo).map(
      (k, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "flex border-b pt-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "flex-1 font-medium text-sm pl-1", children: k }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js",
          lineNumber: 46,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "flex-1 text-right font-thin pl-4 pr-1", children: AttrInfo[k].value }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js",
          lineNumber: 47,
          columnNumber: 13
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js",
        lineNumber: 45,
        columnNumber: 11
      }, this)
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js",
    lineNumber: 41,
    columnNumber: 5
  }, this);
}, FreightAtlasLayer = class extends LayerContainer {
  legend = {
    type: "quantile",
    domain: [0, 150],
    range: [],
    format: ".2s",
    show: !1,
    Title: ""
  };
  onHover = {
    layers: this.layers.map((d) => d.id),
    callback: (layerId, features, lngLat) => [features[0].properties.id, layerId],
    HoverComp
  };
  init(map2, falcor3) {
    console.log("init freight atlas layer");
    let { data_table } = (0, import_lodash16.default)(this, `views[${this.activeView}]`, "");
    this.layerName = (0, import_lodash16.default)(data_table.split("."), "[1]", "").slice(0, -6), this.version = (0, import_lodash16.default)(data_table.split("."), "[1]", "").slice(-4);
  }
  fetchData(falcor3) {
    let { layerName, version } = this, columns = (0, import_lodash16.default)(this, "symbology", []).reduce((out, curr) => (out.includes(curr.column) || out.push(curr.column), out), []);
    return columns.length > 0 && layerName && version ? falcor3.get([
      "nysdot-freight-atlas",
      layerName,
      "byVersion",
      version,
      "length"
    ]).then((res) => {
      let length = (0, import_lodash16.default)(res, [
        "json",
        "nysdot-freight-atlas",
        layerName,
        "byVersion",
        version,
        "length"
      ], 0);
      return columns.length > 0 && length > 0 ? falcor3.get([
        "nysdot-freight-atlas",
        layerName,
        "byVersion",
        version,
        "byIndex",
        { from: 0, to: length - 1 },
        columns
      ]) : res;
    }) : Promise.resolve({});
  }
  render(map2) {
    let { layerName, version } = this, falcorCache = this.falcor.getCache(), versionData = (0, import_lodash16.default)(falcorCache, [
      "nysdot-freight-atlas",
      layerName,
      "byVersion",
      version,
      "byId"
    ], {});
    (0, import_lodash16.default)(this, "symbology", []).forEach((sym) => {
      switch (sym.type) {
        case "simple":
          map2.setPaintProperty(`${layerName}_v${version}`, sym.paint, isNaN(+sym.value) ? sym.value : +sym.value);
          break;
        default:
          console.log("no type for symbology", sym);
      }
    });
  }
}, FreightAtlasFactory = (options = {}) => new FreightAtlasLayer(options), FreightAtlasLayer_default = FreightAtlasFactory;

// app/modules/data-manager/components/SymbologyControls.js
var import_react54 = __toESM(require("react"));
var import_lodash17 = __toESM(require("lodash.get")), import_jsx_dev_runtime45 = require("react/jsx-dev-runtime"), SymbologyControls = ({ layer, onChange }) => {
  let [symbology, setSymbology] = (0, import_react54.useState)((0, import_lodash17.default)(layer.views, `[${layer.activeView}]metadata.tiles.symbology`, []));
  (0, import_react54.useEffect)(() => {
    onChange(symbology);
  }, [symbology]);
  let mapBoxLayer = import_react54.default.useMemo(
    () => (0, import_lodash17.default)(layer.views, `[${layer.activeView}]metadata.tiles.layers[0]`, {}),
    [layer.views, layer.activeView]
  ), data_table = (0, import_react54.useMemo)(
    () => (0, import_lodash17.default)(layer.views, `[${layer.activeView}].data_table`, ""),
    [layer.views, layer.activeView]
  ), layerName = (0, import_react54.useMemo)(
    () => (0, import_lodash17.default)(data_table.split("."), "[1]", "").slice(0, -6),
    [data_table]
  ), version = (0, import_react54.useMemo)(
    () => (0, import_lodash17.default)(data_table.split("."), "[1]", "").slice(-4),
    [data_table]
  );
  return import_react54.default.useMemo(() => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "border-t border-gray-300 h-full w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
    SymbologyControl,
    {
      layerType: mapBoxLayer.type,
      symbology,
      layerName,
      version,
      setSymbology
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/components/SymbologyControls.js",
      lineNumber: 34,
      columnNumber: 7
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 30,
    columnNumber: 5
  }, this), [mapBoxLayer, symbology, layerName, version]);
}, SymbologyControl = (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
  TabPanel_default,
  {
    tabs: [
      {
        name: "Color",
        layerType: "line",
        paintAttribute: "line-color",
        defaultData: "#ccc",
        Component: ColorControl
      },
      {
        name: "Opacity",
        layerType: "line",
        paintAttribute: "line-opacity",
        defaultData: "1",
        Component: SimpleRangeControl
      },
      {
        name: "Width",
        layerType: "line",
        paintAttribute: "line-width",
        defaultData: "1",
        Component: SimpleNumberControl
      }
    ].filter((attr) => attr.layerType === props.layerType).map((attr) => ({
      name: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "text-sm text-left", children: [
        " ",
        attr.name,
        " "
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/components/SymbologyControls.js",
        lineNumber: 79,
        columnNumber: 20
      }, this),
      Component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(PaintControl, { ...props, ...attr }, void 0, !1, {
        fileName: "app/modules/data-manager/components/SymbologyControls.js",
        lineNumber: 80,
        columnNumber: 31
      }, this)
    })),
    themeOptions: { tabLocation: "left" }
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 73,
    columnNumber: 6
  },
  this
) }, void 0, !1, {
  fileName: "app/modules/data-manager/components/SymbologyControls.js",
  lineNumber: 72,
  columnNumber: 5
}, this), PaintControl = ({
  Component,
  paintAttribute,
  defaultData,
  symbology,
  layerName,
  version,
  setSymbology
}) => {
  let lineColorIndex = (0, import_react54.useMemo)(() => getStyleIndex(symbology, paintAttribute), [symbology]), [lineColor, setLineColor] = (0, import_react54.useState)({
    paint: paintAttribute,
    type: (0, import_lodash17.default)(symbology, `[${lineColorIndex}].type`, "simple"),
    value: (0, import_lodash17.default)(symbology, `[${lineColorIndex}].value`, defaultData),
    range: (0, import_lodash17.default)(symbology, `[${lineColorIndex}].range`, []),
    domain: (0, import_lodash17.default)(symbology, `[${lineColorIndex}].domain`, []),
    column: (0, import_lodash17.default)(symbology, `[${lineColorIndex}].column`, ""),
    options: (0, import_lodash17.default)(symbology, `[${lineColorIndex}].options`, "")
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "flex px-2 py-4 h-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "bg-white flex-1 border border-gray-300 hover:bg-gray-100 h-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
    Component,
    {
      symbology: lineColor,
      onChange: (attr, value) => {
        if (setLineColor({ ...lineColor, [attr]: value }), lineColorIndex === -1)
          setSymbology([
            ...symbology,
            { ...lineColor, [attr]: value }
          ]);
        else {
          let newSymbology = [...symbology];
          newSymbology[lineColorIndex] = { ...lineColor, [attr]: value }, setSymbology(newSymbology);
        }
      }
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/components/SymbologyControls.js",
      lineNumber: 130,
      columnNumber: 5
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 129,
    columnNumber: 4
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 128,
    columnNumber: 3
  }, this);
}, ColorControl = ({ symbology, onChange }) => {
  let renderControl = import_react54.default.useMemo(() => {
    switch (symbology.type) {
      case "simple":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
          SimpleColorControl,
          {
            ...symbology,
            onChange
          },
          void 0,
          !1,
          {
            fileName: "app/modules/data-manager/components/SymbologyControls.js",
            lineNumber: 143,
            columnNumber: 14
          },
          this
        );
      case "scale-ordinal":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
          OrdinalScaleColorControl,
          {
            ...symbology,
            onChange
          },
          void 0,
          !1,
          {
            fileName: "app/modules/data-manager/components/SymbologyControls.js",
            lineNumber: 148,
            columnNumber: 14
          },
          this
        );
      case "scale-threshold":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
          ThresholdScaleColorControl,
          {
            ...symbology,
            onChange
          },
          void 0,
          !1,
          {
            fileName: "app/modules/data-manager/components/SymbologyControls.js",
            lineNumber: 153,
            columnNumber: 14
          },
          this
        );
      default:
        return /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { children: "Invalid Layer" }, void 0, !1, {
          fileName: "app/modules/data-manager/components/SymbologyControls.js",
          lineNumber: 158,
          columnNumber: 14
        }, this);
    }
  }, [symbology]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "p-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
      "select",
      {
        className: "p-2 w-full bg-white",
        value: symbology.type,
        onChange: (v) => onChange("type", v.target.value),
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("option", { value: "simple", children: "Single Color" }, void 0, !1, {
            fileName: "app/modules/data-manager/components/SymbologyControls.js",
            lineNumber: 169,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("option", { value: "scale-ordinal", children: "Category" }, void 0, !1, {
            fileName: "app/modules/data-manager/components/SymbologyControls.js",
            lineNumber: 170,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("option", { value: "scale-threshold", children: "Threshold" }, void 0, !1, {
            fileName: "app/modules/data-manager/components/SymbologyControls.js",
            lineNumber: 171,
            columnNumber: 7
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/modules/data-manager/components/SymbologyControls.js",
        lineNumber: 165,
        columnNumber: 6
      },
      this
    ) }, void 0, !1, {
      fileName: "app/modules/data-manager/components/SymbologyControls.js",
      lineNumber: 164,
      columnNumber: 5
    }, this),
    renderControl
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 163,
    columnNumber: 4
  }, this);
}, SimpleColorControl = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
  input_default,
  {
    value,
    small: !0,
    onChange: (v) => onChange("value", v),
    showInputs: !0
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 182,
    columnNumber: 3
  },
  this
), ThresholdScaleColorControl = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { children: " Threshold Scale Color Control " }, void 0, !1, {
  fileName: "app/modules/data-manager/components/SymbologyControls.js",
  lineNumber: 189,
  columnNumber: 3
}, this), OrdinalScaleColorControl = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { children: " Ordinal Scale Color Control " }, void 0, !1, {
  fileName: "app/modules/data-manager/components/SymbologyControls.js",
  lineNumber: 192,
  columnNumber: 3
}, this), SimpleRangeControl = ({ symbology, onChange, min = 0, max = 1, step = 0.01 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "flex justify-between items-center p-1 ", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "pt-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
    "input",
    {
      type: "range",
      min,
      max,
      step,
      value: symbology.value,
      onChange: (v) => onChange("value", v.target.value)
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/components/SymbologyControls.js",
      lineNumber: 197,
      columnNumber: 5
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 196,
    columnNumber: 4
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { children: symbology.value }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 206,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/components/SymbologyControls.js",
  lineNumber: 195,
  columnNumber: 3
}, this), SimpleNumberControl = ({ symbology, onChange, min = 1, max = 50, step = 1 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "flex justify-between items-center p-1 ", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
    "input",
    {
      className: "p-2 w-full bg-white text-right",
      type: "number",
      min,
      max,
      step,
      value: symbology.value,
      onChange: (v) => onChange("value", v.target.value)
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/components/SymbologyControls.js",
      lineNumber: 212,
      columnNumber: 5
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 211,
    columnNumber: 4
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { children: "px" }, void 0, !1, {
    fileName: "app/modules/data-manager/components/SymbologyControls.js",
    lineNumber: 222,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/components/SymbologyControls.js",
  lineNumber: 210,
  columnNumber: 3
}, this), getStyleIndex = (symbologoy, paint) => symbologoy.reduce((out, current, i) => (current.paint === paint && (out = i), out), -1);

// app/modules/data-manager/data-types/freight_atlas_shapefile/create.js
var import_react55 = require("react"), import_jsx_dev_runtime46 = require("react/jsx-dev-runtime"), Create = () => /* @__PURE__ */ (0, import_jsx_dev_runtime46.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime46.jsxDEV)("div", { children: " Add New Source" }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/create.js",
  lineNumber: 7,
  columnNumber: 7
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/create.js",
  lineNumber: 6,
  columnNumber: 5
}, this), create_default = Create;

// app/utils/mapbox.json
var mapbox_default = { MAPBOX_TOKEN: "pk.eyJ1IjoiYW0zMDgxIiwiYSI6IkxzS0FpU0UifQ.rYv6mHCcNd7KKMs7yhY3rw" };

// app/modules/data-manager/data-types/freight_atlas_shapefile/index.js
var import_jsx_dev_runtime47 = require("react/jsx-dev-runtime"), Map2 = ({ layers }) => {
  let { falcor: falcor3 } = useFalcor(), mapOptions = {
    zoom: 6.2,
    center: [
      -75.95,
      42.89
    ],
    logoPosition: "bottom-right",
    styles: [
      {
        name: "Light",
        style: "mapbox://styles/am3081/ckm86j4bw11tj18o5zf8y9pou"
      },
      {
        name: "Blank Road Labels",
        style: "mapbox://styles/am3081/cl0ieiesd000514mop5fkqjox"
      },
      {
        name: "Dark",
        style: "mapbox://styles/am3081/ckm85o7hq6d8817nr0y6ute5v"
      }
    ]
  }, map_layers = (0, import_react56.useMemo)(() => layers.map((l) => FreightAtlasLayer_default(l)), []);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "w-full h-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(
    AvlMap,
    {
      accessToken: mapbox_default.MAPBOX_TOKEN,
      mapOptions,
      falcor: falcor3,
      layers: map_layers,
      CustomSidebar: () => /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", {}, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
        lineNumber: 48,
        columnNumber: 38
      }, this)
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
      lineNumber: 43,
      columnNumber: 13
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
    lineNumber: 42,
    columnNumber: 9
  }, this);
}, Edit2 = ({ startValue, attr, viewId, parentData, cancel = () => {
} }) => {
  let { falcor: falcor3 } = useFalcor(), [value, setValue] = (0, import_react56.useState)(""), inputEl = (0, import_react56.useRef)(null);
  (0, import_react56.useEffect)(() => {
    setValue(startValue), inputEl.current.focus();
  }, [startValue]), (0, import_react56.useEffect)(() => {
    inputEl.current.style.height = "inherit", inputEl.current.style.height = `${inputEl.current.scrollHeight}px`;
  }, [value]);
  let save = async (attr2, value2) => {
    if (viewId)
      try {
        let update = JSON.parse(value2), val = parentData;
        val.tiles[attr2] = update, await falcor3.set({
          paths: [
            ["datamanager", "views", "byId", viewId, "attributes", "metadata"]
          ],
          jsonGraph: {
            datamanager: {
              views: {
                byId: {
                  [viewId]: {
                    attributes: { metadata: JSON.stringify(val) }
                  }
                }
              }
            }
          }
        }), cancel();
      } catch {
      }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "w-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "w-full flex", children: /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(
      "textarea",
      {
        ref: inputEl,
        className: "flex-1 px-2 shadow text-base bg-blue-100 focus:ring-blue-700 focus:border-blue-500  border-gray-300 rounded-none rounded-l-md",
        value,
        onChange: (e) => setValue(e.target.value)
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
        lineNumber: 107,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(Button, { themeOptions: { size: "sm", color: "primary" }, onClick: (e) => save(attr, value), children: " Save " }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
        lineNumber: 115,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(Button, { themeOptions: { size: "sm", color: "cancel" }, onClick: (e) => cancel(), children: " Cancel " }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
        lineNumber: 116,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
      lineNumber: 114,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
    lineNumber: 105,
    columnNumber: 5
  }, this);
}, MapPage = ({ source, views, user }) => {
  let { falcor: falcor3 } = useFalcor(), [activeView] = (0, import_react56.useState)(0), [mapData] = (0, import_react56.useState)((0, import_lodash18.default)(views, `[${activeView}].metadata.tiles`, {})), [editing, setEditing] = import_react56.default.useState(null), viewId = import_react56.default.useMemo(() => (0, import_lodash18.default)(views, `[${activeView}].id`, null), [views, activeView]), layer = import_react56.default.useMemo(() => ({
    name: source.name,
    source,
    views,
    activeView,
    sources: (0, import_lodash18.default)(mapData, "sources", []),
    layers: (0, import_lodash18.default)(mapData, "layers", []),
    symbology: (0, import_lodash18.default)(mapData, "symbology", [])
  }), [source, views, mapData, activeView]), save = async (attr, value) => {
    if (viewId)
      try {
        let update = value, val = (0, import_lodash18.default)(views, `[${activeView}].metadata`, {});
        val.tiles[attr] = update, await falcor3.set({
          paths: [
            ["datamanager", "views", "byId", viewId, "attributes", "metadata"]
          ],
          jsonGraph: {
            datamanager: {
              views: {
                byId: {
                  [viewId]: {
                    attributes: { metadata: JSON.stringify(val) }
                  }
                }
              }
            }
          }
        });
      } catch {
      }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { children: [
    "Map View ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "w-ful h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(Map2, { layers: [layer] }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
      lineNumber: 181,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
      lineNumber: 180,
      columnNumber: 7
    }, this),
    user.authLevel >= 5 ? /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(
        SymbologyControls,
        {
          layer,
          onChange: (v) => save("symbology", v)
        },
        void 0,
        !1,
        {
          fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
          lineNumber: 185,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: ["sources", "layers", "symbology"].map((attr, i) => {
        let val = JSON.stringify((0, import_lodash18.default)(mapData, attr, []), null, 3);
        return /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "flex justify-between group", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: attr }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
              lineNumber: 196,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-4", children: editing === attr ? /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)(
              Edit2,
              {
                startValue: val,
                attr,
                viewId: (0, import_lodash18.default)(views, `[${activeView}].view_id`, null),
                parentData: (0, import_lodash18.default)(views, `[${activeView}].metadata`, {}),
                cancel: () => setEditing(null)
              },
              void 0,
              !1,
              {
                fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
                lineNumber: 200,
                columnNumber: 27
              },
              this
            ) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
              lineNumber: 199,
              columnNumber: 25
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "py-3 pl-2 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("pre", { className: "bg-gray-100 tracking-tighter overflow-auto scrollbar-xs", children: val }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
              lineNumber: 209,
              columnNumber: 27
            }, this) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
              lineNumber: 208,
              columnNumber: 25
            }, this) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
              lineNumber: 197,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
            lineNumber: 195,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { className: "hidden group-hover:block text-blue-500 cursor-pointer", onClick: (e) => setEditing(editing === attr ? null : attr), children: /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("i", { className: "fad fa-pencil absolute -ml-12 mt-3 p-2.5 rounded hover:bg-blue-500 hover:text-white " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
            lineNumber: 218,
            columnNumber: 21
          }, this) }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
            lineNumber: 217,
            columnNumber: 19
          }, this)
        ] }, i, !0, {
          fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
          lineNumber: 194,
          columnNumber: 17
        }, this);
      }) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
        lineNumber: 189,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
      lineNumber: 184,
      columnNumber: 7
    }, this) : ""
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
    lineNumber: 177,
    columnNumber: 5
  }, this);
}, Table = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime47.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/index.js",
  lineNumber: 231,
  columnNumber: 10
}, this), FreightAtlashShapefileConfig = {
  map: {
    name: "Map",
    path: "/map",
    component: MapPage
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table
  },
  sourceCreate: {
    name: "Create",
    component: create_default
  }
}, freight_atlas_shapefile_default = FreightAtlashShapefileConfig;

// app/modules/data-manager/data-types/npmrdsTravelTime/index.js
var import_react57 = require("react");
var import_jsx_dev_runtime48 = require("react/jsx-dev-runtime"), availableStats = [
  "total_tmcs",
  "total_miles",
  "avg_pct_epochs_reporting",
  "median_pct_epochs_reporting",
  "max_pct_epochs_reporting",
  "min_pct_epochs_reporting",
  "var_pct_epochs_reporting",
  "stddev_pct_epochs_reporting"
], Stats = ({ source }) => {
  let [state, setState] = (0, import_react57.useState)("ny"), [stat, setStat] = (0, import_react57.useState)("total_tmcs"), availableStates = Object.keys(source.statistics).sort(), selectedStats = source.statistics[state], lineData = (0, import_react57.useMemo)(() => {
    let d = {}, yrmos = Object.keys(selectedStats).sort();
    for (let yrmo of yrmos) {
      let frcs = Object.keys(selectedStats[yrmo]);
      for (let frc of frcs) {
        let y = stat === "median_pct_epochs_reporting" ? selectedStats[yrmo][frc].quartiles_pct_epochs_reporting[1] : selectedStats[yrmo][frc][stat];
        d[frc] = d[frc] || [], d[frc].push({
          x: yrmo,
          y
        });
      }
    }
    return Object.keys(d).map((frc) => ({
      id: frc,
      data: d[frc]
    }));
  }, [selectedStats, stat]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime48.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime48.jsxDEV)("h4", { children: "Stats View" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/npmrdsTravelTime/index.js",
      lineNumber: 54,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime48.jsxDEV)(
      Select_default,
      {
        options: availableStates,
        onChange: (state2) => setState(state2),
        value: state,
        multi: !1,
        removable: !1,
        searchable: !1
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/npmrdsTravelTime/index.js",
        lineNumber: 56,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime48.jsxDEV)(
      Select_default,
      {
        options: availableStats,
        onChange: (stat2) => setStat(stat2),
        value: stat,
        multi: !1,
        removable: !1,
        searchable: !1
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/npmrdsTravelTime/index.js",
        lineNumber: 65,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime48.jsxDEV)("div", { className: "bg-white rounded relative", style: { height: "30rem" } }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/npmrdsTravelTime/index.js",
      lineNumber: 74,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/npmrdsTravelTime/index.js",
    lineNumber: 53,
    columnNumber: 5
  }, this);
}, NpmrdsTravelTimeConfig = {
  stats: {
    name: "Stats",
    path: "/stats",
    component: Stats
  }
}, npmrdsTravelTime_default = NpmrdsTravelTimeConfig;

// app/modules/data-manager/data-types/ncei_storm_events/index.js
var import_react59 = require("react");

// app/modules/data-manager/data-types/ncei_storm_events/create.js
var import_react58 = __toESM(require("react"));
var import_react_router_dom6 = require("react-router-dom"), import_jsx_dev_runtime49 = require("react/jsx-dev-runtime"), CallServer = async ({ rtPfx, source, etlContextId, userId, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, "ncei_storm_events");
  console.log("calling server?", etlContextId);
  let view = await submitViewMeta(
    {
      rtPfx,
      etlContextId,
      userId,
      sourceName,
      src,
      newVersion
    }
  ), url = new URL(
    `${rtPfx}/hazard_mitigation/loadNCEI`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "details"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), navigate(`/source/${src.source_id}/views`);
}, Create2 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom6.useNavigate)(), [etlContextId, setEtlContextId] = import_react58.default.useState();
  console.log("src", source);
  let rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react58.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime49.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime49.jsxDEV)(
    "button",
    {
      className: "align-right",
      onClick: () => CallServer({ rtPfx, source, etlContextId, userId: user.id, newVersion, navigate }),
      children: "Add New Source"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/create.js",
      lineNumber: 52,
      columnNumber: 13
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events/create.js",
    lineNumber: 51,
    columnNumber: 9
  }, this);
}, create_default2 = Create2;

// app/modules/data-manager/data-types/ncei_storm_events/index.js
var import_lodash19 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime50 = require("react/jsx-dev-runtime"), Table2 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
  lineNumber: 11,
  columnNumber: 12
}, this), RenderVersions = (domain, value, onchange) => /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)(
  "select",
  {
    className: "w-40 pr-4 py-3 bg-white mr-2 flex items-center text-sm",
    value,
    onChange: (e) => onchange(e.target.value),
    children: domain.map((v, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("option", { value: v.view_id, className: "ml-2  truncate", children: v.version }, i, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 22,
      columnNumber: 13
    }, this))
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
    lineNumber: 15,
    columnNumber: 5
  },
  this
), Stats2 = ({ source, views }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react59.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react59.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react59.useState)(void 0);
  (0, import_react59.useEffect)(() => {
    falcor3.get(["ncei_storm_events", pgEnv, "source", source.source_id, "view", [activeView, compareView], ["numRows", "eventsByYear", "eventsByType"]]);
  }, [activeView, compareView]);
  let metadataActiveView = (0, import_lodash19.default)(falcorCache, ["ncei_storm_events", pgEnv, "source", source.source_id, "view", activeView]), metadataCompareView = (0, import_lodash19.default)(falcorCache, ["ncei_storm_events", pgEnv, "source", source.source_id, "view", compareView]);
  return !metadataActiveView || metadataActiveView.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { children: " Stats Not Available " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
    lineNumber: 38,
    columnNumber: 72
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)(import_jsx_dev_runtime50.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("label", { children: "Current Version: " }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 45,
        columnNumber: 17
      }, this),
      RenderVersions(views, activeView, setActiveView),
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)(
        "button",
        {
          className: `${compareMode ? "bg-red-50 hover:bg-red-400" : "bg-blue-100 hover:bg-blue-600"}
                     hover:text-white align-right border-2 border-gray-100 p-2 hover:bg-gray-100`,
          disabled: views.length === 1,
          onClick: () => setCompareMode(!compareMode),
          children: compareMode ? "Discard" : "Compare"
        },
        void 0,
        !1,
        {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 47,
          columnNumber: 17
        },
        this
      )
    ] }, "versionSelector", !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 44,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
      compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("label", { children: "Compare with Version: " }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 57,
        columnNumber: 33
      }, this) : null,
      compareMode ? RenderVersions(views, compareView, setCompareView) : null
    ] }, "compareVersionSelector", !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 56,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-gray-600", children: "Total Number of Rows" }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 62,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-sm text-gray-900", children: [
        (0, import_lodash19.default)(metadataActiveView, ["numRows", "value"]),
        ` (${views.find((v) => v.view_id.toString() === activeView.toString()).version})`
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 65,
        columnNumber: 21
      }, this),
      compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-sm text-gray-900", children: [
        (0, import_lodash19.default)(metadataCompareView, ["numRows", "value"]),
        ` (${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 72,
        columnNumber: 29
      }, this) : null
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 61,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 60,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-lg font-md", children: "Number of Rows/Events by Year" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 82,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Year" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 89,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 92,
          columnNumber: 25
        }, this),
        compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 98,
          columnNumber: 33
        }, this) : null
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 88,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: (0, import_lodash19.default)(metadataActiveView, ["eventsByYear", "value"], []).map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.year }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 111,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: col.num_events }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 114,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode ? (0, import_lodash19.default)((0, import_lodash19.default)(metadataCompareView, ["eventsByYear", "value"], []).find((row) => row.year === col.year), "num_events") : null }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 118,
          columnNumber: 45
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 110,
        columnNumber: 41
      }, this)) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 105,
        columnNumber: 25
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 104,
        columnNumber: 21
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 87,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 86,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-lg font-md", children: "Number of Rows/Events by Type" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 132,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Event Type" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 137,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 140,
          columnNumber: 21
        }, this),
        compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 146,
          columnNumber: 29
        }, this) : null
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 136,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: (0, import_lodash19.default)(metadataActiveView, ["eventsByType", "value"], []).map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.event_type }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 159,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: col.num_events }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 162,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime50.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode ? (0, import_lodash19.default)((0, import_lodash19.default)(metadataCompareView, ["eventsByType", "value"], []).find((row) => row.event_type === col.event_type), "num_events") : null }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
          lineNumber: 165,
          columnNumber: 41
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 158,
        columnNumber: 37
      }, this)) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 153,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
        lineNumber: 152,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
      lineNumber: 135,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events/index.js",
    lineNumber: 43,
    columnNumber: 9
  }, this);
}, NceiStormEventsConfig = {
  stats: {
    name: "Stats",
    path: "/stats",
    component: Stats2
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table2
  },
  sourceCreate: {
    name: "Create",
    component: create_default2
  }
}, ncei_storm_events_default = NceiStormEventsConfig;

// app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js
var import_react61 = require("react");

// app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js
var import_react60 = __toESM(require("react")), import_lodash20 = __toESM(require("lodash.get"));
var import_react_router_dom7 = require("react-router-dom"), import_jsx_dev_runtime51 = require("react/jsx-dev-runtime"), CallServer2 = async ({ rtPfx, source, etlContextId, userId, viewNCEI = {}, viewZTC = {}, viewCousubs = {}, viewTract = {} }, newVersion, navigate) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, "ncei_storm_events_enhanced");
  console.log("calling server?", etlContextId, src);
  let view = await submitViewMeta({
    rtPfx,
    etlContextId,
    userId,
    sourceName,
    src,
    newVersion,
    metadata: {
      zone_to_county_version: viewZTC.view_id,
      cousubs_version: viewCousubs.view_id,
      tract_version: viewTract.view_id,
      ncei_version: viewNCEI.view_id
    }
  }), url = new URL(
    `${rtPfx}/hazard_mitigation/enhanceNCEI`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "details_enhanced"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id), url.searchParams.append("ncei_schema", viewNCEI.table_schema), url.searchParams.append("ncei_table", viewNCEI.table_name), url.searchParams.append("tract_schema", viewTract.table_schema), url.searchParams.append("tract_table", viewTract.table_name), url.searchParams.append("ztc_schema", viewZTC.table_schema), url.searchParams.append("ztc_table", viewZTC.table_name), url.searchParams.append("cousub_schema", viewCousubs.table_schema), url.searchParams.append("cousub_table", viewCousubs.table_name);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), navigate(`/source/${src.source_id}/views`);
}, RenderVersions2 = ({ value, setValue, versions, type }) => /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: [
    "Select ",
    type,
    " version: "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 52,
    columnNumber: 17
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)(
    "select",
    {
      className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
      value: value || "",
      onChange: (e) => {
        setValue(e.target.value);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
          lineNumber: 61,
          columnNumber: 29
        }, this),
        versions.views.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)(
          "option",
          {
            value: v.view_id,
            className: "p-2",
            children: [
              (0, import_lodash20.default)(versions.sources.find((s) => s.source_id === v.source_id), "display_name"),
              ` (${v.view_id} ${formatDate(v.last_updated)})`
            ]
          },
          v.view_id,
          !0,
          {
            fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
            lineNumber: 64,
            columnNumber: 37
          },
          this
        ))
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
      lineNumber: 55,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 54,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 53,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
  lineNumber: 51,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
  lineNumber: 50,
  columnNumber: 9
}, this), Create3 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom7.useNavigate)(), [etlContextId, setEtlContextId] = import_react60.default.useState(), [viewZTC, setViewZTC] = import_react60.default.useState(), [viewCousubs, setViewCousubs] = import_react60.default.useState(), [viewTract, setViewTract] = import_react60.default.useState(), [viewNCEI, setViewNCEI] = import_react60.default.useState(), [versionsZTC, setVersionsZTC] = import_react60.default.useState({ sources: [], views: [] }), [versionsCousubs, setVersionsCousubs] = import_react60.default.useState({ sources: [], views: [] }), [versionsTract, setVersionsTract] = import_react60.default.useState({ sources: [], views: [] }), [versionsNCEI, setVersionsNCEI] = import_react60.default.useState({ sources: [], views: [] }), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react60.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl), await getSrcViews({ rtPfx, setVersions: setVersionsZTC, etlContextId: etl, type: "zone_to_county" }), await getSrcViews({ rtPfx, setVersions: setVersionsCousubs, etlContextId: etl, type: "tl_cousub" }), await getSrcViews({ rtPfx, setVersions: setVersionsTract, etlContextId: etl, type: "tl_tract" }), await getSrcViews({ rtPfx, setVersions: setVersionsNCEI, etlContextId: etl, type: "ncei_storm_events" });
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("div", { className: "w-full", children: [
    RenderVersions2({ value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: "NCEI Storm Events" }),
    RenderVersions2({ value: viewZTC, setValue: setViewZTC, versions: versionsZTC, type: "Zone to County" }),
    RenderVersions2({ value: viewCousubs, setValue: setViewCousubs, versions: versionsCousubs, type: "Cousubs" }),
    RenderVersions2({ value: viewTract, setValue: setViewTract, versions: versionsTract, type: "Tracts" }),
    /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)(
      "button",
      {
        className: "align-right",
        onClick: () => CallServer2(
          {
            rtPfx,
            source,
            etlContextId,
            userId: user.id,
            viewNCEI: versionsNCEI.views.find((v) => v.view_id == viewNCEI),
            viewZTC: versionsZTC.views.find((v) => v.view_id == viewZTC),
            viewCousubs: versionsCousubs.views.find((v) => v.view_id == viewCousubs),
            viewTract: versionsTract.views.find((v) => v.view_id == viewTract),
            newVersion,
            navigate
          }
        ),
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
        lineNumber: 116,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 111,
    columnNumber: 9
  }, this);
}, create_default3 = Create3;

// app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js
var import_lodash21 = __toESM(require("lodash.get")), import_jsx_dev_runtime52 = require("react/jsx-dev-runtime"), RenderVersions3 = (domain, value, onchange) => /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(
  "select",
  {
    className: "w-40 pr-4 py-3 bg-white mr-2 flex items-center text-sm",
    value,
    onChange: (e) => onchange(e.target.value),
    children: domain.map((v, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("option", { value: v.view_id, className: "ml-2  truncate", children: v.version }, i, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
      lineNumber: 15,
      columnNumber: 13
    }, this))
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
    lineNumber: 8,
    columnNumber: 5
  },
  this
), Stats3 = ({ source, views }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react61.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react61.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react61.useState)(void 0);
  (0, import_react61.useEffect)(() => {
    falcor3.get(
      ["dama", pgEnv, "sources", "byId", source.source_id, "views", "invalidate"],
      ["ncei_storm_events_enhanced", pgEnv, "source", source.source_id, "view", [activeView, compareView], ["numRows", "eventsByYear", "eventsByType"]]
    );
  }, [activeView, compareView]);
  let metadataActiveView = (0, import_lodash21.default)(falcorCache, ["ncei_storm_events_enhanced", pgEnv, "source", source.source_id, "view", activeView]), metadataCompareView = (0, import_lodash21.default)(falcorCache, ["ncei_storm_events_enhanced", pgEnv, "source", source.source_id, "view", compareView]);
  return !metadataActiveView || metadataActiveView.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { children: " Stats Not Available " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
    lineNumber: 34,
    columnNumber: 72
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(import_jsx_dev_runtime52.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("label", { children: "Current Version: " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
            lineNumber: 42,
            columnNumber: 17
          }, this),
          RenderVersions3(views, activeView, setActiveView),
          /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(
            "button",
            {
              className: `${compareMode ? "bg-red-50 hover:bg-red-400" : "bg-blue-100 hover:bg-blue-600"}
                     hover:text-white align-right border-2 border-gray-100 p-2 hover:bg-gray-100`,
              disabled: views.length === 1,
              onClick: () => setCompareMode(!compareMode),
              children: compareMode ? "Discard" : "Compare"
            },
            void 0,
            !1,
            {
              fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
              lineNumber: 44,
              columnNumber: 17
            },
            this
          )
        ]
      },
      "versionSelector",
      !0,
      {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 40,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
        children: [
          compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("label", { children: "Compare with Version: " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
            lineNumber: 55,
            columnNumber: 32
          }, this) : null,
          compareMode ? RenderVersions3(views, compareView, setCompareView) : null
        ]
      },
      "compareVersionSelector",
      !0,
      {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 53,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-gray-600", children: "Total Number of Rows" }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 60,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-sm text-gray-900", children: [
        (0, import_lodash21.default)(metadataActiveView, ["numRows", "value"]),
        ` (${views.find((v) => v.view_id.toString() === activeView.toString()).version})`
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 63,
        columnNumber: 21
      }, this),
      compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-sm text-gray-900", children: [
        (0, import_lodash21.default)(metadataCompareView, ["numRows", "value"]),
        ` (${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 70,
        columnNumber: 29
      }, this) : null
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
      lineNumber: 59,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
      lineNumber: 58,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-lg font-md",
        children: "Number of Rows/Events by Year"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 80,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Year" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 88,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 91,
          columnNumber: 25
        }, this),
        compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 97,
          columnNumber: 33
        }, this) : null
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 87,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: (0, import_lodash21.default)(metadataActiveView, ["eventsByYear", "value"], []).map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.year }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 110,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: col.num_events }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 113,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode ? (0, import_lodash21.default)((0, import_lodash21.default)(metadataCompareView, ["eventsByYear", "value"], []).find((row) => row.year === col.year), "num_events") : null }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 117,
          columnNumber: 45
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 109,
        columnNumber: 41
      }, this)) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 104,
        columnNumber: 25
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 103,
        columnNumber: 21
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
      lineNumber: 86,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
      lineNumber: 85,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-lg font-md",
        children: "Number of Rows/Events by Type"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 131,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Event Type" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 137,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 140,
          columnNumber: 21
        }, this),
        compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Count ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 146,
          columnNumber: 29
        }, this) : null
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 136,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: (0, import_lodash21.default)(metadataActiveView, ["eventsByType", "value"], []).map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.event_type }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 159,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: col.num_events }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 162,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode ? (0, import_lodash21.default)((0, import_lodash21.default)(metadataCompareView, ["eventsByType", "value"], []).find((row) => row.event_type === col.event_type), "num_events") : null }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
          lineNumber: 165,
          columnNumber: 41
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 158,
        columnNumber: 37
      }, this)) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 153,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
        lineNumber: 152,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
      lineNumber: 135,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
    lineNumber: 39,
    columnNumber: 9
  }, this);
}, Table3 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime52.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/index.js",
  lineNumber: 182,
  columnNumber: 12
}, this), NceiStormEventsConfig2 = {
  stats: {
    name: "Stats",
    path: "/stats",
    component: Stats3
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table3
  },
  sourceCreate: {
    name: "Create",
    component: create_default3
  }
}, ncei_storm_events_enhanced_default = NceiStormEventsConfig2;

// app/modules/data-manager/data-types/zone_to_county/index.js
var import_react63 = require("react");

// app/modules/data-manager/data-types/zone_to_county/create.js
var import_react62 = __toESM(require("react"));
var import_react_router_dom8 = require("react-router-dom"), import_jsx_dev_runtime53 = require("react/jsx-dev-runtime"), CallServer3 = async ({ rtPfx, source, etlContextId, userId, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, "zone_to_county");
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/hazard_mitigation/csvUploadAction`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "zone_to_county"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), navigate(`/source/${src.source_id}/views`);
}, Create4 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom8.useNavigate)(), [etlContextId, setEtlContextId] = import_react62.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react62.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime53.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime53.jsxDEV)("button", { onClick: () => CallServer3({
    rtPfx,
    source,
    etlContextId,
    userId: user.id,
    newVersion,
    navigate
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/zone_to_county/create.js",
    lineNumber: 46,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/zone_to_county/create.js",
    lineNumber: 45,
    columnNumber: 9
  }, this);
}, create_default4 = Create4;

// app/modules/data-manager/data-types/zone_to_county/index.js
var import_jsx_dev_runtime54 = require("react/jsx-dev-runtime"), Table4 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime54.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/zone_to_county/index.js",
  lineNumber: 4,
  columnNumber: 10
}, this), ZoneToCountyConfig = {
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime54.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/zone_to_county/index.js",
      lineNumber: 11,
      columnNumber: 22
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table4
  },
  sourceCreate: {
    name: "Create",
    component: create_default4
  }
}, zone_to_county_default = ZoneToCountyConfig;

// app/modules/data-manager/data-types/tiger_2017/index.js
var import_react65 = require("react"), import_lodash22 = require("lodash.get");

// app/modules/data-manager/data-types/tiger_2017/create.js
var import_react64 = __toESM(require("react"));
var import_react_router_dom9 = require("react-router-dom"), import_jsx_dev_runtime55 = require("react/jsx-dev-runtime"), CallServer4 = async ({ rtPfx, source, etlContextId, userId, tigerTable, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, `tl_${tigerTable.toLowerCase()}`);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/hazard_mitigation/tigerDownloadAction`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table", tigerTable), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), navigate(`/source/${src.source_id}/views`);
}, RenderTigerTables = ({ value, setValue, domain }) => /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: "Select Type: " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 35,
    columnNumber: 17
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)(
    "select",
    {
      className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
      value: value || "",
      onChange: (e) => {
        setValue(e.target.value);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
          lineNumber: 44,
          columnNumber: 29
        }, this),
        domain.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)(
          "option",
          {
            value: v,
            className: "p-2",
            children: v
          },
          v,
          !1,
          {
            fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
            lineNumber: 47,
            columnNumber: 37
          },
          this
        ))
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
      lineNumber: 38,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 37,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 36,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
  lineNumber: 34,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
  lineNumber: 33,
  columnNumber: 9
}, this), Create5 = ({ source, user, newVersion }) => {
  console.log(user);
  let navigate = (0, import_react_router_dom9.useNavigate)(), [etlContextId, setEtlContextId] = import_react64.default.useState(), [tigerTable, setTigerTable] = import_react64.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return console.log("comes here"), import_react64.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("div", { className: "w-full", children: [
    RenderTigerTables({ value: tigerTable, setValue: setTigerTable, domain: ["STATE", "COUNTY", "COUSUB", "TRACT"] }),
    /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)(
      "button",
      {
        onClick: () => CallServer4({
          rtPfx,
          source,
          etlContextId,
          userId: user.id,
          tigerTable,
          newVersion,
          navigate
        }),
        disabled: !tigerTable,
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
        lineNumber: 82,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 80,
    columnNumber: 9
  }, this);
}, create_default5 = Create5;

// app/modules/data-manager/data-types/tiger_2017/index.js
var import_jsx_dev_runtime56 = require("react/jsx-dev-runtime"), Table5 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime56.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/tiger_2017/index.js",
  lineNumber: 6,
  columnNumber: 10
}, this), tiger2017Config = {
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime56.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/tiger_2017/index.js",
      lineNumber: 13,
      columnNumber: 22
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table5
  },
  sourceCreate: {
    name: "Create",
    component: create_default5
  }
}, tiger_2017_default = tiger2017Config;

// app/modules/data-manager/data-types/open_fema_data/index.js
var import_react67 = require("react");

// app/modules/data-manager/data-types/open_fema_data/create.js
var import_react66 = __toESM(require("react"));
var import_react_router_dom10 = require("react-router-dom"), import_jsx_dev_runtime57 = require("react/jsx-dev-runtime"), datasets = [
  "disaster_declarations_summaries_v2",
  "fema_web_disaster_declarations_v1",
  "fema_web_disaster_summaries_v1",
  "fima_nfip_claims_v1",
  "hazard_mitigation_assistance_mitigated_properties_v2",
  "hazard_mitigation_assistance_projects_v2",
  "housing_assistance_owners_v2",
  "housing_assistance_renters_v1",
  "individual_assistance_housing_registrants_large_disasters_v1",
  "individuals_and_households_program_valid_registrations_v1",
  "public_assistance_applicants_v1",
  "public_assistance_funded_projects_details_v1",
  "registration_intake_individuals_household_programs_v2"
], RenderDatasets = ({ value, setValue, datasets: datasets2 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: "Select Table: " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 49,
    columnNumber: 17
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)(
    "select",
    {
      className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
      value: value || "",
      onChange: (e) => {
        setValue(e.target.value);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
          lineNumber: 58,
          columnNumber: 29
        }, this),
        datasets2.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)(
          "option",
          {
            value: v,
            className: "p-2",
            children: v
          },
          v,
          !1,
          {
            fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
            lineNumber: 61,
            columnNumber: 37
          },
          this
        ))
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
      lineNumber: 52,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 51,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 50,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
  lineNumber: 48,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
  lineNumber: 47,
  columnNumber: 9
}, this), CallServer5 = async ({ rtPfx, source, etlContextId, userId, table, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/hazard_mitigation/openFemaDataLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), navigate(`/source/${src.source_id}/views`);
}, Create6 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom10.useNavigate)(), [etlContextId, setEtlContextId] = import_react66.default.useState(), [table, setTable] = import_react66.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react66.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("div", { className: "w-full", children: [
    RenderDatasets({ value: table, setValue: setTable, datasets }),
    /* @__PURE__ */ (0, import_jsx_dev_runtime57.jsxDEV)("button", { onClick: () => CallServer5({
      rtPfx,
      source,
      etlContextId,
      userId: user.id,
      table,
      newVersion,
      navigate
    }), children: " Add New Source" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
      lineNumber: 117,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 115,
    columnNumber: 9
  }, this);
}, create_default6 = Create6;

// app/modules/data-manager/data-types/open_fema_data/index.js
var import_jsx_dev_runtime58 = require("react/jsx-dev-runtime"), Table6 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime58.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/open_fema_data/index.js",
  lineNumber: 6,
  columnNumber: 10
}, this), FreightAtlashShapefileConfig2 = {
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime58.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/open_fema_data/index.js",
      lineNumber: 15,
      columnNumber: 22
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table6
  },
  sourceCreate: {
    name: "Create",
    component: create_default6
  }
}, open_fema_data_default = FreightAtlashShapefileConfig2;

// app/modules/data-manager/data-types/usda/index.js
var import_react69 = require("react");

// app/modules/data-manager/data-types/usda/create.js
var import_react68 = __toESM(require("react"));
var import_react_router_dom11 = require("react-router-dom"), import_jsx_dev_runtime59 = require("react/jsx-dev-runtime"), CallServer6 = async ({ rtPfx, source, etlContextId, userId, table, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/hazard_mitigation/usdaLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), navigate(`/source/${src.source_id}/views`);
}, Create7 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom11.useNavigate)(), [etlContextId, setEtlContextId] = import_react68.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react68.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime59.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime59.jsxDEV)("button", { onClick: () => CallServer6({
    rtPfx,
    source,
    etlContextId,
    userId: user.id,
    table: "usda_crop_insurance_cause_of_loss",
    newVersion,
    navigate
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/usda/create.js",
    lineNumber: 46,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/usda/create.js",
    lineNumber: 45,
    columnNumber: 9
  }, this);
}, create_default7 = Create7;

// app/modules/data-manager/data-types/usda/index.js
var import_jsx_dev_runtime60 = require("react/jsx-dev-runtime"), Table7 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime60.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/usda/index.js",
  lineNumber: 5,
  columnNumber: 10
}, this), FreightAtlashShapefileConfig3 = {
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime60.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/usda/index.js",
      lineNumber: 14,
      columnNumber: 22
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table7
  },
  sourceCreate: {
    name: "Create",
    component: create_default7
  }
}, usda_default = FreightAtlashShapefileConfig3;

// app/modules/data-manager/data-types/sba/index.js
var import_react71 = require("react");

// app/modules/data-manager/data-types/sba/create.js
var import_react70 = __toESM(require("react"));
var import_react_router_dom12 = require("react-router-dom"), import_jsx_dev_runtime61 = require("react/jsx-dev-runtime"), CallServer7 = async ({ rtPfx, source, etlContextId, userId, table, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/hazard_mitigation/sbaLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), navigate(`/source/${src.source_id}/views`);
}, Create8 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom12.useNavigate)(), [etlContextId, setEtlContextId] = import_react70.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react70.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime61.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime61.jsxDEV)("button", { onClick: () => CallServer7({
    rtPfx,
    source,
    etlContextId,
    userId: user.id,
    table: "sba_disaster_loan_data_new",
    newVersion,
    navigate
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/sba/create.js",
    lineNumber: 46,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/sba/create.js",
    lineNumber: 45,
    columnNumber: 9
  }, this);
}, create_default8 = Create8;

// app/modules/data-manager/data-types/sba/index.js
var import_jsx_dev_runtime62 = require("react/jsx-dev-runtime"), Table8 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime62.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/sba/index.js",
  lineNumber: 5,
  columnNumber: 10
}, this), FreightAtlashShapefileConfig4 = {
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime62.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/sba/index.js",
      lineNumber: 12,
      columnNumber: 22
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table8
  },
  sourceCreate: {
    name: "Create",
    component: create_default8
  }
}, sba_default = FreightAtlashShapefileConfig4;

// app/modules/data-manager/data-types/nri/index.js
var import_react73 = require("react");

// app/modules/data-manager/data-types/nri/create.js
var import_react72 = __toESM(require("react"));
var import_react_router_dom13 = require("react-router-dom"), import_jsx_dev_runtime63 = require("react/jsx-dev-runtime"), CallServer8 = async ({ rtPfx, source, etlContextId, userId, table, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/hazard_mitigation/nriLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), navigate(`/source/${src.source_id}/views`);
}, Create9 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom13.useNavigate)(), [etlContextId, setEtlContextId] = import_react72.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react72.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime63.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime63.jsxDEV)("button", { onClick: () => CallServer8({
    rtPfx,
    source,
    etlContextId,
    userId: user.id,
    table: "nri",
    newVersion,
    navigate
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/nri/create.js",
    lineNumber: 45,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/nri/create.js",
    lineNumber: 44,
    columnNumber: 9
  }, this);
}, create_default9 = Create9;

// app/modules/data-manager/data-types/nri/index.js
var import_jsx_dev_runtime64 = require("react/jsx-dev-runtime"), Table9 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime64.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/nri/index.js",
  lineNumber: 4,
  columnNumber: 10
}, this), FreightAtlashShapefileConfig5 = {
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime64.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/nri/index.js",
      lineNumber: 11,
      columnNumber: 22
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table9
  },
  sourceCreate: {
    name: "Create",
    component: create_default9
  }
}, nri_default = FreightAtlashShapefileConfig5;

// app/modules/data-manager/data-types/per_basis_swd/index.js
var import_react75 = require("react");

// app/modules/data-manager/data-types/per_basis_swd/create.js
var import_react74 = __toESM(require("react")), import_lodash23 = __toESM(require("lodash.get"));
var import_react_router_dom14 = require("react-router-dom"), import_jsx_dev_runtime65 = require("react/jsx-dev-runtime"), CallServer9 = async ({ rtPfx, source, etlContextId, userId, viewNCEI = {}, viewNRI = {}, newVersion, navigate }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, "per_basis");
  console.log("calling server?", etlContextId, src);
  let view = await submitViewMeta({
    rtPfx,
    etlContextId,
    userId,
    sourceName,
    src,
    newVersion,
    metadata: {
      ncei_version: viewNCEI.view_id,
      nri_version: viewNRI.view_id
    }
  }), url = new URL(
    `${rtPfx}/hazard_mitigation/pbSWDLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "per_basis_swd"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id), url.searchParams.append("ncei_schema", viewNCEI.table_schema), url.searchParams.append("ncei_table", viewNCEI.table_name), url.searchParams.append("nri_schema", viewNRI.table_schema), url.searchParams.append("nri_table", viewNRI.table_name);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), navigate(`/source/${src.source_id}/views`);
}, RenderVersions4 = ({ value, setValue, versions, type }) => /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: [
    "Select ",
    type,
    " version: "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 45,
    columnNumber: 17
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)(
    "select",
    {
      className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
      value: value || "",
      onChange: (e) => {
        setValue(e.target.value);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
          lineNumber: 54,
          columnNumber: 29
        }, this),
        versions.views.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)(
          "option",
          {
            value: v.view_id,
            className: "p-2",
            children: [
              (0, import_lodash23.default)(versions.sources.find((s) => s.source_id === v.source_id), "display_name"),
              ` (${v.view_id} ${formatDate(v.last_updated)})`
            ]
          },
          v.view_id,
          !0,
          {
            fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
            lineNumber: 57,
            columnNumber: 37
          },
          this
        ))
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
      lineNumber: 48,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 47,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 46,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
  lineNumber: 44,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
  lineNumber: 43,
  columnNumber: 9
}, this), Create10 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom14.useNavigate)(), [etlContextId, setEtlContextId] = import_react74.default.useState();
  console.log("this loads", newVersion);
  let [viewNCEI, setViewNCEI] = import_react74.default.useState(), [viewNRI, setViewNRI] = import_react74.default.useState(), [versionsNCEI, setVersionsNCEI] = import_react74.default.useState({ sources: [], views: [] }), [versionsNRI, setVersionsNRI] = import_react74.default.useState({ sources: [], views: [] }), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react74.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl), await getSrcViews({ rtPfx, setVersions: setVersionsNCEI, etlContextId: etl, type: "ncei_storm_events_enhanced" }), await getSrcViews({ rtPfx, setVersions: setVersionsNRI, etlContextId: etl, type: "nri" });
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("div", { className: "w-full", children: [
    RenderVersions4({ value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: "NCEI Storm Events" }),
    RenderVersions4({ value: viewNRI, setValue: setViewNRI, versions: versionsNRI, type: "NRI" }),
    /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)(
      "button",
      {
        className: "align-right",
        onClick: () => CallServer9(
          {
            rtPfx,
            source,
            etlContextId,
            userId: user.id,
            viewNCEI: versionsNCEI.views.find((v) => v.view_id == viewNCEI),
            viewNRI: versionsNRI.views.find((v) => v.view_id == viewNRI),
            newVersion,
            navigate
          }
        ),
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
        lineNumber: 101,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 98,
    columnNumber: 9
  }, this);
}, create_default10 = Create10;

// app/modules/data-manager/data-types/per_basis_swd/index.js
var import_lodash24 = __toESM(require("lodash.get")), import_jsx_dev_runtime66 = require("react/jsx-dev-runtime"), Table10 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
  lineNumber: 7,
  columnNumber: 10
}, this), RenderVersions5 = (domain, value, onchange) => /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)(
  "select",
  {
    className: "w-40 pr-4 py-3 bg-white mr-2 flex items-center text-sm",
    value,
    onChange: (e) => onchange(e.target.value),
    children: domain.map((v, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("option", { value: v.view_id, className: "ml-2  truncate", children: v.version }, i, !1, {
      fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
      lineNumber: 18,
      columnNumber: 11
    }, this))
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
    lineNumber: 11,
    columnNumber: 5
  },
  this
), fnum = (number4) => parseInt(number4).toLocaleString(), Stats4 = ({ source, views }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react75.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react75.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react75.useState)(void 0);
  (0, import_react75.useEffect)(() => {
    falcor3.get(
      ["per_basis", pgEnv, "source", source.source_id, "view", [activeView, compareView], "stats"]
    );
  }, [activeView, compareView]);
  let metadataActiveView = (0, import_lodash24.default)(falcorCache, ["per_basis", pgEnv, "source", source.source_id, "view", activeView, "stats", "value"], []), metadataCompareView = (0, import_lodash24.default)(falcorCache, ["per_basis", pgEnv, "source", source.source_id, "view", compareView, "stats", "value"], []);
  return console.log("??", compareMode), !metadataActiveView || metadataActiveView.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("div", { children: " Stats Not Available " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
    lineNumber: 42,
    columnNumber: 72
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)(import_jsx_dev_runtime66.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("label", { children: "Current Version: " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
            lineNumber: 48,
            columnNumber: 17
          }, this),
          RenderVersions5(views, activeView, setActiveView),
          /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)(
            "button",
            {
              className: `${compareMode ? "bg-red-50 hover:bg-red-400" : "bg-blue-100 hover:bg-blue-600"}
                     hover:text-white align-right border-2 border-gray-100 p-2 hover:bg-gray-100`,
              disabled: views.length === 1,
              onClick: () => setCompareMode(!compareMode),
              children: compareMode ? "Discard" : "Compare"
            },
            void 0,
            !1,
            {
              fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
              lineNumber: 50,
              columnNumber: 17
            },
            this
          )
        ]
      },
      "versionSelector",
      !0,
      {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 46,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
        children: [
          compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("label", { children: "Compare with Version: " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
            lineNumber: 61,
            columnNumber: 32
          }, this) : null,
          compareMode ? RenderVersions5(views, compareView, setCompareView) : null
        ]
      },
      "compareVersionSelector",
      !0,
      {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 59,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-lg font-md",
        children: "By Type"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 65,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6 border-b-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Event Type" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 71,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Zero loss events ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 74,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Loss causing events ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 77,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Total events ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 80,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Buildings ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 84,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Crop ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 87,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Population ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 90,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Total ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 93,
          columnNumber: 21
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Zero loss events ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 100,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Loss causing events ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 107,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Total events ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 114,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Buildings ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 120,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Crop ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 127,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Population ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 134,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "Total ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 140,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 70,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: metadataActiveView.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.nri_category }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 152,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.num_events_zero_loss) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 155,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.num_events_with_loss) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 158,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.num_events_total) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 161,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.damage_buildings) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 165,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.damage_crop) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 168,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.damage_population) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 171,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum(col.damage_total) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 174,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "num_events_zero_loss")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 177,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "num_events_with_loss")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 184,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "num_events_total")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 191,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "damage_buildings")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 199,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "damage_crop")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 206,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "damage_population")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 213,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime66.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum((0, import_lodash24.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "damage_total")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
          lineNumber: 220,
          columnNumber: 41
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 151,
        columnNumber: 37
      }, this)) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 146,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
        lineNumber: 145,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
      lineNumber: 69,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/index.js",
    lineNumber: 45,
    columnNumber: 9
  }, this);
}, NceiStormEventsConfig3 = {
  stats: {
    name: "Stats",
    path: "/stats",
    component: Stats4
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table10
  },
  sourceCreate: {
    name: "Create",
    component: create_default10
  }
}, per_basis_swd_default = NceiStormEventsConfig3;

// app/modules/data-manager/data-types/hlr/index.js
var import_react77 = require("react");

// app/modules/data-manager/data-types/hlr/create.js
var import_react76 = __toESM(require("react")), import_react_router_dom15 = require("react-router-dom");
var import_lodash25 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime67 = require("react/jsx-dev-runtime"), CallServer10 = async ({ rtPfx, source, etlContextId, userId, newVersion, navigate, viewPB = {}, viewNRI = {}, viewState = {}, viewCounty = {}, viewNCEI = {} }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, "hlr");
  console.log("calling server?", etlContextId, src);
  let view = await submitViewMeta({
    rtPfx,
    etlContextId,
    userId,
    sourceName,
    src,
    newVersion,
    metadata: {
      pb_version: viewPB.view_id,
      nri_version: viewNRI.view_id,
      state_version: viewState.view_id,
      county_version: viewCounty.view_id,
      ncei_version: viewNCEI.view_id
    }
  }), url = new URL(
    `${rtPfx}/hazard_mitigation/hlrLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "hlr"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id), url.searchParams.append("pb_schema", viewPB.table_schema), url.searchParams.append("pb_table", viewPB.table_name), url.searchParams.append("nri_schema", viewNRI.table_schema), url.searchParams.append("nri_table", viewNRI.table_name), url.searchParams.append("state_schema", viewState.table_schema), url.searchParams.append("state_table", viewState.table_name), url.searchParams.append("county_schema", viewCounty.table_schema), url.searchParams.append("county_table", viewCounty.table_name), url.searchParams.append("ncei_schema", viewNCEI.table_schema), url.searchParams.append("ncei_table", viewNCEI.table_name);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), navigate(`/source/${src.source_id}/views`);
}, RenderVersions6 = ({ value, setValue, versions, type }) => /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: [
    "Select ",
    type,
    " version: "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 55,
    columnNumber: 17
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)(
    "select",
    {
      className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
      value: value || "",
      onChange: (e) => {
        setValue(e.target.value);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/create.js",
          lineNumber: 64,
          columnNumber: 29
        }, this),
        versions.views.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)(
          "option",
          {
            value: v.view_id,
            className: "p-2",
            children: [
              (0, import_lodash25.default)(versions.sources.find((s) => s.source_id === v.source_id), "display_name"),
              ` (${v.view_id} ${formatDate(v.last_updated)})`
            ]
          },
          v.view_id,
          !0,
          {
            fileName: "app/modules/data-manager/data-types/hlr/create.js",
            lineNumber: 67,
            columnNumber: 37
          },
          this
        ))
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/data-manager/data-types/hlr/create.js",
      lineNumber: 58,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 57,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 56,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/hlr/create.js",
  lineNumber: 54,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/hlr/create.js",
  lineNumber: 53,
  columnNumber: 9
}, this), Create11 = ({ source, user, newVersion }) => {
  let navigate = (0, import_react_router_dom15.useNavigate)(), [etlContextId, setEtlContextId] = import_react76.default.useState(), [viewPB, setViewPB] = import_react76.default.useState(), [viewNRI, setViewNRI] = import_react76.default.useState(), [viewState, setViewState] = import_react76.default.useState(), [viewCounty, setViewCounty] = import_react76.default.useState(), [viewNCEI, setViewNCEI] = import_react76.default.useState(), [versionsPB, setVersionsPB] = import_react76.default.useState({ sources: [], views: [] }), [versionsNRI, setVersionsNRI] = import_react76.default.useState({ sources: [], views: [] }), [versionsState, setVersionsState] = import_react76.default.useState({ sources: [], views: [] }), [versionsCounty, setVersionsCounty] = import_react76.default.useState({ sources: [], views: [] }), [versionsNCEI, setVersionsNCEI] = import_react76.default.useState({ sources: [], views: [] }), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react76.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl), await getSrcViews({ rtPfx, setVersions: setVersionsPB, etlContextId: etl, type: "per_basis" }), await getSrcViews({ rtPfx, setVersions: setVersionsNRI, etlContextId: etl, type: "nri" }), await getSrcViews({ rtPfx, setVersions: setVersionsState, etlContextId: etl, type: "tl_state" }), await getSrcViews({ rtPfx, setVersions: setVersionsCounty, etlContextId: etl, type: "tl_county" }), await getSrcViews({ rtPfx, setVersions: setVersionsNCEI, etlContextId: etl, type: "ncei_storm_events_enhanced" });
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("div", { className: "w-full", children: [
    RenderVersions6({ value: viewPB, setValue: setViewPB, versions: versionsPB, type: "PB Storm Events" }),
    RenderVersions6({ value: viewNRI, setValue: setViewNRI, versions: versionsNRI, type: "NRI" }),
    RenderVersions6({ value: viewState, setValue: setViewState, versions: versionsState, type: "State" }),
    RenderVersions6({ value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: "County" }),
    RenderVersions6({ value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: "NCEI Storm Events" }),
    /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)(
      "button",
      {
        className: "align-right",
        onClick: () => CallServer10(
          {
            rtPfx,
            source,
            etlContextId,
            userId: user.id,
            newVersion,
            viewPB: versionsPB.views.find((v) => v.view_id == viewPB),
            viewNRI: versionsNRI.views.find((v) => v.view_id == viewNRI),
            viewState: versionsState.views.find((v) => v.view_id == viewState),
            viewCounty: versionsCounty.views.find((v) => v.view_id == viewCounty),
            viewNCEI: versionsNCEI.views.find((v) => v.view_id == viewNCEI),
            navigate
          }
        ),
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/hlr/create.js",
        lineNumber: 123,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 117,
    columnNumber: 9
  }, this);
}, create_default11 = Create11;

// app/modules/data-manager/data-types/hlr/index.js
var import_lodash26 = __toESM(require("lodash.get")), import_jsx_dev_runtime68 = require("react/jsx-dev-runtime"), Table11 = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { children: " Table View " }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/hlr/index.js",
  lineNumber: 8,
  columnNumber: 12
}, this), RenderVersions7 = (domain, value, onchange) => /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)(
  "select",
  {
    className: "w-40 pr-4 py-3 bg-white mr-2 flex items-center text-sm",
    value,
    onChange: (e) => onchange(e.target.value),
    children: domain.map((v, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("option", { value: v.view_id, className: "ml-2  truncate", children: v.version }, i, !1, {
      fileName: "app/modules/data-manager/data-types/hlr/index.js",
      lineNumber: 19,
      columnNumber: 13
    }, this))
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/data-types/hlr/index.js",
    lineNumber: 12,
    columnNumber: 5
  },
  this
), fnum2 = (number4) => parseInt(number4).toLocaleString(), Stats5 = ({ source, views }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react77.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react77.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react77.useState)(void 0);
  (0, import_react77.useEffect)(() => {
    falcor3.get(
      ["dama", pgEnv, "sources", "byId", source.source_id, "views", "invalidate"],
      ["hlr", pgEnv, "source", source.source_id, "view", [activeView, compareView], "eal"]
    );
  }, [activeView, compareView]), console.log("fc?", falcorCache);
  let metadataActiveView = (0, import_lodash26.default)(falcorCache, ["hlr", pgEnv, "source", source.source_id, "view", activeView, "eal", "value"], []), metadataCompareView = (0, import_lodash26.default)(falcorCache, ["hlr", pgEnv, "source", source.source_id, "view", compareView, "eal", "value"], []);
  return console.log("md", metadataCompareView), !metadataActiveView || metadataActiveView.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { children: " Stats Not Available " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/hlr/index.js",
    lineNumber: 44,
    columnNumber: 72
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)(import_jsx_dev_runtime68.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("label", { children: "Current Version: " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/hlr/index.js",
            lineNumber: 50,
            columnNumber: 17
          }, this),
          RenderVersions7(views, activeView, setActiveView),
          /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)(
            "button",
            {
              className: `${compareMode ? "bg-red-50 hover:bg-red-400" : "bg-blue-100 hover:bg-blue-600"}
                     hover:text-white align-right border-2 border-gray-100 p-2 hover:bg-gray-100`,
              disabled: views.length === 1,
              onClick: () => setCompareMode(!compareMode),
              children: compareMode ? "Discard" : "Compare"
            },
            void 0,
            !1,
            {
              fileName: "app/modules/data-manager/data-types/hlr/index.js",
              lineNumber: 52,
              columnNumber: 17
            },
            this
          )
        ]
      },
      "versionSelector",
      !0,
      {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 48,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
        children: [
          compareMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("label", { children: "Compare with Version: " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/hlr/index.js",
            lineNumber: 63,
            columnNumber: 32
          }, this) : null,
          compareMode ? RenderVersions7(views, compareView, setCompareView) : null
        ]
      },
      "compareVersionSelector",
      !0,
      {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 61,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)(
      "div",
      {
        className: "flex flex-row items-center py-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-lg font-md",
        children: "EAL by Type"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 67,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 border-b-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: "Event Type" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 73,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "buildings ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 76,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "crop ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 79,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "population ",
          compareMode ? `(${views.find((v) => v.view_id.toString() === activeView.toString()).version})` : null
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 82,
          columnNumber: 21
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "buildings ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 89,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "crop ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 96,
          columnNumber: 25
        }, this),
        compareMode && /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "text-sm font-medium text-gray-600 ", children: [
          "population ",
          `(${views.find((v) => v.view_id.toString() === compareView.toString()).version})`
        ] }, void 0, !0, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 103,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 72,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: metadataActiveView.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dt", { className: "text-sm text-gray-900", children: col.nri_category }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 115,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum2(col.swd_buildings) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 118,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum2(col.swd_crop) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 121,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: fnum2(col.swd_population) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 124,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum2((0, import_lodash26.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "swd_buildings")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 127,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum2((0, import_lodash26.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "swd_crop")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 134,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: compareMode && fnum2((0, import_lodash26.default)(metadataCompareView.find((row) => row.nri_category === col.nri_category), "swd_population")) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/hlr/index.js",
          lineNumber: 141,
          columnNumber: 41
        }, this)
      ] }, i, !0, {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 114,
        columnNumber: 37
      }, this)) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 109,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/hlr/index.js",
        lineNumber: 108,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/hlr/index.js",
      lineNumber: 71,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/hlr/index.js",
    lineNumber: 47,
    columnNumber: 9
  }, this);
}, NceiStormEventsConfig4 = {
  stats: {
    name: "Stats",
    path: "/stats",
    component: Stats5
  },
  map: {
    name: "Map",
    path: "/map",
    component: () => /* @__PURE__ */ (0, import_jsx_dev_runtime68.jsxDEV)("div", { children: " No Map " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/hlr/index.js",
      lineNumber: 168,
      columnNumber: 26
    }, this)
  },
  table: {
    name: "Table",
    path: "/table",
    component: Table11
  },
  sourceCreate: {
    name: "Create",
    component: create_default11
  }
}, hlr_default = NceiStormEventsConfig4;

// app/modules/data-manager/data-types/index.js
var DataTypes = {
  freight_atlas_shapefile: freight_atlas_shapefile_default,
  npmrdsTravelTime: npmrdsTravelTime_default,
  ncei_storm_events: ncei_storm_events_default,
  ncei_storm_events_enhanced: ncei_storm_events_enhanced_default,
  zone_to_county: zone_to_county_default,
  tiger_2017: tiger_2017_default,
  open_fema_data: open_fema_data_default,
  usda_crop_insurance_cause_of_loss: usda_default,
  sba_disaster_loan_data_new: sba_default,
  nri: nri_default,
  per_basis: per_basis_swd_default,
  hlr: hlr_default
};

// app/routes/__dama/source/$sourceId.($page)/($viewId).js
var import_react79 = require("@remix-run/react"), import_lodash27 = __toESM(require("lodash.get")), import_jsx_dev_runtime69 = require("react/jsx-dev-runtime");
async function loader3({ params, request }) {
  let { sourceId } = params, lengthPath = ["dama", pgEnv, "sources", "byId", sourceId, "views", "length"], resp = await falcor2.get(lengthPath), data = await falcor2.get(
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      sourceId,
      "views",
      "byIndex",
      { from: 0, to: (0, import_lodash27.default)(resp.json, lengthPath, 0) - 1 },
      "attributes",
      Object.values(ViewAttributes)
    ],
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      sourceId,
      "attributes",
      Object.values(SourceAttributes)
    ],
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      sourceId,
      "meta"
    ]
  ), falcorCache = falcor2.getCache();
  return {
    falcorCache,
    data,
    views: Object.values(
      (0, import_lodash27.default)(
        falcorCache,
        ["dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex"],
        {}
      )
    ).map(
      (v) => getAttributes(
        (0, import_lodash27.default)(
          falcorCache,
          v.value,
          { attributes: {} }
        ).attributes
      )
    ),
    source: getAttributes(
      (0, import_lodash27.default)(
        falcorCache,
        ["dama", pgEnv, "sources", "byId", sourceId],
        { attributes: {} }
      ).attributes
    ),
    meta: (0, import_lodash27.default)(
      falcorCache,
      ["dama", pgEnv, "sources", "byId", sourceId, "meta", "value"],
      {}
    )
  };
}
var action3 = async ({ request, params }) => {
  let { sourceId } = params;
  console.log("gonna invalidate sources length");
  let fd = await request.formData(), res = await falcor2.call(["dama", pgEnv, "sources", "byId", sourceId, "views", "invalidate"]);
  return { falcorCache: falcor2.getCache() };
};
function Dama() {
  let { views, source, meta: meta2, falcorCache, data } = (0, import_react79.useLoaderData)(), { sourceId, page: page2, viewId } = (0, import_react79.useParams)(), [pages, setPages] = (0, import_react78.useState)(default_default), { user } = (0, import_react79.useOutletContext)();
  console.log("view params?", sourceId, page2, viewId), import_react78.default.useEffect(() => {
    if (DataTypes[source.type]) {
      let typePages = Object.keys(DataTypes[source.type]).reduce((a, c) => (DataTypes[source.type][c].path && (a[c] = DataTypes[source.type][c]), a), {}), allPages = { ...default_default, ...typePages };
      setPages(allPages);
    }
  }, [source.type]);
  let Page = (0, import_react78.useMemo)(() => page2 ? (0, import_lodash27.default)(pages, `[${page2}].component`, default_default.overview.component) : default_default.overview.component, [page2, pages]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)("div", { className: "text-xl font-medium overflow-hidden p-2 border-b ", children: source.display_name || source.name }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page)/($viewId).js",
      lineNumber: 116,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)(
      Top_default,
      {
        menuItems: Object.values(pages).map((d) => ({
          name: d.name,
          path: `/source/${sourceId}${d.path}`
        })),
        themeOptions: { size: "inline" }
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__dama/source/$sourceId.($page)/($viewId).js",
        lineNumber: 119,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)("div", { className: "w-full p-4 bg-white shadow mb-4", children: "View details" }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page)/($viewId).js",
      lineNumber: 129,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/$sourceId.($page)/($viewId).js",
    lineNumber: 115,
    columnNumber: 7
  }, this);
}

// app/routes/__dama/source/$sourceId.($page)/index.js
var sourceId_exports = {};
__export(sourceId_exports, {
  action: () => action4,
  default: () => Dama2,
  loader: () => loader4
});
var import_react80 = __toESM(require("react"));
var import_react81 = require("@remix-run/react"), import_lodash28 = __toESM(require("lodash.get")), import_jsx_dev_runtime70 = require("react/jsx-dev-runtime");
async function loader4({ params, request }) {
  let { sourceId } = params, lengthPath = ["dama", pgEnv, "sources", "byId", sourceId, "views", "length"], resp = await falcor2.get(lengthPath), data = await falcor2.get(
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      sourceId,
      "views",
      "byIndex",
      { from: 0, to: (0, import_lodash28.default)(resp.json, lengthPath, 0) - 1 },
      "attributes",
      Object.values(ViewAttributes)
    ],
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      sourceId,
      "attributes",
      Object.values(SourceAttributes)
    ],
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      sourceId,
      "meta"
    ]
  ), falcorCache = falcor2.getCache();
  return {
    falcorCache,
    data,
    views: Object.values(
      (0, import_lodash28.default)(
        falcorCache,
        ["dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex"],
        {}
      )
    ).map(
      (v) => getAttributes(
        (0, import_lodash28.default)(
          falcorCache,
          v.value,
          { attributes: {} }
        ).attributes
      )
    ),
    source: getAttributes(
      (0, import_lodash28.default)(
        falcorCache,
        ["dama", pgEnv, "sources", "byId", sourceId],
        { attributes: {} }
      ).attributes
    ),
    meta: (0, import_lodash28.default)(
      falcorCache,
      ["dama", pgEnv, "sources", "byId", sourceId, "meta", "value"],
      {}
    )
  };
}
var action4 = async ({ request, params }) => {
  let { sourceId } = params;
  console.log("gonna invalidate sources length");
  let fd = await request.formData(), res = await falcor2.call(["dama", pgEnv, "sources", "byId", sourceId, "views", "invalidate"]);
  return { falcorCache: falcor2.getCache() };
};
function Dama2() {
  let { views, source, meta: meta2, falcorCache, data } = (0, import_react81.useLoaderData)(), { sourceId, page: page2, viewId } = (0, import_react81.useParams)(), [pages, setPages] = (0, import_react80.useState)(default_default), { user } = (0, import_react81.useOutletContext)();
  console.log("index params?", sourceId, page2), import_react80.default.useEffect(() => {
    if (DataTypes[source.type]) {
      let typePages = Object.keys(DataTypes[source.type]).reduce((a, c) => (DataTypes[source.type][c].path && (a[c] = DataTypes[source.type][c]), a), {}), allPages = { ...default_default, ...typePages };
      setPages(allPages);
    }
  }, [source.type]);
  let Page = (0, import_react80.useMemo)(() => page2 ? (0, import_lodash28.default)(pages, `[${page2}].component`, default_default.overview.component) : default_default.overview.component, [page2, pages]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "text-xl font-medium overflow-hidden p-2 border-b ", children: source.display_name || source.name }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page)/index.js",
      lineNumber: 116,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)(
      Top_default,
      {
        menuItems: Object.values(pages).map((d) => ({
          name: d.name,
          path: `/source/${sourceId}${d.path}`
        })),
        themeOptions: { size: "inline" }
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__dama/source/$sourceId.($page)/index.js",
        lineNumber: 119,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "w-full p-4 bg-white shadow mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)(Page, { source, views, user, meta: meta2 }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page)/index.js",
      lineNumber: 130,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page)/index.js",
      lineNumber: 129,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/$sourceId.($page)/index.js",
    lineNumber: 115,
    columnNumber: 7
  }, this);
}

// app/routes/__dama/source/delete/$sourceId.js
var sourceId_exports2 = {};
__export(sourceId_exports2, {
  default: () => Popup,
  loader: () => loader5
});
var import_react82 = require("react");
var import_react83 = require("@remix-run/react"), import_lodash29 = __toESM(require("lodash.get"));
var import_react_router_dom16 = require("react-router-dom"), import_jsx_dev_runtime71 = require("react/jsx-dev-runtime");
async function loader5({ params, request }) {
  let { sourceId } = params, data = await falcor2.get(
    ["dama", pgEnv, "sources", "byId", sourceId, "dependents"],
    ["dama", pgEnv, "sources", "byId", sourceId, "attributes", ["display_name"]]
  );
  return {
    sourceId,
    dependents: (0, import_lodash29.default)(data, ["json", "dama", pgEnv, "sources", "byId", sourceId, "dependents"], []),
    display_name: (0, import_lodash29.default)(data, ["json", "dama", pgEnv, "sources", "byId", sourceId, "attributes", "display_name"], "")
  };
}
var DeleteButton2 = ({ text, sourceId }) => {
  let navigate = (0, import_react_router_dom16.useNavigate)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(
    "button",
    {
      className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
      onClick: () => deleteSource(`${DAMA_HOST}/dama-admin/${pgEnv}`, sourceId) && navigate(-1),
      children: text
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 27,
      columnNumber: 9
    },
    this
  );
}, LoadDependentViews = (data, sourceId) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(import_jsx_dev_runtime71.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("label", { children: "The Source has following dependents:" }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 38,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(DeleteButton2, { text: "Delete anyway", sourceId }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 40,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 37,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "p-4 bg-red-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "p-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: ["view_id", "created", "updated"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: key }, key, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 48,
      columnNumber: 29
    }, this)) }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 44,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: data.map(
      (view, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: ["view_id", "_created_timestamp", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: view[key] }, void 0, !1, {
        fileName: "app/routes/__dama/source/delete/$sourceId.js",
        lineNumber: 65,
        columnNumber: 53
      }, this)) }, i, !1, {
        fileName: "app/routes/__dama/source/delete/$sourceId.js",
        lineNumber: 61,
        columnNumber: 37
      }, this)
    ) }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 55,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 54,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 43,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/source/delete/$sourceId.js",
  lineNumber: 36,
  columnNumber: 5
}, this), LoadConfirmDelete = (sourceId) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("label", { children: "No dependents found." }, void 0, !1, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 82,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(DeleteButton2, { text: "Confirm Delete", sourceId }, void 0, !1, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 84,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/source/delete/$sourceId.js",
  lineNumber: 81,
  columnNumber: 9
}, this);
function Popup() {
  let { sourceId, dependents, display_name } = (0, import_react83.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "w-full p-4 bg-white my-1 block border shadow", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "pb-4 font-bold", children: [
      "Delete ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("i", { children: display_name }, void 0, !1, {
        fileName: "app/routes/__dama/source/delete/$sourceId.js",
        lineNumber: 92,
        columnNumber: 54
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 92,
      columnNumber: 13
    }, this),
    dependents.length ? LoadDependentViews(dependents, sourceId) : LoadConfirmDelete(sourceId)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 91,
    columnNumber: 9
  }, this);
}

// app/routes/__dama/view/delete/$viewId.js
var viewId_exports2 = {};
__export(viewId_exports2, {
  default: () => Popup2,
  loader: () => loader6
});
var import_react84 = require("react"), import_react_router_dom17 = require("react-router-dom");
var import_react85 = require("@remix-run/react"), import_lodash30 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime72 = require("react/jsx-dev-runtime");
async function loader6({ params, request }) {
  let { viewId } = params, data = await falcor2.get(
    ["dama", pgEnv, "views", "byId", viewId, "dependents"],
    ["dama", pgEnv, "views", "byId", viewId, "attributes", "source_id"]
  );
  return {
    viewId,
    dependents: (0, import_lodash30.default)(data, ["json", "dama", pgEnv, "views", "byId", viewId, "dependents"], []),
    sourceId: (0, import_lodash30.default)(data, ["json", "dama", pgEnv, "views", "byId", viewId, "attributes", "source_id"], [])
  };
}
var DeleteButton3 = ({ text, viewId, sourceId }) => {
  let navigate = (0, import_react_router_dom17.useNavigate)(), fetcher = (0, import_react85.useFetcher)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(
    "button",
    {
      className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
      onClick: async () => (await deleteView(`${DAMA_HOST}/dama-admin/${pgEnv}`, viewId), await fetcher.submit(
        {},
        {
          method: "post",
          action: `/source/${sourceId}`,
          formData: "this is fd"
        }
      ), navigate(`/source/${sourceId}/views`, { replace: !0 })),
      children: text
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 29,
      columnNumber: 9
    },
    this
  );
}, LoadDependentViews2 = (data, viewId, sourceId) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(import_jsx_dev_runtime72.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("label", { children: "The View has following dependents:" }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 52,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(DeleteButton3, { text: "Delete anyway", viewId, sourceId }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 54,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 51,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "p-4 bg-red-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "p-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: ["view_id", "created", "updated"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: key }, key, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 62,
      columnNumber: 29
    }, this)) }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 58,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: data.map(
      (view, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: ["view_id", "_created_timestamp", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: view[key] }, void 0, !1, {
        fileName: "app/routes/__dama/view/delete/$viewId.js",
        lineNumber: 79,
        columnNumber: 53
      }, this)) }, i, !1, {
        fileName: "app/routes/__dama/view/delete/$viewId.js",
        lineNumber: 75,
        columnNumber: 37
      }, this)
    ) }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 69,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 68,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 57,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/view/delete/$viewId.js",
  lineNumber: 50,
  columnNumber: 5
}, this), LoadConfirmDelete2 = (viewId, sourceId) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("label", { children: "No dependents found." }, void 0, !1, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 96,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(DeleteButton3, { text: "Confirm Delete", viewId, sourceId }, void 0, !1, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 98,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/view/delete/$viewId.js",
  lineNumber: 95,
  columnNumber: 9
}, this);
function Popup2() {
  let { viewId, sourceId, dependents } = (0, import_react85.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "w-full p-4 bg-white my-1 block border shadow", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "pb-4 font-bold", children: [
      "Delete ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("i", { children: viewId }, void 0, !1, {
        fileName: "app/routes/__dama/view/delete/$viewId.js",
        lineNumber: 107,
        columnNumber: 54
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 107,
      columnNumber: 13
    }, this),
    dependents.length ? LoadDependentViews2(dependents, viewId, sourceId) : LoadConfirmDelete2(viewId, sourceId)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 106,
    columnNumber: 9
  }, this);
}

// app/routes/__dama/source/create.js
var create_exports = {};
__export(create_exports, {
  default: () => sourceCreate
});
var import_react86 = require("react");
var import_lodash31 = __toESM(require("lodash.get"));
var import_react87 = require("@remix-run/react"), import_jsx_dev_runtime73 = require("react/jsx-dev-runtime");
function sourceCreate() {
  let { user } = (0, import_react87.useOutletContext)(), [source, setSource] = (0, import_react86.useState)(
    Object.keys(SourceAttributes).filter((d) => !["source_id", "metadata", "statistics"].includes(d)).reduce((out, current) => (out[current] = "", out), {})
  ), CreateComp = (0, import_react86.useMemo)(
    () => (0, import_lodash31.default)(DataTypes, `[${source.type}].sourceCreate.component`, () => /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", {}, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 29,
      columnNumber: 69
    }, this)),
    [DataTypes, source.type]
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "fixed right-0 top-[170px] w-64 ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("pre", { children: JSON.stringify(source, null, 3) }, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 37,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "p-4 font-medium", children: " Create New Source " }, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: [
        Object.keys(SourceAttributes).filter((d) => !["source_id", "metadata", "description", "type", "statistics", "category", "update_interval", "categories"].includes(d)).map((attr, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: attr }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 52,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(
            input_default,
            {
              className: "w-full p-2 flex-1 px-2 shadow bg-grey-50 focus:bg-blue-100  border-gray-300 ",
              value: (0, import_lodash31.default)(source, attr, ""),
              onChange: (e) => {
                setSource({ ...source, [attr]: e });
              }
            },
            void 0,
            !1,
            {
              fileName: "app/routes/__dama/source/create.js",
              lineNumber: 56,
              columnNumber: 27
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 55,
            columnNumber: 25
          }, this) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 53,
            columnNumber: 21
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 51,
          columnNumber: 19
        }, this) }, i, !1, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 50,
          columnNumber: 17
        }, this)),
        /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: "Data Type" }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 75,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(
            "select",
            {
              className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
              value: (0, import_lodash31.default)(source, "type", ""),
              onChange: (e) => {
                setSource({ ...source, type: e.target.value });
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
                  fileName: "app/routes/__dama/source/create.js",
                  lineNumber: 86,
                  columnNumber: 25
                }, this),
                Object.keys(DataTypes).filter((k) => DataTypes[k].sourceCreate).map((k) => /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("option", { value: k, className: "p-2", children: k }, k, !1, {
                  fileName: "app/routes/__dama/source/create.js",
                  lineNumber: 89,
                  columnNumber: 37
                }, this))
              ]
            },
            void 0,
            !0,
            {
              fileName: "app/routes/__dama/source/create.js",
              lineNumber: 79,
              columnNumber: 21
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 78,
            columnNumber: 19
          }, this) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 76,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 74,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 73,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__dama/source/create.js",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(CreateComp, { source, user }, void 0, !1, {
        fileName: "app/routes/__dama/source/create.js",
        lineNumber: 99,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 43,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/create.js",
    lineNumber: 35,
    columnNumber: 5
  }, this);
}

// app/routes/__dama/datasources.js
var datasources_exports = {};
__export(datasources_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => Dama3,
  loader: () => loader7
});
var import_react88 = require("react");
var import_react89 = require("@remix-run/react"), import_lodash32 = __toESM(require("lodash.get")), import_jsx_dev_runtime74 = require("react/jsx-dev-runtime");
async function loader7({ request }) {
  let lengthPath = ["dama", pgEnv, "sources", "length"], resp = await falcor2.get(lengthPath), sourceData = await falcor2.get([
    "dama",
    pgEnv,
    "sources",
    "byIndex",
    { from: 0, to: (0, import_lodash32.default)(resp.json, lengthPath, 0) - 1 },
    "attributes",
    Object.values(SourceAttributes)
  ]), falcorCache = falcor2.getCache();
  return Object.values((0, import_lodash32.default)(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {})).map((v) => getAttributes((0, import_lodash32.default)(falcorCache, v.value, { attributes: {} }).attributes));
}
function Dama3() {
  let [layerSearch, setLayerSearch] = (0, import_react88.useState)(""), sources = (0, import_react89.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { className: "py-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(
      "input",
      {
        className: "w-full text-lg p-2 border border-gray-300 ",
        placeholder: "Search datasources",
        value: layerSearch,
        onChange: (e) => setLayerSearch(e.target.value)
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__dama/datasources.js",
        lineNumber: 32,
        columnNumber: 21
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 31,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 30,
      columnNumber: 13
    }, this),
    sources.filter((source) => {
      let searchTerm = source.name + " " + (0, import_lodash32.default)(source, "categories[0]", []).join(" ");
      return !layerSearch.length > 2 || searchTerm.toLowerCase().includes(layerSearch.toLowerCase());
    }).map((s, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(SourceThumb, { source: s }, i, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 46,
      columnNumber: 36
    }, this))
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 29,
    columnNumber: 9
  }, this);
}
var SourceThumb = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { className: "w-full p-4 bg-white my-1 hover:bg-blue-50 block border shadow flex", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(import_react89.Link, { to: `/source/${source.source_id}`, className: "text-xl font-medium w-full block", children: /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("span", { children: source.name }, void 0, !1, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 56,
    columnNumber: 17
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 55,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { children: ((0, import_lodash32.default)(source, "categories", []) || []).map((cat) => cat.map((s, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(
    import_react89.Link,
    {
      to: `/cat/${i > 0 ? cat[i - 1] + "/" : ""}${s}`,
      className: "text-xs p-1 px-2 bg-blue-200 text-blue-600 mr-2",
      children: s
    },
    i,
    !1,
    {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 61,
      columnNumber: 25
    },
    this
  ))) }, void 0, !1, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 58,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(import_react89.Link, { to: `/source/${source.source_id}`, className: "py-2 block", children: source.description }, void 0, !1, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 66,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(import_react89.Link, { to: `/source/${source.source_id}`, className: "py-2 block", children: source._created_timestamp }, void 0, !1, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 69,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(
    import_react89.Link,
    {
      className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
      to: `/source/delete/${source.source_id}`,
      children: " delete "
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 72,
      columnNumber: 13
    },
    this
  )
] }, void 0, !0, {
  fileName: "app/routes/__dama/datasources.js",
  lineNumber: 54,
  columnNumber: 9
}, this);
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("h1", { children: "Error" }, void 0, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 81,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("p", { children: error.message }, void 0, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 82,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("p", { children: "The stack trace is:" }, void 0, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 83,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("pre", { children: error.stack }, void 0, !1, {
      fileName: "app/routes/__dama/datasources.js",
      lineNumber: 84,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/datasources.js",
    lineNumber: 80,
    columnNumber: 9
  }, this);
}

// app/routes/__dama/index.(cat).js
var index_cat_exports = {};
__export(index_cat_exports, {
  default: () => SourceThumb2,
  loader: () => loader8
});
var import_react96 = __toESM(require("react"));
var import_react97 = require("@remix-run/react"), import_lodash36 = __toESM(require("lodash.get"));

// app/modules/avl-graph-modified/src/BarGraph.js
var import_react95 = __toESM(require("react"));

// node_modules/d3-array/src/ascending.js
function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-array/src/descending.js
function descending(a, b) {
  return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

// node_modules/d3-array/src/bisector.js
function bisector(f) {
  let compare1, compare2, delta;
  f.length !== 2 ? (compare1 = ascending, compare2 = (d, x) => ascending(f(d), x), delta = (d, x) => f(d) - x) : (compare1 = f === ascending || f === descending ? f : zero, compare2 = f, delta = f);
  function left2(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0)
        return hi;
      do {
        let mid = lo + hi >>> 1;
        compare2(a[mid], x) < 0 ? lo = mid + 1 : hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right2(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0)
        return hi;
      do {
        let mid = lo + hi >>> 1;
        compare2(a[mid], x) <= 0 ? lo = mid + 1 : hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center2(a, x, lo = 0, hi = a.length) {
    let i = left2(a, x, lo, hi - 1);
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }
  return { left: left2, center: center2, right: right2 };
}
function zero() {
  return 0;
}

// node_modules/d3-array/src/number.js
function number(x) {
  return x === null ? NaN : +x;
}

// node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector(ascending), bisectRight = ascendingBisect.right, bisectLeft = ascendingBisect.left, bisectCenter = bisector(number).center, bisect_default = bisectRight;

// node_modules/internmap/src/index.js
var InternMap = class extends Map {
  constructor(entries, key = keyof) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } }), entries != null)
      for (let [key2, value] of entries)
        this.set(key2, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
};
function intern_get({ _intern, _key }, value) {
  let key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
  let key = _key(value);
  return _intern.has(key) ? _intern.get(key) : (_intern.set(key, value), value);
}
function intern_delete({ _intern, _key }, value) {
  let key = _key(value);
  return _intern.has(key) && (value = _intern.get(key), _intern.delete(key)), value;
}
function keyof(value) {
  return value !== null && typeof value == "object" ? value.valueOf() : value;
}

// node_modules/d3-array/src/ticks.js
var e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
function tickSpec(start2, stop, count) {
  let step = (stop - start2) / Math.max(0, count), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1, i1, i2, inc;
  return power < 0 ? (inc = Math.pow(10, -power) / factor, i1 = Math.round(start2 * inc), i2 = Math.round(stop * inc), i1 / inc < start2 && ++i1, i2 / inc > stop && --i2, inc = -inc) : (inc = Math.pow(10, power) * factor, i1 = Math.round(start2 / inc), i2 = Math.round(stop / inc), i1 * inc < start2 && ++i1, i2 * inc > stop && --i2), i2 < i1 && 0.5 <= count && count < 2 ? tickSpec(start2, stop, count * 2) : [i1, i2, inc];
}
function ticks(start2, stop, count) {
  if (stop = +stop, start2 = +start2, count = +count, !(count > 0))
    return [];
  if (start2 === stop)
    return [start2];
  let reverse = stop < start2, [i1, i2, inc] = reverse ? tickSpec(stop, start2, count) : tickSpec(start2, stop, count);
  if (!(i2 >= i1))
    return [];
  let n = i2 - i1 + 1, ticks2 = new Array(n);
  if (reverse)
    if (inc < 0)
      for (let i = 0; i < n; ++i)
        ticks2[i] = (i2 - i) / -inc;
    else
      for (let i = 0; i < n; ++i)
        ticks2[i] = (i2 - i) * inc;
  else if (inc < 0)
    for (let i = 0; i < n; ++i)
      ticks2[i] = (i1 + i) / -inc;
  else
    for (let i = 0; i < n; ++i)
      ticks2[i] = (i1 + i) * inc;
  return ticks2;
}
function tickIncrement(start2, stop, count) {
  return stop = +stop, start2 = +start2, count = +count, tickSpec(start2, stop, count)[2];
}
function tickStep(start2, stop, count) {
  stop = +stop, start2 = +start2, count = +count;
  let reverse = stop < start2, inc = reverse ? tickIncrement(stop, start2, count) : tickIncrement(start2, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}

// node_modules/d3-array/src/range.js
function range(start2, stop, step) {
  start2 = +start2, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start2, start2 = 0, 1) : n < 3 ? 1 : +step;
  for (var i = -1, n = Math.max(0, Math.ceil((stop - start2) / step)) | 0, range2 = new Array(n); ++i < n; )
    range2[i] = start2 + i * step;
  return range2;
}

// node_modules/d3-scale/src/init.js
function initRange(domain, range2) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range2).domain(domain);
      break;
  }
  return this;
}

// node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index = new InternMap(), domain = [], range2 = [], unknown = implicit;
  function scale(d) {
    let i = index.get(d);
    if (i === void 0) {
      if (unknown !== implicit)
        return unknown;
      index.set(d, i = domain.push(d) - 1);
    }
    return range2[i % range2.length];
  }
  return scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [], index = new InternMap();
    for (let value of _)
      index.has(value) || index.set(value, domain.push(value) - 1);
    return scale;
  }, scale.range = function(_) {
    return arguments.length ? (range2 = Array.from(_), scale) : range2.slice();
  }, scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  }, scale.copy = function() {
    return ordinal(domain, range2).unknown(unknown);
  }, initRange.apply(scale, arguments), scale;
}

// node_modules/d3-scale/src/band.js
function band() {
  var scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = !1, paddingInner = 0, paddingOuter = 0, align = 0.5;
  delete scale.unknown;
  function rescale() {
    var n = domain().length, reverse = r1 < r0, start2 = reverse ? r1 : r0, stop = reverse ? r0 : r1;
    step = (stop - start2) / Math.max(1, n - paddingInner + paddingOuter * 2), round && (step = Math.floor(step)), start2 += (stop - start2 - step * (n - paddingInner)) * align, bandwidth = step * (1 - paddingInner), round && (start2 = Math.round(start2), bandwidth = Math.round(bandwidth));
    var values = range(n).map(function(i) {
      return start2 + step * i;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }
  return scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  }, scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  }, scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = !0, rescale();
  }, scale.bandwidth = function() {
    return bandwidth;
  }, scale.step = function() {
    return step;
  }, scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  }, scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  }, scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  }, scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  }, scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  }, scale.copy = function() {
    return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  }, initRange.apply(rescale(), arguments);
}

// node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype, prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7, brighter = 1 / darker, reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`), named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format2) {
  var m, l;
  return format2 = (format2 + "").trim().toLowerCase(), (m = reHex.exec(format2)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format2)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format2)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format2)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format2)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format2) ? rgbn(named[format2]) : format2 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  return a <= 0 && (r = g = b = NaN), new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  return o instanceof Color || (o = color(o)), o ? (o = o.rgb(), new Rgb(o.r, o.g, o.b, o.opacity)) : new Rgb();
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity ?? 1);
}
function Rgb(r, g, b, opacity) {
  this.r = +r, this.g = +g, this.b = +b, this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    return k = k == null ? brighter : Math.pow(brighter, k), new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    return k = k == null ? darker : Math.pow(darker, k), new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: rgb_formatHex,
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  let a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  return value = clampi(value), (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  return a <= 0 ? h = s = l = NaN : l <= 0 || l >= 1 ? h = s = NaN : s <= 0 && (h = NaN), new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (o instanceof Color || (o = color(o)), !o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
  return s ? (r === max ? h = (g - b) / s + (g < b) * 6 : g === max ? h = (b - r) / s + 2 : h = (r - g) / s + 4, s /= l < 0.5 ? max + min : 2 - max - min, h *= 60) : s = l > 0 && l < 1 ? 0 : h, new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity ?? 1);
}
function Hsl(h, s, l, opacity) {
  this.h = +h, this.s = +s, this.l = +l, this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    return k = k == null ? brighter : Math.pow(brighter, k), new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    return k = k == null ? darker : Math.pow(darker, k), new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    let a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  return value = (value || 0) % 360, value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default = (x) => () => x;

// node_modules/d3-interpolate/src/color.js
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}
function gamma(y) {
  return (y = +y) == 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant_default(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default(isNaN(a) ? b : a);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb2(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      return start2.r = r(t), start2.g = g(t), start2.b = b(t), start2.opacity = opacity(t), start2 + "";
    };
  }
  return rgb2.gamma = rgbGamma, rgb2;
}(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i)
      color2 = rgb(colors[i]), r[i] = color2.r || 0, g[i] = color2.g || 0, b[i] = color2.b || 0;
    return r = spline(r), g = spline(g), b = spline(b), color2.opacity = 1, function(t) {
      return color2.r = r(t), color2.g = g(t), color2.b = b(t), color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default), rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-interpolate/src/numberArray.js
function numberArray_default(a, b) {
  b || (b = []);
  var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
  return function(t) {
    for (i = 0; i < n; ++i)
      c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}
function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

// node_modules/d3-interpolate/src/array.js
function genericArray(a, b) {
  var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
  for (i = 0; i < na; ++i)
    x[i] = value_default(a[i], b[i]);
  for (; i < nb; ++i)
    c[i] = b[i];
  return function(t) {
    for (i = 0; i < na; ++i)
      c[i] = x[i](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/date.js
function date_default(a, b) {
  var d = new Date();
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

// node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

// node_modules/d3-interpolate/src/object.js
function object_default(a, b) {
  var i = {}, c = {}, k;
  (a === null || typeof a != "object") && (a = {}), (b === null || typeof b != "object") && (b = {});
  for (k in b)
    k in a ? i[k] = value_default(a[k], b[k]) : c[k] = b[k];
  return function(t) {
    for (k in i)
      c[k] = i[k](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero2(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  for (a = a + "", b = b + ""; (am = reA.exec(a)) && (bm = reB.exec(b)); )
    (bs = bm.index) > bi && (bs = b.slice(bi, bs), s[i] ? s[i] += bs : s[++i] = bs), (am = am[0]) === (bm = bm[0]) ? s[i] ? s[i] += bm : s[++i] = bm : (s[++i] = null, q.push({ i, x: number_default(am, bm) })), bi = reB.lastIndex;
  return bi < b.length && (bs = b.slice(bi), s[i] ? s[i] += bs : s[++i] = bs), s.length < 2 ? q[0] ? one(q[0].x) : zero2(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/d3-interpolate/src/value.js
function value_default(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant_default(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf != "function" && typeof b.toString != "function" || isNaN(b) ? object_default : number_default)(a, b);
}

// node_modules/d3-interpolate/src/round.js
function round_default(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

// node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI, identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  return (scaleX = Math.sqrt(a * a + b * b)) && (a /= scaleX, b /= scaleX), (skewX = a * c + b * d) && (c -= a * skewX, d -= b * skewX), (scaleY = Math.sqrt(c * c + d * d)) && (c /= scaleY, d /= scaleY, skewX /= scaleY), a * d < b * c && (a = -a, b = -b, skewX = -skewX, scaleX = -scaleX), {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}

// node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
  let m = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
  return value == null ? identity : (svgNode || (svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g")), svgNode.setAttribute("transform", value), (value = svgNode.transform.baseVal.consolidate()) ? (value = value.matrix, decompose_default(value.a, value.b, value.c, value.d, value.e, value.f)) : identity);
}

// node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else
      (xb || yb) && s.push("translate(" + xb + pxComma + yb + pxParen);
  }
  function rotate(a, b, s, q) {
    a !== b ? (a - b > 180 ? b += 360 : b - a > 180 && (a += 360), q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) })) : b && s.push(pop(s) + "rotate(" + b + degParen);
  }
  function skewX(a, b, s, q) {
    a !== b ? q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) }) : b && s.push(pop(s) + "skewX(" + b + degParen);
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else
      (xb !== 1 || yb !== 1) && s.push(pop(s) + "scale(" + xb + "," + yb + ")");
  }
  return function(a, b) {
    var s = [], q = [];
    return a = parse(a), b = parse(b), translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q), rotate(a.rotate, b.rotate, s, q), skewX(a.skewX, b.skewX, s, q), scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q), a = b = null, function(t) {
      for (var i = -1, n = q.length, o; ++i < n; )
        s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)"), interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

// node_modules/d3-scale/src/constant.js
function constants(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-scale/src/number.js
function number2(x) {
  return +x;
}

// node_modules/d3-scale/src/continuous.js
var unit = [0, 1];
function identity2(x) {
  return x;
}
function normalize(a, b) {
  return (b -= a = +a) ? function(x) {
    return (x - a) / b;
  } : constants(isNaN(b) ? NaN : 0.5);
}
function clamper(a, b) {
  var t;
  return a > b && (t = a, a = b, b = t), function(x) {
    return Math.max(a, Math.min(b, x));
  };
}
function bimap(domain, range2, interpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range2[0], r1 = range2[1];
  return d1 < d0 ? (d0 = normalize(d1, d0), r0 = interpolate(r1, r0)) : (d0 = normalize(d0, d1), r0 = interpolate(r0, r1)), function(x) {
    return r0(d0(x));
  };
}
function polymap(domain, range2, interpolate) {
  var j = Math.min(domain.length, range2.length) - 1, d = new Array(j), r = new Array(j), i = -1;
  for (domain[j] < domain[0] && (domain = domain.slice().reverse(), range2 = range2.slice().reverse()); ++i < j; )
    d[i] = normalize(domain[i], domain[i + 1]), r[i] = interpolate(range2[i], range2[i + 1]);
  return function(x) {
    var i2 = bisect_default(domain, x, 1, j) - 1;
    return r[i2](d[i2](x));
  };
}
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
  var domain = unit, range2 = unit, interpolate = value_default, transform, untransform, unknown, clamp = identity2, piecewise, output, input2;
  function rescale() {
    var n = Math.min(domain.length, range2.length);
    return clamp !== identity2 && (clamp = clamper(domain[0], domain[n - 1])), piecewise = n > 2 ? polymap : bimap, output = input2 = null, scale;
  }
  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range2, interpolate)))(transform(clamp(x)));
  }
  return scale.invert = function(y) {
    return clamp(untransform((input2 || (input2 = piecewise(range2, domain.map(transform), number_default)))(y)));
  }, scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number2), rescale()) : domain.slice();
  }, scale.range = function(_) {
    return arguments.length ? (range2 = Array.from(_), rescale()) : range2.slice();
  }, scale.rangeRound = function(_) {
    return range2 = Array.from(_), interpolate = round_default, rescale();
  }, scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? !0 : identity2, rescale()) : clamp !== identity2;
  }, scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  }, scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  }, function(t, u) {
    return transform = t, untransform = u, rescale();
  };
}
function continuous() {
  return transformer()(identity2, identity2);
}

// node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default(x) {
  return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}
function formatDecimalParts(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0)
    return null;
  var i, coefficient = x.slice(0, i);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

// node_modules/d3-format/src/exponent.js
function exponent_default(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

// node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
  return function(value, width) {
    for (var i = value.length, t = [], j = 0, g = grouping[0], length = 0; i > 0 && g > 0 && (length + g + 1 > width && (g = Math.max(1, width - length)), t.push(value.substring(i -= g, i + g)), !((length += g + 1) > width)); )
      g = grouping[j = (j + 1) % grouping.length];
    return t.reverse().join(thousands);
  };
}

// node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// node_modules/d3-format/src/formatSpecifier.js
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "", this.align = specifier.align === void 0 ? ">" : specifier.align + "", this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "", this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "", this.zero = !!specifier.zero, this.width = specifier.width === void 0 ? void 0 : +specifier.width, this.comma = !!specifier.comma, this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision, this.trim = !!specifier.trim, this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s) {
  out:
    for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i)
      switch (s[i]) {
        case ".":
          i0 = i1 = i;
          break;
        case "0":
          i0 === 0 && (i0 = i), i1 = i;
          break;
        default:
          if (!+s[i])
            break out;
          i0 > 0 && (i0 = 0);
          break;
      }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

// node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d)
    return x + "";
  var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
}

// node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d)
    return x + "";
  var coefficient = d[0], exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
  "%": (x, p) => (x * 100).toFixed(p),
  b: (x) => Math.round(x).toString(2),
  c: (x) => x + "",
  d: formatDecimal_default,
  e: (x, p) => x.toExponential(p),
  f: (x, p) => x.toFixed(p),
  g: (x, p) => x.toPrecision(p),
  o: (x) => Math.round(x).toString(8),
  p: (x, p) => formatRounded_default(x * 100, p),
  r: formatRounded_default,
  s: formatPrefixAuto_default,
  X: (x) => Math.round(x).toString(16).toUpperCase(),
  x: (x) => Math.round(x).toString(16)
};

// node_modules/d3-format/src/identity.js
function identity_default(x) {
  return x;
}

// node_modules/d3-format/src/locale.js
var map = Array.prototype.map, prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default(locale2) {
  var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity_default : formatGroup_default(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity_default : formatNumerals_default(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero3 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    type === "n" ? (comma = !0, type = "g") : formatTypes_default[type] || (precision === void 0 && (precision = 12), trim = !0, type = "g"), (zero3 || fill === "0" && align === "=") && (zero3 = !0, fill = "0", align = "=");
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "", formatType = formatTypes_default[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format2(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
      if (type === "c")
        valueSuffix = formatType(value) + valueSuffix, value = "";
      else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        if (value = isNaN(value) ? nan : formatType(Math.abs(value), precision), trim && (value = formatTrim_default(value)), valueNegative && +value == 0 && sign !== "+" && (valueNegative = !1), valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix, valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : ""), maybeSuffix) {
          for (i = -1, n = value.length; ++i < n; )
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix, value = value.slice(0, i);
              break;
            }
        }
      }
      comma && !zero3 && (value = group(value, 1 / 0));
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      switch (comma && zero3 && (value = group(padding + value, padding.length ? width - valueSuffix.length : 1 / 0), padding = ""), align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    return format2.toString = function() {
      return specifier + "";
    }, format2;
  }
  function formatPrefix2(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
    return function(value2) {
      return f(k * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}

// node_modules/d3-format/src/defaultLocale.js
var locale, format, formatPrefix;
defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function defaultLocale(definition) {
  return locale = locale_default(definition), format = locale.format, formatPrefix = locale.formatPrefix, locale;
}

// node_modules/d3-format/src/precisionFixed.js
function precisionFixed_default(step) {
  return Math.max(0, -exponent_default(Math.abs(step)));
}

// node_modules/d3-format/src/precisionPrefix.js
function precisionPrefix_default(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3 - exponent_default(Math.abs(step)));
}

// node_modules/d3-format/src/precisionRound.js
function precisionRound_default(step, max) {
  return step = Math.abs(step), max = Math.abs(max) - step, Math.max(0, exponent_default(max) - exponent_default(step)) + 1;
}

// node_modules/d3-scale/src/tickFormat.js
function tickFormat(start2, stop, count, specifier) {
  var step = tickStep(start2, stop, count), precision;
  switch (specifier = formatSpecifier(specifier ?? ",f"), specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start2), Math.abs(stop));
      return specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value)) && (specifier.precision = precision), formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start2), Math.abs(stop)))) && (specifier.precision = precision - (specifier.type === "e"));
      break;
    }
    case "f":
    case "%": {
      specifier.precision == null && !isNaN(precision = precisionFixed_default(step)) && (specifier.precision = precision - (specifier.type === "%") * 2);
      break;
    }
  }
  return format(specifier);
}

// node_modules/d3-scale/src/linear.js
function linearish(scale) {
  var domain = scale.domain;
  return scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count ?? 10);
  }, scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count ?? 10, specifier);
  }, scale.nice = function(count) {
    count == null && (count = 10);
    var d = domain(), i0 = 0, i1 = d.length - 1, start2 = d[i0], stop = d[i1], prestep, step, maxIter = 10;
    for (stop < start2 && (step = start2, start2 = stop, stop = step, step = i0, i0 = i1, i1 = step); maxIter-- > 0; ) {
      if (step = tickIncrement(start2, stop, count), step === prestep)
        return d[i0] = start2, d[i1] = stop, domain(d);
      if (step > 0)
        start2 = Math.floor(start2 / step) * step, stop = Math.ceil(stop / step) * step;
      else if (step < 0)
        start2 = Math.ceil(start2 * step) / step, stop = Math.floor(stop * step) / step;
      else
        break;
      prestep = step;
    }
    return scale;
  }, scale;
}
function linear2() {
  var scale = continuous();
  return scale.copy = function() {
    return copy(scale, linear2());
  }, initRange.apply(scale, arguments), linearish(scale);
}

// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml", namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  return i >= 0 && (prefix = name.slice(0, i)) !== "xmlns" && (name = name.slice(i + 1)), namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  typeof select != "function" && (select = selector_default(select));
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i)
      (node = group[i]) && (subnode = select.call(node, node.__data__, i, group)) && ("__data__" in node && (subnode.__data__ = node.__data__), subgroup[i] = subnode);
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

// node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  typeof select == "function" ? select = arrayAll(select) : select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i)
      (node = group[i]) && (subgroups.push(select.call(node, node.__data__, i, group)), parents.push(node));
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match == "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match == "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  typeof match != "function" && (match = matcher_default(match));
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i)
      (node = group[i]) && match.call(node, node.__data__, i, group) && subgroup.push(node);
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument, this.namespaceURI = parent.namespaceURI, this._next = null, this._parent = parent, this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default2(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  for (var i = 0, node, groupLength = group.length, dataLength = data.length; i < dataLength; ++i)
    (node = group[i]) ? (node.__data__ = data[i], update[i] = node) : enter[i] = new EnterNode(parent, data[i]);
  for (; i < groupLength; ++i)
    (node = group[i]) && (exit[i] = node);
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i)
    (node = group[i]) && (keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "", nodeByKeyValue.has(keyValue) ? exit[i] = node : nodeByKeyValue.set(keyValue, node));
  for (i = 0; i < dataLength; ++i)
    keyValue = key.call(parent, data[i], i, data) + "", (node = nodeByKeyValue.get(keyValue)) ? (update[i] = node, node.__data__ = data[i], nodeByKeyValue.delete(keyValue)) : enter[i] = new EnterNode(parent, data[i]);
  for (i = 0; i < groupLength; ++i)
    (node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node && (exit[i] = node);
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  typeof value != "function" && (value = constant_default2(value));
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0)
      if (previous = enterGroup[i0]) {
        for (i0 >= i1 && (i1 = i0 + 1); !(next = updateGroup[i1]) && ++i1 < dataLength; )
          ;
        previous._next = next || null;
      }
  }
  return update = new Selection(update, parents), update._enter = enter, update._exit = exit, update;
}
function arraylike(data) {
  return typeof data == "object" && "length" in data ? data : Array.from(data);
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  return typeof onenter == "function" ? (enter = onenter(enter), enter && (enter = enter.selection())) : enter = enter.append(onenter + ""), onupdate != null && (update = onupdate(update), update && (update = update.selection())), onexit == null ? exit.remove() : onexit(exit), enter && update ? enter.merge(update).order() : update;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  for (var selection2 = context.selection ? context.selection() : context, groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j)
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i)
      (node = group0[i] || group1[i]) && (merge[i] = node);
  for (; j < m0; ++j)
    merges[j] = groups0[j];
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m; )
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; )
      (node = group[i]) && (next && node.compareDocumentPosition(next) ^ 4 && next.parentNode.insertBefore(node, next), next = node);
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  compare || (compare = ascending2);
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i)
      (node = group[i]) && (sortgroup[i] = node);
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending2(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  return arguments[0] = this, callback.apply(null, arguments), this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j)
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node)
        return node;
    }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (let node of this)
    ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j)
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i)
      (node = group[i]) && callback.call(node, node.__data__, i, group);
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    v == null ? this.removeAttribute(name) : this.setAttribute(name, v);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    v == null ? this.removeAttributeNS(fullname.space, fullname.local) : this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value == "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    v == null ? this.style.removeProperty(name) : this.style.setProperty(name, v, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value == "function" ? styleFunction : styleConstant)(name, value, priority ?? "")) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    v == null ? delete this[name] : this[name] = v;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value == "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node, this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    i < 0 && (this._names.push(name), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    i >= 0 && (this._names.splice(i, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  for (var list2 = classList(node), i = -1, n = names.length; ++i < n; )
    list2.add(names[i]);
}
function classedRemove(node, names) {
  for (var list2 = classList(node), i = -1, n = names.length; ++i < n; )
    list2.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    for (var list2 = classList(this.node()), i = -1, n = names.length; ++i < n; )
      if (!list2.contains(names[i]))
        return !1;
    return !0;
  }
  return this.each((typeof value == "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v ?? "";
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value == "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v ?? "";
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value == "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
function raise() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
function lower() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create2 = typeof name == "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create2 = typeof name == "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before == "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  parent && parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(!1), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(!0), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    return i >= 0 && (name = t.slice(i + 1), t = t.slice(0, i)), { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!!on) {
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j)
        o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name ? this.removeEventListener(o.type, o.listener, o.options) : on[++i] = o;
      ++i ? on.length = i : delete this.__on;
    }
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) {
      for (var j = 0, m = on.length; j < m; ++j)
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, o.listener = listener, o.options = options), o.value = value;
          return;
        }
    }
    this.addEventListener(typename.type, listener, options), o = { type: typename.type, name: typename.name, value, listener, options }, on ? on.push(o) : this.__on = [o];
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) {
      for (var j = 0, m = on.length, o; j < m; ++j)
        for (i = 0, o = on[j]; i < n; ++i)
          if ((t = typenames[i]).type === o.type && t.name === o.name)
            return o.value;
    }
    return;
  }
  for (on = value ? onAdd : onRemove, i = 0; i < n; ++i)
    this.each(on(typenames[i], value, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type, params) {
  var window2 = window_default(node), event = window2.CustomEvent;
  typeof event == "function" ? event = new event(type, params) : (event = window2.document.createEvent("Event"), params ? (event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail) : event.initEvent(type, !1, !1)), node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function dispatch_default(type, params) {
  return this.each((typeof params == "function" ? dispatchFunction : dispatchConstant)(type, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j)
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i)
      (node = group[i]) && (yield node);
}

// node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups, this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector == "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// app/modules/avl-graph-modified/src/BarGraph.js
var import_deepequal2 = require("deepequal"), import_lodash35 = __toESM(require("lodash.get"));

// app/modules/avl-graph-modified/src/components/AxisBottom.js
var import_react90 = __toESM(require("react"));

// node_modules/d3-dispatch/src/dispatch.js
var noop2 = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t))
      throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames2(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0 && (name = t.slice(i + 1), t = t.slice(0, i)), t && !types.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames2(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      for (; ++i < n; )
        if ((t = (typename = T[i]).type) && (t = get31(_[t], typename.name)))
          return t;
      return;
    }
    if (callback != null && typeof callback != "function")
      throw new Error("invalid callback: " + callback);
    for (; ++i < n; )
      if (t = (typename = T[i]).type)
        _[t] = set(_[t], typename.name, callback);
      else if (callback == null)
        for (t in _)
          _[t] = set(_[t], typename.name, null);
    return this;
  },
  copy: function() {
    var copy2 = {}, _ = this._;
    for (var t in _)
      copy2[t] = _[t].slice();
    return new Dispatch(copy2);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0)
      for (var args = new Array(n), i = 0, n, t; i < n; ++i)
        args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  }
};
function get31(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i)
    if ((c = type[i]).name === name)
      return c.value;
}
function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i)
    if (type[i].name === name) {
      type[i] = noop2, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  return callback != null && type.push({ name, value: callback }), type;
}
var dispatch_default2 = dispatch;

// node_modules/d3-timer/src/timer.js
var frame = 0, timeout = 0, interval = 0, pokeDelay = 1e3, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance == "object" && performance.now ? performance : Date, setFrame = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback != "function")
      throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay), !this._next && taskTail !== this && (taskTail ? taskTail._next = this : taskHead = this, taskTail = this), this._call = callback, this._time = time, sleep();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, sleep());
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  return t.restart(callback, delay, time), t;
}
function timerFlush() {
  now(), ++frame;
  for (var t = taskHead, e; t; )
    (e = clockNow - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew, frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0, nap(), clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  delay > pokeDelay && (clockSkew -= delay, clockLast = now2);
}
function nap() {
  for (var t0, t1 = taskHead, t2, time = 1 / 0; t1; )
    t1._call ? (time > t1._time && (time = t1._time), t0 = t1, t1 = t1._next) : (t2 = t1._next, t1._next = null, t1 = t0 ? t0._next = t2 : taskHead = t2);
  taskTail = t0, sleep(time);
}
function sleep(time) {
  if (!frame) {
    timeout && (timeout = clearTimeout(timeout));
    var delay = time - clockNow;
    delay > 24 ? (time < 1 / 0 && (timeout = setTimeout(wake, time - clock.now() - clockSkew)), interval && (interval = clearInterval(interval))) : (interval || (clockLast = clock.now(), interval = setInterval(poke, pokeDelay)), frame = 1, setFrame(wake));
  }
}

// node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer();
  return delay = delay == null ? 0 : +delay, t.restart((elapsed) => {
    t.stop(), callback(elapsed + delay);
  }, delay, time), t;
}

// node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default2("start", "end", "cancel", "interrupt"), emptyTween = [], CREATED = 0, SCHEDULED = 1, STARTING = 2, STARTED = 3, RUNNING = 4, ENDING = 5, ENDED = 6;
function schedule_default(node, name, id3, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules)
    node.__transition = {};
  else if (id3 in schedules)
    return;
  create(node, id3, {
    name,
    index,
    group,
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id3) {
  var schedule = get32(node, id3);
  if (schedule.state > CREATED)
    throw new Error("too late; already scheduled");
  return schedule;
}
function set2(node, id3) {
  var schedule = get32(node, id3);
  if (schedule.state > STARTED)
    throw new Error("too late; already running");
  return schedule;
}
function get32(node, id3) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id3]))
    throw new Error("transition not found");
  return schedule;
}
function create(node, id3, self) {
  var schedules = node.__transition, tween;
  schedules[id3] = self, self.timer = timer(schedule, 0, self.time);
  function schedule(elapsed) {
    self.state = SCHEDULED, self.timer.restart(start2, self.delay, self.time), self.delay <= elapsed && start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j, n, o;
    if (self.state !== SCHEDULED)
      return stop();
    for (i in schedules)
      if (o = schedules[i], o.name === self.name) {
        if (o.state === STARTED)
          return timeout_default(start2);
        o.state === RUNNING ? (o.state = ENDED, o.timer.stop(), o.on.call("interrupt", node, node.__data__, o.index, o.group), delete schedules[i]) : +i < id3 && (o.state = ENDED, o.timer.stop(), o.on.call("cancel", node, node.__data__, o.index, o.group), delete schedules[i]);
      }
    if (timeout_default(function() {
      self.state === STARTED && (self.state = RUNNING, self.timer.restart(tick, self.delay, self.time), tick(elapsed));
    }), self.state = STARTING, self.on.call("start", node, node.__data__, self.index, self.group), self.state === STARTING) {
      for (self.state = STARTED, tween = new Array(n = self.tween.length), i = 0, j = -1; i < n; ++i)
        (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) && (tween[++j] = o);
      tween.length = j + 1;
    }
  }
  function tick(elapsed) {
    for (var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length; ++i < n; )
      tween[i].call(node, t);
    self.state === ENDING && (self.on.call("end", node, node.__data__, self.index, self.group), stop());
  }
  function stop() {
    self.state = ENDED, self.timer.stop(), delete schedules[id3];
    for (var i in schedules)
      return;
    delete node.__transition;
  }
}

// node_modules/d3-transition/src/interrupt.js
function interrupt_default(node, name) {
  var schedules = node.__transition, schedule, active, empty2 = !0, i;
  if (!!schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) {
        empty2 = !1;
        continue;
      }
      active = schedule.state > STARTING && schedule.state < ENDING, schedule.state = ENDED, schedule.timer.stop(), schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group), delete schedules[i];
    }
    empty2 && delete node.__transition;
  }
}

// node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id3, name) {
  var tween0, tween1;
  return function() {
    var schedule = set2(this, id3), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i)
        if (tween1[i].name === name) {
          tween1 = tween1.slice(), tween1.splice(i, 1);
          break;
        }
    }
    schedule.tween = tween1;
  };
}
function tweenFunction(id3, name, value) {
  var tween0, tween1;
  if (typeof value != "function")
    throw new Error();
  return function() {
    var schedule = set2(this, id3), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i)
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      i === n && tween1.push(t);
    }
    schedule.tween = tween1;
  };
}
function tween_default(name, value) {
  var id3 = this._id;
  if (name += "", arguments.length < 2) {
    for (var tween = get32(this.node(), id3).tween, i = 0, n = tween.length, t; i < n; ++i)
      if ((t = tween[i]).name === name)
        return t.value;
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id3, name, value));
}
function tweenValue(transition2, name, value) {
  var id3 = transition2._id;
  return transition2.each(function() {
    var schedule = set2(this, id3);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  }), function(node) {
    return get32(node, id3).value[name];
  };
}

// node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
  var c;
  return (typeof b == "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}

// node_modules/d3-transition/src/transition/attr.js
function attrRemove2(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    return value1 == null ? void this.removeAttribute(name) : (string0 = this.getAttribute(name), string1 = value1 + "", string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1)));
  };
}
function attrFunctionNS2(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    return value1 == null ? void this.removeAttributeNS(fullname.space, fullname.local) : (string0 = this.getAttributeNS(fullname.space, fullname.local), string1 = value1 + "", string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1)));
  };
}
function attr_default2(name, value) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value == "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
}

// node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    return i !== i0 && (t0 = (i0 = i) && attrInterpolateNS(fullname, i)), t0;
  }
  return tween._value = value, tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    return i !== i0 && (t0 = (i0 = i) && attrInterpolate(name, i)), t0;
  }
  return tween._value = value, tween;
}
function attrTween_default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value != "function")
    throw new Error();
  var fullname = namespace_default(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

// node_modules/d3-transition/src/transition/delay.js
function delayFunction(id3, value) {
  return function() {
    init(this, id3).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id3, value) {
  return value = +value, function() {
    init(this, id3).delay = value;
  };
}
function delay_default(value) {
  var id3 = this._id;
  return arguments.length ? this.each((typeof value == "function" ? delayFunction : delayConstant)(id3, value)) : get32(this.node(), id3).delay;
}

// node_modules/d3-transition/src/transition/duration.js
function durationFunction(id3, value) {
  return function() {
    set2(this, id3).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id3, value) {
  return value = +value, function() {
    set2(this, id3).duration = value;
  };
}
function duration_default(value) {
  var id3 = this._id;
  return arguments.length ? this.each((typeof value == "function" ? durationFunction : durationConstant)(id3, value)) : get32(this.node(), id3).duration;
}

// node_modules/d3-transition/src/transition/ease.js
function easeConstant(id3, value) {
  if (typeof value != "function")
    throw new Error();
  return function() {
    set2(this, id3).ease = value;
  };
}
function ease_default(value) {
  var id3 = this._id;
  return arguments.length ? this.each(easeConstant(id3, value)) : get32(this.node(), id3).ease;
}

// node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id3, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v != "function")
      throw new Error();
    set2(this, id3).ease = v;
  };
}
function easeVarying_default(value) {
  if (typeof value != "function")
    throw new Error();
  return this.each(easeVarying(this._id, value));
}

// node_modules/d3-transition/src/transition/filter.js
function filter_default2(match) {
  typeof match != "function" && (match = matcher_default(match));
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i)
      (node = group[i]) && match.call(node, node.__data__, i, group) && subgroup.push(node);
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition2) {
  if (transition2._id !== this._id)
    throw new Error();
  for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j)
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i)
      (node = group0[i] || group1[i]) && (merge[i] = node);
  for (; j < m0; ++j)
    merges[j] = groups0[j];
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/on.js
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    return i >= 0 && (t = t.slice(0, i)), !t || t === "start";
  });
}
function onFunction(id3, name, listener) {
  var on0, on1, sit = start(name) ? init : set2;
  return function() {
    var schedule = sit(this, id3), on = schedule.on;
    on !== on0 && (on1 = (on0 = on).copy()).on(name, listener), schedule.on = on1;
  };
}
function on_default2(name, listener) {
  var id3 = this._id;
  return arguments.length < 2 ? get32(this.node(), id3).on.on(name) : this.each(onFunction(id3, name, listener));
}

// node_modules/d3-transition/src/transition/remove.js
function removeFunction(id3) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition)
      if (+i !== id3)
        return;
    parent && parent.removeChild(this);
  };
}
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/d3-transition/src/transition/select.js
function select_default3(select) {
  var name = this._name, id3 = this._id;
  typeof select != "function" && (select = selector_default(select));
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i)
      (node = group[i]) && (subnode = select.call(node, node.__data__, i, group)) && ("__data__" in node && (subnode.__data__ = node.__data__), subgroup[i] = subnode, schedule_default(subgroup[i], name, id3, i, subgroup, get32(node, id3)));
  return new Transition(subgroups, this._parents, name, id3);
}

// node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default2(select) {
  var name = this._name, id3 = this._id;
  typeof select != "function" && (select = selectorAll_default(select));
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i)
      if (node = group[i]) {
        for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get32(node, id3), k = 0, l = children2.length; k < l; ++k)
          (child = children2[k]) && schedule_default(child, name, id3, k, children2, inherit2);
        subgroups.push(children2), parents.push(node);
      }
  return new Transition(subgroups, parents, name, id3);
}

// node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function styleFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    return value1 == null && (string1 = value1 = (this.style.removeProperty(name), styleValue(this, name))), string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function styleMaybeRemove(id3, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule = set2(this, id3), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
    (on !== on0 || listener0 !== listener) && (on1 = (on0 = on).copy()).on(event, listener0 = listener), schedule.on = on1;
  };
}
function style_default2(name, value, priority) {
  var i = (name += "") == "transform" ? interpolateTransformCss : interpolate_default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value == "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
}

// node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    return i !== i0 && (t = (i0 = i) && styleInterpolate(name, i, priority)), t;
  }
  return tween._value = value, tween;
}
function styleTween_default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value != "function")
    throw new Error();
  return this.tween(key, styleTween(name, value, priority ?? ""));
}

// node_modules/d3-transition/src/transition/text.js
function textConstant2(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction2(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 ?? "";
  };
}
function text_default2(value) {
  return this.tween("text", typeof value == "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
}

// node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    return i !== i0 && (t0 = (i0 = i) && textInterpolate(i)), t0;
  }
  return tween._value = value, tween;
}
function textTween_default(value) {
  var key = "text";
  if (arguments.length < 1)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value != "function")
    throw new Error();
  return this.tween(key, textTween(value));
}

// node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  for (var name = this._name, id0 = this._id, id1 = newId(), groups = this._groups, m = groups.length, j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i)
      if (node = group[i]) {
        var inherit2 = get32(node, id0);
        schedule_default(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
  return new Transition(groups, this._parents, name, id1);
}

// node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id3 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      --size === 0 && resolve();
    } };
    that.each(function() {
      var schedule = set2(this, id3), on = schedule.on;
      on !== on0 && (on1 = (on0 = on).copy(), on1._.cancel.push(cancel), on1._.interrupt.push(cancel), on1._.end.push(end)), schedule.on = on1;
    }), size === 0 && resolve();
  });
}

// node_modules/d3-transition/src/transition/index.js
var id2 = 0;
function Transition(groups, parents, name, id3) {
  this._groups = groups, this._parents = parents, this._name = name, this._id = id3;
}
function transition(name) {
  return selection_default().transition(name);
}
function newId() {
  return ++id2;
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default2,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default2,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

// node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
  time: null,
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id3) {
  for (var timing; !(timing = node.__transition) || !(timing = timing[id3]); )
    if (!(node = node.parentNode))
      throw new Error(`transition ${id3} not found`);
  return timing;
}
function transition_default2(name) {
  var id3, timing;
  name instanceof Transition ? (id3 = name._id, name = name._name) : (id3 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "");
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j)
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i)
      (node = group[i]) && schedule_default(node, name, id3, i, group, timing || inherit(node, id3));
  return new Transition(groups, this._parents, name, id3);
}

// node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/d3-axis/src/identity.js
function identity_default2(x) {
  return x;
}

// node_modules/d3-axis/src/axis.js
var top = 1, right = 2, bottom = 3, left = 4, epsilon = 1e-6;
function translateX(x) {
  return "translate(" + x + ",0)";
}
function translateY(y) {
  return "translate(0," + y + ")";
}
function number3(scale) {
  return (d) => +scale(d);
}
function center(scale, offset) {
  return offset = Math.max(0, scale.bandwidth() - offset * 2) / 2, scale.round() && (offset = Math.round(offset)), (d) => +scale(d) + offset;
}
function entering() {
  return !this.__axis;
}
function axis(orient, scale) {
  var tickArguments = [], tickValues = null, tickFormat2 = null, tickSizeInner = 6, tickSizeOuter = 6, tickPadding = 3, offset = typeof window < "u" && window.devicePixelRatio > 1 ? 0 : 0.5, k = orient === top || orient === left ? -1 : 1, x = orient === left || orient === right ? "x" : "y", transform = orient === top || orient === bottom ? translateX : translateY;
  function axis2(context) {
    var values = tickValues ?? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()), format2 = tickFormat2 ?? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity_default2), spacing = Math.max(tickSizeInner, 0) + tickPadding, range2 = scale.range(), range0 = +range2[0] + offset, range1 = +range2[range2.length - 1] + offset, position = (scale.bandwidth ? center : number3)(scale.copy(), offset), selection2 = context.selection ? context.selection() : context, path = selection2.selectAll(".domain").data([null]), tick = selection2.selectAll(".tick").data(values, scale).order(), tickExit = tick.exit(), tickEnter = tick.enter().append("g").attr("class", "tick"), line = tick.select("line"), text = tick.select("text");
    path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor")), tick = tick.merge(tickEnter), line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x + "2", k * tickSizeInner)), text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em")), context !== selection2 && (path = path.transition(context), tick = tick.transition(context), line = line.transition(context), text = text.transition(context), tickExit = tickExit.transition(context).attr("opacity", epsilon).attr("transform", function(d) {
      return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform");
    }), tickEnter.attr("opacity", epsilon).attr("transform", function(d) {
      var p = this.parentNode.__axis;
      return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset);
    })), tickExit.remove(), path.attr("d", orient === left || orient === right ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1), tick.attr("opacity", 1).attr("transform", function(d) {
      return transform(position(d) + offset);
    }), line.attr(x + "2", k * tickSizeInner), text.attr(x, k * spacing).text(format2), selection2.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle"), selection2.each(function() {
      this.__axis = position;
    });
  }
  return axis2.scale = function(_) {
    return arguments.length ? (scale = _, axis2) : scale;
  }, axis2.ticks = function() {
    return tickArguments = Array.from(arguments), axis2;
  }, axis2.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis2) : tickArguments.slice();
  }, axis2.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis2) : tickValues && tickValues.slice();
  }, axis2.tickFormat = function(_) {
    return arguments.length ? (tickFormat2 = _, axis2) : tickFormat2;
  }, axis2.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis2) : tickSizeInner;
  }, axis2.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis2) : tickSizeInner;
  }, axis2.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis2) : tickSizeOuter;
  }, axis2.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis2) : tickPadding;
  }, axis2.offset = function(_) {
    return arguments.length ? (offset = +_, axis2) : offset;
  }, axis2;
}
function axisRight(scale) {
  return axis(right, scale);
}
function axisBottom(scale) {
  return axis(bottom, scale);
}
function axisLeft(scale) {
  return axis(left, scale);
}

// app/modules/avl-graph-modified/src/components/AxisBottom.js
var import_jsx_dev_runtime75 = require("react/jsx-dev-runtime"), AxisBottom = (props) => {
  let {
    adjustedWidth,
    adjustedHeight,
    type = "band",
    domain,
    scale,
    format: format2,
    tickValues,
    secondary,
    label,
    margin,
    tickDensity = 2
  } = props, ref = import_react90.default.useRef();
  return import_react90.default.useEffect(
    () => {
      ref.current && renderAxisBottom({
        ref: ref.current,
        adjustedWidth,
        adjustedHeight,
        type,
        domain,
        scale,
        format: format2,
        tickValues,
        secondary,
        label,
        margin,
        tickDensity
      });
    },
    [
      adjustedWidth,
      adjustedHeight,
      type,
      domain,
      scale,
      format2,
      tickValues,
      secondary,
      label,
      margin,
      tickDensity
    ]
  ), /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("g", { ref }, void 0, !1, {
    fileName: "app/modules/avl-graph-modified/src/components/AxisBottom.js",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}, renderAxisBottom = ({
  ref,
  adjustedWidth,
  adjustedHeight,
  domain,
  scale,
  format: format2,
  secondary,
  label,
  tickValues,
  type,
  margin,
  tickDensity
}) => {
  let { left: left2, top: top2, bottom: bottom2 } = margin;
  if (!tickValues && type === "band") {
    let ticks2 = Math.ceil(adjustedWidth / 100 * tickDensity), mod = Math.ceil(domain.length / ticks2), halfMod = Math.floor(mod * 0.5);
    tickValues = domain.filter(
      (d, i) => (mod === 1 || i > 0) && (mod === 1 || i < domain.length - 1) && !((i - halfMod) % mod)
    );
  } else if (!tickValues && type === "ordinal") {
    let density = 100 / tickDensity, tick = 0;
    tickValues = [];
    for (let i = 0; i < domain.length; ++i)
      i > 0 && (tick += scale(domain[i]) - scale(domain[i - 1])), (!tickValues.length && tick >= density * 0.5 || tick >= density) && (tickValues.push(domain[i]), tick = 0);
  }
  let axisBottom2 = axisBottom(scale).tickValues(tickValues).tickFormat(format2), transition2 = transition().duration(1e3), group = select_default2(ref).selectAll("g.animated-group").data(["animated-group"]).join(
    (enter) => enter.append("g").attr("class", "animated-group").call(
      (enter2) => enter2.style("transform", `translate(${left2}px, ${adjustedHeight + top2}px)`)
    ),
    (update) => update.call(
      (update2) => update2.transition(transition2).style("transform", `translate(${left2}px, ${adjustedHeight + top2}px)`)
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).remove()
    )
  ).selectAll("g.axis-group").data(domain.length ? ["axis-group"] : []).join(
    (enter) => enter.append("g").attr("class", "axis-group").call(
      (enter2) => enter2.style("transform", "scale(0, 0)").transition(transition2).style("transform", "scale(1, 1)")
    ),
    (update) => update.call(
      (update2) => update2.transition(transition2).style("transform", "scale(1, 1)")
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).style("transform", "scale(0, 0)").remove()
    )
  );
  group.selectAll("g.axis").data(domain.length ? ["axis-bottom"] : []).join("g").attr("class", "axis axis-bottom").classed("secondary", secondary).transition(transition2).call(axisBottom2), group.selectAll("text.axis-label").data(domain.length && Boolean(label) ? [label] : []).join("text").attr("class", "axis-label axis-label-bottom").style("transform", `translate(${adjustedWidth * 0.5}px, ${bottom2 - 9}px)`).attr("text-anchor", "middle").attr("fill", "currentColor").attr("font-size", "1rem").text((d) => d);
};

// app/modules/avl-graph-modified/src/components/AxisLeft.js
var import_react91 = __toESM(require("react"));
var import_jsx_dev_runtime76 = require("react/jsx-dev-runtime"), AxisLeft = (props) => {
  let {
    adjustedWidth,
    adjustedHeight,
    showGridLines = !0,
    gridLineOpacity = 1,
    gridLineColor = "#000",
    domain,
    scale,
    format: format2,
    type = "linear",
    secondary,
    label,
    margin,
    ticks: ticks2 = 10,
    tickValues
  } = props, ref = import_react91.default.useRef();
  return import_react91.default.useEffect(
    () => {
      ref.current && renderAxisLeft(
        ref.current,
        adjustedWidth,
        adjustedHeight,
        domain,
        scale,
        type,
        format2,
        secondary,
        label,
        margin,
        ticks2,
        tickValues,
        showGridLines,
        gridLineOpacity,
        gridLineColor
      );
    },
    [
      adjustedWidth,
      adjustedHeight,
      showGridLines,
      domain,
      scale,
      type,
      format2,
      secondary,
      label,
      margin,
      ticks2,
      tickValues
    ]
  ), /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("g", { ref }, void 0, !1, {
    fileName: "app/modules/avl-graph-modified/src/components/AxisLeft.js",
    lineNumber: 31,
    columnNumber: 10
  }, this);
}, renderAxisLeft = (ref, adjustedWidth, adjustedHeight, domain, scale, type, format2, secondary, label, margin, ticks2, tickValues, showGridLines, gridLineOpacity, gridLineColor) => {
  let { left: left2, top: top2 } = margin, axisLeft2 = axisLeft(scale).tickFormat(format2);
  tickValues ? axisLeft2.tickValues(tickValues) : axisLeft2.ticks(ticks2);
  let transition2 = transition().duration(1e3), group = select_default2(ref).selectAll("g.animated-group").data(["animated-group"]).join(
    (enter) => enter.append("g").attr("class", "animated-group").call(
      (enter2) => enter2.style("transform", `translate(${left2}px, ${top2}px)`)
    ),
    (update) => update.call(
      (update2) => update2.transition(transition2).style("transform", `translate(${left2}px, ${top2}px)`)
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).style("transform", `translate(${left2}px, ${top2}px)`).remove()
    )
  ).selectAll("g.axis-group").data(domain.length ? ["axis-group"] : []).join(
    (enter) => enter.append("g").attr("class", "axis-group").call(
      (enter2) => enter2.style("transform", `translateY(${adjustedHeight}px) scale(0, 0)`).transition(transition2).style("transform", "translateY(0px) scale(1, 1)")
    ),
    (update) => update.call(
      (update2) => update2.transition(transition2).style("transform", "translateY(0px) scale(1, 1)")
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).style("transform", `translateY(${adjustedHeight}px) scale(0, 0)`).remove()
    )
  );
  if (group.selectAll("g.axis").data(domain.length ? ["axis-left"] : []).join("g").attr("class", "axis axis-left").classed("secondary", secondary).transition(transition2).call(axisLeft2).call(
    (g) => g.selectAll(".tick line").attr("stroke", gridLineColor).attr("stroke-opacity", gridLineOpacity)
  ), group.selectAll("text.axis-label").data(domain.length && Boolean(label) ? [label] : []).join("text").attr("class", "axis-label axis-label-left").style(
    "transform",
    `translate(${-left2 + 20}px, ${adjustedHeight * 0.5}px) rotate(-90deg)`
  ).attr("text-anchor", "middle").attr("fill", gridLineColor).attr("font-size", "1rem").text((d) => d), type !== "linear" || !showGridLines)
    return;
  let gridLines = group.selectAll("line.grid-line"), numGridLines = gridLines.size(), numTicks = scale.ticks(ticks2).length, gridEnter = numGridLines && numGridLines < numTicks ? scale(domain[1] * 1.5) : scale(0), gridExit = scale(domain[1] * 1.5);
  gridLines.data(domain.length ? scale.ticks(ticks2) : []).join(
    (enter) => enter.append("line").attr("class", "grid-line").attr("x1", 0).attr("x2", adjustedWidth).attr("y1", gridEnter).attr("y2", gridEnter).attr("stroke", gridLineColor).attr("stroke-opacity", gridLineOpacity).call(
      (enter2) => enter2.transition(transition2).attr("y1", (d) => scale(d) + 0.5).attr("y2", (d) => scale(d) + 0.5)
    ),
    (update) => update.call(
      (update2) => update2.attr("stroke", gridLineColor).attr("stroke-opacity", gridLineOpacity).transition(transition2).attr("x2", adjustedWidth).attr("y1", (d) => scale(d) + 0.5).attr("y2", (d) => scale(d) + 0.5)
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).attr("y1", gridExit).attr("y2", gridExit).remove()
    )
  );
};

// app/modules/avl-graph-modified/src/components/AxisRight.js
var import_react92 = __toESM(require("react"));
var import_jsx_dev_runtime77 = require("react/jsx-dev-runtime"), AxisRight = (props) => {
  let {
    adjustedWidth,
    adjustedHeight,
    showGridLines = !0,
    domain,
    scale,
    format: format2,
    type = "linear",
    secondary,
    label,
    margin,
    ticks: ticks2 = 10
  } = props, ref = import_react92.default.useRef();
  return import_react92.default.useEffect(
    () => {
      ref.current && renderAxisRight(
        ref.current,
        adjustedWidth,
        adjustedHeight,
        domain,
        scale,
        type,
        format2,
        secondary,
        label,
        margin,
        ticks2,
        showGridLines
      );
    },
    [
      adjustedWidth,
      adjustedHeight,
      showGridLines,
      domain,
      scale,
      type,
      format2,
      secondary,
      label,
      margin,
      ticks2
    ]
  ), /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("g", { ref }, void 0, !1, {
    fileName: "app/modules/avl-graph-modified/src/components/AxisRight.js",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}, renderAxisRight = (ref, adjustedWidth, adjustedHeight, domain, scale, type, format2, secondary, label, margin, ticks2, showGridLines) => {
  let { left: left2, right: right2, top: top2 } = margin, axisRight2 = axisRight(scale).tickFormat(format2).ticks(ticks2), transition2 = transition().duration(1e3), group = select_default2(ref).selectAll("g.animated-group").data(["animated-group"]).join(
    (enter) => enter.append("g").attr("class", "animated-group").call(
      (enter2) => enter2.style("transform", `translate(${adjustedWidth + left2}px, ${top2}px)`)
    ),
    (update) => update.call(
      (update2) => update2.transition(transition2).style("transform", `translate(${adjustedWidth + left2}px, ${top2}px)`)
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).style("transform", `translate(${adjustedWidth + left2}px, ${top2}px)`).remove()
    )
  ).selectAll("g.axis-group").data(domain.length ? ["axis-group"] : []).join(
    (enter) => enter.append("g").attr("class", "axis-group").call(
      (enter2) => enter2.style("transform", `translateY(${adjustedHeight}px) scale(0, 0)`).transition(transition2).style("transform", "translateY(0px) scale(1, 1)")
    ),
    (update) => update.call(
      (update2) => update2.transition(transition2).style("transform", "translateY(0px) scale(1, 1)")
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).style("transform", `translateY(${adjustedHeight}px) scale(0, 0)`).remove()
    )
  );
  if (group.selectAll("g.axis").data(domain.length ? ["axis-right"] : []).join("g").attr("class", "axis axis-right").transition(transition2).call(axisRight2), group.selectAll("g.axis.axis-right .domain").attr("stroke-dasharray", secondary ? "8 4" : null), group.selectAll("text.axis-label").data(domain.length && Boolean(label) ? [label] : []).join("text").attr("class", "axis-label axis-label-right").style(
    "transform",
    `translate(${right2 - 20}px, ${adjustedHeight * 0.5}px) rotate(90deg)`
  ).attr("text-anchor", "middle").attr("fill", "currentColor").attr("font-size", "1rem").text((d) => d), type !== "linear" || !showGridLines)
    return;
  let gridLines = group.selectAll("line.grid-line"), numGridLines = gridLines.size(), numTicks = scale.ticks().length, gridEnter = numGridLines && numGridLines < numTicks ? scale(domain[1] * 1.5) : scale(0), gridExit = scale(domain[1] * 1.5);
  gridLines.data(domain.length ? scale.ticks() : []).join(
    (enter) => enter.append("line").attr("class", "grid-line").attr("stroke-dasharray", secondary ? "8 4" : null).attr("x1", 0).attr("x2", -adjustedWidth).attr("y1", gridEnter).attr("y2", gridEnter).attr("stroke", "currentColor").call(
      (enter2) => enter2.transition(transition2).attr("y1", (d) => scale(d) + 0.5).attr("y2", (d) => scale(d) + 0.5)
    ),
    (update) => update.call(
      (update2) => update2.attr("stroke", "currentColor").transition(transition2).attr("x2", -adjustedWidth).attr("y1", (d) => scale(d) + 0.5).attr("y2", (d) => scale(d) + 0.5)
    ),
    (exit) => exit.call(
      (exit2) => exit2.transition(transition2).attr("y1", gridExit).attr("y2", gridExit).remove()
    )
  );
};

// app/modules/avl-graph-modified/src/components/HoverCompContainer.js
var import_react93 = __toESM(require("react")), import_lodash33 = __toESM(require("lodash.throttle")), import_jsx_dev_runtime78 = require("react/jsx-dev-runtime"), getTranslate2 = ({ pos, svgWidth, svgHeight, margin, position }) => {
  let [x, y] = pos;
  switch (position) {
    case "above": {
      let xMax = svgWidth - margin.right;
      return `translate(
        max(
          min(calc(${x}px - 50%), calc(${xMax - 10}px - 100%)),
          calc(${margin.left + 10}px)
        ),
        calc(-100% - ${30 - y}px)
      )`;
    }
    default: {
      let yMax = svgHeight - margin.bottom, yTrans = `max(
          ${margin.top + 10}px,
          min(${y - 30}px, calc(${yMax - 10}px - 100%))
        )`;
      return x < margin.left + (svgWidth - margin.left - margin.right) * 0.5 ? `translate(
          ${x + 30}px,
          ${yTrans}
        )` : `translate(
        calc(-100% + ${x - 30}px),
        ${yTrans}
      )`;
    }
  }
}, HoverCompContainer2 = ({ show, children: children2, ...rest }) => /* @__PURE__ */ (0, import_jsx_dev_runtime78.jsxDEV)(
  "div",
  {
    className: `
      absolute top-0 left-0 z-50 pointer-events-none
      rounded whitespace-nowrap hover-comp
    `,
    style: {
      display: show ? "inline-block" : "none",
      transform: getTranslate2(rest),
      boxShadow: "2px 2px 8px 0px rgba(0, 0, 0, 0.75)",
      transition: "transform 0.15s ease-out"
    },
    children: children2
  },
  void 0,
  !1,
  {
    fileName: "app/modules/avl-graph-modified/src/components/HoverCompContainer.js",
    lineNumber: 42,
    columnNumber: 3
  },
  this
), UPDATE_DATA = "update-data", SET_SHOW = "set-show", Reducer2 = (state, action7) => {
  let { type, ...payload } = action7;
  switch (type) {
    case UPDATE_DATA:
    case SET_SHOW:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}, InitialState2 = {
  show: !1,
  pos: [0, 0],
  data: null,
  target: "graph"
}, useHoverComp = (ref) => {
  let [hoverData, dispatch2] = import_react93.default.useReducer(Reducer2, InitialState2), updateHoverData = import_react93.default.useMemo(() => (0, import_lodash33.default)(dispatch2, 25), [dispatch2]), onMouseOver = import_react93.default.useCallback((e, data, { pos = null, target = "graph" } = {}) => {
    let rect = ref.current.getBoundingClientRect();
    updateHoverData({
      type: UPDATE_DATA,
      show: !0,
      target,
      data,
      pos: pos ? [pos.x - rect.x, pos.y - rect.y] : [e.clientX - rect.x, e.clientY - rect.y]
    });
  }, [ref, updateHoverData]), onMouseMove = import_react93.default.useCallback((e, data, { pos = null, target = "graph" } = {}) => {
    let rect = ref.current.getBoundingClientRect();
    updateHoverData({
      type: UPDATE_DATA,
      show: !0,
      target,
      data,
      pos: pos ? [pos.x - rect.x, pos.y - rect.y] : [e.clientX - rect.x, e.clientY - rect.y]
    });
  }, [ref, updateHoverData]), onMouseLeave = import_react93.default.useCallback((e) => {
    updateHoverData({ type: SET_SHOW, show: !1 });
  }, [updateHoverData]);
  return {
    hoverData,
    onMouseOver,
    onMouseMove,
    onMouseLeave
  };
};

// app/modules/avl-graph-modified/src/utils/index.js
var import_react94 = __toESM(require("react")), import_deepequal = __toESM(require("deepequal")), import_lodash34 = __toESM(require("lodash.get"));
var DEFAULT_COLORS = getColorRange(12, "Set3"), getColorFunc = (colors) => {
  if (typeof colors == "function")
    return colors;
  let colorRange = [...DEFAULT_COLORS];
  if (typeof colors == "string") {
    let [k1, k2, reverse = !1] = colors.split("-");
    colorRange = getColorRange(k1, k2), reverse && colorRange.reverse();
  } else
    Array.isArray(colors) && (colorRange = [...colors]);
  return (d, i) => colorRange[i % colorRange.length];
}, Identity2 = (i) => i, EmptyArray2 = [], EmptyObject2 = {}, strictNaN = (v) => v === null || isNaN(v), DefaultMargin = {
  left: 70,
  top: 20,
  right: 20,
  bottom: 30
};
var useShouldComponentUpdate = (props) => {
  let prevProps = import_react94.default.useRef({}), ShouldComponentUpdate = import_react94.default.useMemo(() => {
    let keys = (0, import_lodash34.default)(props, "shouldComponentUpdate", []);
    return keys.reduce((a, c) => a || !(0, import_deepequal.default)((0, import_lodash34.default)(prevProps, ["current", c]), (0, import_lodash34.default)(props, c)), !Boolean(keys.length));
  }, [props]);
  return import_react94.default.useEffect(() => {
    prevProps.current = props;
  }, [props]), ShouldComponentUpdate;
};

// app/modules/avl-graph-modified/src/BarGraph.js
var import_jsx_dev_runtime79 = require("react/jsx-dev-runtime"), DefaultHoverComp2 = ({ data, keys, indexFormat, keyFormat, valueFormat }) => {
  let theme = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: `
      flex flex-col px-2 pt-1 rounded
      ${keys.length <= 1 ? "pb-2" : "pb-1"}
      ${theme.accent1}
    `, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "font-bold text-lg leading-6 border-b-2 mb-1 pl-2", children: indexFormat((0, import_lodash35.default)(data, "index", null)) }, void 0, !1, {
      fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    keys.slice().reverse().filter((key) => (0, import_lodash35.default)(data, ["data", key], !1)).map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: `
            flex items-center px-2 border-2 rounded transition
            ${data.key === key ? "border-current" : "border-transparent"}
          `, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
        "div",
        {
          className: "mr-2 rounded-sm color-square w-5 h-5",
          style: {
            backgroundColor: (0, import_lodash35.default)(data, ["barValues", key, "color"], null),
            opacity: data.key === key ? 1 : 0.2
          }
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
          lineNumber: 51,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "mr-4", children: [
        keyFormat(key),
        ":"
      ] }, void 0, !0, {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 56,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "text-right flex-1", children: valueFormat((0, import_lodash35.default)(data, ["data", key], 0)) }, void 0, !1, {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 59,
        columnNumber: 13
      }, this)
    ] }, key, !0, {
      fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
      lineNumber: 47,
      columnNumber: 11
    }, this)),
    keys.length <= 1 ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "flex pr-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "w-5 mr-2" }, void 0, !1, {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 67,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "mr-4 pl-2", children: "Total:" }, void 0, !1, {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 68,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "flex-1 text-right", children: valueFormat(keys.reduce((a, c) => a + (0, import_lodash35.default)(data, ["data", c], 0), 0)) }, void 0, !1, {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 71,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
      lineNumber: 66,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}, DefaultHoverCompData = {
  HoverComp: DefaultHoverComp2,
  indexFormat: Identity2,
  keyFormat: Identity2,
  valueFormat: Identity2,
  position: "side"
}, InitialState3 = {
  xDomain: [],
  yDomain: [],
  XScale: null,
  YScale: null,
  adjustedWidth: 0,
  adjustedHeight: 0
}, BarGraph = (props) => {
  let {
    data = EmptyArray2,
    keys = EmptyArray2,
    margin = EmptyObject2,
    hoverComp = EmptyObject2,
    axisBottom: axisBottom2 = null,
    xScale = null,
    axisLeft: axisLeft2 = null,
    yScale = null,
    axisRight: axisRight2 = null,
    indexBy = "index",
    className = "",
    paddingInner = 0,
    paddingOuter = 0,
    padding,
    colors,
    groupMode = "stacked"
  } = props, Margin = import_react95.default.useMemo(() => ({ ...DefaultMargin, ...margin }), [margin]), HoverCompData = import_react95.default.useMemo(() => {
    let hcData = { ...DefaultHoverCompData, ...hoverComp };
    return typeof hcData.indexFormat == "string" && (hcData.indexFormat = format(hcData.indexFormat)), typeof hcData.keyFormat == "string" && (hcData.keyFormat = format(hcData.keyFormat)), typeof hcData.valueFormat == "string" && (hcData.valueFormat = format(hcData.valueFormat)), hcData;
  }, [hoverComp]), ref = import_react95.default.useRef(), { width, height } = useSetSize(ref), [state, setState] = import_react95.default.useState(InitialState3), barData = import_react95.default.useRef(EmptyArray2), exitingData = import_react95.default.useRef(EmptyArray2), exitData = import_react95.default.useCallback(() => {
    barData.current = barData.current.filter(({ id: id3 }) => !(id3 in exitingData.current)), setState((prev) => ({ ...prev }));
  }, []), ShouldComponentUpdate = useShouldComponentUpdate(props);
  import_react95.default.useEffect(
    () => {
      if (!(width && height) || !ShouldComponentUpdate)
        return;
      let adjustedWidth = Math.max(0, width - (Margin.left + Margin.right)), adjustedHeight = Math.max(0, height - (Margin.top + Margin.bottom)), xDomain2 = data.map((d) => d[indexBy]), yDomain2 = [];
      xDomain2.length && (groupMode === "stacked" ? yDomain2 = data.reduce((a, c) => {
        let y = keys.reduce((a2, k) => a2 + (0, import_lodash35.default)(c, k, 0), 0);
        return strictNaN(y) ? a : [0, Math.max(y, (0, import_lodash35.default)(a, 1, 0))];
      }, []) : groupMode === "grouped" && (yDomain2 = data.reduce((a, c) => {
        let y = keys.reduce((a2, k) => Math.max(a2, (0, import_lodash35.default)(c, k, 0)), 0);
        return strictNaN(y) ? a : [0, Math.max(y, (0, import_lodash35.default)(a, 1, 0))];
      }, [])));
      let XScale2 = band().paddingInner(padding || paddingInner).paddingOuter(padding || paddingOuter).domain(xDomain2).range([0, adjustedWidth]);
      xScale && (xDomain2 = (0, import_lodash35.default)(xScale, "domain", xDomain2), XScale2.domain(xDomain2));
      let bandwidth = XScale2.bandwidth(), step = XScale2.step(), outer = XScale2.paddingOuter() * step, zeroYdomain = yDomain2[0] === 0 && yDomain2[1] === 0, YScale2 = linear2().domain(yDomain2).range([adjustedHeight, zeroYdomain ? adjustedHeight : 0]);
      yScale && (yDomain2 = (0, import_lodash35.default)(yScale, "domain", yDomain2), YScale2.domain(yDomain2));
      let colorFunc = getColorFunc(colors), [updating, exiting] = barData.current.reduce((a, c) => {
        let [u, e] = a;
        return u[c.id] = "updating", e[c.id] = c, c.state = "exiting", [u, e];
      }, [{}, {}]);
      barData.current = data.map((d, i) => {
        delete exiting[d[indexBy]];
        let barValues = {};
        if (groupMode === "stacked") {
          let current = adjustedHeight;
          return {
            stacks: keys.map((key, ii) => {
              let value = (0, import_lodash35.default)(d, key, 0), height2 = Math.max(0, adjustedHeight - YScale2(value)), color2 = colorFunc(value, ii, d, key);
              return current -= height2, barValues[key] = { value, color: color2 }, {
                data: d,
                key,
                width: bandwidth,
                height: height2,
                index: d[indexBy],
                y: current,
                x: 0,
                color: color2,
                value,
                barValues
              };
            }),
            barValues,
            left: outer + i * step,
            data: d,
            state: (0, import_lodash35.default)(updating, d[indexBy], "entering"),
            id: d[indexBy].toString()
          };
        } else if (groupMode === "grouped")
          return {
            stacks: keys.slice().map((key, ii) => {
              let value = (0, import_lodash35.default)(d, key, 0), y = Math.min(adjustedHeight, YScale2(value)), color2 = colorFunc(d, ii, key);
              return barValues[key] = { value, color: color2 }, {
                data: d,
                key,
                width: bandwidth / keys.length,
                height: adjustedHeight - y,
                index: d[indexBy],
                y,
                x: bandwidth / keys.length * ii,
                color: color2,
                value,
                barValues
              };
            }),
            barValues,
            left: outer + i * step,
            data: d,
            state: (0, import_lodash35.default)(updating, d[indexBy], "entering"),
            id: d[indexBy].toString()
          };
        return { stacks: [] };
      }), exitingData.current = exiting;
      let exitingAsArray = Object.values(exiting);
      exitingAsArray.length && setTimeout(exitData, 1050), barData.current = barData.current.concat(exitingAsArray), setState({
        xDomain: xDomain2,
        yDomain: yDomain2,
        XScale: XScale2,
        YScale: YScale2,
        adjustedWidth,
        adjustedHeight
      });
    },
    [
      data,
      keys,
      width,
      height,
      groupMode,
      Margin,
      colors,
      indexBy,
      exitData,
      padding,
      paddingInner,
      paddingOuter,
      ShouldComponentUpdate
    ]
  );
  let {
    onMouseMove,
    onMouseLeave,
    hoverData
  } = useHoverComp(ref), {
    xDomain,
    XScale,
    yDomain,
    YScale,
    ...restOfState
  } = state, {
    HoverComp: HoverComp3,
    position,
    ...hoverCompRest
  } = HoverCompData;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("div", { className: "w-full h-full avl-graph-container relative", ref, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("svg", { className: `w-full h-full block avl-graph ${className}`, children: [
      barData.current.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("g", { children: [
        axisBottom2 ? /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
          AxisBottom,
          {
            ...restOfState,
            margin: Margin,
            scale: XScale,
            domain: xDomain,
            ...axisBottom2
          },
          void 0,
          !1,
          {
            fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
            lineNumber: 354,
            columnNumber: 15
          },
          this
        ) : null,
        axisLeft2 ? /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
          AxisLeft,
          {
            ...restOfState,
            margin: Margin,
            scale: YScale,
            domain: yDomain,
            ...axisLeft2
          },
          void 0,
          !1,
          {
            fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
            lineNumber: 361,
            columnNumber: 15
          },
          this
        ) : null,
        axisRight2 ? /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
          AxisRight,
          {
            ...restOfState,
            margin: Margin,
            scale: YScale,
            domain: yDomain,
            ...axisRight2
          },
          void 0,
          !1,
          {
            fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
            lineNumber: 368,
            columnNumber: 15
          },
          this
        ) : null
      ] }, void 0, !0, {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 352,
        columnNumber: 11
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
        "g",
        {
          style: { transform: `translate(${Margin.left}px, ${Margin.top}px)` },
          onMouseLeave,
          children: barData.current.map(
            ({ id: id3, ...rest }) => /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
              Bar,
              {
                ...rest,
                svgHeight: state.adjustedHeight,
                onMouseMove
              },
              id3,
              !1,
              {
                fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
                lineNumber: 379,
                columnNumber: 15
              },
              this
            )
          )
        },
        void 0,
        !1,
        {
          fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
          lineNumber: 376,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
      lineNumber: 350,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
      HoverCompContainer2,
      {
        ...hoverData,
        position,
        svgWidth: width,
        svgHeight: height,
        margin: Margin,
        children: hoverData.data ? /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
          HoverComp3,
          {
            data: hoverData.data,
            keys,
            ...hoverCompRest
          },
          void 0,
          !1,
          {
            fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
            lineNumber: 393,
            columnNumber: 11
          },
          this
        ) : null
      },
      void 0,
      !1,
      {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 387,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
    lineNumber: 348,
    columnNumber: 5
  }, this);
}, Stack = import_react95.default.memo((props) => {
  let {
    state,
    width,
    svgHeight,
    height,
    y,
    x,
    color: color2,
    onMouseMove,
    Key,
    index,
    value,
    data,
    barValues
  } = props, ref = import_react95.default.useRef();
  import_react95.default.useEffect(() => {
    state === "entering" ? select_default2(ref.current).attr("width", width).attr("height", 0).attr("x", x).attr("y", svgHeight).transition().duration(1e3).attr("height", height).attr("y", y).attr("fill", color2) : state === "exiting" ? select_default2(ref.current).transition().duration(1e3).attr("height", 0).attr("y", svgHeight) : select_default2(ref.current).transition().duration(1e3).attr("height", height).attr("x", x).attr("y", y).attr("width", width).attr("fill", color2);
  }, [ref, state, width, svgHeight, height, x, y, color2]);
  let _onMouseMove = import_react95.default.useCallback((e) => {
    onMouseMove(e, { color: color2, key: Key, index, value, data, barValues });
  }, [onMouseMove, color2, Key, index, value, data, barValues]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
    "rect",
    {
      className: "avl-stack",
      ref,
      onMouseMove: _onMouseMove
    },
    void 0,
    !1,
    {
      fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
      lineNumber: 452,
      columnNumber: 5
    },
    this
  );
}), Bar = import_react95.default.memo(({ stacks, left: left2, state, ...props }) => {
  let ref = import_react95.default.useRef();
  return import_react95.default.useEffect(() => {
    state === "entering" ? select_default2(ref.current).attr("transform", `translate(${left2} 0)`) : select_default2(ref.current).transition().duration(1e3).attr("transform", `translate(${left2} 0)`);
  }, [ref, state, left2]), /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("g", { className: "avl-bar", ref, children: stacks.map(
    ({ key, ...rest }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
      Stack,
      {
        Key: key,
        state,
        ...props,
        ...rest
      },
      key,
      !1,
      {
        fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
        lineNumber: 476,
        columnNumber: 11
      },
      this
    )
  ) }, void 0, !1, {
    fileName: "app/modules/avl-graph-modified/src/BarGraph.js",
    lineNumber: 474,
    columnNumber: 5
  }, this);
});

// app/routes/__dama/index.(cat).js
var import_jsx_dev_runtime80 = require("react/jsx-dev-runtime"), getViews = (sourceId, falcorCache) => Object.values(
  (0, import_lodash36.default)(
    falcorCache,
    ["dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex"],
    {}
  )
).map(
  (v) => getAttributes(
    (0, import_lodash36.default)(
      falcorCache,
      v.value,
      { attributes: {} }
    ).attributes
  )
);
async function loader8({ request }) {
  let lengthPath = ["dama", pgEnv, "sources", "byId", [218, 198], "views", "length"], resp = await falcor2.get(lengthPath);
  await falcor2.get(
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      218,
      "views",
      "byIndex",
      { from: 0, to: (0, import_lodash36.default)(resp.json, ["dama", pgEnv, "sources", "byId", 218, "views", "length"], 0) - 1 },
      "attributes",
      Object.values(ViewAttributes)
    ],
    [
      "dama",
      pgEnv,
      "sources",
      "byId",
      198,
      "views",
      "byIndex",
      { from: 0, to: (0, import_lodash36.default)(resp.json, ["dama", pgEnv, "sources", "byId", 198, "views", "length"], 0) - 1 },
      "attributes",
      Object.values(ViewAttributes)
    ]
  );
  let falcorCache = falcor2.getCache(), hlrViews = getViews(218, falcorCache), enhancedNCEIViews = getViews(198, falcorCache), ltsHlrView = hlrViews[0].view_id, ltsEnhancedNCEIView = enhancedNCEIViews[0].view_id, sourceData = await falcor2.get(
    ["hlr", pgEnv, "source", 218, "view", ltsHlrView, "eal"],
    ["nri", "totals", "detailed", "all"],
    ["ncei_storm_events_enhanced", pgEnv, "source", 198, "view", ltsEnhancedNCEIView, "lossByYearByType"],
    ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", [ltsHlrView, ltsEnhancedNCEIView]]
  ), tmpSrcIds = [];
  Object.keys((0, import_lodash36.default)(sourceData, ["json", "dama", pgEnv, "viewDependencySubgraphs", "byViewId"], {})).forEach((viewId) => {
    tmpSrcIds.push(
      ...(0, import_lodash36.default)(sourceData, ["json", "dama", pgEnv, "viewDependencySubgraphs", "byViewId", viewId, "dependencies"], []).map((d) => d.source_id).filter((d) => d)
    );
  });
  let srcMeta = await falcor2.get(["dama", pgEnv, "sources", "byId", tmpSrcIds, "attributes", "type"]);
  return {
    dama: (0, import_lodash36.default)(sourceData, ["json", "dama", pgEnv, "viewDependencySubgraphs", "byViewId"]),
    avail: (0, import_lodash36.default)(sourceData, ["json", "hlr", pgEnv, "source", 218, "view", ltsHlrView, "eal"], []).filter((d) => !["Heavy Rain", "Freezing Fog"].includes(d.nri_category)),
    availLTSViewId: ltsHlrView,
    enhancedNCEILTSViewId: ltsEnhancedNCEIView,
    nri: (0, import_lodash36.default)(sourceData, ["json", "nri", "totals", "detailed", "all", 0], []),
    enhancedNCEILoss: (0, import_lodash36.default)(sourceData, ["json", "ncei_storm_events_enhanced", pgEnv, "source", 198, "view", ltsEnhancedNCEIView, "lossByYearByType"], []),
    srcMeta: (0, import_lodash36.default)(srcMeta, ["json", "dama", pgEnv, "sources", "byId"])
  };
}
var HoverComp2 = ({ data, keys, indexFormat, keyFormat, valueFormat }) => /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: `
      flex flex-col px-2 pt-1 rounded bg-white
      ${keys.length <= 1 ? "pb-2" : "pb-1"}`, children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "font-bold text-lg leading-6 border-b-2 mb-1 pl-2", children: indexFormat((0, import_lodash36.default)(data, "index", null)) }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 92,
    columnNumber: 13
  }, this),
  keys.slice().filter((key) => data.key === key).reverse().map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: `
            flex items-center px-2 border-2 rounded transition
            ${data.key === key ? "border-current" : "border-transparent"}
          `, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(
      "div",
      {
        className: "mr-2 rounded-sm color-square w-5 h-5",
        style: {
          backgroundColor: (0, import_lodash36.default)(data, ["barValues", key, "color"], null),
          opacity: data.key === key ? 1 : 0.2
        }
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 103,
        columnNumber: 25
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "mr-4", children: [
      keyFormat(key),
      ":"
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 108,
      columnNumber: 25
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "text-right flex-1", children: valueFormat((0, import_lodash36.default)(data, ["data", key], 0)) }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 111,
      columnNumber: 25
    }, this)
  ] }, key, !0, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 99,
    columnNumber: 21
  }, this)),
  keys.length <= 1 ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "flex pr-2", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "w-5 mr-2" }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 119,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "mr-4 pl-2", children: "Total:" }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 120,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "flex-1 text-right", children: valueFormat(keys.reduce((a, c) => a + (0, import_lodash36.default)(data, ["data", c], 0), 0)) }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 123,
      columnNumber: 21
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 118,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/index.(cat).js",
  lineNumber: 89,
  columnNumber: 9
}, this), fnumIndex = (d) => d >= 1e9 ? `${parseInt(d / 1e9)} B` : d >= 1e6 ? `${parseInt(d / 1e6)} M` : d >= 1e3 ? `${parseInt(d / 1e3)} K` : `${d}`, reformatNRI = (data = {}) => import_react96.default.useMemo(() => {
  let formattedData = [];
  return Object.keys(data).filter((key) => key !== "group_by" && key.includes("_")).forEach((key) => {
    let [nri_category, ctype] = key.split("_"), tmpExisting = formattedData.find((f) => f.nri_category === nri_category);
    tmpExisting ? tmpExisting[ctype] = data[nri_category] : formattedData.push({ nri_category, [ctype]: data[nri_category] });
  }), formattedData.sort((a, b) => a.nri_category.localeCompare(b.nri_category));
}, [data]), reformatEnhancedNCEI = (data = {}) => import_react96.default.useMemo(() => {
  let formattedData = [], nri_categories = /* @__PURE__ */ new Set();
  return data.filter((d) => d.year >= 1996).forEach((row) => {
    nri_categories.add(row.event_type_formatted);
    let tmpExisting = formattedData.find((f) => f.year === row.year);
    tmpExisting ? tmpExisting[row.event_type_formatted] = parseInt(row.total_damage) : formattedData.push({ year: row.year, [row.event_type_formatted]: parseInt(row.total_damage) });
  }), { formattedData, nri_categories: [...nri_categories] };
}, [data]), RenderViewDependencies = ({ dama, srcMeta, viewId }) => (0, import_lodash36.default)((0, import_lodash36.default)(dama, [viewId, "dependencies"], []).find((d) => d.view_id === viewId), ["view_dependencies"], []).map((id3) => {
  let tmpSrcId = (0, import_lodash36.default)((0, import_lodash36.default)(dama, [viewId, "dependencies"], []).find((d) => d.view_id === id3), "source_id");
  return /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(import_react97.Link, { to: `/source/${tmpSrcId}/views/${id3}`, className: "p-2", children: (0, import_lodash36.default)(srcMeta, [tmpSrcId, "attributes", "type"], id3) }, id3, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 185,
    columnNumber: 20
  }, this);
}), RenderLegend = () => /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "flex grid grid-cols-6", children: Object.keys(hazardsMeta).map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: "mb-1 pb-1 pl-1 flex", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(
    "div",
    {
      className: "rounded-full",
      style: {
        height: "20px",
        width: "20px",
        backgroundColor: hazardsMeta[key].color
      }
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 196,
      columnNumber: 29
    },
    this
  ),
  /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("span", { className: "pl-2", children: hazardsMeta[key].name }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 202,
    columnNumber: 29
  }, this)
] }, key, !0, {
  fileName: "app/routes/__dama/index.(cat).js",
  lineNumber: 195,
  columnNumber: 25
}, this)) }, void 0, !1, {
  fileName: "app/routes/__dama/index.(cat).js",
  lineNumber: 191,
  columnNumber: 9
}, this);
function SourceThumb2({ source }) {
  let { avail, nri, enhancedNCEILoss, dama, availLTSViewId, enhancedNCEILTSViewId, srcMeta } = (0, import_react97.useLoaderData)(), reformattedNRI = reformatNRI(nri), { formattedData: reformattedEnhancedNCEI, nri_categories } = reformatEnhancedNCEI(enhancedNCEILoss), range2 = [...new Set(reformattedEnhancedNCEI.map((d) => d.year))].sort((a, b) => a - b), [from, setFrom] = import_react96.default.useState(range2[0]), [to, setTo] = import_react96.default.useState(range2[range2.length - 1]), blockClasses = "w-full p-4 my-1 block border flex flex-col";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(import_jsx_dev_runtime80.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: blockClasses, style: { height: "600px" }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("label", { className: "text-lg", children: " NCEI Losses " }, "nceiLossesTitle", !1, {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 221,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("label", { className: "text-sm mb-2", children: [
        "using: ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(RenderViewDependencies, { dama, srcMeta, viewId: enhancedNCEILTSViewId }, void 0, !1, {
          fileName: "app/routes/__dama/index.(cat).js",
          lineNumber: 222,
          columnNumber: 81
        }, this)
      ] }, "nceiLossesDeps", !0, {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 222,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(RenderLegend, {}, void 0, !1, {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 223,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(
        BarGraph,
        {
          data: reformattedEnhancedNCEI,
          keys: nri_categories,
          indexBy: "year",
          axisBottom: (d) => d,
          axisLeft: { format: fnumIndex, gridLineOpacity: 1, gridLineColor: "#9d9c9c" },
          paddingInner: 0.05,
          colors: (value, ii, d, key) => hazardsMeta[key].color,
          hoverComp: {
            HoverComp: HoverComp2,
            valueFormat: fnumIndex,
            keyFormat: (d) => hazardsMeta[d].name
          }
        },
        "nceiLosses",
        !1,
        {
          fileName: "app/routes/__dama/index.(cat).js",
          lineNumber: 224,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 220,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: blockClasses, style: { height: "500px" }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("label", { className: "text-lg", children: "EALs (AVAIL) " }, "ealsAvailTitle", !1, {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 241,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("label", { className: "text-sm", children: [
        "using: ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(RenderViewDependencies, { dama, srcMeta, viewId: availLTSViewId }, void 0, !1, {
          fileName: "app/routes/__dama/index.(cat).js",
          lineNumber: 242,
          columnNumber: 75
        }, this)
      ] }, "ealsAvailDeps", !0, {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 242,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(
        BarGraph,
        {
          data: avail,
          keys: ["swd_buildings", "swd_crop", "swd_population"],
          indexBy: "nri_category",
          axisBottom: (d) => d,
          axisLeft: { format: fnumIndex, gridLineOpacity: 1, gridLineColor: "#9d9c9c" },
          paddingInner: 0.05,
          colors: (value, ii, d, key) => ctypeColors[key.split("_")[1]],
          hoverComp: {
            HoverComp: HoverComp2,
            valueFormat: fnumIndex
          }
        },
        "ealsAvail",
        !1,
        {
          fileName: "app/routes/__dama/index.(cat).js",
          lineNumber: 243,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 240,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { className: blockClasses, style: { height: "500px" }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("label", { className: "text-lg", children: "EALs (NRI) " }, "ealsNriTitle", !1, {
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 259,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(
        BarGraph,
        {
          data: reformattedNRI,
          keys: ["buildings", "crop", "population"],
          indexBy: "nri_category",
          axisBottom: (d) => d,
          axisLeft: { format: fnumIndex, gridLineOpacity: 1, gridLineColor: "#9d9c9c" },
          paddingInner: 0.05,
          colors: (value, ii, d, key) => ctypeColors[key],
          hoverComp: {
            HoverComp: HoverComp2,
            valueFormat: fnumIndex
          }
        },
        "ealsNri",
        !1,
        {
          fileName: "app/routes/__dama/index.(cat).js",
          lineNumber: 260,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 258,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 219,
    columnNumber: 9
  }, this);
}

// app/routes/__dms.jsx
var dms_exports = {};
__export(dms_exports, {
  default: () => Index3,
  loader: () => loader9
});
var import_react98 = require("@remix-run/react");
var import_jsx_dev_runtime81 = require("react/jsx-dev-runtime");
async function loader9({ request }) {
  return await checkAuth(request);
}
function Index3() {
  let user = (0, import_react98.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)("div", { className: "bg-gray-100 px-4 text-gray-500 min-h-screen", children: /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)(import_react98.Outlet, {}, void 0, !1, {
    fileName: "app/routes/__dms.jsx",
    lineNumber: 20,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dms.jsx",
    lineNumber: 19,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dms.jsx",
    lineNumber: 18,
    columnNumber: 5
  }, this);
}

// app/routes/__dms/blog/blog.config.js
var blog_config_exports = {};
__export(blog_config_exports, {
  default: () => blog_config_default
});

// app/modules/dms/components/table.js
var import_react100 = require("@remix-run/react"), import_react101 = require("react");

// app/modules/dms/theme/index.js
var import_react99 = __toESM(require("react"));

// app/modules/dms/theme/default-theme.js
function defaultTheme() {
  return {
    landing: {
      wrapper: "p-4 border-2 border-blue-300"
    },
    table: {
      table: "min-w-full divide-y divide-gray-300",
      thead: "",
      th: "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900",
      tbody: "divide-y divide-gray-200 ",
      td: "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
    },
    textarea: {
      viewWrapper: "overflow-hidden p-2 bg-gray-100 border-b-2"
    },
    card: {
      wrapper: "p-4 border",
      row: "flex py-1",
      rowLabel: "px-4 w-28 text-sm",
      rowContent: "flex-1"
    }
  };
}
var default_theme_default = defaultTheme();

// app/modules/dms/theme/index.js
var ThemeContext2 = import_react99.default.createContext(default_theme_default), useTheme2 = () => (0, import_react99.useContext)(ThemeContext2), theme_default2 = ThemeContext2;

// app/modules/dms/components/table.js
var import_lodash37 = __toESM(require("lodash.get")), import_jsx_dev_runtime82 = require("react/jsx-dev-runtime");
function replaceVars(url, data) {
  var regex = /:(\w+)/g;
  return url.replace(regex, function(match, p1) {
    return data[p1] || ":" + p1;
  });
}
var ColumnTypes = {
  data: function({ data, column, className, key }) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("td", { className, children: [
      " ",
      (0, import_lodash37.default)(data, [column.path], "").toString(),
      " "
    ] }, key, !0, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 15,
      columnNumber: 10
    }, this);
  },
  date: function({ data, column, className, key }) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("td", { className, children: [
      " ",
      new Date(data[column.path]).toLocaleString(),
      " "
    ] }, key, !0, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 18,
      columnNumber: 10
    }, this);
  },
  link: function({ data, column, className, key }) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("td", { className, children: /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)(import_react100.Link, { to: replaceVars(column.to, data), children: replaceVars(column.text, data) }, void 0, !1, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 23,
      columnNumber: 5
    }, this) }, key, !1, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 22,
      columnNumber: 4
    }, this);
  }
};
function TableColumn({ data, column, className }) {
  let Column = (0, import_lodash37.default)(ColumnTypes, [column.type], ColumnTypes.data);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)(Column, { data, column, className }, void 0, !1, {
    fileName: "app/modules/dms/components/table.js",
    lineNumber: 33,
    columnNumber: 9
  }, this);
}
function Table12({ dataItems = [], attributes = {}, options = {} }) {
  let theme = useTheme2(), { columns = [] } = options;
  return columns.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("div", { children: " No columns specified. " }, void 0, !1, {
    fileName: "app/modules/dms/components/table.js",
    lineNumber: 40,
    columnNumber: 10
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("div", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("table", { className: `${theme.table.table}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("thead", { className: `${theme.table.thead}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("tr", { children: columns.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("th", { className: `${theme.table.th}`, children: col.name }, i, !1, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 47,
      columnNumber: 31
    }, this)) }, void 0, !1, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 46,
      columnNumber: 6
    }, this) }, void 0, !1, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 45,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("tbody", { className: `${theme.table.tbody}`, children: dataItems.map(
      (d) => /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("tr", { children: columns.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)(
        TableColumn,
        {
          className: `${theme.table.td}`,
          data: d,
          column: col
        },
        `${col.name}-${i}`,
        !1,
        {
          fileName: "app/modules/dms/components/table.js",
          lineNumber: 56,
          columnNumber: 9
        },
        this
      )) }, d.id, !1, {
        fileName: "app/modules/dms/components/table.js",
        lineNumber: 53,
        columnNumber: 7
      }, this)
    ) }, void 0, !1, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 50,
      columnNumber: 5
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms/components/table.js",
    lineNumber: 44,
    columnNumber: 4
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms/components/table.js",
    lineNumber: 43,
    columnNumber: 3
  }, this);
}

// app/routes/__dms/blog/blog.config.js
var import_react102 = require("@remix-run/react");
var import_jsx_dev_runtime83 = require("react/jsx-dev-runtime"), BlogLayout = ({ children: children2, user }) => /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { className: "flex p-2 text-gray-800 border-b w-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)(import_react102.NavLink, { to: "/blog", className: "p-4", children: "Home" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)(import_react102.NavLink, { to: "/blog/admin", className: "p-4", children: "Admin" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 9,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { className: "flex flex-1 justify-end ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)(AuthMenu_default, { user }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 12,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 11,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 10,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 7,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { children: children2 }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 16,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dms/blog/blog.config.js",
  lineNumber: 6,
  columnNumber: 3
}, this), BlogAdmin = (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)(import_react102.Link, { to: "/blog/new", className: "p-4 border", children: " New Post " }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 23,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 22,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)(Table12, { ...props }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 25,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dms/blog/blog.config.js",
  lineNumber: 21,
  columnNumber: 3
}, this), BLOG_POST = {
  app: "avl-website2",
  type: "blog-post",
  attributes: [
    {
      key: "title",
      type: "text",
      required: !0
    },
    {
      key: "body",
      type: "richtext",
      required: !0
    },
    {
      key: "tags",
      type: "text",
      isArray: !0
    },
    {
      key: "url_slug",
      type: "text",
      required: !1
    },
    {
      key: "bloggerId",
      name: "Blogger ID",
      type: "text",
      default: "props:user.id",
      editable: !1
    },
    {
      key: "replyTo",
      name: "Reply To",
      type: "text",
      default: "props:blog-post.id",
      editable: !1
    }
  ]
}, Blog = {
  format: BLOG_POST,
  children: [
    {
      type: BlogLayout,
      action: "list",
      path: "",
      children: [
        {
          type: "dms-landing",
          action: "list",
          path: ""
        },
        {
          type: BlogAdmin,
          action: "list",
          path: "admin",
          options: {
            attributes: [
              "id",
              "title",
              "bloggerId",
              "updated_at"
            ],
            columns: [
              {
                type: "link",
                name: "Title",
                text: ":title",
                to: "/blog/post/:id",
                filter: "fuzzyText"
              },
              {
                type: "data",
                name: "Blogger",
                path: "bloggerId"
              },
              {
                type: "date",
                name: "Updated",
                path: "updated_at"
              },
              {
                type: "link",
                name: "",
                to: "/blog/edit/:id",
                text: "edit"
              }
            ],
            filter: {
              args: ["self:data.replyTo"],
              comparator: (arg1) => !Boolean(arg1),
              sortType: (d) => new Date(d).valueOf()
            }
          }
        },
        {
          type: "dms-card",
          path: "post",
          action: "view",
          params: ["id"],
          options: {
            mapDataToProps: {
              title: "item:data.title",
              body: [
                "item:data.bloggerId",
                "item:data.body",
                "item:data.tags"
              ],
              footer: [
                "item:updated_at"
              ]
            }
          }
        },
        {
          type: "dms-edit",
          action: "edit",
          path: "new",
          redirect: "/blog/admin"
        },
        {
          type: "dms-edit",
          action: "edit",
          path: "edit",
          params: ["id"]
        }
      ]
    },
    {
      type: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { children: "Test Page" }, void 0, !1, {
        fileName: "app/routes/__dms/blog/blog.config.js",
        lineNumber: 152,
        columnNumber: 24
      }, this),
      path: "test"
    }
  ]
}, blog_config_default = Blog;

// app/routes/__dms/site/site.config.js
var site_config_exports = {};
__export(site_config_exports, {
  page: () => page,
  pageSection: () => pageSection,
  siteConfig: () => siteConfig
});
var import_react103 = require("@remix-run/react");
var import_jsx_dev_runtime84 = require("react/jsx-dev-runtime"), pageSection = {
  app: "dms-remix",
  type: "page-section",
  attributes: [
    {
      key: "title",
      type: "text"
    },
    {
      key: "section",
      type: "text"
    },
    {
      key: "element",
      type: "type-select",
      attributes: [
        {
          key: "Draft Editor",
          type: "richtext"
        },
        {
          key: "Simple Text",
          type: "text"
        },
        {
          key: "Asset Table",
          type: "asset-table"
        },
        {
          key: "NFIP Table",
          type: "nfip-table"
        },
        {
          key: "Map",
          type: "map"
        }
      ]
    }
  ]
}, page = {
  app: "dms-remix",
  type: "page",
  registerFormats: [pageSection],
  attributes: [
    {
      key: "title",
      type: "text"
    },
    {
      key: "section",
      type: "text",
      required: !0,
      default: "props:section",
      hidden: !0
    },
    {
      key: "sectionLanding",
      type: "boolean",
      default: !1,
      editable: !1,
      hidden: !0
    },
    {
      key: "index",
      type: "number",
      default: "props:index",
      editable: !1,
      hidden: !0
    },
    {
      key: "title",
      type: "text"
    },
    {
      key: "url-slug",
      type: "text"
    },
    {
      key: "showSidebar",
      type: "boolean",
      default: !0,
      required: !0
    }
  ]
}, SiteLayout = ({ children: children2, user }) => /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { className: "flex p-2 text-gray-800 border-b w-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)(import_react103.NavLink, { to: "/site", className: "p-4", children: "Home" }, void 0, !1, {
      fileName: "app/routes/__dms/site/site.config.js",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { className: "flex flex-1 justify-end ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)(AuthMenu_default, { user }, void 0, !1, {
      fileName: "app/routes/__dms/site/site.config.js",
      lineNumber: 101,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dms/site/site.config.js",
      lineNumber: 100,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dms/site/site.config.js",
      lineNumber: 99,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 97,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { children: children2 }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 105,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dms/site/site.config.js",
  lineNumber: 96,
  columnNumber: 3
}, this), SiteAdmin = (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { className: "w-full p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)(import_react103.Link, { to: "/site/new", className: "p-2 bg-blue-500 shadow text-gray-100", children: " New Page " }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 112,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 111,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)(Table12, { ...props }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 114,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dms/site/site.config.js",
  lineNumber: 110,
  columnNumber: 3
}, this), siteConfig = {
  format: page,
  children: [
    {
      type: SiteLayout,
      action: "list",
      path: "",
      children: [
        {
          type: "dms-landing",
          action: "list",
          path: "list"
        },
        {
          type: "dms-edit",
          action: "edit",
          path: "",
          redirect: "/site"
        },
        {
          type: SiteAdmin,
          action: "list",
          path: "",
          options: {
            attributes: [
              "id",
              "title",
              "bloggerId",
              "updated_at"
            ],
            columns: [
              {
                type: "data",
                name: "Id",
                path: "id"
              },
              {
                type: "link",
                name: "Title",
                text: ":title",
                to: "/site/page/:id",
                filter: "fuzzyText"
              },
              {
                type: "date",
                name: "Updated",
                path: "updated_at"
              },
              {
                type: "link",
                name: "",
                to: "/site/edit/:id",
                text: "edit"
              }
            ],
            filter: {
              args: ["self:data.replyTo"],
              comparator: (arg1) => !Boolean(arg1),
              sortType: (d) => new Date(d).valueOf()
            }
          }
        },
        {
          type: "dms-edit",
          action: "edit",
          path: "edit",
          params: ["id"]
        },
        {
          type: "dms-card",
          path: "page",
          action: "view",
          params: ["id"]
        }
      ]
    },
    {
      type: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { children: "Test Page" }, void 0, !1, {
        fileName: "app/routes/__dms/site/site.config.js",
        lineNumber: 192,
        columnNumber: 24
      }, this),
      path: "test"
    }
  ]
};

// app/routes/__dms/blog/$.jsx
var __exports = {};
__export(__exports, {
  ErrorBoundary: () => ErrorBoundary2,
  action: () => action5,
  default: () => DMS,
  loader: () => loader10
});
var import_react140 = require("react"), import_react141 = require("@remix-run/react");

// app/modules/dms/wrappers/edit.js
var import_react107 = __toESM(require("react")), import_react108 = require("@remix-run/react");

// app/modules/dms/data-types/text.js
var import_react104 = require("react"), import_jsx_dev_runtime85 = require("react/jsx-dev-runtime"), Edit3 = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime85.jsxDEV)(
  "input",
  {
    value,
    onChange: (e) => onChange(e.target.value)
  },
  void 0,
  !1,
  {
    fileName: "app/modules/dms/data-types/text.js",
    lineNumber: 5,
    columnNumber: 9
  },
  this
), View = ({ value }) => value ? /* @__PURE__ */ (0, import_jsx_dev_runtime85.jsxDEV)("div", { children: value }, void 0, !1, {
  fileName: "app/modules/dms/data-types/text.js",
  lineNumber: 16,
  columnNumber: 9
}, this) : !1, text_default3 = {
  EditComp: Edit3,
  ViewComp: View
};

// app/modules/dms/data-types/textarea.js
var import_react105 = require("react");
var import_lodash38 = __toESM(require("lodash.get")), import_jsx_dev_runtime86 = require("react/jsx-dev-runtime"), Edit4 = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)(
  "textarea",
  {
    value,
    onChange: (e) => onChange(e.target.value)
  },
  void 0,
  !1,
  {
    fileName: "app/modules/dms/data-types/textarea.js",
    lineNumber: 7,
    columnNumber: 9
  },
  this
), View2 = ({ value }) => {
  let theme = useTheme2();
  return value ? /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)("pre", { className: (0, import_lodash38.default)(theme, "textarea.viewWrapper", ""), children: JSON.stringify(value, null, 3) }, void 0, !1, {
    fileName: "app/modules/dms/data-types/textarea.js",
    lineNumber: 18,
    columnNumber: 9
  }, this) : !1;
}, textarea_default2 = {
  EditComp: Edit4,
  ViewComp: View2
};

// app/modules/dms/data-types/boolean.js
var import_react106 = require("react"), import_jsx_dev_runtime87 = require("react/jsx-dev-runtime"), Edit5 = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime87.jsxDEV)(
  "select",
  {
    value,
    onChange: (e) => onChange(e.target.value),
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime87.jsxDEV)("option", { value: !0, children: "True" }, void 0, !1, {
        fileName: "app/modules/dms/data-types/boolean.js",
        lineNumber: 9,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime87.jsxDEV)("option", { value: !1, children: "False" }, void 0, !1, {
        fileName: "app/modules/dms/data-types/boolean.js",
        lineNumber: 10,
        columnNumber: 13
      }, this)
    ]
  },
  void 0,
  !0,
  {
    fileName: "app/modules/dms/data-types/boolean.js",
    lineNumber: 5,
    columnNumber: 9
  },
  this
), View3 = ({ value }) => value ? /* @__PURE__ */ (0, import_jsx_dev_runtime87.jsxDEV)("div", { children: value }, void 0, !1, {
  fileName: "app/modules/dms/data-types/boolean.js",
  lineNumber: 19,
  columnNumber: 9
}, this) : !1, boolean_default = {
  EditComp: Edit5,
  ViewComp: View3
};

// app/modules/dms/data-types/index.js
var import_lodash39 = __toESM(require("lodash.get")), DmsDataTypes = {
  text: text_default3,
  datetime: text_default3,
  textarea: textarea_default2,
  boolean: boolean_default,
  default: text_default3
};
function registerDataType(name, dataType) {
  DmsDataTypes[name] = dataType;
}
function getViewComp(type) {
  return (0, import_lodash39.default)(DmsDataTypes, `[${type}]`, DmsDataTypes.default).ViewComp;
}
function getEditComp(type) {
  return (0, import_lodash39.default)(DmsDataTypes, `[${type}]`, DmsDataTypes.default).EditComp;
}

// app/modules/dms/wrappers/_utils.js
var import_lodash40 = __toESM(require("lodash.get"));
function getAttributes5(format2, options, mode = "") {
  let attributeFilter = (0, import_lodash40.default)(options, "attributes", []), attributes = format2.attributes.filter((attr) => attributeFilter.length === 0 || attributeFilter.includes(attr.key)).filter(
    (attr) => mode !== "edit" || typeof attr.editable > "u" || !!attr.editable
  ).reduce((out, attr) => (out[attr.key] = attr, out), {}), attributeKeys = Object.keys(attributes);
  return Object.keys(attributes).filter((attributeKey) => attributeKeys.includes(attributeKey)).map((attributeKey) => {
    attributes[attributeKey].ViewComp = getViewComp(
      (0, import_lodash40.default)(attributes, `[${attributeKey}].type`, "default")
    ), attributes[attributeKey].EditComp = getEditComp(
      (0, import_lodash40.default)(attributes, `[${attributeKey}].type`, "default")
    );
  }), attributes;
}

// app/modules/dms/wrappers/edit.js
var import_lodash41 = require("lodash.get"), import_jsx_dev_runtime88 = require("react/jsx-dev-runtime");
function EditWrapper({ Component, format: format2, options, params, ...props }) {
  let attributes = getAttributes5(format2, options, "edit"), { "*": path } = (0, import_react108.useParams)(), pathParams = getParams(params, path), { data, user } = (0, import_react108.useLoaderData)(), status = (0, import_react108.useActionData)(), [item, setItem] = import_react107.default.useState(
    data.filter((d) => filterParams(d, pathParams))[0] || {}
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { className: "text-xs", children: "Edit Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/edit.js",
      lineNumber: 26,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("form", { method: "post", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)(
        Component,
        {
          ...props,
          format: format2,
          attributes,
          item,
          updateAttribute: (attr, value) => {
            setItem({ ...item, [attr]: value });
          },
          options,
          status,
          user
        },
        void 0,
        !1,
        {
          fileName: "app/modules/dms/wrappers/edit.js",
          lineNumber: 29,
          columnNumber: 5
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("input", { type: "hidden", name: "data", value: JSON.stringify(item) }, void 0, !1, {
        fileName: "app/modules/dms/wrappers/edit.js",
        lineNumber: 39,
        columnNumber: 5
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/dms/wrappers/edit.js",
      lineNumber: 28,
      columnNumber: 4
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms/wrappers/edit.js",
    lineNumber: 25,
    columnNumber: 3
  }, this);
}

// app/modules/dms/wrappers/list.js
var import_react109 = require("react"), import_react110 = require("@remix-run/react");
var import_jsx_dev_runtime89 = require("react/jsx-dev-runtime");
function ListWrapper({ Component, format: format2, options, ...props }) {
  let attributes = getAttributes5(format2, options), { data, user } = (0, import_react110.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime89.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime89.jsxDEV)("div", { className: "text-xs", children: "List Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/list.js",
      lineNumber: 28,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime89.jsxDEV)(
      Component,
      {
        ...props,
        format: format2,
        attributes,
        dataItems: data,
        options,
        user
      },
      void 0,
      !1,
      {
        fileName: "app/modules/dms/wrappers/list.js",
        lineNumber: 29,
        columnNumber: 4
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/dms/wrappers/list.js",
    lineNumber: 27,
    columnNumber: 3
  }, this);
}

// app/modules/dms/wrappers/view.js
var import_react111 = require("react"), import_react112 = require("@remix-run/react");
var import_jsx_dev_runtime90 = require("react/jsx-dev-runtime");
function ViewWrapper({ Component, format: format2, options, ...props }) {
  let attributes = getAttributes5(format2, options), { data, user } = (0, import_react112.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("div", { children: "View Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/view.js",
      lineNumber: 12,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)(
      Component,
      {
        ...props,
        format: format2,
        attributes,
        item: data[0],
        options,
        user
      },
      void 0,
      !1,
      {
        fileName: "app/modules/dms/wrappers/view.js",
        lineNumber: 13,
        columnNumber: 4
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/dms/wrappers/view.js",
    lineNumber: 11,
    columnNumber: 3
  }, this);
}

// app/modules/dms/wrappers/error.js
var import_react113 = require("react"), import_react114 = require("@remix-run/react");
var import_jsx_dev_runtime91 = require("react/jsx-dev-runtime");
function ErrorWrapper({ Component, format: format2, options, ...props }) {
  let attributes = getAttributes5(format2, options);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime91.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime91.jsxDEV)("div", { className: "text-xs", children: "Error Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/error.js",
      lineNumber: 27,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime91.jsxDEV)(
      Component,
      {
        ...props,
        format: format2,
        attributes,
        dataItems: [],
        options,
        user: {}
      },
      void 0,
      !1,
      {
        fileName: "app/modules/dms/wrappers/error.js",
        lineNumber: 28,
        columnNumber: 4
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/dms/wrappers/error.js",
    lineNumber: 26,
    columnNumber: 3
  }, this);
}

// app/modules/dms/wrappers/index.js
var wrappers_default = {
  edit: EditWrapper,
  error: ErrorWrapper,
  list: ListWrapper,
  view: ViewWrapper
};

// app/modules/dms/components/dev-info.js
var import_react115 = require("react"), import_jsx_dev_runtime92 = require("react/jsx-dev-runtime");
function DevInfo(props) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime92.jsxDEV)("div", { children: "404 - Config not found" }, void 0, !1, {
    fileName: "app/modules/dms/components/dev-info.js",
    lineNumber: 5,
    columnNumber: 3
  }, this);
}

// app/modules/dms/components/landing.js
var import_react117 = require("react");

// app/modules/dms/components/card.js
var import_react116 = require("react");
var import_lodash42 = __toESM(require("lodash.get")), import_jsx_dev_runtime93 = require("react/jsx-dev-runtime");
function Card({ item, attributes }) {
  let theme = useTheme2();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { className: (0, import_lodash42.default)(theme, "card.wrapper", ""), children: Object.keys(attributes).map((attrKey, i) => {
    let ViewComp = attributes[attrKey].ViewComp;
    return /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { className: (0, import_lodash42.default)(theme, "card.row", ""), children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { className: (0, import_lodash42.default)(theme, "card.rowLabel", ""), children: attrKey }, void 0, !1, {
        fileName: "app/modules/dms/components/card.js",
        lineNumber: 14,
        columnNumber: 8
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { className: (0, import_lodash42.default)(theme, "card.rowContent", ""), children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(ViewComp, { value: item[attrKey] }, `${attrKey}-${i}`, !1, {
        fileName: "app/modules/dms/components/card.js",
        lineNumber: 16,
        columnNumber: 9
      }, this) }, void 0, !1, {
        fileName: "app/modules/dms/components/card.js",
        lineNumber: 15,
        columnNumber: 8
      }, this)
    ] }, `${attrKey}-${i}`, !0, {
      fileName: "app/modules/dms/components/card.js",
      lineNumber: 13,
      columnNumber: 7
    }, this);
  }) }, item.id, !1, {
    fileName: "app/modules/dms/components/card.js",
    lineNumber: 8,
    columnNumber: 3
  }, this);
}

// app/modules/dms/components/landing.js
var import_jsx_dev_runtime94 = require("react/jsx-dev-runtime");
function Landing({ dataItems = [], attributes }) {
  let theme = useTheme2();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime94.jsxDEV)("div", { className: "border border-pink-300", children: [
    "Landing",
    dataItems.map(
      (d, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime94.jsxDEV)(
        Card,
        {
          item: d,
          attributes
        },
        i,
        !1,
        {
          fileName: "app/modules/dms/components/landing.js",
          lineNumber: 12,
          columnNumber: 6
        },
        this
      )
    )
  ] }, void 0, !0, {
    fileName: "app/modules/dms/components/landing.js",
    lineNumber: 8,
    columnNumber: 3
  }, this);
}

// app/modules/dms/components/edit.js
var import_react118 = require("react");
var import_lodash43 = __toESM(require("lodash.get")), import_jsx_dev_runtime95 = require("react/jsx-dev-runtime");
function Card2({ item, updateAttribute, attributes, status }) {
  let theme = useTheme2();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { className: (0, import_lodash43.default)(theme, "card.wrapper", ""), children: [
    status ? /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { children: JSON.stringify(status) }, void 0, !1, {
      fileName: "app/modules/dms/components/edit.js",
      lineNumber: 10,
      columnNumber: 14
    }, this) : "",
    Object.keys(attributes).map((attrKey, i) => {
      let EditComp = attributes[attrKey].EditComp;
      return /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { className: (0, import_lodash43.default)(theme, "card.row", ""), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { className: (0, import_lodash43.default)(theme, "card.rowLabel", ""), children: attrKey }, void 0, !1, {
          fileName: "app/modules/dms/components/edit.js",
          lineNumber: 17,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { className: (0, import_lodash43.default)(theme, "card.rowContent", ""), children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(
          EditComp,
          {
            value: item[attrKey],
            onChange: (v) => updateAttribute(attrKey, v)
          },
          `${attrKey}-${i}`,
          !1,
          {
            fileName: "app/modules/dms/components/edit.js",
            lineNumber: 19,
            columnNumber: 10
          },
          this
        ) }, void 0, !1, {
          fileName: "app/modules/dms/components/edit.js",
          lineNumber: 18,
          columnNumber: 9
        }, this)
      ] }, `${attrKey}-${i}`, !0, {
        fileName: "app/modules/dms/components/edit.js",
        lineNumber: 16,
        columnNumber: 8
      }, this);
    }),
    /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("button", { type: "submit", children: " Save " }, void 0, !1, {
      fileName: "app/modules/dms/components/edit.js",
      lineNumber: 29,
      columnNumber: 5
    }, this)
  ] }, item.id, !0, {
    fileName: "app/modules/dms/components/edit.js",
    lineNumber: 9,
    columnNumber: 3
  }, this);
}

// app/modules/dms/components/index.js
var components_default = {
  devinfo: DevInfo,
  "dms-landing": Landing,
  "dms-table": Table12,
  "dms-card": Card,
  "dms-edit": Card2
};

// app/modules/dms/dms-manager/utils.js
var import_jsx_dev_runtime96 = require("react/jsx-dev-runtime"), DefaultComponent = components_default.devinfo, DefaultWrapper = wrappers_default.error;
function filterParams(data, params) {
  let filter2 = !1;
  return Object.keys(params).forEach((k) => {
    data[k] == params[k] ? filter2 = !0 : filter2 = !1;
  }), filter2;
}
function configMatcher(config, path, depth) {
  let params = [.../* @__PURE__ */ new Set(["", ...path.split("/")])];
  return [...config.filter((d) => d.path === params[depth] || typeof params[depth] > "u" && d.path === "" || depth === 0 && d.path === params[depth + 1]).sort((a, b) => b.path.length - a.path.length).filter((d, i, arr) => arr.length === 1 || depth > 0 || i == 0 && d.path !== "")];
}
function getActiveConfig(config = [], path = "/", depth = 0) {
  let configs = [...configMatcher(config, path, depth)];
  return configs.forEach((out) => {
    out.children = getActiveConfig(out.children, path, depth + 1);
  }), configs || [];
}
function getActiveView(config, path, format2, depth = 0) {
  return configMatcher(config, path, depth).map((activeConfig) => {
    let comp = typeof activeConfig.type == "function" ? activeConfig.type : components_default[activeConfig.type] || DefaultComponent, Wrapper = wrappers_default[activeConfig.action] || DefaultWrapper, children2 = [];
    return activeConfig.children && (children2 = getActiveView(activeConfig.children, path, format2, depth + 1)), /* @__PURE__ */ (0, import_jsx_dev_runtime96.jsxDEV)(
      Wrapper,
      {
        Component: comp,
        format: format2,
        ...activeConfig,
        children: children2
      },
      global.i++,
      !1,
      {
        fileName: "app/modules/dms/dms-manager/utils.js",
        lineNumber: 77,
        columnNumber: 10
      },
      this
    );
  });
}
function validFormat(format2) {
  return format2 && format2.attributes && format2.attributes.length > 0;
}
function enhanceFormat(format2) {
  let out = { ...format2 };
  return out.attributes.filter((d) => d.key === "updated_at").length === 0 && (out.attributes.push({ key: "updated_at", type: "datetime", editable: !1 }), out.attributes.push({ key: "created_at", type: "datetime", editable: !1 })), out;
}
function getParams(params, path = "") {
  if (!params || params.length === 0)
    return {};
  let paths = path.split("/");
  return params.reduce((out, curr, i) => (out[curr] = paths[i + 1], out), {});
}

// app/modules/dms/api/index.js
var import_node5 = require("@remix-run/node"), import_lodash44 = __toESM(require("lodash.get"));
async function dmsDataLoader(config, path = "/") {
  let { app, type } = config.format, activeConfig = getActiveConfig(config.children, path)[0] || {}, attributeFilter = (0, import_lodash44.default)(activeConfig, "options.attributes", []), params = getParams(activeConfig.params, path);
  console.log("dmsDataLoader", activeConfig, params, path);
  let lengthReq = ["dms", "data", `${app}+${type}`, "length"], length = (0, import_lodash44.default)(await falcor2.get(lengthReq), ["json", ...lengthReq], 0), itemReq = ["dms", "data", `${app}+${type}`, "byIndex"];
  return length ? Object.values((0, import_lodash44.default)(
    await falcor2.get([
      ...itemReq,
      { from: 0, to: length - 1 },
      ["id", "data", "updated_at", "created_at"]
    ]),
    ["json", ...itemReq],
    {}
  )).filter((d) => d.id).map((d) => (d.data.id = d.id, d.data.updated_at = d.updated_at, d.data.created_at = d.created_at, attributeFilter.length ? attributeFilter.reduce((out, attr) => (out[attr] = d.data[attr], out), {}) : d.data)) : [];
}
async function dmsDataEditor(config, data, path = "/") {
  let { app, type } = config.format, { id: id3 } = data, attributeKeys = Object.keys(data).filter((k) => !["id", "updated_at", "created_at"].includes(k)), activeConfig = getActiveConfig(config.children, path), updateData = attributeKeys.reduce((out, key) => (out[key] = data[key], out), {});
  if (console.log("dmsDataEditor", id3, attributeKeys, updateData), id3 && attributeKeys.length > 0) {
    let update = await falcor2.call(["dms", "data", "edit"], [id3, data]);
    return { message: "Update successful." };
  } else if (attributeKeys.length > 0) {
    let newData = await falcor2.call(
      ["dms", "data", "create"],
      [app, type, data]
    );
    return console.log("newData", newData), (0, import_node5.redirect)(activeConfig.redirect || "/");
  }
  return { message: "Not sure how I got here." };
}

// app/modules/dms/dms-manager/index.js
var import_react120 = __toESM(require("react"));

// app/modules/dms/dms-manager/messages.js
var import_react119 = require("react"), import_jsx_dev_runtime97 = require("react/jsx-dev-runtime");
function InvalidConfig({ config }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime97.jsxDEV)("div", { children: [
    " Invalid DMS Config :",
    /* @__PURE__ */ (0, import_jsx_dev_runtime97.jsxDEV)("pre", { style: { background: "#dedede" }, children: JSON.stringify(config, null, 3) }, void 0, !1, {
      fileName: "app/modules/dms/dms-manager/messages.js",
      lineNumber: 6,
      columnNumber: 4
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms/dms-manager/messages.js",
    lineNumber: 5,
    columnNumber: 3
  }, this);
}
function NoRouteMatch({ path }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime97.jsxDEV)("div", { children: [
    " These aren't the droids you are looking for",
    /* @__PURE__ */ (0, import_jsx_dev_runtime97.jsxDEV)("div", { className: "text-5xl", children: "404" }, void 0, !1, {
      fileName: "app/modules/dms/dms-manager/messages.js",
      lineNumber: 16,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime97.jsxDEV)("div", { children: [
      "/",
      path
    ] }, void 0, !0, {
      fileName: "app/modules/dms/dms-manager/messages.js",
      lineNumber: 19,
      columnNumber: 4
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms/dms-manager/messages.js",
    lineNumber: 15,
    columnNumber: 3
  }, this);
}

// app/modules/dms/dms-manager/index.js
var import_jsx_dev_runtime98 = require("react/jsx-dev-runtime"), DmsManager = ({
  config,
  path = "",
  theme = default_theme_default
}) => {
  if (!config.children || !validFormat(config.format))
    return /* @__PURE__ */ (0, import_jsx_dev_runtime98.jsxDEV)(InvalidConfig, { config }, void 0, !1, {
      fileName: "app/modules/dms/dms-manager/index.js",
      lineNumber: 15,
      columnNumber: 10
    }, this);
  let enhancedFormat = import_react120.default.useMemo(
    () => enhanceFormat(config.format),
    [config.format]
  ), RenderView = getActiveView(config.children, path, enhancedFormat);
  return RenderView ? /* @__PURE__ */ (0, import_jsx_dev_runtime98.jsxDEV)(theme_default2.Provider, { value: theme, children: RenderView }, void 0, !1, {
    fileName: "app/modules/dms/dms-manager/index.js",
    lineNumber: 36,
    columnNumber: 3
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime98.jsxDEV)(NoRouteMatch, { path }, void 0, !1, {
    fileName: "app/modules/dms/dms-manager/index.js",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}, dms_manager_default = DmsManager;

// app/modules/dms-custom/draft/index.js
var import_react139 = require("react"), import_lodash47 = require("lodash.get");

// app/modules/dms-custom/draft/editor/index.js
var import_react137 = __toESM(require("react"));

// app/modules/dms-custom/draft/editor/utils/img-loader.js
var import_react121 = __toESM(require("react")), import_jsx_dev_runtime99 = require("react/jsx-dev-runtime"), img_loader_default = (Component, options = {}) => {
  class ImgLoaderWrapper extends import_react121.default.Component {
    state = {
      loading: !1,
      message: ""
    };
    uploadImage(file) {
      if (!file)
        return Promise.resolve(null);
      if (!/^image[/]/.test(file.type))
        return this.setState({ message: "File was not an image." }), Promise.resolve(null);
      let filename = file.name.replace(/\s+/g, "_");
      this.setState({ message: "", loading: !0 });
      let reader = new FileReader();
      return reader.readAsArrayBuffer(file), new Promise((resolve) => {
        reader.addEventListener("load", () => {
          fetch(`${this.props.imgUploadUrl}/upload/${filename}`, {
            method: "POST",
            body: reader.result,
            headers: {
              "Content-Type": "application/octet-stream",
              Authorization: window.localStorage.getItem("userToken")
            }
          }).then((res) => (res.ok || resolve({ url: null }), res.json())).then(resolve);
        });
      }).then(({ url }) => (this.setState({ loading: !1 }), { url, filename }));
    }
    editImage(src, filename, action7, args) {
      return this.setState({ loading: !0 }), new Promise((resolve) => {
        fetch(`${this.props.imgUploadUrl}/edit/${filename}/${action7}/${args}`, {
          method: "POST",
          body: JSON.stringify({ src: encodeURI(src) }),
          headers: {
            "Content-Type": "application/json",
            Authorization: window.localStorage.getItem("userToken")
          }
        }).then((res) => (res.ok || resolve({ url: null }), res.json())).then(resolve);
      }).then(({ url }) => (this.setState({ loading: !1 }), url));
    }
    saveImage(src, filename, history) {
      return this.setState({ loading: !0 }), new Promise((resolve) => {
        fetch(`${this.props.imgUploadUrl}/save/${filename}`, {
          method: "POST",
          body: JSON.stringify({
            src,
            history
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: window.localStorage.getItem("userToken")
          }
        }).then((res) => (res.ok || resolve({ url: null }), res.json())).then(resolve);
      }).then(({ url }) => (this.setState({ loading: !1 }), url));
    }
    render() {
      let { forwardRef, ...props } = this.props;
      return /* @__PURE__ */ (0, import_jsx_dev_runtime99.jsxDEV)(
        Component,
        {
          ...props,
          ...this.state,
          ref: forwardRef,
          uploadImage: (...args) => this.uploadImage(...args),
          editImage: (...args) => this.editImage(...args),
          saveImage: (...args) => this.saveImage(...args)
        },
        void 0,
        !1,
        {
          fileName: "app/modules/dms-custom/draft/editor/utils/img-loader.js",
          lineNumber: 106,
          columnNumber: 9
        },
        this
      );
    }
  }
  return import_react121.default.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime99.jsxDEV)(ImgLoaderWrapper, { ...props, forwardRef: ref }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/img-loader.js",
    lineNumber: 113,
    columnNumber: 43
  }, this));
};

// app/modules/dms-custom/draft/editor/utils/show-loading.js
var import_react122 = __toESM(require("react")), import_jsx_dev_runtime100 = require("react/jsx-dev-runtime"), Loader = ({ color: color2 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("svg", { width: "100", height: "100", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("path", { fill: color2, d: `M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
    c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(
    "animateTransform",
    {
      attributeName: "transform",
      attributeType: "XML",
      type: "rotate",
      dur: "2s",
      from: "0 50 50",
      to: "360 50 50",
      repeatCount: "indefinite"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 7,
      columnNumber: 9
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 5,
    columnNumber: 4
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("path", { fill: color2, d: `M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
    c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(
    "animateTransform",
    {
      attributeName: "transform",
      attributeType: "XML",
      type: "rotate",
      dur: "1s",
      from: "0 50 50",
      to: "-360 50 50",
      repeatCount: "indefinite"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 18,
      columnNumber: 9
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 16,
    columnNumber: 4
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("path", { fill: color2, d: `M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
    L82,35.7z`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(
    "animateTransform",
    {
      attributeName: "transform",
      attributeType: "XML",
      type: "rotate",
      dur: "2s",
      from: "0 50 50",
      to: "360 50 50",
      repeatCount: "indefinite"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 29,
      columnNumber: 9
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 27,
    columnNumber: 4
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
  lineNumber: 4,
  columnNumber: 3
}, this), ScalableLoading2 = ({ scale = 1, color: color2 = "#005bcc" }) => {
  let size = 100 * scale;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("div", { style: {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("div", { style: {
    display: "flex",
    transform: `scale(${scale}, ${scale})`,
    width: "100px",
    height: "100px"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(Loader, { color: color2 }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 55,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 50,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 45,
    columnNumber: 5
  }, this);
}, show_loading_default = (Component, options = {}) => {
  let { position = "fixed" } = options;
  return import_react122.default.forwardRef(({ children: children2, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(import_jsx_dev_runtime100.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(Component, { ...props, ref, children: [
      children2,
      !props.loading || position !== "absolute" ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(LoadingComponent, { ...options }, void 0, !1, {
        fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
        lineNumber: 68,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 65,
      columnNumber: 7
    }, this),
    !props.loading || position !== "fixed" ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(LoadingComponent, { ...options }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 72,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 64,
    columnNumber: 5
  }, this));
}, LoadingComponent = import_react122.default.memo(
  ({ color: color2, position = "fixed", className = "", scale = 1 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("div", { className: `
    ${position} left-0 top-0 right-0 bottom-0
    flex justify-center items-center z-50 bg-black opacity-50
    ${className}
  `, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)(ScalableLoading2, { scale, color: color2 }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 84,
    columnNumber: 5
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 79,
    columnNumber: 3
  }, this)
);

// app/modules/dms-custom/draft/editor/index.js
var import_draft_js9 = require("draft-js"), import_editor = __toESM(require("@draft-js-plugins/editor"));

// app/modules/dms-custom/draft/editor/buttons/index.js
var import_immutable = __toESM(require("immutable"));

// app/modules/dms-custom/draft/editor/buttons/makeBlockDataButton.js
var import_react125 = require("react"), import_draft_js = require("draft-js");

// app/modules/dms-custom/draft/editor/buttons/button.js
var import_react123 = require("react"), import_jsx_dev_runtime101 = require("react/jsx-dev-runtime"), EditorButton = ({ active, disabled, children: children2, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime101.jsxDEV)(
  "button",
  {
    ...props,
    disabled,
    tabIndex: -1,
    onMouseDown: (e) => e.preventDefault(),
    className: "px-1 first:rounded-l last:rounded-r focus:border-none focus:outline-none",
    children: children2
  },
  void 0,
  !1,
  {
    fileName: "app/modules/dms-custom/draft/editor/buttons/button.js",
    lineNumber: 6,
    columnNumber: 5
  },
  this
), button_default = EditorButton;

// app/modules/dms-custom/draft/editor/buttons/icons.js
var import_react124 = require("react"), import_jsx_dev_runtime102 = require("react/jsx-dev-runtime"), Text = ({ children: children2 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("div", { className: "px-1 font-serif font-semibold", style: { fontSize: "1.25em" }, children: children2 }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
  lineNumber: 4,
  columnNumber: 3
}, this), Icon2 = ({ children: children2 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("div", { className: "flex item-center justify-center px-1", children: children2 }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
  lineNumber: 9,
  columnNumber: 3
}, this), Icons = {
  blockquote: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-quote-right" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 23,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 23,
    columnNumber: 5
  }, this),
  "code-block": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-code" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 34,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 34,
    columnNumber: 5
  }, this),
  "header-one": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: "H1" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 36,
    columnNumber: 17
  }, this),
  "header-two": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: "H2" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 37,
    columnNumber: 17
  }, this),
  "header-three": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: "H3" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 38,
    columnNumber: 19
  }, this),
  "ordered-list-item": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-list-ol", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 48,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 48,
    columnNumber: 5
  }, this),
  "unordered-list-item": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-list-ul", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 59,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 59,
    columnNumber: 5
  }, this),
  BOLD: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: "B" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 66,
    columnNumber: 5
  }, this),
  CODE: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-code" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 77,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 77,
    columnNumber: 5
  }, this),
  ITALIC: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("i", { children: "I" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 91,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 91,
    columnNumber: 5
  }, this),
  STRIKETHROUGH: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("strike", { children: "\xA0S\xA0" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 94,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 94,
    columnNumber: 5
  }, this),
  SUBSCRIPT: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: [
    "x",
    /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("sub", { children: "2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
      lineNumber: 98,
      columnNumber: 8
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 97,
    columnNumber: 5
  }, this),
  SUPERSCRIPT: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: [
    "x",
    /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("sup", { children: "2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
      lineNumber: 103,
      columnNumber: 8
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 102,
    columnNumber: 5
  }, this),
  UNDERLINE: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Text, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("u", { children: "U" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 107,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 107,
    columnNumber: 5
  }, this),
  "text-left": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-align-left", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 118,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 118,
    columnNumber: 5
  }, this),
  "text-center": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-align-center", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 129,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 129,
    columnNumber: 5
  }, this),
  "text-right": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-align-right", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 140,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 140,
    columnNumber: 5
  }, this),
  "text-justify": /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-align-justify", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 143,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 143,
    columnNumber: 5
  }, this),
  indent: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-indent", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 147,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 147,
    columnNumber: 5
  }, this),
  outdent: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("span", { className: "fas fa-outdent", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 150,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 150,
    columnNumber: 5
  }, this)
}, icons_default = Icons;

// app/modules/dms-custom/draft/editor/buttons/makeBlockDataButton.js
var import_jsx_dev_runtime103 = require("react/jsx-dev-runtime"), makeBlockDataButton = (dataType, buttonType, store) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), getStartData = (contentState) => contentState.getBlockForKey(editorState.getSelection().getStartKey()).getData(), isActive = () => getStartData(editorState.getCurrentContent()).get(dataType) === buttonType, click = (e) => {
    e.preventDefault();
    let contentState = editorState.getCurrentContent(), selectionState = editorState.getSelection(), blockData = getStartData(contentState), newContentState = import_draft_js.Modifier.setBlockData(
      contentState,
      selectionState,
      isActive() ? blockData.delete(dataType) : blockData.set(dataType, buttonType)
    );
    setEditorState(
      import_draft_js.EditorState.set(
        editorState,
        { currentContent: newContentState }
      )
    );
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime103.jsxDEV)(button_default, { active: isActive(), onClick: click, children: icons_default[buttonType] }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/makeBlockDataButton.js",
    lineNumber: 47,
    columnNumber: 7
  }, this);
}, makeBlockDataButton_default = makeBlockDataButton;

// app/modules/dms-custom/draft/editor/buttons/makeDataRangeButton.js
var import_react126 = __toESM(require("react")), import_draft_js2 = require("draft-js");
var import_jsx_dev_runtime104 = require("react/jsx-dev-runtime"), makeDataRangeButton = (dataType, buttonType, store, shift, max, min = 0) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), getStartData = import_react126.default.useCallback(
    (contentState) => contentState.getBlockForKey(editorState.getSelection().getStartKey()).getData(),
    [editorState]
  ), isDisabled = import_react126.default.useCallback(() => {
    let data = getStartData(editorState.getCurrentContent()), value = data.get(dataType) || 0;
    return value + shift < min || value + shift > max;
  }, [getStartData, editorState]), click = import_react126.default.useCallback((e) => {
    e.preventDefault();
    let contentState = editorState.getCurrentContent(), selectionState = editorState.getSelection(), blockData = getStartData(contentState), value = blockData.get(dataType) || min;
    value = Math.max(min, Math.min(max, value + shift));
    let newContentState = import_draft_js2.Modifier.setBlockData(
      contentState,
      selectionState,
      value > min ? blockData.set(dataType, value) : blockData.delete(dataType)
    );
    setEditorState(
      import_draft_js2.EditorState.set(
        editorState,
        { currentContent: newContentState }
      )
    );
  }, [getStartData, editorState, setEditorState]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(button_default, { disabled: isDisabled(), onClick: click, children: icons_default[buttonType] }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/makeDataRangeButton.js",
    lineNumber: 52,
    columnNumber: 7
  }, this);
}, makeDataRangeButton_default = makeDataRangeButton;

// app/modules/dms-custom/draft/editor/buttons/makeBlockStyleButton.js
var import_react127 = require("react"), import_draft_js3 = require("draft-js");
var import_jsx_dev_runtime105 = require("react/jsx-dev-runtime"), makeBlockStyleButton = (buttonType, store) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), click = (e) => {
    e.preventDefault(), setEditorState(
      import_draft_js3.RichUtils.toggleBlockType(editorState, buttonType)
    );
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime105.jsxDEV)(
    button_default,
    {
      active: (() => editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType() === buttonType)(),
      onClick: click,
      children: icons_default[buttonType]
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/buttons/makeBlockStyleButton.js",
      lineNumber: 28,
      columnNumber: 7
    },
    this
  );
}, makeBlockStyleButton_default = makeBlockStyleButton;

// app/modules/dms-custom/draft/editor/buttons/makeInlineStyleButton.js
var import_react128 = require("react"), import_draft_js4 = require("draft-js");
var import_jsx_dev_runtime106 = require("react/jsx-dev-runtime"), makeInlineStyleButton = (buttonType, store) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), click = (e) => {
    e.preventDefault(), setEditorState(
      import_draft_js4.RichUtils.toggleInlineStyle(editorState, buttonType)
    );
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime106.jsxDEV)(button_default, { active: (() => editorState.getCurrentInlineStyle().has(buttonType))(), onClick: click, children: icons_default[buttonType] }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/makeInlineStyleButton.js",
    lineNumber: 27,
    columnNumber: 7
  }, this);
}, makeInlineStyleButton_default = makeInlineStyleButton;

// app/modules/dms-custom/draft/editor/buttons/index.js
var ButtonsPlugin = () => {
  let store = {
    blockMap: import_immutable.default.OrderedMap()
  }, getBlockMap = (editorState) => {
    let selection2 = editorState.getSelection(), startKey = selection2.getStartKey(), endKey = selection2.getEndKey(), found = !1;
    return editorState.getCurrentContent().getBlockMap().reduce((a, block) => {
      let key = block.getKey();
      return key === startKey && (found = !0), found && (a = a.set(key, block)), key === endKey && (found = !1), a;
    }, import_immutable.default.OrderedMap());
  };
  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState, store.setEditorState = setEditorState, store.blockMap = getBlockMap(getEditorState());
    },
    onChange: (editorState) => (store.blockMap = getBlockMap(editorState), editorState),
    BlockQuoteButton: makeBlockStyleButton_default("blockquote", store),
    CodeBlockButton: makeBlockStyleButton_default("code-block", store),
    HeaderOneButton: makeBlockStyleButton_default("header-one", store),
    HeaderTwoButton: makeBlockStyleButton_default("header-two", store),
    HeaderThreeButton: makeBlockStyleButton_default("header-three", store),
    OrderedListButton: makeBlockStyleButton_default("ordered-list-item", store),
    UnorderedListButton: makeBlockStyleButton_default("unordered-list-item", store),
    BoldButton: makeInlineStyleButton_default("BOLD", store),
    CodeButton: makeInlineStyleButton_default("CODE", store),
    ItalicButton: makeInlineStyleButton_default("ITALIC", store),
    StrikeThroughButton: makeInlineStyleButton_default("STRIKETHROUGH", store),
    SubScriptButton: makeInlineStyleButton_default("SUBSCRIPT", store),
    SuperScriptButton: makeInlineStyleButton_default("SUPERSCRIPT", store),
    UnderlineButton: makeInlineStyleButton_default("UNDERLINE", store),
    LeftAlignButton: makeBlockDataButton_default("textAlign", "text-left", store),
    CenterAlignButton: makeBlockDataButton_default("textAlign", "text-center", store),
    RightAlignButton: makeBlockDataButton_default("textAlign", "text-right", store),
    JustifyAlignButton: makeBlockDataButton_default("textAlign", "text-justify", store),
    TextIndentButton: makeDataRangeButton_default("textIndent", "indent", store, 1, 4),
    TextOutdentButton: makeDataRangeButton_default("textIndent", "outdent", store, -1, 4)
  };
}, buttons_default = ButtonsPlugin;

// app/modules/dms-custom/draft/editor/toolbar/index.js
var import_react129 = require("react"), import_jsx_dev_runtime107 = require("react/jsx-dev-runtime"), Separator = ({ ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)("div", { className: "border-r border-l mx-2 border-current", style: { borderColor: "currentColor" } }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/toolbar/index.js",
  lineNumber: 5,
  columnNumber: 3
}, this), ToolbarPlugin = (options = {}) => {
  let {
    position = "top",
    direction = "row"
  } = options, store = {};
  return {
    initialize: ({ getEditorState, setEditorState, getProps }) => {
      store.getEditorState = getEditorState, store.setEditorState = setEditorState;
    },
    Toolbar: ({ children: children2 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)("div", { className: `absolute ${position}-0 left-0 w-full p-2 z-10 h-14`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)("div", { className: `flex flex-${direction} shadow-md h-10 p-1 rounded w-full`, children: children2 }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/toolbar/index.js",
      lineNumber: 18,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/toolbar/index.js",
      lineNumber: 17,
      columnNumber: 7
    }, this),
    Separator
  };
}, toolbar_default = ToolbarPlugin;

// app/modules/dms-custom/draft/editor/image/index.js
var import_react130 = __toESM(require("react")), import_draft_js5 = require("draft-js"), import_jsx_dev_runtime108 = require("react/jsx-dev-runtime"), ImagePlugin = (options = {}) => {
  let {
    wrappers = []
  } = options, ImageBlock = import_react130.default.forwardRef(
    ({ blockProps, compProps }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime108.jsxDEV)("img", { src: blockProps.src, ...compProps, ref, alt: "" }, blockProps.key, !1, {
      fileName: "app/modules/dms-custom/draft/editor/image/index.js",
      lineNumber: 11,
      columnNumber: 5
    }, this)
  ), WrappedBlock = wrappers.reduce((a, c) => c(a), ImageBlock);
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        let contentState = getEditorState().getCurrentContent(), entityKey = block.getEntityAt(0);
        if (!entityKey)
          return null;
        let entity = contentState.getEntity(entityKey);
        if (entity.getType() === "IMAGE")
          return {
            component: WrappedBlock,
            editable: !1,
            props: {
              src: entity.getData().src,
              key: entityKey
            }
          };
      }
      return null;
    },
    addImage: (src, editorState) => {
      let contentState = editorState.getCurrentContent().createEntity(
        "IMAGE",
        "IMMUTABLE",
        { src }
      ), entityKey = contentState.getLastCreatedEntityKey(), newEditorState = import_draft_js5.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, "IMAGE-BLOCK"), newContentState = newEditorState.getCurrentContent(), beforeKey = newContentState.getSelectionBefore().getStartKey();
      if (newContentState.getBlockForKey(beforeKey).getLength() > 0)
        return newEditorState;
      let firstBlock = newContentState.getFirstBlock(), lastBlock = newContentState.getLastBlock(), selectAll = new import_draft_js5.SelectionState({ anchorKey: firstBlock.getKey(), focusKey: lastBlock.getKey() }), currentContent = import_draft_js5.Modifier.replaceWithFragment(
        newContentState,
        selectAll,
        newContentState.getBlockMap().filter((b) => b.getKey() !== beforeKey)
      ), anchorKey = currentContent.getLastBlock().getKey();
      return import_draft_js5.EditorState.forceSelection(
        import_draft_js5.EditorState.set(
          newEditorState,
          { currentContent }
        ),
        new import_draft_js5.SelectionState({ anchorKey, focusKey: anchorKey })
      );
    }
  };
}, image_default = ImagePlugin;

// app/modules/dms-custom/draft/editor/linkify-it/index.js
var import_react131 = require("react"), import_linkify_it = __toESM(require("linkify-it")), import_tlds = __toESM(require("tlds")), import_jsx_dev_runtime109 = require("react/jsx-dev-runtime"), linkify = (0, import_linkify_it.default)().tlds(import_tlds.default).add("ftp", null).set({ fuzzyIP: !0 }), Link17 = ({ store, options, decoratedText, children: children2, ...props }) => {
  let links2 = linkify.match(decoratedText), href = links2 && links2.pop().url, {
    target = "_blank"
  } = options;
  return store.getReadOnly() ? /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)(
    "a",
    {
      className: "text-blue-500 underline cursor-pointer",
      href,
      target,
      children: children2
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
      lineNumber: 20,
      columnNumber: 5
    },
    this
  ) : /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)("div", { className: "inline-block relative hoverable", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)("div", { className: "text-blue-500 underline cursor-pointer", children: children2 }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)(
      "div",
      {
        className: "read-only-link-tooltip show-on-hover show-on-bottom pb-1 px-2 bg-gray-200 absolute z-50 rounded",
        onClick: (e) => e.stopPropagation(),
        contentEditable: !1,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)(
          "a",
          {
            className: "text-blue-500 underline cursor-pointer",
            href,
            target,
            children: href
          },
          void 0,
          !1,
          {
            fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
            lineNumber: 31,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      !1,
      {
        fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
        lineNumber: 29,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
    lineNumber: 25,
    columnNumber: 5
  }, this);
}, strategy = (contentBlock, callback) => {
  let text = contentBlock.getText(), links2 = linkify.match(text);
  links2 && links2.forEach(({ index, lastIndex }) => callback(index, lastIndex));
}, linkifyitPlugin = (options = {}) => {
  let store = {};
  return {
    initialize: ({ getReadOnly }) => {
      store.getReadOnly = getReadOnly;
    },
    decorators: [
      {
        strategy,
        component: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)(Link17, { ...props, store, options }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
          lineNumber: 53,
          columnNumber: 29
        }, this)
      }
    ]
  };
}, linkify_it_default = linkifyitPlugin;

// app/modules/dms-custom/draft/editor/super-sub-script/index.js
var import_react132 = require("react"), import_jsx_dev_runtime110 = require("react/jsx-dev-runtime"), makeStrategy = (script) => (contentBlock, callback, contentState) => {
  let characterList = contentBlock.getCharacterList(), start2 = null;
  characterList.forEach((c, i) => {
    let hasStyle = c.hasStyle(script);
    hasStyle && start2 === null ? start2 = i : hasStyle || (start2 !== null && callback(start2, i), start2 = null);
  }), start2 !== null && callback(start2, characterList.size);
}, SuperSubScriptPlugin = () => ({
  decorators: [
    {
      strategy: makeStrategy("SUPERSCRIPT"),
      component: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("sup", { children: props.children }, void 0, !1, {
        fileName: "app/modules/dms-custom/draft/editor/super-sub-script/index.js",
        lineNumber: 27,
        columnNumber: 27
      }, this)
    },
    {
      strategy: makeStrategy("SUBSCRIPT"),
      component: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("sub", { children: props.children }, void 0, !1, {
        fileName: "app/modules/dms-custom/draft/editor/super-sub-script/index.js",
        lineNumber: 30,
        columnNumber: 27
      }, this)
    }
  ]
}), super_sub_script_default = SuperSubScriptPlugin;

// app/modules/dms-custom/draft/editor/positionable/index.js
var import_draft_js6 = require("draft-js");

// app/modules/dms-custom/draft/editor/positionable/wrapper.js
var import_react134 = __toESM(require("react")), import_lodash45 = __toESM(require("lodash.throttle"));

// app/modules/dms-custom/draft/editor/utils/index.js
var import_react133 = __toESM(require("react")), combineCompProps = (...props) => props.reduce((a, c) => {
  for (let key in c)
    if (!(key in a))
      a[key] = c[key];
    else
      switch (key) {
        case "className":
          a[key] = `${a[key]} ${c[key]}`;
          break;
        case "style":
          a[key] = { ...a[key], ...c[key] };
          break;
        case "onMouseOut":
        case "onMouseDown":
        case "onMouseMove": {
          let prev = a[key];
          a[key] = (e) => {
            prev(e), c[key](e);
          };
          break;
        }
        default:
          break;
      }
  return a;
}, {}), useSetRefs2 = (...refs) => import_react133.default.useCallback((node) => {
  [...refs].forEach((ref) => {
    !ref || (typeof ref == "function" ? ref(node) : ref.current = node);
  });
}, [refs]);

// app/modules/dms-custom/draft/editor/positionable/wrapper.js
var import_jsx_dev_runtime111 = require("react/jsx-dev-runtime"), POSITIONS = ["block", "inline-block float-left mr-2", "block mx-auto", "inline-block float-right ml-2"], BUTTONS = [
  /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M3,7 L3,17 L17,17 L17,7 L3,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 13,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 14,
          columnNumber: 5
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
      lineNumber: 10,
      columnNumber: 3
    },
    this
  ),
  /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M21,15 L15,15 L15,17 L21,17 L21,15 Z M21,7 L15,7 L15,9 L21,9 L21,7 Z M15,13 L21,13 L21,11 L15,11 L15,13 Z M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M3,7 L3,17 L13,17 L13,7 L3,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 19,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 20,
          columnNumber: 5
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
      lineNumber: 16,
      columnNumber: 3
    },
    this
  ),
  /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M5,7 L5,17 L19,17 L19,7 L5,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 25,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 26,
          columnNumber: 5
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
      lineNumber: 22,
      columnNumber: 3
    },
    this
  ),
  /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M9,15 L3,15 L3,17 L9,17 L9,15 Z M9,7 L3,7 L3,9 L9,9 L9,7 Z M3,13 L9,13 L9,11 L3,11 L3,13 Z M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M11,7 L11,17 L21,17 L21,7 L11,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 31,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 32,
          columnNumber: 5
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
      lineNumber: 28,
      columnNumber: 3
    },
    this
  )
], positionableWrapper = (store) => (Component) => import_react134.default.forwardRef(({ compProps = {}, ...props }, ref) => {
  let {
    block,
    contentState,
    blockProps = {}
  } = props, {
    adjustPosition,
    position
  } = blockProps, handleClick = (e, p) => {
    e.preventDefault(), p !== position && (adjustPosition(block, contentState, p), setDisplay("none"));
  }, figRef = import_react134.default.useRef(), compRef = import_react134.default.useRef(), [display, setDisplay] = import_react134.default.useState("none"), [pos, setPos] = import_react134.default.useState([0, 0]), _onMouseMove = import_react134.default.useCallback((e) => {
    if (setDisplay("flex"), compRef.current) {
      let figRect = figRef.current.getBoundingClientRect(), compRect = compRef.current.getBoundingClientRect();
      setPos([
        compRect.x - figRect.x,
        compRect.width
      ]);
    }
  }, [figRef, compRef]), onMouseMove = import_react134.default.useMemo(() => (0, import_lodash45.default)(_onMouseMove, 25), [_onMouseMove]), newCompProps = combineCompProps(
    compProps,
    { className: POSITIONS[position] }
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
    "figure",
    {
      ref: figRef,
      className: "relative",
      onMouseMove,
      onMouseOut: (e) => {
        setDisplay("none"), onMouseMove.cancel();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
          "div",
          {
            className: "absolute top-0 p-1 z-10 justify-center",
            style: {
              display: store.getReadOnly() ? "none" : display,
              left: `${pos[0]}px`,
              width: `${pos[1]}px`
            },
            children: BUTTONS.map(
              (b, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
                "button",
                {
                  className: `
                    py-1 px-2 bg-gray-100 hover:bg-gray-300
                    ${position === i ? "bg-gray-300" : ""}
                  `,
                  onClick: (e) => handleClick(e, i),
                  onMouseDown: (e) => e.preventDefault(),
                  children: b
                },
                i,
                !1,
                {
                  fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
                  lineNumber: 88,
                  columnNumber: 17
                },
                this
              )
            )
          },
          void 0,
          !1,
          {
            fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
            lineNumber: 82,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
          Component,
          {
            ref: useSetRefs2(ref, compRef),
            compProps: newCompProps,
            ...props
          },
          void 0,
          !1,
          {
            fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
            lineNumber: 100,
            columnNumber: 11
          },
          this
        )
      ]
    },
    blockProps.key,
    !0,
    {
      fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
      lineNumber: 78,
      columnNumber: 9
    },
    this
  );
}), wrapper_default = positionableWrapper;

// app/modules/dms-custom/draft/editor/positionable/index.js
var PositionablePlugin = () => {
  let store = {}, adjustPosition = (block, contentState, position) => {
    let entityKey = block.getEntityAt(0), editorState = store.getEditorState();
    contentState.mergeEntityData(entityKey, { position }), store.setEditorState(
      import_draft_js6.EditorState.forceSelection(
        editorState,
        editorState.getSelection()
      )
    );
  };
  return {
    initialize: ({ getEditorState, setEditorState, getReadOnly }) => {
      store.getEditorState = getEditorState, store.setEditorState = setEditorState, store.getReadOnly = getReadOnly;
    },
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        let contentState = getEditorState().getCurrentContent(), entityKey = block.getEntityAt(0);
        if (!entityKey)
          return null;
        let { position = 0 } = contentState.getEntity(entityKey).getData();
        return {
          props: {
            adjustPosition,
            position,
            key: entityKey
          }
        };
      }
      return null;
    },
    wrapper: wrapper_default(store)
  };
}, positionable_default = PositionablePlugin;

// app/modules/dms-custom/draft/editor/stuff/index.js
var import_react135 = require("react"), import_draft_js7 = require("draft-js"), import_immutable2 = __toESM(require("immutable")), import_jsx_dev_runtime112 = require("react/jsx-dev-runtime"), customStyleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  }
}, blockStyleFn = (block) => {
  let textAlign = block.getData().get("textAlign"), textIndent = block.getData().get("textIndent"), styles = [
    textIndent ? `indent-${textIndent}` : "",
    textAlign || ""
  ];
  switch (block.getType()) {
    case "header-one":
      styles.push("text-3xl font-extrabold");
      break;
    case "header-two":
      styles.push("text-2xl font-bold");
      break;
    case "header-three":
      styles.push("text-xl font-semibold");
      break;
    case "header-four":
      styles.push("text-base font-medium");
      break;
    case "header-five":
      styles.push("text-sm font-medium");
      break;
    case "header-six":
      styles.push("text-xs font-medium");
      break;
    case "blockquote":
      styles.push("rounded bg-gray-200 py-2 px-3 m-2");
      break;
    default:
      break;
  }
  return styles.filter(Boolean).join(" ");
}, myBlockRenderMap = import_immutable2.default.Map({
  blockquote: {
    element: "blockquote",
    wrapper: /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)("div", { className: "rounded bg-gray-100 p-2 my-2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/stuff/index.js",
      lineNumber: 53,
      columnNumber: 14
    }, this)
  },
  "code-block": {
    element: "pre",
    wrapper: /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)("pre", { className: "border font-mono py-2 px-3 rounded bg-gray-50 my-2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/stuff/index.js",
      lineNumber: 57,
      columnNumber: 14
    }, this)
  },
  atomic: {
    element: "figure",
    wrapper: /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)("figure", { className: "relative z-10" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/stuff/index.js",
      lineNumber: 61,
      columnNumber: 14
    }, this)
  }
}), blockRenderMap = import_draft_js7.DefaultDraftBlockRenderMap.merge(myBlockRenderMap), hasListSelected = (editorState) => editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType().includes("ordered-list-item"), onTab = (store, e) => {
  if (!(+e.keyCode == 9 || +e.code == 15))
    return (0, import_draft_js7.getDefaultKeyBinding)(e);
  if (!hasListSelected(store.getEditorState()))
    return (0, import_draft_js7.getDefaultKeyBinding)(e);
  e.preventDefault();
  let found = !1, direction = e.shiftKey ? -1 : 1, editorState = store.getEditorState(), contentState = editorState.getCurrentContent(), blockMap = contentState.getBlockMap(), selection2 = editorState.getSelection(), startKey = selection2.getStartKey(), endKey = selection2.getEndKey(), newBlockMap = blockMap.reduce((a, block) => {
    let depth = block.getDepth(), key = block.getKey();
    return key === startKey && (found = !0), found && (block = block.set("depth", Math.max(0, Math.min(4, depth + direction)))), key === endKey && (found = !1), a.set(block.getKey(), block);
  }, blockMap);
  store.setEditorState(
    import_draft_js7.EditorState.forceSelection(
      import_draft_js7.EditorState.push(
        editorState,
        contentState.merge({ blockMap: newBlockMap }),
        "adjust-depth"
      ),
      selection2
    )
  );
}, StuffPlugin = () => {
  let store = {};
  return {
    initialize: ({ getEditorState, setEditorState, ...rest }) => {
      store.getEditorState = getEditorState, store.setEditorState = setEditorState;
    },
    keyBindingFn: onTab.bind(null, store),
    customStyleMap,
    blockStyleFn,
    blockRenderMap
  };
}, stuff_default = StuffPlugin;

// app/modules/dms-custom/draft/editor/resizable/index.js
var import_draft_js8 = require("draft-js");

// app/modules/dms-custom/draft/editor/resizable/wrapper.js
var import_react136 = __toESM(require("react")), import_lodash46 = __toESM(require("lodash.throttle"));
var import_jsx_dev_runtime113 = require("react/jsx-dev-runtime"), resizableWrapper = (store) => (Component) => import_react136.default.forwardRef(({ compProps = {}, ...props }, ref) => {
  let {
    block,
    contentState,
    blockProps = {}
  } = props, {
    adjustWidth,
    width = null
  } = blockProps, compRef = import_react136.default.useRef(), [hovering, setHovering] = import_react136.default.useState(!1), [canResize, setCanResize] = import_react136.default.useState(0), [resizing, setResizing] = import_react136.default.useState(0), [screenX, setScreenX] = import_react136.default.useState(0), _onResize = import_react136.default.useCallback((e) => {
    if (e.preventDefault(), compRef.current && resizing) {
      let compRect = compRef.current.getBoundingClientRect(), diff = screenX - e.screenX, width2 = compRect.width - diff * resizing;
      setScreenX(e.screenX), adjustWidth(block, contentState, width2);
    }
  }, [compRef, resizing, screenX, adjustWidth, block, contentState]), onResize = import_react136.default.useMemo(() => (0, import_lodash46.default)(_onResize, 25), [_onResize]), onMouseUp = import_react136.default.useCallback((e) => {
    setResizing(0);
  }, []);
  import_react136.default.useEffect(() => (document.addEventListener("mousemove", onResize), document.addEventListener("mouseup", onMouseUp), () => {
    document.removeEventListener("mousemove", onResize), document.removeEventListener("mouseup", onMouseUp);
  }), [onResize, onMouseUp]);
  let onMouseMove = import_react136.default.useCallback((e) => {
    if (setHovering(!0), compRef.current) {
      let compRect = compRef.current.getBoundingClientRect();
      e.clientX >= compRect.x && e.clientX <= compRect.x + 20 ? setCanResize(-1) : e.clientX >= compRect.x + compRect.width - 20 && e.clientX <= compRect.x + compRect.width ? setCanResize(1) : setCanResize(0);
    }
  }, [compRef]), onMouseDown = import_react136.default.useCallback((e) => {
    canResize && (e.preventDefault(), setResizing(canResize), setScreenX(e.screenX));
  }, [canResize]), newCompProps = combineCompProps(
    compProps,
    {
      style: {
        width: width ? `${width}px` : null,
        cursor: canResize ? "ew-resize" : "auto",
        boxShadow: hovering || resizing ? "0 0 2px 4px rgba(0, 0, 0, 0.25)" : ""
      },
      onMouseDown
    }
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime113.jsxDEV)(
    "figure",
    {
      className: "relative",
      onMouseMove: store.getReadOnly() ? null : onMouseMove,
      onMouseOut: (e) => setHovering(!1),
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime113.jsxDEV)(
        Component,
        {
          ref: useSetRefs2(ref, compRef),
          compProps: newCompProps,
          ...props
        },
        void 0,
        !1,
        {
          fileName: "app/modules/dms-custom/draft/editor/resizable/wrapper.js",
          lineNumber: 93,
          columnNumber: 11
        },
        this
      )
    },
    blockProps.key,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/resizable/wrapper.js",
      lineNumber: 89,
      columnNumber: 9
    },
    this
  );
}), wrapper_default2 = resizableWrapper;

// app/modules/dms-custom/draft/editor/resizable/index.js
var ResizablePlugin = () => {
  let store = {}, adjustWidth = (block, contentState, width) => {
    let entityKey = block.getEntityAt(0), editorState = store.getEditorState();
    contentState.mergeEntityData(entityKey, { width }), store.setEditorState(
      import_draft_js8.EditorState.forceSelection(
        editorState,
        editorState.getSelection()
      )
    );
  };
  return {
    initialize: ({ getEditorState, setEditorState, getReadOnly }) => {
      store.getEditorState = getEditorState, store.setEditorState = setEditorState, store.getReadOnly = getReadOnly, store.resizing = 0, store.screenX = null;
    },
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        let contentState = getEditorState().getCurrentContent(), entityKey = block.getEntityAt(0);
        if (!entityKey)
          return null;
        let { width = null } = contentState.getEntity(entityKey).getData();
        return {
          props: {
            adjustWidth,
            width,
            key: entityKey
          }
        };
      }
      return null;
    },
    wrapper: wrapper_default2(store)
  };
}, resizable_default = ResizablePlugin;

// app/modules/dms-custom/draft/editor/index.js
var import_jsx_dev_runtime114 = require("react/jsx-dev-runtime"), buttonPlugin = buttons_default(), {
  BlockQuoteButton,
  CodeBlockButton,
  HeaderOneButton,
  HeaderTwoButton,
  HeaderThreeButton,
  OrderedListButton,
  UnorderedListButton,
  BoldButton,
  CodeButton,
  ItalicButton,
  StrikeThroughButton,
  SubScriptButton,
  SuperScriptButton,
  UnderlineButton,
  LeftAlignButton,
  CenterAlignButton,
  JustifyAlignButton,
  RightAlignButton,
  TextIndentButton,
  TextOutdentButton
} = buttonPlugin, toolbarPlugin = toolbar_default(), { Toolbar, Separator: Separator2 } = toolbarPlugin, positionablePlugin = positionable_default(), resizablePlugin = resizable_default(), imagePlugin = image_default({
  wrappers: [
    positionablePlugin.wrapper,
    resizablePlugin.wrapper
  ]
}), { addImage } = imagePlugin, linkItPlugin = linkify_it_default(), plugins = [
  buttonPlugin,
  toolbarPlugin,
  imagePlugin,
  linkItPlugin,
  super_sub_script_default(),
  positionablePlugin,
  resizablePlugin,
  stuff_default()
], decorator = new import_draft_js9.CompositeDecorator(
  linkItPlugin.decorators
), createEmpty = () => import_draft_js9.EditorState.createEmpty(decorator);
var MyEditor = class extends import_react137.default.Component {
  constructor(props, ...args) {
    super(props, ...args), this.state = {
      hasFocus: !1
    }, this.editor = null, this.handleDroppedFiles = this.handleDroppedFiles.bind(this), this.handleChange = this.handleChange.bind(this), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this);
  }
  componentDidMount() {
    this.props.autoFocus && this.focus();
  }
  componentWillUnmount() {
    this.editor = null;
  }
  focus() {
    setTimeout(() => {
      this.editor && this.editor.focus();
    }, 25);
  }
  handleChange(editorState) {
    this.setState({ editorState }), this.props.onChange(editorState);
  }
  handleDroppedFiles(selection2, files, { getEditorState }) {
    if (this.props.disabled || !files.length)
      return "not-handled";
    let file = files[0];
    return /^image[/]/.test(file.type) ? (this.props.uploadImage(file).then(({ filename, url }) => {
      this.handleChange(addImage(url, getEditorState()));
    }), "handled") : "not-handled";
  }
  onFocus(e) {
    this.setState((state) => ({ hasFocus: !0 })), typeof this.props.onFocus == "function" && this.props.onFocus(e);
  }
  onBlur(e) {
    this.setState((state) => ({ hasFocus: !1 })), typeof this.props.onBlur == "function" && this.props.onBlur(e);
  }
  render() {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(
      EditorWrapper,
      {
        id: this.props.id,
        hasFocus: this.state.hasFocus,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)("div", { className: "px-2 pb-2 flow-root", children: /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(
            import_editor.default,
            {
              editorKey: "foobar",
              ref: (n) => this.editor = n,
              placeholder: this.props.placeholder,
              editorState: this.state.editorState || this.props.value,
              onChange: this.handleChange,
              plugins,
              readOnly: this.props.disabled,
              handleDroppedFiles: this.handleDroppedFiles,
              spellCheck: !0,
              onFocus: this.onFocus,
              onBlur: this.onBlur
            },
            void 0,
            !1,
            {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 181,
              columnNumber: 11
            },
            this
          ) }, void 0, !1, {
            fileName: "app/modules/dms-custom/draft/editor/index.js",
            lineNumber: 180,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(Toolbar, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(BoldButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 196,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(ItalicButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 197,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(StrikeThroughButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 198,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(UnderlineButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 199,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(SubScriptButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 200,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(SuperScriptButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 201,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(CodeButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 202,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 204,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(HeaderOneButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 206,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(HeaderTwoButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 207,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(HeaderThreeButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 208,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 210,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(BlockQuoteButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 212,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(CodeBlockButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 213,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(OrderedListButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 214,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(UnorderedListButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 215,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 217,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(LeftAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 219,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(CenterAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 220,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(JustifyAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 221,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(RightAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 222,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 224,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(TextOutdentButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 226,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)(TextIndentButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 227,
              columnNumber: 11
            }, this)
          ] }, void 0, !0, {
            fileName: "app/modules/dms-custom/draft/editor/index.js",
            lineNumber: 195,
            columnNumber: 9
          }, this),
          this.props.children
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/modules/dms-custom/draft/editor/index.js",
        lineNumber: 177,
        columnNumber: 7
      },
      this
    );
  }
};
__publicField(MyEditor, "defaultProps", {
  disabled: !1,
  autoFocus: !1,
  id: "draft-js-editor",
  placeholder: ""
});
var LoadingOptions = {
  position: "absolute",
  className: "rounded"
}, editor_default = img_loader_default(show_loading_default(MyEditor, LoadingOptions)), EditorWrapper = ({ children: children2, hasFocus, id: id3, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime114.jsxDEV)("div", { className: `pt-16 relative rounded draft-js-editor
        w-full
      `, ...props, children: children2 }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/index.js",
  lineNumber: 244,
  columnNumber: 5
}, this);

// app/modules/dms-custom/draft/editor/editor.read-only.js
var import_react138 = require("react"), import_draft_js10 = require("draft-js"), import_editor2 = __toESM(require("@draft-js-plugins/editor"));
var import_jsx_dev_runtime115 = require("react/jsx-dev-runtime"), positionablePlugin2 = positionable_default(), resizablePlugin2 = resizable_default(), imagePlugin2 = image_default({
  wrappers: [
    positionablePlugin2.wrapper,
    resizablePlugin2.wrapper
  ]
}), linkItPlugin2 = linkify_it_default(), plugins2 = [
  buttons_default(),
  imagePlugin2,
  linkItPlugin2,
  super_sub_script_default(),
  positionablePlugin2,
  resizablePlugin2,
  stuff_default()
], decorator2 = new import_draft_js10.CompositeDecorator(
  linkItPlugin2.decorators
), ReadOnlyEditor = ({ spellCheck = !0, isRaw = !0, value }) => value ? /* @__PURE__ */ (0, import_jsx_dev_runtime115.jsxDEV)("div", { className: "draft-js-editor read-only-editor flow-root", children: /* @__PURE__ */ (0, import_jsx_dev_runtime115.jsxDEV)(
  import_editor2.default,
  {
    editorKey: "foobar",
    editorState: value,
    onChange: () => {
    },
    spellCheck,
    plugins: plugins2,
    readOnly: !0
  },
  void 0,
  !1,
  {
    fileName: "app/modules/dms-custom/draft/editor/editor.read-only.js",
    lineNumber: 53,
    columnNumber: 7
  },
  this
) }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/editor.read-only.js",
  lineNumber: 52,
  columnNumber: 5
}, this) : null, editor_read_only_default = ReadOnlyEditor;

// app/modules/dms-custom/draft/index.js
var import_draft_js11 = require("draft-js"), import_jsx_dev_runtime116 = require("react/jsx-dev-runtime");
function isJson(str) {
  try {
    JSON.parse(str);
  } catch {
    return !1;
  }
  return !0;
}
var Edit6 = ({ value, onChange }) => {
  let data = value ? isJson(value) ? JSON.parse(value) : value : createEmpty();
  return value && (data = import_draft_js11.EditorState.createWithContent((0, import_draft_js11.convertFromRaw)(data))), /* @__PURE__ */ (0, import_jsx_dev_runtime116.jsxDEV)("div", { className: "w-full relative", children: /* @__PURE__ */ (0, import_jsx_dev_runtime116.jsxDEV)(
    editor_default,
    {
      editorKey: "foobar",
      value: value ? data : createEmpty(),
      onChange: (e) => {
        onChange((0, import_draft_js11.convertToRaw)(e.getCurrentContent()));
      },
      imgUploadUrl: "https://graph.availabs.org/img/new"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/index.js",
      lineNumber: 28,
      columnNumber: 13
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/index.js",
    lineNumber: 27,
    columnNumber: 9
  }, this);
};
Edit6.settings = {
  hasControls: !0,
  name: "ElementEdit"
};
var View4 = ({ value }) => {
  let data = value ? isJson(value) ? JSON.parse(value) : value : createEmpty();
  return value && (data = import_draft_js11.EditorState.createWithContent((0, import_draft_js11.convertFromRaw)(data))), /* @__PURE__ */ (0, import_jsx_dev_runtime116.jsxDEV)("div", { className: "relative w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime116.jsxDEV)(editor_read_only_default, { value: data }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/index.js",
    lineNumber: 56,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/index.js",
    lineNumber: 55,
    columnNumber: 9
  }, this);
}, draft_default = {
  EditComp: Edit6,
  ViewComp: View4
};

// app/routes/__dms/blog/$.jsx
var import_jsx_dev_runtime117 = require("react/jsx-dev-runtime");
registerDataType("richtext", draft_default);
async function loader10({ request, params }) {
  return {
    data: await dmsDataLoader(blog_config_default, params["*"]),
    user: await checkAuth(request)
  };
}
async function action5({ request, params }) {
  let form = await request.formData();
  return dmsDataEditor(blog_config_default, JSON.parse(form.get("data")), params["*"]);
}
function DMS() {
  let params = (0, import_react141.useParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime117.jsxDEV)(
    dms_manager_default,
    {
      path: params["*"] || "",
      config: blog_config_default
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 37,
      columnNumber: 7
    },
    this
  );
}
function ErrorBoundary2({ error }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime117.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime117.jsxDEV)("h1", { children: "DMS Error ErrorBoundary" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime117.jsxDEV)("p", { children: error.message }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 48,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime117.jsxDEV)("p", { children: "The stack trace is:" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 49,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime117.jsxDEV)("pre", { children: error.stack }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 50,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dms/blog/$.jsx",
    lineNumber: 46,
    columnNumber: 5
  }, this);
}

// app/routes/__dms/site/$.jsx
var __exports2 = {};
__export(__exports2, {
  ErrorBoundary: () => ErrorBoundary3,
  action: () => action6,
  default: () => DMS2,
  loader: () => loader11
});
var import_react142 = require("react"), import_react143 = require("@remix-run/react");
var import_jsx_dev_runtime118 = require("react/jsx-dev-runtime");
registerDataType("richtext", draft_default);
async function loader11({ request, params }) {
  return console.log("loader", params["*"]), {
    data: await dmsDataLoader(siteConfig, params["*"]),
    user: await checkAuth(request)
  };
}
async function action6({ request, params }) {
  let form = await request.formData();
  return dmsDataEditor(siteConfig, JSON.parse(form.get("data")), params["*"]);
}
function DMS2() {
  let params = (0, import_react143.useParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime118.jsxDEV)(
    dms_manager_default,
    {
      path: params["*"] || "",
      config: siteConfig
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 40,
      columnNumber: 7
    },
    this
  );
}
function ErrorBoundary3({ error }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime118.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime118.jsxDEV)("h1", { children: "DMS Error ErrorBoundary" }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 50,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime118.jsxDEV)("p", { children: error.message }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 51,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime118.jsxDEV)("p", { children: "The stack trace is:" }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime118.jsxDEV)("pre", { children: error.stack }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 53,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dms/site/$.jsx",
    lineNumber: 49,
    columnNumber: 5
  }, this);
}

// app/routes/jokes.jsx
var jokes_exports = {};
__export(jokes_exports, {
  default: () => JokesRoute
});
var import_react144 = require("@remix-run/react"), import_jsx_dev_runtime119 = require("react/jsx-dev-runtime");
function JokesRoute() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime119.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime119.jsxDEV)("h1", { children: "J\u{1F92A}KES" }, void 0, !1, {
      fileName: "app/routes/jokes.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime119.jsxDEV)("main", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime119.jsxDEV)(import_react144.Outlet, {}, void 0, !1, {
      fileName: "app/routes/jokes.jsx",
      lineNumber: 8,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/jokes.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/jokes.jsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "dcb47232", entry: { module: "/build/entry.client-PEJTVJ2F.js", imports: ["/build/_shared/chunk-Y4FP2WQT.js", "/build/_shared/chunk-AX3AIEI4.js", "/build/_shared/chunk-JE7OEZ56.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-UP6EKJLL.js", imports: ["/build/_shared/chunk-L672PVKI.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__auth": { id: "routes/__auth", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__auth-THIGUZ36.js", imports: ["/build/_shared/chunk-OQ2FZUN7.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__auth/login": { id: "routes/__auth/login", parentId: "routes/__auth", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/__auth/login-35S3JXUS.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__auth/logout": { id: "routes/__auth/logout", parentId: "routes/__auth", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/__auth/logout-LADMCKIU.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama": { id: "routes/__dama", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__dama-7I4ZYS7N.js", imports: ["/build/_shared/chunk-SRN2T35Y.js", "/build/_shared/chunk-OQ2FZUN7.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/datasources": { id: "routes/__dama/datasources", parentId: "routes/__dama", path: "datasources", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/datasources-XFYMGPS2.js", imports: ["/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/__dama/index.(cat)": { id: "routes/__dama/index.(cat)", parentId: "routes/__dama", path: "cat?", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/index.(cat)-L7WLP5FB.js", imports: ["/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/source/$sourceId.($page)/($viewId)": { id: "routes/__dama/source/$sourceId.($page)/($viewId)", parentId: "routes/__dama", path: "source/:sourceId/:page?/:viewId?", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/source/$sourceId.($page)/($viewId)-6HB5IB7O.js", imports: ["/build/_shared/chunk-D2ICCRBE.js", "/build/_shared/chunk-7NMS5LSB.js", "/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-L672PVKI.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/source/$sourceId.($page)/index": { id: "routes/__dama/source/$sourceId.($page)/index", parentId: "routes/__dama", path: "source/:sourceId/:page?", index: !0, caseSensitive: void 0, module: "/build/routes/__dama/source/$sourceId.($page)/index-TDSL7H34.js", imports: ["/build/_shared/chunk-D2ICCRBE.js", "/build/_shared/chunk-7NMS5LSB.js", "/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-L672PVKI.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/source/create": { id: "routes/__dama/source/create", parentId: "routes/__dama", path: "source/create", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/source/create-IFUKYVHX.js", imports: ["/build/_shared/chunk-D2ICCRBE.js", "/build/_shared/chunk-7NMS5LSB.js", "/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-L672PVKI.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/source/delete/$sourceId": { id: "routes/__dama/source/delete/$sourceId", parentId: "routes/__dama", path: "source/delete/:sourceId", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/source/delete/$sourceId-AZUYPTFH.js", imports: ["/build/_shared/chunk-7NMS5LSB.js", "/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/view/delete/$viewId": { id: "routes/__dama/view/delete/$viewId", parentId: "routes/__dama", path: "view/delete/:viewId", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/view/delete/$viewId-WSIPCWNF.js", imports: ["/build/_shared/chunk-7NMS5LSB.js", "/build/_shared/chunk-NCSQQ6IA.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dms": { id: "routes/__dms", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__dms-IDLUUATK.js", imports: ["/build/_shared/chunk-SRN2T35Y.js", "/build/_shared/chunk-OQ2FZUN7.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dms/blog/$": { id: "routes/__dms/blog/$", parentId: "routes/__dms", path: "blog/*", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/blog/$-FB6XGJ6Z.js", imports: ["/build/_shared/chunk-EGKVC64H.js", "/build/_shared/chunk-6QKMKL6S.js", "/build/_shared/chunk-WWZN2ML2.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/__dms/blog/blog.config": { id: "routes/__dms/blog/blog.config", parentId: "routes/__dms", path: "blog/blog/config", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/blog/blog.config-TX5EJNLJ.js", imports: ["/build/_shared/chunk-6QKMKL6S.js", "/build/_shared/chunk-WWZN2ML2.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dms/site/$": { id: "routes/__dms/site/$", parentId: "routes/__dms", path: "site/*", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/site/$-IV32R6PN.js", imports: ["/build/_shared/chunk-EGKVC64H.js", "/build/_shared/chunk-WWZN2ML2.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-6TRVSBDH.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/__dms/site/site.config": { id: "routes/__dms/site/site.config", parentId: "routes/__dms", path: "site/site/config", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/site/site.config-OG7I4IWH.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/jokes": { id: "routes/jokes", parentId: "root", path: "jokes", index: void 0, caseSensitive: void 0, module: "/build/routes/jokes-ZQNCEMXS.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-DCB47232.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { v2_meta: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/__auth": {
    id: "routes/__auth",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/__auth/logout": {
    id: "routes/__auth/logout",
    parentId: "routes/__auth",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/__auth/login": {
    id: "routes/__auth/login",
    parentId: "routes/__auth",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/__dama": {
    id: "routes/__dama",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: dama_exports
  },
  "routes/__dama/source/$sourceId.($page)/($viewId)": {
    id: "routes/__dama/source/$sourceId.($page)/($viewId)",
    parentId: "routes/__dama",
    path: "source/:sourceId/:page?/:viewId?",
    index: void 0,
    caseSensitive: void 0,
    module: viewId_exports
  },
  "routes/__dama/source/$sourceId.($page)/index": {
    id: "routes/__dama/source/$sourceId.($page)/index",
    parentId: "routes/__dama",
    path: "source/:sourceId/:page?",
    index: !0,
    caseSensitive: void 0,
    module: sourceId_exports
  },
  "routes/__dama/source/delete/$sourceId": {
    id: "routes/__dama/source/delete/$sourceId",
    parentId: "routes/__dama",
    path: "source/delete/:sourceId",
    index: void 0,
    caseSensitive: void 0,
    module: sourceId_exports2
  },
  "routes/__dama/view/delete/$viewId": {
    id: "routes/__dama/view/delete/$viewId",
    parentId: "routes/__dama",
    path: "view/delete/:viewId",
    index: void 0,
    caseSensitive: void 0,
    module: viewId_exports2
  },
  "routes/__dama/source/create": {
    id: "routes/__dama/source/create",
    parentId: "routes/__dama",
    path: "source/create",
    index: void 0,
    caseSensitive: void 0,
    module: create_exports
  },
  "routes/__dama/datasources": {
    id: "routes/__dama/datasources",
    parentId: "routes/__dama",
    path: "datasources",
    index: void 0,
    caseSensitive: void 0,
    module: datasources_exports
  },
  "routes/__dama/index.(cat)": {
    id: "routes/__dama/index.(cat)",
    parentId: "routes/__dama",
    path: "cat?",
    index: void 0,
    caseSensitive: void 0,
    module: index_cat_exports
  },
  "routes/__dms": {
    id: "routes/__dms",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: dms_exports
  },
  "routes/__dms/blog/blog.config": {
    id: "routes/__dms/blog/blog.config",
    parentId: "routes/__dms",
    path: "blog/blog/config",
    index: void 0,
    caseSensitive: void 0,
    module: blog_config_exports
  },
  "routes/__dms/site/site.config": {
    id: "routes/__dms/site/site.config",
    parentId: "routes/__dms",
    path: "site/site/config",
    index: void 0,
    caseSensitive: void 0,
    module: site_config_exports
  },
  "routes/__dms/blog/$": {
    id: "routes/__dms/blog/$",
    parentId: "routes/__dms",
    path: "blog/*",
    index: void 0,
    caseSensitive: void 0,
    module: __exports
  },
  "routes/__dms/site/$": {
    id: "routes/__dms/site/$",
    parentId: "routes/__dms",
    path: "site/*",
    index: void 0,
    caseSensitive: void 0,
    module: __exports2
  },
  "routes/jokes": {
    id: "routes/jokes",
    parentId: "root",
    path: "jokes",
    index: void 0,
    caseSensitive: void 0,
    module: jokes_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
