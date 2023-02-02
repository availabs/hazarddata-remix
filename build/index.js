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
    var getXMLHttpRequest = require_getXMLHttpRequest(), getCORSRequest = require_getCORSRequest(), hasOwnProp = Object.prototype.hasOwnProperty, noop2 = function() {
    };
    function Observable() {
    }
    Observable.create = function(subscribe) {
      var o = new Observable();
      return o.subscribe = function(onNext, onError, onCompleted) {
        var observer, disposable;
        return typeof onNext == "function" ? observer = {
          onNext,
          onError: onError || noop2,
          onCompleted: onCompleted || noop2
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
          } catch (e2) {
            _handleXhrError(observer, "invalid json", e2);
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
      let { color = "white", size: size2 = "compact", subMenuStyle = "inline" } = opts, colors = {
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
        contentBg: `${colors[color].contentBg}`,
        contentBgAccent: `${colors[color].contentBgAccent}`,
        logoWrapper: `${sizes[size2].wrapper} ${colors[color].contentBgAccent} ${colors[color].textColorAccent}`,
        sidenavWrapper: `${colors[color].contentBg} ${sizes[size2].wrapper} h-full hidden md:block z-20`,
        menuIconSide: `text-${colors[color].accentColor} ${sizes[size2].icon} group-hover:${colors[color].highlightColor}`,
        menuIconClosed: "fa fa-bars p-3 cursor-pointer",
        menuIconOpen: "fa fa-cancel",
        itemsWrapper: `p-4 border-t ${colors[color].borderColor} ${sizes[size2].wrapper}`,
        navitemSide: ` 
	            group font-sans flex flex-col
	            ${sizes[size2].sideItem} ${colors[color].textColor} ${colors[color].borderColor} 
	            hover:${colors[color].highlightColor} 
	            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 
	            transition-all cursor-pointer
	         `,
        navitemSideActive: `
	            group font-sans flex flex-col w-full
	            ${sizes[size2].sideItem} ${colors[color].textColor} ${colors[color].borderColor} 
	            hover:${colors[color].highlightColor} 
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
      let { color = "white", size: size2 = "compact" } = opts, colors = {
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
        topnavWrapper: `w-full ${colors[color].contentBg} ${sizes[size2].wrapper} `,
        topnavContent: "flex w-full h-full",
        topnavMenu: "hidden md:flex flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-sm",
        menuIconTop: `text-${colors[color].accentColor} ${sizes[size2].icon} group-hover:${colors[color].highlightColor}`,
        menuOpenIcon: "os-icon os-icon-menu",
        menuCloseIcon: "os-icon os-icon-x",
        navitemTop: `
				    group font-sans 
				    ${sizes[size2].topItem} ${colors[color].textColor} ${colors[color].borderColor} 
				    ${colors[color].accentBg} hover:${colors[color].highlightColor} 
				    focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 
				    transition cursor-pointer
				`,
        topmenuRightNavContainer: "hidden md:block h-full",
        navitemTopActive: `
					group font-sans
		    		${sizes[size2].topItem} ${colors[color].textColor} ${colors[color].borderColor} 
		    		${colors[color].accentBg} hover:${colors[color].highlightColor} 
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
      let { color = "white", size: size2 = "full", wrapStyle = "no-wrap" } = opts, colors = {
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
        menuWrapper: `bg-${colors[color]} my-1 text-sm`,
        menuItemActive: `px-2 py-2 cursor-not-allowed bg-${accent}-200 border-1 border-${colors[color]} focus:border-${accent}-300`,
        menuItem: `px-2 py-2 cursor-pointer hover:bg-blue-100 border-1 border-${colors[color]} focus:border-blue-300 flex-wrap`,
        valueItem: `max-w-full ${wrapStyles[wrapStyle]}`,
        itemText: "text-xl",
        select: `bg-${colors[color]} w-full flex flex-1 flex-row justify-between truncate ${sizes[size2]} cursor-pointer border-2 border-${colors[color]} focus:border-blue-300`,
        selectIcon: "self-center fa fa-angle-down text-gray-400 pt-2 px-2",
        vars: {
          color: colors,
          size: sizes,
          wrapStyle: wrapStyles
        }
      };
    },
    table: (opts = {}) => {
      let { color = "white", size: size2 = "compact" } = opts, colors = {
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
        tableRow: `${colors[color]} transition ease-in-out duration-150`,
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
      let { color = "white", size: size2 = "base", width = "block" } = opts, colors = {
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
                    ${colors[color]} ${sizes[size2]} ${widths[width]}
                `,
        vars: {
          color: colors,
          size: sizes,
          width: widths
        }
      };
    },
    input: (opts = {}) => {
      let { color = "white", size: size2 = "small", width = "block" } = opts, colors = {
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
                 ${colors[color]} ${sizes[size2]} ${widths[width]}
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
  return ({ children, ...props }) => {
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
    return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Component, { ...props, children: import_react3.default.Children.map(children, (child) => import_react3.default.cloneElement(child, toShare)) }, void 0, !1, {
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
  children,
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
            /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: theme.navItemContent, children }, void 0, !1, {
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
var import_jsx_dev_runtime9 = require("react/jsx-dev-runtime"), Dropdown = ({ control, children, className, openType = "hover" }) => {
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
        open ? /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `shadow fixed w-full max-w-[193px] rounded-b-lg ${open ? "block" : "hidden"} z-10`, children }, void 0, !1, {
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
  let last, timer;
  return () => {
    let now = +new Date();
    !!last && now < last + threshold ? (clearTimeout(timer), timer = setTimeout(() => {
      last = now, fn();
    }, threshold)) : (last = now, fn());
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
  _fillArray(array, val) {
    let newArray = [];
    for (let i = 0, max = array.length; i < max; i++)
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
      children,
      className,
      scrolledPastClassName,
      style
    } = this.props, counter = 0, items = import_react17.default.Children.map(children, (child, idx) => {
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
var import_jsx_dev_runtime21 = require("react/jsx-dev-runtime"), textarea_default = import_react23.default.forwardRef(({ large, small, className = "", children, onChange, value, ...props }, ref) => {
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
      children
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
  children,
  confirmMessage,
  type,
  ...props
}) => {
  let [canClick, setCanClick] = import_react24.default.useState(!1), timeout = import_react24.default.useRef(null), confirm = import_react24.default.useCallback(
    (e) => {
      e.preventDefault(), setCanClick(!0), timeout.current = setTimeout(setCanClick, 5e3, !1);
    },
    [timeout]
  ), doOnClick = import_react24.default.useCallback(
    (e) => {
      setCanClick(!1), onClick && onClick(e);
    },
    [onClick]
  );
  return import_react24.default.useEffect(() => () => clearTimeout(timeout.current), [timeout]), /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)(
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
        /* @__PURE__ */ (0, import_jsx_dev_runtime22.jsxDEV)("div", { style: { color: canClick ? "transparent" : null }, children }, void 0, !1, {
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
  children,
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
      children
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
      children
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
var ValueContainer = import_react25.default.forwardRef(({ children, hasFocus, large, small, disabled = !1, customTheme, className = "", ...props }, ref) => {
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
      children
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
var import_jsx_dev_runtime25 = require("react/jsx-dev-runtime"), ValueItem2 = ({ isPlaceholder, children, remove, edit, disabled = !1, themeOptions }) => {
  let theme = useTheme().select(themeOptions);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: `
        ${isPlaceholder ? theme.textLight : `${disabled ? theme.accent2 : remove || edit ? theme.menuBgActive : ""}
            mr-1 pl-2 ${!disabled && (remove || edit) ? "pr-1" : "pr-4"}
          `}
        ${theme.itemText}
         mt-1 flex items-center max-w-full
      `, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("span", { className: theme.valueItem, children }, void 0, !1, {
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
    isPlaceholder || disabled || !remove ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)(
      "div",
      {
        className: `
            ${theme.menuBgActive} ${theme.menuBgActiveHover} ${theme.textContrast}
            ${edit ? "ml-1" : "ml-2"} p-1 flex justify-center items-center rounded cursor-pointer
          `,
        onClick: remove,
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
  ({ children, searchable, opened, direction, themeOptions = {} }, ref) => {
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
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime25.jsxDEV)("div", { className: `${theme.menuWrapper}`, children }, void 0, !1, {
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
var Expandable = import_react30.default.forwardRef(({ open, transitioning, width, padding, children, heightFull = !0 }, ref) => {
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
            children
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
var import_jsx_dev_runtime30 = require("react/jsx-dev-runtime"), FalcorContext = import_react33.default.createContext(), useFalcor = () => import_react33.default.useContext(FalcorContext), FalcorConsumer = FalcorContext.Consumer, FalcorProvider = ({ falcor: falcor3, children }) => {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime30.jsxDEV)(FalcorContext.Provider, { value: falcorValue, children }, void 0, !1, {
    fileName: "app/modules/avl-falcor/index.js",
    lineNumber: 35,
    columnNumber: 5
  }, this);
};

// app/styles/app.css
var app_default = "/build/_assets/app-DJ6DHYNP.css";

// app/theme.js
var ppdaf = () => {
  let primary = "nuetral", highlight = "white", accent = "blue";
  return {
    graphColors: ["#1e40af", "#93c5fd", "#1d4ed8", "#bfdbfe"],
    graphCategorical: ["#fde72f", "#95d840", "#55a488", "#2f708e", "#453781", "#472354"],
    sidenav: (opts = {}) => {
      let { color = "white", size = "compact", subMenuStyle = "inline", responsive = "top" } = opts, mobile = {
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
        logoWrapper: `${sizes[size].wrapper} ${colors[color].contentBgAccent} ${colors[color].textColorAccent}`,
        sidenavWrapper: `${mobile[responsive]} ${colors[color].contentBg} ${sizes[size].wrapper} h-full z-20`,
        menuIconSide: `${sizes[size].icon} group-hover:${colors[color].highlightColor}`,
        itemsWrapper: `${colors[color].borderColor} ${sizes[size].itemWrapper}  `,
        navItemContent: `${sizes[size].sideItemContent}`,
        navitemSide: `
            group font-sans flex flex-col
            ${sizes[size].sideItem} ${colors[color].sideItem}
            focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
            transition-all cursor-pointer
         `,
        navitemSideActive: `
            group font-sans flex flex-col
            ${sizes[size].sideItem} ${sizes[size].sideItemActive} ${colors[color].sideItemActive} 
            hover:${colors[color].highlightColor}
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
    topnav: ({ color = "white", size = "compact" }) => {
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
          topItem: `flex items-center text-sm px-4 border-r h-12 ${colors[color].textColor} ${colors[color].borderColor}
            ${colors[color].accentBg} hover:${colors[color].highlightColor}`,
          activeItem: `flex items-center text-sm px-4 border-r h-12 ${colors[color].textColor} ${colors[color].borderColor}
            ${colors[color].accentBg} hover:${colors[color].highlightColor}`,
          icon: "mr-3 text-lg",
          responsive: "md:hidden"
        },
        inline: {
          menu: "flex flex-1",
          sideItem: "flex mx-4 pr-4 py-4 text-base font-base border-b hover:pl-4",
          topItem: `flex px-4 py-2 mx-2 font-medium text-gray-400 border-b-2 ${colors[color].textColor} ${colors[color].borderColor}
          hover:border-gray-300 hover:text-gray-700 border-gray-100 `,
          activeItem: `flex px-4 py-2 mx-2 font-medium text-blue-600 border-b-2 ${colors[color].textColor} ${colors[color].borderColor} border-blue-600 `,
          icon: "mr-4 text-2xl",
          responsive: "hidden"
        }
      };
      return {
        topnavWrapper: `w-full ${colors[color].contentBg} border-b border-gray-200`,
        topnavContent: "flex w-full h-full",
        topnavMenu: `${sizes[size].menu} h-full overflow-x-auto overflow-y-hidden scrollbar-sm`,
        menuIconTop: `text-${colors[color].accentColor} ${sizes[size].icon} group-hover:${colors[color].highlightColor}`,
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
        mobileButton: `${sizes[size].responsive} ${colors[color].contentBg} inline-flex items-center justify-center p-2  text-gray-400 hover:bg-gray-100 `,
        vars: {
          colors,
          sizes
        }
      };
    },
    select: (opts = {}) => {
      let { color = "white" } = opts, colors = {
        white: "white",
        transparent: "gray-100 border border-gray-200 shadow-sm"
      };
      return {
        menuWrapper: `bg-${colors[color]} my-1`,
        menuItemActive: `px-4 py-2 cursor-not-allowed bg-${accent}-200 border-1 focus:border-${accent}-300`,
        menuItem: `px-4 py-2 cursor-pointer hover:bg-blue-100 border-1 border-${colors[color]} focus:border-blue-300`,
        select: `bg-${colors[color]} w-full flex flex-row flex-wrap justify-between px-4 py-2 cursor-pointer focus:border-blue-300`,
        selectIcon: "fal fa-angle-down text-gray-400 pt-2"
      };
    },
    table: (opts = {}) => {
      let { color = "white", size = "compact" } = opts, colors = {
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
        tableRow: `${colors[color]} transition ease-in-out duration-150 border-b border-gray-100`,
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
      let { color = "white", size = "base", width = "block" } = opts, colors = {
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
                  ${colors[color]} ${sizes[size]} ${widths[width]}
                `,
        vars: {
          color: colors,
          size: sizes,
          width: widths
        }
      };
    },
    input: (opts = {}) => {
      let { color = "white", size = "small", width = "block" } = opts, colors = {
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
                 ${colors[color]} ${sizes[size]} ${widths[width]}
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
  action: () => action,
  loader: () => loader2
});
var import_node2 = require("@remix-run/node");
var action = async ({
  request
}) => logout(request), loader2 = async ({ request }) => {
  let pathname = new URL(request.url).pathname;
  return logout(request);
};

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
  loader: () => loader3
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
    /* @__PURE__ */ (0, import_jsx_dev_runtime34.jsxDEV)("div", { className: "text-xs font-medium -mt-1 tracking-widest text-left text-gray-500 group-hover:text-gray-200", children: user.groups[0] ? user.groups[0] : "" }, void 0, !1, {
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
async function loader3({ request }) {
  return await checkAuth(request);
}
function Index2() {
  let user = (0, import_react40.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "bg-gray-100 p-1 text-gray-500 min-h-screen", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "flex p-1 text-gray-800 border-b w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)(import_react40.NavLink, { to: "/", className: "p-4", children: "Home" }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 21,
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
          lineNumber: 24,
          columnNumber: 15
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 23,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 22,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama.jsx",
      lineNumber: 20,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)("div", { className: "w-full border-b p-2", children: "breadcrumbs" }, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 36,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime35.jsxDEV)(import_react40.Outlet, {}, void 0, !1, {
        fileName: "app/routes/__dama.jsx",
        lineNumber: 37,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama.jsx",
      lineNumber: 35,
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

// app/routes/__dama/source/$sourceId.($page).js
var sourceId_page_exports = {};
__export(sourceId_page_exports, {
  default: () => Dama,
  loader: () => loader4
});
var import_react76 = __toESM(require("react"));

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

// app/modules/data-manager/data-types/default/Overview.js
var import_react41 = __toESM(require("react"));
var import_lodash10 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime36 = require("react/jsx-dev-runtime"), Edit = ({ startValue, attr, sourceId, cancel = () => {
} }) => {
  let [value, setValue] = (0, import_react41.useState)("");
  (0, import_react41.useEffect)(() => {
    setValue(startValue);
  }, [startValue]);
  let save = (attr2, value2) => {
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "w-full flex", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(input_default, { className: "flex-1 px-2 shadow bg-blue-100 focus:ring-blue-700 focus:border-blue-500  border-gray-300 rounded-none rounded-l-md", value, onChange: (e) => setValue(e) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(Button, { themeOptions: { size: "sm", color: "primary" }, onClick: (e) => save(attr, value), children: " Save " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 43,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)(Button, { themeOptions: { size: "sm", color: "cancel" }, onClick: (e) => cancel(), children: " Cancel " }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 44,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/Overview.js",
    lineNumber: 41,
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
          lineNumber: 57,
          columnNumber: 13
        },
        this
      ) : (0, import_lodash10.default)(source, "description", !1) || "No Description" }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      user.authLevel > 5 ? /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "hidden group-hover:block text-blue-500 cursor-pointer", onClick: (e) => setEditing("description"), children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("i", { className: "fad fa-pencil absolute -ml-12  p-2 hover:bg-blue-500 rounded focus:bg-blue-700 hover:text-white " }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 66,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 65,
        columnNumber: 9
      }, this) : ""
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 54,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: [
      Object.keys(SourceAttributes).filter((d) => !["source_id", "metadata", "description", "statistics", "category"].includes(d)).map((attr, i) => {
        let val = typeof source[attr] == "object" ? JSON.stringify(source[attr]) : source[attr];
        return /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "flex justify-between group", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: attr }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 78,
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
                lineNumber: 82,
                columnNumber: 27
              },
              this
            ) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 81,
              columnNumber: 25
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "py-5 px-2", children: val }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 89,
              columnNumber: 25
            }, this) }, void 0, !1, {
              fileName: "app/modules/data-manager/data-types/default/Overview.js",
              lineNumber: 79,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/modules/data-manager/data-types/default/Overview.js",
            lineNumber: 77,
            columnNumber: 19
          }, this),
          user.authLevel > 5 ? /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "hidden group-hover:block text-blue-500 cursor-pointer", onClick: (e) => setEditing(editing === attr ? null : attr), children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("i", { className: "fad fa-pencil absolute -ml-12 mt-3 p-2.5 rounded hover:bg-blue-500 hover:text-white " }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/default/Overview.js",
            lineNumber: 95,
            columnNumber: 21
          }, this) }, void 0, !1, {
            fileName: "app/modules/data-manager/data-types/default/Overview.js",
            lineNumber: 94,
            columnNumber: 19
          }, this) : ""
        ] }, i, !0, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 76,
          columnNumber: 17
        }, this);
      }),
      /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Versions" }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 102,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("ul", { className: "border border-gray-200 rounded-md divide-y divide-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("select", { className: "pl-3 pr-4 py-3 w-full bg-white mr-2 flex items-center justify-between text-sm", children: views.map((v, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime36.jsxDEV)("option", { className: "ml-2  truncate", children: v.version }, i, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 108,
          columnNumber: 25
        }, this)) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 105,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 104,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/modules/data-manager/data-types/default/Overview.js",
          lineNumber: 103,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/modules/data-manager/data-types/default/Overview.js",
        lineNumber: 101,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 70,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/Overview.js",
      lineNumber: 69,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/default/Overview.js",
    lineNumber: 53,
    columnNumber: 5
  }, this);
}, Overview_default = OverviewEdit;

// app/modules/data-manager/data-types/default/Metadata.js
var import_react42 = require("react"), import_lodash11 = require("lodash.get"), import_jsx_dev_runtime37 = require("react/jsx-dev-runtime"), Metadata = ({ source, meta: meta2 }) => (console.log("meta", meta2), !meta2 || Object.keys(meta2).length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime37.jsxDEV)("div", { children: " Metadata Not Available " }, void 0, !1, {
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
var import_react43 = __toESM(require("react")), import_lodash12 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime38 = require("react/jsx-dev-runtime"), AddView = ({ source, views, user }) => {
  let newVersion = Math.max(...views.map((v) => parseInt(v.version))) + 1, sourceTypeToFileNameMapping = source.type.substring(0, 3) === "tl_" ? "tiger_2017" : source.type, CreateComp = import_react43.default.useMemo(
    () => (0, import_lodash12.default)(DataTypes, `[${sourceTypeToFileNameMapping}].sourceCreate.component`, () => /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)("div", {}, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/default/AddView.js",
      lineNumber: 9,
      columnNumber: 93
    }, this)),
    [DataTypes, source, views, user]
  );
  return console.log("??", newVersion, source), /* @__PURE__ */ (0, import_jsx_dev_runtime38.jsxDEV)(CreateComp, { source, existingSource: source, user, newVersion }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/AddView.js",
    lineNumber: 13,
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
    `${rtPfx}/staged-geospatial-dataset/versionSelectorUtils`
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
var import_react44 = require("@remix-run/react"), import_jsx_dev_runtime39 = require("react/jsx-dev-runtime"), DeleteButton = ({ text, viewId }) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(
  import_react44.Link,
  {
    className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
    to: `/view/delete/${viewId}`,
    children: text
  },
  void 0,
  !1,
  {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 7,
    columnNumber: 5
  },
  this
), Views = ({ source, views, user, falcor: falcor3 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { className: "py-4 sm:py-2 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6 border-b-2", children: ["view_id", "version", "last_updated", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: key }, key, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 21,
    columnNumber: 29
  }, this)) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 17,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: views.map(
    (view, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6", children: [
      ["view_id", "version", "last_updated", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 align-middle", children: typeof view[key] == "object" ? "" : view[key] }, key, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 38,
        columnNumber: 53
      }, this)),
      /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 flex justify-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime39.jsxDEV)(DeleteButton, { text: "delete", viewId: view.view_id }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 44,
        columnNumber: 45
      }, this) }, void 0, !1, {
        fileName: "app/modules/data-manager/data-types/default/Views.js",
        lineNumber: 43,
        columnNumber: 41
      }, this)
    ] }, i, !0, {
      fileName: "app/modules/data-manager/data-types/default/Views.js",
      lineNumber: 34,
      columnNumber: 37
    }, this)
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 28,
    columnNumber: 17
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/default/Views.js",
    lineNumber: 27,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/default/Views.js",
  lineNumber: 16,
  columnNumber: 9
}, this), Views_default = Views;

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
var import_react54 = __toESM(require("react"));
var import_lodash18 = __toESM(require("lodash.get"));

// app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js
var import_react51 = __toESM(require("react"));

// app/modules/avl-map/src/avl-map.js
var import_react48 = __toESM(require("react")), import_maplibre_gl = __toESM(require("maplibre-gl")), import_lodash14 = __toESM(require("lodash.get"));

// app/modules/avl-map/src/components/utils.js
var import_react45 = __toESM(require("react")), getRect = (ref) => {
  let node = ref && ref.current;
  return node ? node.getBoundingClientRect() : { width: 0, height: 0 };
}, useSetSize2 = (ref, callback) => {
  let [size, setSize] = import_react45.default.useState({ width: 0, height: 0, x: 0, y: 0 }), doSetSize = import_react45.default.useCallback(() => {
    let rect = getRect(ref), { width, height, x, y } = rect;
    (width !== size.width || height !== size.height) && (typeof callback == "function" && callback({ width, height, x, y }), setSize({ width, height, x, y }));
  }, [ref, size, callback]);
  return import_react45.default.useEffect(() => (window.addEventListener("resize", doSetSize), () => {
    window.removeEventListener("resize", doSetSize);
  }), [doSetSize]), import_react45.default.useEffect(() => {
    doSetSize();
  }), size;
}, hasValue2 = (value) => value == null || typeof value == "string" && !value.length ? !1 : Array.isArray(value) ? value.reduce((a, c) => a || hasValue2(c), !1) : typeof value == "number" && isNaN(value) ? !1 : typeof value == "object" ? Object.values(value).reduce((a, c) => a || hasValue2(c), !1) : !0;

// app/modules/avl-map/src/components/HoverCompContainer.js
var import_react46 = __toESM(require("react")), import_jsx_dev_runtime40 = require("react/jsx-dev-runtime"), Icon = ({
  onClick,
  cursor = "cursor-pointer",
  className = "",
  style = {},
  children
}) => /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
  "div",
  {
    onClick,
    className: `
        ${cursor} ${className} transition h-6 w-6
        hover:text-blue-500 flex items-center justify-center
      `,
    style: { ...style },
    children
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
}, getTransform = ({ x }, orientation) => orientation === "right" ? "translate(-50%, -50%) rotate(45deg) skew(-15deg, -15deg)" : "translate(50%, -50%) rotate(45deg) skew(-15deg, -15deg)", RemoveButton = ({ orientation, children }) => /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(
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
    children
  },
  void 0,
  !1,
  {
    fileName: "app/modules/avl-map/src/components/HoverCompContainer.js",
    lineNumber: 76,
    columnNumber: 5
  },
  this
), PinnedHoverComp = ({ children, remove, id: id2, project, lngLat, width }) => {
  let pos = project(lngLat), orientation = import_react46.default.useRef(pos.x < width * 0.5 ? "right" : "left"), style = import_react46.default.useMemo(() => ({
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
        children,
        /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(RemoveButton, { orientation: orientation.current, children: /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)(Icon, { onClick: (e) => remove(id2), children: /* @__PURE__ */ (0, import_jsx_dev_runtime40.jsxDEV)("span", { className: "fa fa-times" }, void 0, !1, {
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
}, HoverCompContainer = ({ show, children, lngLat, project, ...rest }) => {
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
      children
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
var import_react47 = __toESM(require("react")), import_lodash13 = __toESM(require("lodash.get")), import_jsx_dev_runtime41 = require("react/jsx-dev-runtime"), InfoBoxContainer = ({
  activeLayers,
  width = 320,
  padding = 8,
  MapActions,
  ...props
}) => {
  let [infoBoxLayers, infoBoxWidth] = import_react47.default.useMemo(() => activeLayers.reduce(
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
var import_jsx_dev_runtime42 = require("react/jsx-dev-runtime"), import_react49 = require("react"), DefaultStyles = [
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
  let { size, center, zoom } = { ...DefaultStaticOptions, ...options };
  return `https://api.mapbox.com/styles/v1/${style.slice(16)}/static/${center},${zoom}/${size.join("x")}?attribution=false&logo=false&access_token=${import_maplibre_gl.default.accessToken}`;
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
}, Reducer = (state, action5) => {
  let { type, ...payload } = action5;
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
          ({ id: id2 }) => id2 !== payload.layerId
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
      let { data, layer, HoverComp: HoverComp2, pinnable, sortOrder, ...rest } = payload;
      return state.hoverData.data.set(layer.id, {
        data,
        HoverComp: HoverComp2,
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
          ({ id: id2 }) => id2 !== payload.layer.id
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
  } = props, [state, dispatch] = import_react48.default.useReducer(Reducer, InitialState), updateHover = import_react48.default.useCallback((hoverData2) => {
    dispatch(hoverData2);
  }, []), projectLngLat = import_react48.default.useCallback(
    (lngLat) => state.map.project(lngLat),
    [state.map]
  ), updateFilter = import_react48.default.useCallback(
    (layer, filterName, value) => {
      if (!(0, import_lodash14.default)(layer, ["filters", filterName], null))
        return;
      dispatch({ type: "loading-start", layerId: layer.id });
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
        dispatch({ type: "loading-stop", layerId: layer.id });
      });
    },
    [state.map, falcor3, layerProps]
  ), fetchData = import_react48.default.useCallback(
    (layer) => {
      dispatch({ type: "loading-start", layerId: layer.id }), Promise.resolve(layer.fetchData(falcor3)).then(() => layer.render(state.map, falcor3)).then(() => {
        dispatch({ type: "loading-stop", layerId: layer.id });
      });
    },
    [state.map, falcor3]
  ), updateLegend = import_react48.default.useCallback(
    (layer, update) => {
      !(0, import_lodash14.default)(layer, "legend", null) || (layer.legend = {
        ...layer.legend,
        ...update
      }, layer.render(state.map, falcor3), dispatch({ type: "update-state" }));
    },
    [state.map, falcor3]
  ), addDynamicLayer = import_react48.default.useCallback((layer) => {
    layer.isDynamic = !0, dispatch({
      type: "add-dynamic-layer",
      layer
    });
  }, []), removeDynamicLayer = import_react48.default.useCallback(
    (layer) => {
      layer._onRemove(state.map), dispatch({
        type: "remove-dynamic-layer",
        layer
      });
    },
    [state.map]
  ), toggleVisibility = import_react48.default.useCallback(
    (layer) => {
      layer.toggleVisibility(state.map), dispatch({ type: "update-state" });
    },
    [state.map]
  ), addLayer = import_react48.default.useCallback(
    (layer) => {
      layer._onAdd(state.map, falcor3, updateHover), dispatch({
        type: "activate-layer",
        layer
      });
    },
    [state.map, falcor3, updateHover]
  ), removeLayer = import_react48.default.useCallback(
    (layer) => {
      layer._onRemove(state.map), dispatch({
        type: "deactivate-layer",
        layerId: layer.id
      });
    },
    [state.map]
  ), setSidebarTab = import_react48.default.useCallback((sidebarTabIndex) => {
    dispatch({
      type: "switch-tab",
      sidebarTabIndex
    });
  }, []), showModal = import_react48.default.useCallback((layerId, modalKey) => {
    dispatch({
      type: "show-modal",
      layerId,
      modalKey
    });
  }, []), closeModal = import_react48.default.useCallback((layerId, modalKey) => {
    dispatch({
      type: "close-modal",
      layerId,
      modalKey
    });
  }, []), bringModalToFront = import_react48.default.useCallback((layerId, modalKey) => {
    dispatch({
      type: "bring-modal-to-front",
      layerId,
      modalKey
    });
  }, []), removePinnedHoverComp = import_react48.default.useCallback((id3) => {
    dispatch({
      type: "remove-pinned",
      id: id3
    });
  }, []), addPinnedHoverComp = import_react48.default.useCallback(
    ({ lngLat, hoverData: hoverData2 }) => {
      if (hoverData2.pinnable) {
        let marker = new import_maplibre_gl.default.Marker().setLngLat(lngLat).addTo(state.map);
        dispatch({
          type: "pin-hover-comp",
          marker,
          lngLat
        });
      }
    },
    [state.map]
  ), saveMapAsImage = import_react48.default.useCallback(
    (fileName = "map.png") => {
      let canvas = state.map.getCanvas(), a = document.createElement("a");
      a.download = fileName, a.href = canvas.toDataURL(), a.click();
    },
    [state.map]
  ), setMapStyle = import_react48.default.useCallback(
    (styleIndex) => {
      state.map.once("style.load", (e) => {
        state.activeLayers.slice().reverse().reduce((promise, layer) => promise.then(
          () => layer.onMapStyleChange(state.map, falcor3, updateHover)
        ), Promise.resolve());
      }), state.activeLayers.forEach((layer) => {
        layer._onRemove(state.map);
      }), state.map.setStyle(state.mapStyles[styleIndex].style), dispatch({
        type: "set-map-style",
        styleIndex
      });
    },
    [state.map, state.mapStyles, state.activeLayers, updateHover, falcor3]
  ), MapActions = import_react48.default.useMemo(
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
  ), MapOptions = import_react48.default.useRef({ ...DefaultMapOptions, ...mapOptions }), id2 = import_react48.default.useRef(props.id || getUniqueId());
  import_react48.default.useEffect(() => {
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
    let map = new import_maplibre_gl.default.Map({
      container: id2.current,
      logoControl: !1,
      ...Options,
      style: mapStyles[styleIndex].style
    });
    return navigationControl && map.addControl(new import_maplibre_gl.default.NavigationControl(), navigationControl), map.on("move", (e) => {
      dispatch({ type: "update-state", mapMoved: performance.now() });
    }), map.once("load", (e) => {
      dispatch({ type: "map-loaded", map, mapStyles, styleIndex });
    }), () => map.remove();
  }, [accessToken, navigationControl]), import_react48.default.useEffect(() => {
    !state.map || [...layers, ...state.dynamicLayers].filter(({ id: id3 }) => !state.initializedLayers.includes(id3)).reverse().reduce((promise, layer) => {
      dispatch({ type: "init-layer", layer }), layer.dispatchStateUpdate = (layer2, newState) => {
        dispatch({
          type: "layer-update",
          newState,
          layer: layer2
        });
      }, layer.props = (0, import_lodash14.default)(layerProps, layer.id, {});
      for (let filterName in layer.filters)
        layer.filters[filterName].onChange = (v) => updateFilter(layer, filterName, v);
      return layer.toolbar.forEach((tool) => {
        typeof tool.action == "function" && (tool.actionFunc = tool.action.bind(layer));
      }), layer.mapActions.forEach((action5) => {
        action5.actionFunc = action5.action.bind(layer);
      }), promise.then(() => layer._init(state.map, falcor3, MapActions)).then(() => {
        layer.setActive && layer.fetchData(falcor3).then(() => layer._onAdd(state.map, falcor3, updateHover)).then(() => dispatch({ type: "activate-layer", layer }));
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
  let pinHoverComp = import_react48.default.useCallback(
    ({ lngLat }) => {
      if (state.hoverData.pinnable) {
        let marker = new import_maplibre_gl.default.Marker().setLngLat(lngLat).addTo(state.map);
        dispatch({
          type: "pin-hover-comp",
          marker,
          lngLat
        });
      }
    },
    [state.map, state.hoverData.pinnable]
  ), hovering = Boolean(state.hoverData.data.size);
  import_react48.default.useEffect(() => {
    if (!!hovering)
      return state.map.on("click", pinHoverComp), () => state.map.off("click", pinHoverComp);
  }, [state.map, pinHoverComp, hovering]);
  let loadingLayers = import_react48.default.useMemo(() => [...layers, ...state.dynamicLayers].filter(
    (layer) => Boolean(state.layersLoading[layer.id])
  ), [layers, state.dynamicLayers, state.layersLoading]), { HoverComps, ...hoverData } = import_react48.default.useMemo(() => {
    let HoverComps2 = [...state.hoverData.data.values()].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    return { ...state.hoverData, show: Boolean(HoverComps2.length), HoverComps: HoverComps2 };
  }, [state.hoverData]), inactiveLayers = import_react48.default.useMemo(() => [...layers, ...state.dynamicLayers].filter((layer) => !state.initializedLayers.includes(layer.id) || !state.activeLayers.includes(layer)), [
    layers,
    state.dynamicLayers,
    state.initializedLayers,
    state.activeLayers
  ]);
  import_react48.default.useEffect(() => {
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
    }), (needsFetch.length || needsRender.length) && dispatch({
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
  let ref = import_react48.default.useRef(null), size = useSetSize2(ref), AllMapActions = import_react48.default.useMemo(() => ({ ...MapActions, setMapStyle }), [MapActions, setMapStyle]), getRect2 = import_react48.default.useCallback(() => ref.current ? ref.current.getBoundingClientRect() : { width: 0, height: 0 }, []), { width, height } = getRect2();
  return import_react48.default.useEffect(() => {
    state.map && state.map.resize();
  }, [width, height, state.map]), /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)("div", { ref, className: "w-full h-full relative focus:outline-none", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)("div", { id: id2.current, className: "w-full h-full relative" }, void 0, !1, {
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
            ({ HoverComps: HoverComps2, data, id: id3, ...hoverData2 }) => /* @__PURE__ */ (0, import_react49.createElement)(
              PinnedHoverComp,
              {
                ...hoverData2,
                ...size,
                remove: removePinnedHoverComp,
                project: projectLngLat,
                key: id3,
                id: id3
              },
              HoverComps2.map(({ HoverComp: HoverComp2, data: data2, layer }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
                HoverComp2,
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
          Boolean(state.hoverData.data.size) ? /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(HoverCompContainer, { ...hoverData, ...size, project: projectLngLat, children: HoverComps.map(({ HoverComp: HoverComp2, data, layer }, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime42.jsxDEV)(
            HoverComp2,
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
var import_react50 = require("react"), import_jsx_dev_runtime43 = require("react/jsx-dev-runtime"), DefaultHoverComp = ({ data, layer }) => {
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
    return this.sources.forEach(({ id: id2, source }) => {
      mapboxMap.getSource(id2) || mapboxMap.addSource(id2, source);
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
    function click(layerId, { point, features, lngLat }) {
      this.onClick.callback.call(this, layerId, features, lngLat, point);
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
    let callback = (0, import_lodash15.default)(this, ["onHover", "callback"], DefaultCallback).bind(this), HoverComp2 = (0, import_lodash15.default)(this, ["onHover", "HoverComp"], DefaultHoverComp_default), property = (0, import_lodash15.default)(this, ["onHover", "property"], null), filterFunc = (0, import_lodash15.default)(this, ["onHover", "filterFunc"], null), pinnable = (0, import_lodash15.default)(this, ["onHover", "pinnable"], !0), sortOrder = (0, import_lodash15.default)(this, ["onHover", "sortOrder"], 1 / 0), mousemove = (layerId, { point, features, lngLat }) => {
      let hoveredFeatures = this.hoveredFeatures.get(layerId) || /* @__PURE__ */ new Map();
      this.hoveredFeatures.set(layerId, /* @__PURE__ */ new Map());
      let hoverFeatures = (features2) => {
        features2.forEach(({ id: id2, source, sourceLayer }) => {
          if (id2 != null)
            if (hoveredFeatures.has(id2))
              this.hoveredFeatures.get(layerId).set(id2, hoveredFeatures.get(id2)), hoveredFeatures.delete(id2);
            else {
              let value = { id: id2, source, sourceLayer };
              this.hoveredFeatures.get(layerId).set(id2, value), mapboxMap.setFeatureState(value, { hover: !0 });
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
        let filter = filterFunc.call(this, layerId, features, lngLat, point);
        hasValue2(filter) && mapboxMap.queryRenderedFeatures({ layers: [layerId], filter }).forEach((feature) => {
          featuresMap.set(feature.id, feature);
        });
      }
      features.forEach((feature) => {
        featuresMap.set(feature.id, feature);
      }), hoverFeatures([...featuresMap.values()]), hoveredFeatures.forEach((value) => {
        mapboxMap.setFeatureState(value, { hover: !1 });
      });
      let data = callback(layerId, features, lngLat, point);
      hasValue2(data) && updateHover({
        pos: [point.x, point.y],
        type: "hover-layer-move",
        HoverComp: HoverComp2,
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
    let start, current, box, canvasContainer = mapboxMap.getCanvasContainer(), getPos = (e) => {
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
      var minX = Math.min(start.x, current.x), maxX = Math.max(start.x, current.x), minY = Math.min(start.y, current.y), maxY = Math.max(start.y, current.y);
      box.style.transform = `translate( ${minX}px, ${minY}px)`, box.style.width = `${maxX - minX}px`, box.style.height = `${maxY - minY}px`;
    }, mouseup = (e) => {
      finish([start, getPos(e)]);
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
      !(e.shiftKey && e.button === 0) || (document.addEventListener("mousemove", mousemove), document.addEventListener("mouseup", mouseup), document.addEventListener("keydown", keyup), mapboxMap.dragPan.disable(), start = getPos(e));
    };
    this.callbacks.push({
      action: "mousemove",
      callback: mousemove,
      element: canvasContainer
    }), canvasContainer.addEventListener("mousedown", mousedown, !0), mapboxMap.boxZoom.disable(), this.onBoxSelect.selectedValues = [];
  }
  _onRemove(mapboxMap) {
    for (; this.callbacks.length; ) {
      let { action: action5, layerId, callback, element } = this.callbacks.pop();
      element ? element.removeEventListener(action5, callback) : layerId ? this.mapboxMap.off(action5, layerId, callback) : this.mapboxMap.off(action5, callback);
    }
    this.layers.forEach(({ id: id2 }) => {
      this.mapboxMap.removeLayer(id2);
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
    this.isVisible = !this.isVisible, this.layers.forEach(({ id: id2 }) => {
      this.isVisible ? this._setVisibilityVisible(mapboxMap, id2) : this._setVisibilityNone(mapboxMap, id2);
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
  let { falcor: falcor3, falcorCache } = useFalcor(), { layerName, version } = layer, id2 = import_react51.default.useMemo(() => (0, import_lodash16.default)(data, "[0]", null), [data]), attributes = import_react51.default.useMemo(
    () => (0, import_lodash16.default)(layer.source, "metadata", []).map((d) => d.name).filter((d) => !["wkb_geometry", "objectid", "objectid_1"].includes(d)),
    [layer.source]
  );
  import_react51.default.useEffect(() => {
    falcor3.get(
      [
        "nysdot-freight-atlas",
        layerName,
        "byVersion",
        version,
        "byId",
        id2,
        attributes
      ]
    );
  }, [id2, layerName, version, attributes, falcor3]);
  let AttrInfo = import_react51.default.useMemo(() => (0, import_lodash16.default)(falcorCache, [
    "nysdot-freight-atlas",
    layerName,
    "byVersion",
    version,
    "byId",
    id2
  ], {}), [id2, falcorCache, layerName, version]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "bg-white p-4 max-h-64 scrollbar-xs overflow-y-scroll", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime44.jsxDEV)("div", { className: "font-medium pb-1 w-full border-b ", children: layer.source.display_name }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/freight_atlas_shapefile/FreightAtlasLayer.js",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    Object.keys(AttrInfo).length === 0 ? `Fetching Attributes ${id2}` : "",
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
  init(map, falcor3) {
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
  render(map) {
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
          map.setPaintProperty(`${layerName}_v${version}`, sym.paint, isNaN(+sym.value) ? sym.value : +sym.value);
          break;
        default:
          console.log("no type for symbology", sym);
      }
    });
  }
}, FreightAtlasFactory = (options = {}) => new FreightAtlasLayer(options), FreightAtlasLayer_default = FreightAtlasFactory;

// app/modules/data-manager/components/SymbologyControls.js
var import_react52 = __toESM(require("react"));
var import_lodash17 = __toESM(require("lodash.get")), import_jsx_dev_runtime45 = require("react/jsx-dev-runtime"), SymbologyControls = ({ layer, onChange }) => {
  let [symbology, setSymbology] = (0, import_react52.useState)((0, import_lodash17.default)(layer.views, `[${layer.activeView}]metadata.tiles.symbology`, []));
  (0, import_react52.useEffect)(() => {
    onChange(symbology);
  }, [symbology]);
  let mapBoxLayer = import_react52.default.useMemo(
    () => (0, import_lodash17.default)(layer.views, `[${layer.activeView}]metadata.tiles.layers[0]`, {}),
    [layer.views, layer.activeView]
  ), data_table = (0, import_react52.useMemo)(
    () => (0, import_lodash17.default)(layer.views, `[${layer.activeView}].data_table`, ""),
    [layer.views, layer.activeView]
  ), layerName = (0, import_react52.useMemo)(
    () => (0, import_lodash17.default)(data_table.split("."), "[1]", "").slice(0, -6),
    [data_table]
  ), version = (0, import_react52.useMemo)(
    () => (0, import_lodash17.default)(data_table.split("."), "[1]", "").slice(-4),
    [data_table]
  );
  return import_react52.default.useMemo(() => /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)("div", { className: "border-t border-gray-300 h-full w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime45.jsxDEV)(
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
  let lineColorIndex = (0, import_react52.useMemo)(() => getStyleIndex(symbology, paintAttribute), [symbology]), [lineColor, setLineColor] = (0, import_react52.useState)({
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
  let renderControl = import_react52.default.useMemo(() => {
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
var import_react53 = require("react"), import_jsx_dev_runtime46 = require("react/jsx-dev-runtime"), Create = () => /* @__PURE__ */ (0, import_jsx_dev_runtime46.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime46.jsxDEV)("div", { children: " Add New Source" }, void 0, !1, {
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
  }, map_layers = (0, import_react54.useMemo)(() => layers.map((l) => FreightAtlasLayer_default(l)), []);
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
  let { falcor: falcor3 } = useFalcor(), [value, setValue] = (0, import_react54.useState)(""), inputEl = (0, import_react54.useRef)(null);
  (0, import_react54.useEffect)(() => {
    setValue(startValue), inputEl.current.focus();
  }, [startValue]), (0, import_react54.useEffect)(() => {
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
  let { falcor: falcor3 } = useFalcor(), [activeView] = (0, import_react54.useState)(0), [mapData] = (0, import_react54.useState)((0, import_lodash18.default)(views, `[${activeView}].metadata.tiles`, {})), [editing, setEditing] = import_react54.default.useState(null), viewId = import_react54.default.useMemo(() => (0, import_lodash18.default)(views, `[${activeView}].id`, null), [views, activeView]), layer = import_react54.default.useMemo(() => ({
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
var import_react55 = require("react");
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
  let [state, setState] = (0, import_react55.useState)("ny"), [stat, setStat] = (0, import_react55.useState)("total_tmcs"), availableStates = Object.keys(source.statistics).sort(), selectedStats = source.statistics[state], lineData = (0, import_react55.useMemo)(() => {
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
var import_react57 = require("react");

// app/modules/data-manager/data-types/ncei_storm_events/create.js
var import_react56 = __toESM(require("react"));
var import_jsx_dev_runtime49 = require("react/jsx-dev-runtime"), CallServer = async ({ rtPfx, source, etlContextId, userId, newVersion }) => {
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
    `${rtPfx}/staged-geospatial-dataset/loadNCEI`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "details"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), history.push(`/datasources/source/${src.source_id}`);
}, Create2 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react56.default.useState();
  console.log("src", source);
  let rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react56.default.useEffect(() => {
    async function fetchData() {
      let etl = await newETL({ rtPfx, setEtlContextId });
      setEtlContextId(etl);
    }
    fetchData();
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime49.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime49.jsxDEV)(
    "button",
    {
      className: "align-right",
      onClick: () => CallServer({ rtPfx, source, etlContextId, userId: user.id, newVersion }),
      children: "Add New Source"
    },
    void 0,
    !1,
    {
      fileName: "app/modules/data-manager/data-types/ncei_storm_events/create.js",
      lineNumber: 50,
      columnNumber: 13
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events/create.js",
    lineNumber: 49,
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
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react57.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react57.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react57.useState)(void 0);
  (0, import_react57.useEffect)(() => {
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
var import_react59 = require("react");

// app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js
var import_react58 = __toESM(require("react")), import_lodash20 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime51 = require("react/jsx-dev-runtime"), CallServer2 = async ({ rtPfx, source, etlContextId, userId, viewNCEI = {}, viewZTC = {}, viewCousubs = {}, viewTract = {} }, newVersion) => {
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
    `${rtPfx}/staged-geospatial-dataset/enhanceNCEI`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "details_enhanced"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id), url.searchParams.append("ncei_schema", viewNCEI.table_schema), url.searchParams.append("ncei_table", viewNCEI.table_name), url.searchParams.append("tract_schema", viewTract.table_schema), url.searchParams.append("tract_table", viewTract.table_name), url.searchParams.append("ztc_schema", viewZTC.table_schema), url.searchParams.append("ztc_table", viewZTC.table_name), url.searchParams.append("cousub_schema", viewCousubs.table_schema), url.searchParams.append("cousub_table", viewCousubs.table_name);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), history.push(`/datasources/source/${src.source_id}`);
}, RenderVersions2 = ({ value, setValue, versions, type }) => /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime51.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: [
    "Select ",
    type,
    " version: "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 51,
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
          lineNumber: 60,
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
            lineNumber: 63,
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
      lineNumber: 54,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 53,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 52,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
  lineNumber: 50,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
  lineNumber: 49,
  columnNumber: 9
}, this), Create3 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react58.default.useState(), [viewZTC, setViewZTC] = import_react58.default.useState(), [viewCousubs, setViewCousubs] = import_react58.default.useState(), [viewTract, setViewTract] = import_react58.default.useState(), [viewNCEI, setViewNCEI] = import_react58.default.useState(), [versionsZTC, setVersionsZTC] = import_react58.default.useState({ sources: [], views: [] }), [versionsCousubs, setVersionsCousubs] = import_react58.default.useState({ sources: [], views: [] }), [versionsTract, setVersionsTract] = import_react58.default.useState({ sources: [], views: [] }), [versionsNCEI, setVersionsNCEI] = import_react58.default.useState({ sources: [], views: [] }), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react58.default.useEffect(() => {
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
            newVersion
          }
        ),
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
        lineNumber: 114,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/ncei_storm_events_enhanced/create.js",
    lineNumber: 109,
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
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react59.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react59.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react59.useState)(void 0);
  (0, import_react59.useEffect)(() => {
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
var import_react61 = require("react");

// app/modules/data-manager/data-types/zone_to_county/create.js
var import_react60 = __toESM(require("react"));
var import_jsx_dev_runtime53 = require("react/jsx-dev-runtime"), CallServer3 = async ({ rtPfx, source, etlContextId, userId, newVersion }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, "zone_to_county");
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/staged-geospatial-dataset/csvUploadAction`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "zone_to_county"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), history.push(`/datasources/source/${src.source_id}`);
}, Create4 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react60.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react60.default.useEffect(() => {
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
    newVersion
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/zone_to_county/create.js",
    lineNumber: 44,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/zone_to_county/create.js",
    lineNumber: 43,
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
var import_react63 = require("react"), import_lodash22 = require("lodash.get");

// app/modules/data-manager/data-types/tiger_2017/create.js
var import_react62 = __toESM(require("react"));
var import_jsx_dev_runtime55 = require("react/jsx-dev-runtime"), CallServer4 = async ({ rtPfx, source, etlContextId, userId, tigerTable, newVersion }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, `tl_${tigerTable.toLowerCase()}`);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/staged-geospatial-dataset/tigerDownloadAction`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table", tigerTable), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body);
}, RenderTigerTables = ({ value, setValue, domain }) => /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime55.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: "Select Type: " }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 34,
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
          lineNumber: 43,
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
            lineNumber: 46,
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
      lineNumber: 37,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 36,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 35,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
  lineNumber: 33,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
  lineNumber: 32,
  columnNumber: 9
}, this), Create5 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react62.default.useState(), [tigerTable, setTigerTable] = import_react62.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return console.log("comes here"), import_react62.default.useEffect(() => {
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
          newVersion
        }),
        disabled: !tigerTable,
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
        lineNumber: 79,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/tiger_2017/create.js",
    lineNumber: 77,
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
var import_react65 = require("react");

// app/modules/data-manager/data-types/open_fema_data/create.js
var import_react64 = __toESM(require("react"));
var import_jsx_dev_runtime57 = require("react/jsx-dev-runtime"), datasets = [
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
    lineNumber: 48,
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
          lineNumber: 57,
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
            lineNumber: 60,
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
      lineNumber: 51,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 50,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 49,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
  lineNumber: 47,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
  lineNumber: 46,
  columnNumber: 9
}, this), CallServer5 = async ({ rtPfx, source, etlContextId, userId, table, newVersion }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/staged-geospatial-dataset/openFemaDataLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), history.push(`/datasources/source/${src.source_id}`);
}, Create6 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react64.default.useState(), [table, setTable] = import_react64.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react64.default.useEffect(() => {
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
      newVersion
    }), children: " Add New Source" }, void 0, !1, {
      fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
      lineNumber: 115,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/open_fema_data/create.js",
    lineNumber: 113,
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
var import_react67 = require("react");

// app/modules/data-manager/data-types/usda/create.js
var import_react66 = __toESM(require("react"));
var import_jsx_dev_runtime59 = require("react/jsx-dev-runtime"), CallServer6 = async ({ rtPfx, source, etlContextId, userId, table, newVersion }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/staged-geospatial-dataset/usdaLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), history.push(`/datasources/source/${src.source_id}`);
}, Create7 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react66.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react66.default.useEffect(() => {
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
    newVersion
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/usda/create.js",
    lineNumber: 44,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/usda/create.js",
    lineNumber: 43,
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
var import_react69 = require("react");

// app/modules/data-manager/data-types/sba/create.js
var import_react68 = __toESM(require("react"));
var import_jsx_dev_runtime61 = require("react/jsx-dev-runtime"), CallServer7 = async ({ rtPfx, source, etlContextId, userId, table, newVersion }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/staged-geospatial-dataset/sbaLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), history.push(`/datasources/source/${src.source_id}`);
}, Create8 = ({ source, user, newVersion }) => {
  console.log("comes here");
  let [etlContextId, setEtlContextId] = import_react68.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react68.default.useEffect(() => {
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
    newVersion
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/sba/create.js",
    lineNumber: 45,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/sba/create.js",
    lineNumber: 44,
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
var import_react71 = require("react");

// app/modules/data-manager/data-types/nri/create.js
var import_react70 = __toESM(require("react"));
var import_jsx_dev_runtime63 = require("react/jsx-dev-runtime"), CallServer8 = async ({ rtPfx, source, etlContextId, userId, table, newVersion }) => {
  let { name: sourceName, display_name: sourceDisplayName } = source, src = source.source_id ? source : await createNewDataSource(rtPfx, source, table);
  console.log("src?", src);
  let view = await submitViewMeta({ rtPfx, etlContextId, userId, sourceName, src, newVersion }), url = new URL(
    `${rtPfx}/staged-geospatial-dataset/nriLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", table), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", stgLyrDataRes.body), history.push(`/datasources/source/${src.source_id}`);
}, Create9 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react70.default.useState(), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react70.default.useEffect(() => {
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
    newVersion
  }), children: " Add New Source" }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/nri/create.js",
    lineNumber: 43,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/nri/create.js",
    lineNumber: 42,
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
var import_react73 = require("react");

// app/modules/data-manager/data-types/per_basis_swd/create.js
var import_react72 = __toESM(require("react")), import_lodash23 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime65 = require("react/jsx-dev-runtime"), CallServer9 = async ({ rtPfx, source, etlContextId, userId, viewNCEI = {}, viewNRI = {} }, newVersion) => {
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
    `${rtPfx}/staged-geospatial-dataset/pbSWDLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "per_basis_swd"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id), url.searchParams.append("ncei_schema", viewNCEI.table_schema), url.searchParams.append("ncei_table", viewNCEI.table_name), url.searchParams.append("nri_schema", viewNRI.table_schema), url.searchParams.append("nri_table", viewNRI.table_name);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), history.push(`/datasources/source/${src.source_id}`);
}, RenderVersions4 = ({ value, setValue, versions, type }) => /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime65.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: [
    "Select ",
    type,
    " version: "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 44,
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
          lineNumber: 53,
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
            lineNumber: 56,
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
      lineNumber: 47,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 46,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 45,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
  lineNumber: 43,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
  lineNumber: 42,
  columnNumber: 9
}, this), Create10 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react72.default.useState(), [viewNCEI, setViewNCEI] = import_react72.default.useState(), [viewNRI, setViewNRI] = import_react72.default.useState(), [versionsNCEI, setVersionsNCEI] = import_react72.default.useState({ sources: [], views: [] }), [versionsNRI, setVersionsNRI] = import_react72.default.useState({ sources: [], views: [] }), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react72.default.useEffect(() => {
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
            newVersion
          }
        ),
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
        lineNumber: 99,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/per_basis_swd/create.js",
    lineNumber: 96,
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
), fnum = (number) => parseInt(number).toLocaleString(), Stats4 = ({ source, views }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react73.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react73.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react73.useState)(void 0);
  (0, import_react73.useEffect)(() => {
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
var import_react75 = require("react");

// app/modules/data-manager/data-types/hlr/create.js
var import_react74 = __toESM(require("react"));
var import_lodash25 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime67 = require("react/jsx-dev-runtime"), CallServer10 = async ({ rtPfx, source, etlContextId, userId, newVersion, viewPB = {}, viewNRI = {}, viewState = {}, viewCounty = {}, viewNCEI = {} }) => {
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
    `${rtPfx}/staged-geospatial-dataset/hlrLoader`
  );
  url.searchParams.append("etl_context_id", etlContextId), url.searchParams.append("table_name", "hlr"), url.searchParams.append("src_id", src.source_id), url.searchParams.append("view_id", view.view_id), url.searchParams.append("pb_schema", viewPB.table_schema), url.searchParams.append("pb_table", viewPB.table_name), url.searchParams.append("nri_schema", viewNRI.table_schema), url.searchParams.append("nri_table", viewNRI.table_name), url.searchParams.append("state_schema", viewState.table_schema), url.searchParams.append("state_table", viewState.table_name), url.searchParams.append("county_schema", viewCounty.table_schema), url.searchParams.append("county_table", viewCounty.table_name), url.searchParams.append("ncei_schema", viewNCEI.table_schema), url.searchParams.append("ncei_table", viewNCEI.table_name);
  let stgLyrDataRes = await fetch(url);
  await checkApiResponse(stgLyrDataRes), console.log("res", await stgLyrDataRes.json()), history.push(`/datasources/source/${src.source_id}`);
}, RenderVersions6 = ({ value, setValue, versions, type }) => /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime67.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: [
    "Select ",
    type,
    " version: "
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 53,
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
          lineNumber: 62,
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
            lineNumber: 65,
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
      lineNumber: 56,
      columnNumber: 25
    },
    this
  ) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 55,
    columnNumber: 21
  }, this) }, void 0, !1, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 54,
    columnNumber: 17
  }, this)
] }, void 0, !0, {
  fileName: "app/modules/data-manager/data-types/hlr/create.js",
  lineNumber: 52,
  columnNumber: 13
}, this) }, void 0, !1, {
  fileName: "app/modules/data-manager/data-types/hlr/create.js",
  lineNumber: 51,
  columnNumber: 9
}, this), Create11 = ({ source, user, newVersion }) => {
  let [etlContextId, setEtlContextId] = import_react74.default.useState(), [viewPB, setViewPB] = import_react74.default.useState(), [viewNRI, setViewNRI] = import_react74.default.useState(), [viewState, setViewState] = import_react74.default.useState(), [viewCounty, setViewCounty] = import_react74.default.useState(), [viewNCEI, setViewNCEI] = import_react74.default.useState(), [versionsPB, setVersionsPB] = import_react74.default.useState({ sources: [], views: [] }), [versionsNRI, setVersionsNRI] = import_react74.default.useState({ sources: [], views: [] }), [versionsState, setVersionsState] = import_react74.default.useState({ sources: [], views: [] }), [versionsCounty, setVersionsCounty] = import_react74.default.useState({ sources: [], views: [] }), [versionsNCEI, setVersionsNCEI] = import_react74.default.useState({ sources: [], views: [] }), rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;
  return import_react74.default.useEffect(() => {
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
            viewNCEI: versionsNCEI.views.find((v) => v.view_id == viewNCEI)
          }
        ),
        children: "Add New Source"
      },
      void 0,
      !1,
      {
        fileName: "app/modules/data-manager/data-types/hlr/create.js",
        lineNumber: 120,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/modules/data-manager/data-types/hlr/create.js",
    lineNumber: 114,
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
), fnum2 = (number) => parseInt(number).toLocaleString(), Stats5 = ({ source, views }) => {
  let { falcor: falcor3, falcorCache } = useFalcor(), [activeView, setActiveView] = (0, import_react75.useState)(views[0].view_id), [compareView, setCompareView] = (0, import_react75.useState)(views[0].view_id), [compareMode, setCompareMode] = (0, import_react75.useState)(void 0);
  (0, import_react75.useEffect)(() => {
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

// app/routes/__dama/source/$sourceId.($page).js
var import_react77 = require("@remix-run/react"), import_lodash27 = __toESM(require("lodash.get")), import_jsx_dev_runtime69 = require("react/jsx-dev-runtime");
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
function Dama() {
  let { views, source, meta: meta2 } = (0, import_react77.useLoaderData)(), { sourceId, page: page2 } = (0, import_react77.useParams)(), [pages, setPages] = (0, import_react76.useState)(default_default), user = { email: "test@test.com", id: 1 };
  import_react76.default.useEffect(() => {
    if (DataTypes[source.type]) {
      let typePages = Object.keys(DataTypes[source.type]).reduce((a, c) => (DataTypes[source.type][c].path && (a[c] = DataTypes[source.type][c]), a), {}), allPages = { ...default_default, ...typePages };
      setPages(allPages);
    }
  }, [source.type]);
  let Page = (0, import_react76.useMemo)(() => page2 ? (0, import_lodash27.default)(pages, `[${page2}].component`, default_default.overview.component) : default_default.overview.component, [page2, pages]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)("div", { className: "text-xl font-medium overflow-hidden p-2 border-b ", children: source.display_name || source.name }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page).js",
      lineNumber: 96,
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
        fileName: "app/routes/__dama/source/$sourceId.($page).js",
        lineNumber: 99,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)("div", { className: "w-full p-4 bg-white shadow mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime69.jsxDEV)(Page, { source, views, user, meta: meta2 }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page).js",
      lineNumber: 110,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/source/$sourceId.($page).js",
      lineNumber: 109,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/$sourceId.($page).js",
    lineNumber: 95,
    columnNumber: 7
  }, this);
}

// app/routes/__dama/source/delete/$sourceId.js
var sourceId_exports = {};
__export(sourceId_exports, {
  default: () => Popup,
  loader: () => loader5
});
var import_react78 = require("react");
var import_react79 = require("@remix-run/react"), import_lodash28 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime70 = require("react/jsx-dev-runtime");
async function loader5({ params, request }) {
  let { sourceId } = params, data = await falcor2.get(
    ["dama", pgEnv, "sources", "byId", sourceId, "dependents"],
    ["dama", pgEnv, "sources", "byId", sourceId, "attributes", ["display_name"]]
  );
  return {
    sourceId,
    dependents: (0, import_lodash28.default)(data, ["json", "dama", pgEnv, "sources", "byId", sourceId, "dependents"], []),
    display_name: (0, import_lodash28.default)(data, ["json", "dama", pgEnv, "sources", "byId", sourceId, "attributes", "display_name"], "")
  };
}
var DeleteButton2 = ({ text, sourceId }) => /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)(
  "button",
  {
    className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
    onClick: () => deleteSource(`${DAMA_HOST}/dama-admin/${pgEnv}`, sourceId),
    children: text
  },
  void 0,
  !1,
  {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 24,
    columnNumber: 5
  },
  this
), LoadDependentViews = (data, sourceId) => /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)(import_jsx_dev_runtime70.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("label", { children: "The Source has following dependents:" }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 34,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)(DeleteButton2, { text: "Delete anyway", sourceId }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 36,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 33,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "p-4 bg-red-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "p-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: ["view_id", "created", "updated"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: key }, key, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 44,
      columnNumber: 29
    }, this)) }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 40,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: data.map(
      (view, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: ["view_id", "_created_timestamp", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: view[key] }, void 0, !1, {
        fileName: "app/routes/__dama/source/delete/$sourceId.js",
        lineNumber: 61,
        columnNumber: 53
      }, this)) }, i, !1, {
        fileName: "app/routes/__dama/source/delete/$sourceId.js",
        lineNumber: 57,
        columnNumber: 37
      }, this)
    ) }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 51,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 50,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 39,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/source/delete/$sourceId.js",
  lineNumber: 32,
  columnNumber: 5
}, this), LoadConfirmDelete = (sourceId) => /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("label", { children: "No dependents found." }, void 0, !1, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 78,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)(DeleteButton2, { text: "Confirm Delete", sourceId }, void 0, !1, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 80,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/source/delete/$sourceId.js",
  lineNumber: 77,
  columnNumber: 9
}, this);
function Popup() {
  let { sourceId, dependents, display_name } = (0, import_react79.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "w-full p-4 bg-white my-1 block border shadow", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("div", { className: "pb-4 font-bold", children: [
      "Delete ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime70.jsxDEV)("i", { children: display_name }, void 0, !1, {
        fileName: "app/routes/__dama/source/delete/$sourceId.js",
        lineNumber: 88,
        columnNumber: 54
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/source/delete/$sourceId.js",
      lineNumber: 88,
      columnNumber: 13
    }, this),
    dependents.length ? LoadDependentViews(dependents, sourceId) : LoadConfirmDelete(sourceId)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/delete/$sourceId.js",
    lineNumber: 87,
    columnNumber: 9
  }, this);
}

// app/routes/__dama/view/delete/$viewId.js
var viewId_exports = {};
__export(viewId_exports, {
  default: () => Popup2,
  loader: () => loader6
});
var import_react80 = require("react");
var import_react81 = require("@remix-run/react"), import_lodash29 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime71 = require("react/jsx-dev-runtime");
async function loader6({ params, request }) {
  let { viewId } = params, data = await falcor2.get(
    ["dama", pgEnv, "views", "byId", viewId, "dependents"]
  );
  return {
    viewId,
    dependents: (0, import_lodash29.default)(data, ["json", "dama", pgEnv, "views", "byId", viewId, "dependents"], [])
  };
}
var DeleteButton3 = ({ text, viewId }) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(
  "button",
  {
    className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
    onClick: () => deleteView(`${DAMA_HOST}/dama-admin/${pgEnv}`, viewId),
    children: text
  },
  void 0,
  !1,
  {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 22,
    columnNumber: 5
  },
  this
), LoadDependentViews2 = (data, viewId) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(import_jsx_dev_runtime71.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("label", { children: "The View has following dependents:" }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 32,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(DeleteButton3, { text: "Delete anyway", viewId }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 34,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 31,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "p-4 bg-red-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "p-4 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b-2", children: ["view_id", "created", "updated"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("dt", { className: "text-sm font-medium text-gray-600", children: key }, key, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 42,
      columnNumber: 29
    }, this)) }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 38,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0 overflow-auto h-[700px]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: data.map(
      (view, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: ["view_id", "_created_timestamp", "_modified_timestamp"].map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 ", children: view[key] }, void 0, !1, {
        fileName: "app/routes/__dama/view/delete/$viewId.js",
        lineNumber: 59,
        columnNumber: 53
      }, this)) }, i, !1, {
        fileName: "app/routes/__dama/view/delete/$viewId.js",
        lineNumber: 55,
        columnNumber: 37
      }, this)
    ) }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 49,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 48,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 37,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/view/delete/$viewId.js",
  lineNumber: 30,
  columnNumber: 5
}, this), LoadConfirmDelete2 = (viewId) => /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "pb-4 flex justify-between", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("label", { children: "No dependents found." }, void 0, !1, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 76,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)(DeleteButton3, { text: "Confirm Delete", viewId }, void 0, !1, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 78,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dama/view/delete/$viewId.js",
  lineNumber: 75,
  columnNumber: 9
}, this);
function Popup2() {
  let { viewId, dependents } = (0, import_react81.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "w-full p-4 bg-white my-1 block border shadow", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("div", { className: "pb-4 font-bold", children: [
      "Delete ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime71.jsxDEV)("i", { children: viewId }, void 0, !1, {
        fileName: "app/routes/__dama/view/delete/$viewId.js",
        lineNumber: 86,
        columnNumber: 54
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/view/delete/$viewId.js",
      lineNumber: 86,
      columnNumber: 13
    }, this),
    dependents.length ? LoadDependentViews2(dependents, viewId) : LoadConfirmDelete2(viewId)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/view/delete/$viewId.js",
    lineNumber: 85,
    columnNumber: 9
  }, this);
}

// app/routes/__dama/source/create.js
var create_exports = {};
__export(create_exports, {
  default: () => sourceCreate
});
var import_react82 = require("react");
var import_lodash30 = __toESM(require("lodash.get"));
var import_jsx_dev_runtime72 = require("react/jsx-dev-runtime");
function sourceCreate() {
  let [source, setSource] = (0, import_react82.useState)(
    Object.keys(SourceAttributes).filter((d) => !["source_id", "metadata", "statistics"].includes(d)).reduce((out, current) => (out[current] = "", out), {})
  ), CreateComp = (0, import_react82.useMemo)(
    () => (0, import_lodash30.default)(DataTypes, `[${source.type}].sourceCreate.component`, () => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", {}, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 27,
      columnNumber: 69
    }, this)),
    [DataTypes, source.type]
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "fixed right-0 top-[170px] w-64 ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("pre", { children: JSON.stringify(source, null, 3) }, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 35,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 34,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "p-4 font-medium", children: " Create New Source " }, void 0, !1, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: [
        Object.keys(SourceAttributes).filter((d) => !["source_id", "metadata", "description", "type", "statistics", "category", "update_interval", "categories"].includes(d)).map((attr, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: attr }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 50,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(
            input_default,
            {
              className: "w-full p-2 flex-1 px-2 shadow bg-grey-50 focus:bg-blue-100  border-gray-300 ",
              value: (0, import_lodash30.default)(source, attr, ""),
              onChange: (e) => {
                setSource({ ...source, [attr]: e });
              }
            },
            void 0,
            !1,
            {
              fileName: "app/routes/__dama/source/create.js",
              lineNumber: 54,
              columnNumber: 27
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 53,
            columnNumber: 25
          }, this) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 51,
            columnNumber: 21
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 49,
          columnNumber: 19
        }, this) }, i, !1, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 48,
          columnNumber: 17
        }, this)),
        /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "flex justify-between group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500 py-5", children: "Data Type" }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 73,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("div", { className: "pt-3 pr-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(
            "select",
            {
              className: "w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300",
              value: (0, import_lodash30.default)(source, "type", ""),
              onChange: (e) => {
                setSource({ ...source, type: e.target.value });
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("option", { value: "", disabled: !0, children: "Select your option" }, void 0, !1, {
                  fileName: "app/routes/__dama/source/create.js",
                  lineNumber: 84,
                  columnNumber: 25
                }, this),
                Object.keys(DataTypes).filter((k) => DataTypes[k].sourceCreate).map((k) => /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)("option", { value: k, className: "p-2", children: k }, k, !1, {
                  fileName: "app/routes/__dama/source/create.js",
                  lineNumber: 87,
                  columnNumber: 37
                }, this))
              ]
            },
            void 0,
            !0,
            {
              fileName: "app/routes/__dama/source/create.js",
              lineNumber: 77,
              columnNumber: 21
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 76,
            columnNumber: 19
          }, this) }, void 0, !1, {
            fileName: "app/routes/__dama/source/create.js",
            lineNumber: 74,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 72,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/__dama/source/create.js",
          lineNumber: 71,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__dama/source/create.js",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime72.jsxDEV)(CreateComp, { source }, void 0, !1, {
        fileName: "app/routes/__dama/source/create.js",
        lineNumber: 97,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__dama/source/create.js",
      lineNumber: 41,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/source/create.js",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}

// app/routes/__dama/index.(cat).js
var index_cat_exports = {};
__export(index_cat_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => Dama2,
  loader: () => loader7
});
var import_react83 = require("react");
var import_react84 = require("@remix-run/react"), import_lodash31 = __toESM(require("lodash.get")), import_jsx_dev_runtime73 = require("react/jsx-dev-runtime");
async function loader7({ request }) {
  let lengthPath = ["dama", pgEnv, "sources", "length"], resp = await falcor2.get(lengthPath), sourceData = await falcor2.get([
    "dama",
    pgEnv,
    "sources",
    "byIndex",
    { from: 0, to: (0, import_lodash31.default)(resp.json, lengthPath, 0) - 1 },
    "attributes",
    Object.values(SourceAttributes)
  ]), falcorCache = falcor2.getCache();
  return Object.values((0, import_lodash31.default)(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {})).map((v) => getAttributes((0, import_lodash31.default)(falcorCache, v.value, { attributes: {} }).attributes));
}
function Dama2() {
  let [layerSearch, setLayerSearch] = (0, import_react83.useState)(""), sources = (0, import_react84.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "py-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(
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
        fileName: "app/routes/__dama/index.(cat).js",
        lineNumber: 32,
        columnNumber: 21
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 31,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 30,
      columnNumber: 13
    }, this),
    sources.filter((source) => {
      let searchTerm = source.name + " " + (0, import_lodash31.default)(source, "categories[0]", []).join(" ");
      return !layerSearch.length > 2 || searchTerm.toLowerCase().includes(layerSearch.toLowerCase());
    }).map((s, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(SourceThumb, { source: s }, i, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 46,
      columnNumber: 36
    }, this))
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 29,
    columnNumber: 9
  }, this);
}
var SourceThumb = ({ source }) => /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { className: "w-full p-4 bg-white my-1 hover:bg-blue-50 block border shadow flex", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(import_react84.Link, { to: `/source/${source.source_id}`, className: "text-xl font-medium w-full block", children: /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("span", { children: source.name }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 56,
    columnNumber: 17
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 55,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { children: ((0, import_lodash31.default)(source, "categories", []) || []).map((cat) => cat.map((s, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(
    import_react84.Link,
    {
      to: `/cat/${i > 0 ? cat[i - 1] + "/" : ""}${s}`,
      className: "text-xs p-1 px-2 bg-blue-200 text-blue-600 mr-2",
      children: s
    },
    i,
    !1,
    {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 61,
      columnNumber: 25
    },
    this
  ))) }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 58,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(import_react84.Link, { to: `/source/${source.source_id}`, className: "py-2 block", children: source.description }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 66,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(import_react84.Link, { to: `/source/${source.source_id}`, className: "py-2 block", children: source._created_timestamp }, void 0, !1, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 69,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)(
    import_react84.Link,
    {
      className: "bg-red-50 hover:bg-red-400 hover:text-white p-2",
      to: `/source/delete/${source.source_id}`,
      children: " delete "
    },
    void 0,
    !1,
    {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 72,
      columnNumber: 13
    },
    this
  )
] }, void 0, !0, {
  fileName: "app/routes/__dama/index.(cat).js",
  lineNumber: 54,
  columnNumber: 9
}, this);
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("h1", { children: "Error" }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 81,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("p", { children: error.message }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 82,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("p", { children: "The stack trace is:" }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 83,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime73.jsxDEV)("pre", { children: error.stack }, void 0, !1, {
      fileName: "app/routes/__dama/index.(cat).js",
      lineNumber: 84,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__dama/index.(cat).js",
    lineNumber: 80,
    columnNumber: 9
  }, this);
}

// app/routes/__dms.jsx
var dms_exports = {};
__export(dms_exports, {
  default: () => Index3,
  loader: () => loader8
});
var import_react85 = require("@remix-run/react");
var import_jsx_dev_runtime74 = require("react/jsx-dev-runtime");
async function loader8({ request }) {
  return await checkAuth(request);
}
function Index3() {
  let user = (0, import_react85.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)("div", { className: "bg-gray-100 px-4 text-gray-500 min-h-screen", children: /* @__PURE__ */ (0, import_jsx_dev_runtime74.jsxDEV)(import_react85.Outlet, {}, void 0, !1, {
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
var import_react87 = require("@remix-run/react"), import_react88 = require("react");

// app/modules/dms/theme/index.js
var import_react86 = __toESM(require("react"));

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
var ThemeContext2 = import_react86.default.createContext(default_theme_default), useTheme2 = () => (0, import_react86.useContext)(ThemeContext2), theme_default2 = ThemeContext2;

// app/modules/dms/components/table.js
var import_lodash32 = __toESM(require("lodash.get")), import_jsx_dev_runtime75 = require("react/jsx-dev-runtime");
function replaceVars(url, data) {
  var regex = /:(\w+)/g;
  return url.replace(regex, function(match, p1) {
    return data[p1] || ":" + p1;
  });
}
var ColumnTypes = {
  data: function({ data, column, className, key }) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("td", { className, children: [
      " ",
      (0, import_lodash32.default)(data, [column.path], "").toString(),
      " "
    ] }, key, !0, {
      fileName: "app/modules/dms/components/table.js",
      lineNumber: 15,
      columnNumber: 10
    }, this);
  },
  date: function({ data, column, className, key }) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("td", { className, children: [
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
    return /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("td", { className, children: /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)(import_react87.Link, { to: replaceVars(column.to, data), children: replaceVars(column.text, data) }, void 0, !1, {
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
  let Column = (0, import_lodash32.default)(ColumnTypes, [column.type], ColumnTypes.data);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)(Column, { data, column, className }, void 0, !1, {
    fileName: "app/modules/dms/components/table.js",
    lineNumber: 33,
    columnNumber: 9
  }, this);
}
function Table12({ dataItems = [], attributes = {}, options = {} }) {
  let theme = useTheme2(), { columns = [] } = options;
  return columns.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("div", { children: " No columns specified. " }, void 0, !1, {
    fileName: "app/modules/dms/components/table.js",
    lineNumber: 40,
    columnNumber: 10
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("div", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("table", { className: `${theme.table.table}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("thead", { className: `${theme.table.thead}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("tr", { children: columns.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("th", { className: `${theme.table.th}`, children: col.name }, i, !1, {
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
    /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("tbody", { className: `${theme.table.tbody}`, children: dataItems.map(
      (d) => /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)("tr", { children: columns.map((col, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime75.jsxDEV)(
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
var import_react89 = require("@remix-run/react");
var import_jsx_dev_runtime76 = require("react/jsx-dev-runtime"), BlogLayout = ({ children, user }) => /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { className: "flex p-2 text-gray-800 border-b w-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)(import_react89.NavLink, { to: "/blog", className: "p-4", children: "Home" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)(import_react89.NavLink, { to: "/blog/admin", className: "p-4", children: "Admin" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/blog.config.js",
      lineNumber: 9,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { className: "flex flex-1 justify-end ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)(AuthMenu_default, { user }, void 0, !1, {
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { children }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 16,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dms/blog/blog.config.js",
  lineNumber: 6,
  columnNumber: 3
}, this), BlogAdmin = (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)(import_react89.Link, { to: "/blog/new", className: "p-4 border", children: " New Post " }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 23,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dms/blog/blog.config.js",
    lineNumber: 22,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)(Table12, { ...props }, void 0, !1, {
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
      type: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime76.jsxDEV)("div", { children: "Test Page" }, void 0, !1, {
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
var import_react90 = require("@remix-run/react");
var import_jsx_dev_runtime77 = require("react/jsx-dev-runtime"), pageSection = {
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
}, SiteLayout = ({ children, user }) => /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { className: "flex p-2 text-gray-800 border-b w-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)(import_react90.NavLink, { to: "/site", className: "p-4", children: "Home" }, void 0, !1, {
      fileName: "app/routes/__dms/site/site.config.js",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { className: "flex flex-1 justify-end ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)(AuthMenu_default, { user }, void 0, !1, {
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { children }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 105,
    columnNumber: 5
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/__dms/site/site.config.js",
  lineNumber: 96,
  columnNumber: 3
}, this), SiteAdmin = (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { className: "w-full p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)(import_react90.Link, { to: "/site/new", className: "p-2 bg-blue-500 shadow text-gray-100", children: " New Page " }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 112,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__dms/site/site.config.js",
    lineNumber: 111,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)(Table12, { ...props }, void 0, !1, {
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
      type: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime77.jsxDEV)("div", { children: "Test Page" }, void 0, !1, {
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
  action: () => action3,
  default: () => DMS,
  loader: () => loader9
});
var import_react127 = require("react"), import_react128 = require("@remix-run/react");

// app/modules/dms/wrappers/edit.js
var import_react94 = __toESM(require("react")), import_react95 = require("@remix-run/react");

// app/modules/dms/data-types/text.js
var import_react91 = require("react"), import_jsx_dev_runtime78 = require("react/jsx-dev-runtime"), Edit3 = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime78.jsxDEV)(
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
), View = ({ value }) => value ? /* @__PURE__ */ (0, import_jsx_dev_runtime78.jsxDEV)("div", { children: value }, void 0, !1, {
  fileName: "app/modules/dms/data-types/text.js",
  lineNumber: 16,
  columnNumber: 9
}, this) : !1, text_default = {
  EditComp: Edit3,
  ViewComp: View
};

// app/modules/dms/data-types/textarea.js
var import_react92 = require("react");
var import_lodash33 = __toESM(require("lodash.get")), import_jsx_dev_runtime79 = require("react/jsx-dev-runtime"), Edit4 = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)(
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
  return value ? /* @__PURE__ */ (0, import_jsx_dev_runtime79.jsxDEV)("pre", { className: (0, import_lodash33.default)(theme, "textarea.viewWrapper", ""), children: JSON.stringify(value, null, 3) }, void 0, !1, {
    fileName: "app/modules/dms/data-types/textarea.js",
    lineNumber: 18,
    columnNumber: 9
  }, this) : !1;
}, textarea_default2 = {
  EditComp: Edit4,
  ViewComp: View2
};

// app/modules/dms/data-types/boolean.js
var import_react93 = require("react"), import_jsx_dev_runtime80 = require("react/jsx-dev-runtime"), Edit5 = ({ value, onChange }) => /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)(
  "select",
  {
    value,
    onChange: (e) => onChange(e.target.value),
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("option", { value: !0, children: "True" }, void 0, !1, {
        fileName: "app/modules/dms/data-types/boolean.js",
        lineNumber: 9,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("option", { value: !1, children: "False" }, void 0, !1, {
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
), View3 = ({ value }) => value ? /* @__PURE__ */ (0, import_jsx_dev_runtime80.jsxDEV)("div", { children: value }, void 0, !1, {
  fileName: "app/modules/dms/data-types/boolean.js",
  lineNumber: 19,
  columnNumber: 9
}, this) : !1, boolean_default = {
  EditComp: Edit5,
  ViewComp: View3
};

// app/modules/dms/data-types/index.js
var import_lodash34 = __toESM(require("lodash.get")), DmsDataTypes = {
  text: text_default,
  datetime: text_default,
  textarea: textarea_default2,
  boolean: boolean_default,
  default: text_default
};
function registerDataType(name, dataType) {
  DmsDataTypes[name] = dataType;
}
function getViewComp(type) {
  return (0, import_lodash34.default)(DmsDataTypes, `[${type}]`, DmsDataTypes.default).ViewComp;
}
function getEditComp(type) {
  return (0, import_lodash34.default)(DmsDataTypes, `[${type}]`, DmsDataTypes.default).EditComp;
}

// app/modules/dms/wrappers/_utils.js
var import_lodash35 = __toESM(require("lodash.get"));
function getAttributes5(format, options, mode = "") {
  let attributeFilter = (0, import_lodash35.default)(options, "attributes", []), attributes = format.attributes.filter((attr) => attributeFilter.length === 0 || attributeFilter.includes(attr.key)).filter(
    (attr) => mode !== "edit" || typeof attr.editable > "u" || !!attr.editable
  ).reduce((out, attr) => (out[attr.key] = attr, out), {}), attributeKeys = Object.keys(attributes);
  return Object.keys(attributes).filter((attributeKey) => attributeKeys.includes(attributeKey)).map((attributeKey) => {
    attributes[attributeKey].ViewComp = getViewComp(
      (0, import_lodash35.default)(attributes, `[${attributeKey}].type`, "default")
    ), attributes[attributeKey].EditComp = getEditComp(
      (0, import_lodash35.default)(attributes, `[${attributeKey}].type`, "default")
    );
  }), attributes;
}

// app/modules/dms/wrappers/edit.js
var import_lodash36 = require("lodash.get"), import_jsx_dev_runtime81 = require("react/jsx-dev-runtime");
function EditWrapper({ Component, format, options, params, ...props }) {
  let attributes = getAttributes5(format, options, "edit"), { "*": path } = (0, import_react95.useParams)(), pathParams = getParams(params, path), { data, user } = (0, import_react95.useLoaderData)(), status = (0, import_react95.useActionData)(), [item, setItem] = import_react94.default.useState(
    data.filter((d) => filterParams(d, pathParams))[0] || {}
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)("div", { className: "text-xs", children: "Edit Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/edit.js",
      lineNumber: 26,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)("form", { method: "post", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)(
        Component,
        {
          ...props,
          format,
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
      /* @__PURE__ */ (0, import_jsx_dev_runtime81.jsxDEV)("input", { type: "hidden", name: "data", value: JSON.stringify(item) }, void 0, !1, {
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
var import_react96 = require("react"), import_react97 = require("@remix-run/react");
var import_jsx_dev_runtime82 = require("react/jsx-dev-runtime");
function ListWrapper({ Component, format, options, ...props }) {
  let attributes = getAttributes5(format, options), { data, user } = (0, import_react97.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)("div", { className: "text-xs", children: "List Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/list.js",
      lineNumber: 28,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime82.jsxDEV)(
      Component,
      {
        ...props,
        format,
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
var import_react98 = require("react"), import_react99 = require("@remix-run/react");
var import_jsx_dev_runtime83 = require("react/jsx-dev-runtime");
function ViewWrapper({ Component, format, options, ...props }) {
  let attributes = getAttributes5(format, options), { data, user } = (0, import_react99.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)("div", { children: "View Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/view.js",
      lineNumber: 12,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime83.jsxDEV)(
      Component,
      {
        ...props,
        format,
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
var import_react100 = require("react"), import_react101 = require("@remix-run/react");
var import_jsx_dev_runtime84 = require("react/jsx-dev-runtime");
function ErrorWrapper({ Component, format, options, ...props }) {
  let attributes = getAttributes5(format, options);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { className: "border border-green-300", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)("div", { className: "text-xs", children: "Error Wrapper" }, void 0, !1, {
      fileName: "app/modules/dms/wrappers/error.js",
      lineNumber: 27,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime84.jsxDEV)(
      Component,
      {
        ...props,
        format,
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
var import_react102 = require("react"), import_jsx_dev_runtime85 = require("react/jsx-dev-runtime");
function DevInfo(props) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime85.jsxDEV)("div", { children: "404 - Config not found" }, void 0, !1, {
    fileName: "app/modules/dms/components/dev-info.js",
    lineNumber: 5,
    columnNumber: 3
  }, this);
}

// app/modules/dms/components/landing.js
var import_react104 = require("react");

// app/modules/dms/components/card.js
var import_react103 = require("react");
var import_lodash37 = __toESM(require("lodash.get")), import_jsx_dev_runtime86 = require("react/jsx-dev-runtime");
function Card({ item, attributes }) {
  let theme = useTheme2();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)("div", { className: (0, import_lodash37.default)(theme, "card.wrapper", ""), children: Object.keys(attributes).map((attrKey, i) => {
    let ViewComp = attributes[attrKey].ViewComp;
    return /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)("div", { className: (0, import_lodash37.default)(theme, "card.row", ""), children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)("div", { className: (0, import_lodash37.default)(theme, "card.rowLabel", ""), children: attrKey }, void 0, !1, {
        fileName: "app/modules/dms/components/card.js",
        lineNumber: 14,
        columnNumber: 8
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)("div", { className: (0, import_lodash37.default)(theme, "card.rowContent", ""), children: /* @__PURE__ */ (0, import_jsx_dev_runtime86.jsxDEV)(ViewComp, { value: item[attrKey] }, `${attrKey}-${i}`, !1, {
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
var import_jsx_dev_runtime87 = require("react/jsx-dev-runtime");
function Landing({ dataItems = [], attributes }) {
  let theme = useTheme2();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime87.jsxDEV)("div", { className: "border border-pink-300", children: [
    "Landing",
    dataItems.map(
      (d, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime87.jsxDEV)(
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
var import_react105 = require("react");
var import_lodash38 = __toESM(require("lodash.get")), import_jsx_dev_runtime88 = require("react/jsx-dev-runtime");
function Card2({ item, updateAttribute, attributes, status }) {
  let theme = useTheme2();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { className: (0, import_lodash38.default)(theme, "card.wrapper", ""), children: [
    status ? /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { children: JSON.stringify(status) }, void 0, !1, {
      fileName: "app/modules/dms/components/edit.js",
      lineNumber: 10,
      columnNumber: 14
    }, this) : "",
    Object.keys(attributes).map((attrKey, i) => {
      let EditComp = attributes[attrKey].EditComp;
      return /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { className: (0, import_lodash38.default)(theme, "card.row", ""), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { className: (0, import_lodash38.default)(theme, "card.rowLabel", ""), children: attrKey }, void 0, !1, {
          fileName: "app/modules/dms/components/edit.js",
          lineNumber: 17,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("div", { className: (0, import_lodash38.default)(theme, "card.rowContent", ""), children: /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)(
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
    /* @__PURE__ */ (0, import_jsx_dev_runtime88.jsxDEV)("button", { type: "submit", children: " Save " }, void 0, !1, {
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
var import_jsx_dev_runtime89 = require("react/jsx-dev-runtime"), DefaultComponent = components_default.devinfo, DefaultWrapper = wrappers_default.error;
function filterParams(data, params) {
  let filter = !1;
  return Object.keys(params).forEach((k) => {
    data[k] == params[k] ? filter = !0 : filter = !1;
  }), filter;
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
function getActiveView(config, path, format, depth = 0) {
  return configMatcher(config, path, depth).map((activeConfig) => {
    let comp = typeof activeConfig.type == "function" ? activeConfig.type : components_default[activeConfig.type] || DefaultComponent, Wrapper = wrappers_default[activeConfig.action] || DefaultWrapper, children = [];
    return activeConfig.children && (children = getActiveView(activeConfig.children, path, format, depth + 1)), /* @__PURE__ */ (0, import_jsx_dev_runtime89.jsxDEV)(
      Wrapper,
      {
        Component: comp,
        format,
        ...activeConfig,
        children
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
function validFormat(format) {
  return format && format.attributes && format.attributes.length > 0;
}
function enhanceFormat(format) {
  let out = { ...format };
  return out.attributes.filter((d) => d.key === "updated_at").length === 0 && (out.attributes.push({ key: "updated_at", type: "datetime", editable: !1 }), out.attributes.push({ key: "created_at", type: "datetime", editable: !1 })), out;
}
function getParams(params, path = "") {
  if (!params || params.length === 0)
    return {};
  let paths = path.split("/");
  return params.reduce((out, curr, i) => (out[curr] = paths[i + 1], out), {});
}

// app/modules/dms/api/index.js
var import_node4 = require("@remix-run/node"), import_lodash39 = __toESM(require("lodash.get"));
async function dmsDataLoader(config, path = "/") {
  let { app, type } = config.format, activeConfig = getActiveConfig(config.children, path)[0] || {}, attributeFilter = (0, import_lodash39.default)(activeConfig, "options.attributes", []), params = getParams(activeConfig.params, path);
  console.log("dmsDataLoader", activeConfig, params, path);
  let lengthReq = ["dms", "data", `${app}+${type}`, "length"], length = (0, import_lodash39.default)(await falcor2.get(lengthReq), ["json", ...lengthReq], 0), itemReq = ["dms", "data", `${app}+${type}`, "byIndex"];
  return length ? Object.values((0, import_lodash39.default)(
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
  let { app, type } = config.format, { id: id2 } = data, attributeKeys = Object.keys(data).filter((k) => !["id", "updated_at", "created_at"].includes(k)), activeConfig = getActiveConfig(config.children, path), updateData = attributeKeys.reduce((out, key) => (out[key] = data[key], out), {});
  if (console.log("dmsDataEditor", id2, attributeKeys, updateData), id2 && attributeKeys.length > 0) {
    let update = await falcor2.call(["dms", "data", "edit"], [id2, data]);
    return { message: "Update successful." };
  } else if (attributeKeys.length > 0) {
    let newData = await falcor2.call(
      ["dms", "data", "create"],
      [app, type, data]
    );
    return console.log("newData", newData), (0, import_node4.redirect)(activeConfig.redirect || "/");
  }
  return { message: "Not sure how I got here." };
}

// app/modules/dms/dms-manager/index.js
var import_react107 = __toESM(require("react"));

// app/modules/dms/dms-manager/messages.js
var import_react106 = require("react"), import_jsx_dev_runtime90 = require("react/jsx-dev-runtime");
function InvalidConfig({ config }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("div", { children: [
    " Invalid DMS Config :",
    /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("pre", { style: { background: "#dedede" }, children: JSON.stringify(config, null, 3) }, void 0, !1, {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("div", { children: [
    " These aren't the droids you are looking for",
    /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("div", { className: "text-5xl", children: "404" }, void 0, !1, {
      fileName: "app/modules/dms/dms-manager/messages.js",
      lineNumber: 16,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime90.jsxDEV)("div", { children: [
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
var import_jsx_dev_runtime91 = require("react/jsx-dev-runtime"), DmsManager = ({
  config,
  path = "",
  theme = default_theme_default
}) => {
  if (!config.children || !validFormat(config.format))
    return /* @__PURE__ */ (0, import_jsx_dev_runtime91.jsxDEV)(InvalidConfig, { config }, void 0, !1, {
      fileName: "app/modules/dms/dms-manager/index.js",
      lineNumber: 15,
      columnNumber: 10
    }, this);
  let enhancedFormat = import_react107.default.useMemo(
    () => enhanceFormat(config.format),
    [config.format]
  ), RenderView = getActiveView(config.children, path, enhancedFormat);
  return RenderView ? /* @__PURE__ */ (0, import_jsx_dev_runtime91.jsxDEV)(theme_default2.Provider, { value: theme, children: RenderView }, void 0, !1, {
    fileName: "app/modules/dms/dms-manager/index.js",
    lineNumber: 36,
    columnNumber: 3
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime91.jsxDEV)(NoRouteMatch, { path }, void 0, !1, {
    fileName: "app/modules/dms/dms-manager/index.js",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}, dms_manager_default = DmsManager;

// app/modules/dms-custom/draft/index.js
var import_react126 = require("react"), import_lodash42 = require("lodash.get");

// app/modules/dms-custom/draft/editor/index.js
var import_react124 = __toESM(require("react"));

// app/modules/dms-custom/draft/editor/utils/img-loader.js
var import_react108 = __toESM(require("react")), import_jsx_dev_runtime92 = require("react/jsx-dev-runtime"), img_loader_default = (Component, options = {}) => {
  class ImgLoaderWrapper extends import_react108.default.Component {
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
    editImage(src, filename, action5, args) {
      return this.setState({ loading: !0 }), new Promise((resolve) => {
        fetch(`${this.props.imgUploadUrl}/edit/${filename}/${action5}/${args}`, {
          method: "POST",
          body: JSON.stringify({ src: encodeURI(src) }),
          headers: {
            "Content-Type": "application/json",
            Authorization: window.localStorage.getItem("userToken")
          }
        }).then((res) => (res.ok || resolve({ url: null }), res.json())).then(resolve);
      }).then(({ url }) => (this.setState({ loading: !1 }), url));
    }
    saveImage(src, filename, history2) {
      return this.setState({ loading: !0 }), new Promise((resolve) => {
        fetch(`${this.props.imgUploadUrl}/save/${filename}`, {
          method: "POST",
          body: JSON.stringify({
            src,
            history: history2
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
      return /* @__PURE__ */ (0, import_jsx_dev_runtime92.jsxDEV)(
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
  return import_react108.default.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime92.jsxDEV)(ImgLoaderWrapper, { ...props, forwardRef: ref }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/utils/img-loader.js",
    lineNumber: 113,
    columnNumber: 43
  }, this));
};

// app/modules/dms-custom/draft/editor/utils/show-loading.js
var import_react109 = __toESM(require("react")), import_jsx_dev_runtime93 = require("react/jsx-dev-runtime"), Loader = ({ color }) => /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("svg", { width: "100", height: "100", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("path", { fill: color, d: `M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
    c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("path", { fill: color, d: `M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
    c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("path", { fill: color, d: `M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
    L82,35.7z`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(
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
}, this), ScalableLoading2 = ({ scale = 1, color = "#005bcc" }) => {
  let size = 100 * scale;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { style: {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { style: {
    display: "flex",
    transform: `scale(${scale}, ${scale})`,
    width: "100px",
    height: "100px"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(Loader, { color }, void 0, !1, {
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
  return import_react109.default.forwardRef(({ children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(import_jsx_dev_runtime93.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(Component, { ...props, ref, children: [
      children,
      !props.loading || position !== "absolute" ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(LoadingComponent, { ...options }, void 0, !1, {
        fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
        lineNumber: 68,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 65,
      columnNumber: 7
    }, this),
    !props.loading || position !== "fixed" ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(LoadingComponent, { ...options }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
      lineNumber: 72,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/utils/show-loading.js",
    lineNumber: 64,
    columnNumber: 5
  }, this));
}, LoadingComponent = import_react109.default.memo(
  ({ color, position = "fixed", className = "", scale = 1 }) => /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)("div", { className: `
    ${position} left-0 top-0 right-0 bottom-0
    flex justify-center items-center z-50 bg-black opacity-50
    ${className}
  `, children: /* @__PURE__ */ (0, import_jsx_dev_runtime93.jsxDEV)(ScalableLoading2, { scale, color }, void 0, !1, {
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
var import_react112 = require("react"), import_draft_js = require("draft-js");

// app/modules/dms-custom/draft/editor/buttons/button.js
var import_react110 = require("react"), import_jsx_dev_runtime94 = require("react/jsx-dev-runtime"), EditorButton = ({ active, disabled, children, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime94.jsxDEV)(
  "button",
  {
    ...props,
    disabled,
    tabIndex: -1,
    onMouseDown: (e) => e.preventDefault(),
    className: "px-1 first:rounded-l last:rounded-r focus:border-none focus:outline-none",
    children
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
var import_react111 = require("react"), import_jsx_dev_runtime95 = require("react/jsx-dev-runtime"), Text = ({ children }) => /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { className: "px-1 font-serif font-semibold", style: { fontSize: "1.25em" }, children }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
  lineNumber: 4,
  columnNumber: 3
}, this), Icon2 = ({ children }) => /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("div", { className: "flex item-center justify-center px-1", children }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
  lineNumber: 9,
  columnNumber: 3
}, this), Icons = {
  blockquote: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-quote-right" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 23,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 23,
    columnNumber: 5
  }, this),
  "code-block": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-code" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 34,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 34,
    columnNumber: 5
  }, this),
  "header-one": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: "H1" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 36,
    columnNumber: 17
  }, this),
  "header-two": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: "H2" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 37,
    columnNumber: 17
  }, this),
  "header-three": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: "H3" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 38,
    columnNumber: 19
  }, this),
  "ordered-list-item": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-list-ol", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 48,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 48,
    columnNumber: 5
  }, this),
  "unordered-list-item": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-list-ul", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 59,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 59,
    columnNumber: 5
  }, this),
  BOLD: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: "B" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 66,
    columnNumber: 5
  }, this),
  CODE: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-code" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 77,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 77,
    columnNumber: 5
  }, this),
  ITALIC: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("i", { children: "I" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 91,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 91,
    columnNumber: 5
  }, this),
  STRIKETHROUGH: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("strike", { children: "\xA0S\xA0" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 94,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 94,
    columnNumber: 5
  }, this),
  SUBSCRIPT: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: [
    "x",
    /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("sub", { children: "2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
      lineNumber: 98,
      columnNumber: 8
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 97,
    columnNumber: 5
  }, this),
  SUPERSCRIPT: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: [
    "x",
    /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("sup", { children: "2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
      lineNumber: 103,
      columnNumber: 8
    }, this)
  ] }, void 0, !0, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 102,
    columnNumber: 5
  }, this),
  UNDERLINE: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Text, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("u", { children: "U" }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 107,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 107,
    columnNumber: 5
  }, this),
  "text-left": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-align-left", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 118,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 118,
    columnNumber: 5
  }, this),
  "text-center": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-align-center", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 129,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 129,
    columnNumber: 5
  }, this),
  "text-right": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-align-right", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 140,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 140,
    columnNumber: 5
  }, this),
  "text-justify": /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-align-justify", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 143,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 143,
    columnNumber: 5
  }, this),
  indent: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-indent", style: { fontSize: "1.25em" } }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 147,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/icons.js",
    lineNumber: 147,
    columnNumber: 5
  }, this),
  outdent: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)(Icon2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime95.jsxDEV)("span", { className: "fas fa-outdent", style: { fontSize: "1.25em" } }, void 0, !1, {
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
var import_jsx_dev_runtime96 = require("react/jsx-dev-runtime"), makeBlockDataButton = (dataType, buttonType, store) => () => {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime96.jsxDEV)(button_default, { active: isActive(), onClick: click, children: icons_default[buttonType] }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/makeBlockDataButton.js",
    lineNumber: 47,
    columnNumber: 7
  }, this);
}, makeBlockDataButton_default = makeBlockDataButton;

// app/modules/dms-custom/draft/editor/buttons/makeDataRangeButton.js
var import_react113 = __toESM(require("react")), import_draft_js2 = require("draft-js");
var import_jsx_dev_runtime97 = require("react/jsx-dev-runtime"), makeDataRangeButton = (dataType, buttonType, store, shift, max, min = 0) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), getStartData = import_react113.default.useCallback(
    (contentState) => contentState.getBlockForKey(editorState.getSelection().getStartKey()).getData(),
    [editorState]
  ), isDisabled = import_react113.default.useCallback(() => {
    let data = getStartData(editorState.getCurrentContent()), value = data.get(dataType) || 0;
    return value + shift < min || value + shift > max;
  }, [getStartData, editorState]), click = import_react113.default.useCallback((e) => {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime97.jsxDEV)(button_default, { disabled: isDisabled(), onClick: click, children: icons_default[buttonType] }, void 0, !1, {
    fileName: "app/modules/dms-custom/draft/editor/buttons/makeDataRangeButton.js",
    lineNumber: 52,
    columnNumber: 7
  }, this);
}, makeDataRangeButton_default = makeDataRangeButton;

// app/modules/dms-custom/draft/editor/buttons/makeBlockStyleButton.js
var import_react114 = require("react"), import_draft_js3 = require("draft-js");
var import_jsx_dev_runtime98 = require("react/jsx-dev-runtime"), makeBlockStyleButton = (buttonType, store) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), click = (e) => {
    e.preventDefault(), setEditorState(
      import_draft_js3.RichUtils.toggleBlockType(editorState, buttonType)
    );
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime98.jsxDEV)(
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
var import_react115 = require("react"), import_draft_js4 = require("draft-js");
var import_jsx_dev_runtime99 = require("react/jsx-dev-runtime"), makeInlineStyleButton = (buttonType, store) => () => {
  let {
    getEditorState,
    setEditorState
  } = store, editorState = getEditorState(), click = (e) => {
    e.preventDefault(), setEditorState(
      import_draft_js4.RichUtils.toggleInlineStyle(editorState, buttonType)
    );
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime99.jsxDEV)(button_default, { active: (() => editorState.getCurrentInlineStyle().has(buttonType))(), onClick: click, children: icons_default[buttonType] }, void 0, !1, {
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
    let selection = editorState.getSelection(), startKey = selection.getStartKey(), endKey = selection.getEndKey(), found = !1;
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
var import_react116 = require("react"), import_jsx_dev_runtime100 = require("react/jsx-dev-runtime"), Separator = ({ ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("div", { className: "border-r border-l mx-2 border-current", style: { borderColor: "currentColor" } }, void 0, !1, {
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
    Toolbar: ({ children }) => /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("div", { className: `absolute ${position}-0 left-0 w-full p-2 z-10 h-14`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime100.jsxDEV)("div", { className: `flex flex-${direction} shadow-md h-10 p-1 rounded w-full`, children }, void 0, !1, {
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
var import_react117 = __toESM(require("react")), import_draft_js5 = require("draft-js"), import_jsx_dev_runtime101 = require("react/jsx-dev-runtime"), ImagePlugin = (options = {}) => {
  let {
    wrappers = []
  } = options, ImageBlock = import_react117.default.forwardRef(
    ({ blockProps, compProps }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime101.jsxDEV)("img", { src: blockProps.src, ...compProps, ref, alt: "" }, blockProps.key, !1, {
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
var import_react118 = require("react"), import_linkify_it = __toESM(require("linkify-it")), import_tlds = __toESM(require("tlds")), import_jsx_dev_runtime102 = require("react/jsx-dev-runtime"), linkify = (0, import_linkify_it.default)().tlds(import_tlds.default).add("ftp", null).set({ fuzzyIP: !0 }), Link15 = ({ store, options, decoratedText, children, ...props }) => {
  let links2 = linkify.match(decoratedText), href = links2 && links2.pop().url, {
    target = "_blank"
  } = options;
  return store.getReadOnly() ? /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(
    "a",
    {
      className: "text-blue-500 underline cursor-pointer",
      href,
      target,
      children
    },
    void 0,
    !1,
    {
      fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
      lineNumber: 20,
      columnNumber: 5
    },
    this
  ) : /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("div", { className: "inline-block relative hoverable", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)("div", { className: "text-blue-500 underline cursor-pointer", children }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(
      "div",
      {
        className: "read-only-link-tooltip show-on-hover show-on-bottom pb-1 px-2 bg-gray-200 absolute z-50 rounded",
        onClick: (e) => e.stopPropagation(),
        contentEditable: !1,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(
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
        component: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime102.jsxDEV)(Link15, { ...props, store, options }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/linkify-it/index.js",
          lineNumber: 53,
          columnNumber: 29
        }, this)
      }
    ]
  };
}, linkify_it_default = linkifyitPlugin;

// app/modules/dms-custom/draft/editor/super-sub-script/index.js
var import_react119 = require("react"), import_jsx_dev_runtime103 = require("react/jsx-dev-runtime"), makeStrategy = (script) => (contentBlock, callback, contentState) => {
  let characterList = contentBlock.getCharacterList(), start = null;
  characterList.forEach((c, i) => {
    let hasStyle = c.hasStyle(script);
    hasStyle && start === null ? start = i : hasStyle || (start !== null && callback(start, i), start = null);
  }), start !== null && callback(start, characterList.size);
}, SuperSubScriptPlugin = () => ({
  decorators: [
    {
      strategy: makeStrategy("SUPERSCRIPT"),
      component: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime103.jsxDEV)("sup", { children: props.children }, void 0, !1, {
        fileName: "app/modules/dms-custom/draft/editor/super-sub-script/index.js",
        lineNumber: 27,
        columnNumber: 27
      }, this)
    },
    {
      strategy: makeStrategy("SUBSCRIPT"),
      component: (props) => /* @__PURE__ */ (0, import_jsx_dev_runtime103.jsxDEV)("sub", { children: props.children }, void 0, !1, {
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
var import_react121 = __toESM(require("react")), import_lodash40 = __toESM(require("lodash.throttle"));

// app/modules/dms-custom/draft/editor/utils/index.js
var import_react120 = __toESM(require("react")), combineCompProps = (...props) => props.reduce((a, c) => {
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
}, {}), useSetRefs2 = (...refs) => import_react120.default.useCallback((node) => {
  [...refs].forEach((ref) => {
    !ref || (typeof ref == "function" ? ref(node) : ref.current = node);
  });
}, [refs]);

// app/modules/dms-custom/draft/editor/positionable/wrapper.js
var import_jsx_dev_runtime104 = require("react/jsx-dev-runtime"), POSITIONS = ["block", "inline-block float-left mr-2", "block mx-auto", "inline-block float-right ml-2"], BUTTONS = [
  /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M3,7 L3,17 L17,17 L17,7 L3,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 13,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M21,15 L15,15 L15,17 L21,17 L21,15 Z M21,7 L15,7 L15,9 L21,9 L21,7 Z M15,13 L21,13 L21,11 L15,11 L15,13 Z M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M3,7 L3,17 L13,17 L13,7 L3,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 19,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M5,7 L5,17 L19,17 L19,7 L5,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 25,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
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
  /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
    "svg",
    {
      viewBox: "0 0 24 24",
      height: "24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M9,15 L3,15 L3,17 L9,17 L9,15 Z M9,7 L3,7 L3,9 L9,9 L9,7 Z M3,13 L9,13 L9,11 L3,11 L3,13 Z M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M11,7 L11,17 L21,17 L21,7 L11,7 Z" }, void 0, !1, {
          fileName: "app/modules/dms-custom/draft/editor/positionable/wrapper.js",
          lineNumber: 31,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)("path", { d: "M0 0h24v24H0z", fill: "none" }, void 0, !1, {
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
], positionableWrapper = (store) => (Component) => import_react121.default.forwardRef(({ compProps = {}, ...props }, ref) => {
  let {
    block,
    contentState,
    blockProps = {}
  } = props, {
    adjustPosition,
    position
  } = blockProps, handleClick = (e, p) => {
    e.preventDefault(), p !== position && (adjustPosition(block, contentState, p), setDisplay("none"));
  }, figRef = import_react121.default.useRef(), compRef = import_react121.default.useRef(), [display, setDisplay] = import_react121.default.useState("none"), [pos, setPos] = import_react121.default.useState([0, 0]), _onMouseMove = import_react121.default.useCallback((e) => {
    if (setDisplay("flex"), compRef.current) {
      let figRect = figRef.current.getBoundingClientRect(), compRect = compRef.current.getBoundingClientRect();
      setPos([
        compRect.x - figRect.x,
        compRect.width
      ]);
    }
  }, [figRef, compRef]), onMouseMove = import_react121.default.useMemo(() => (0, import_lodash40.default)(_onMouseMove, 25), [_onMouseMove]), newCompProps = combineCompProps(
    compProps,
    { className: POSITIONS[position] }
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
    "figure",
    {
      ref: figRef,
      className: "relative",
      onMouseMove,
      onMouseOut: (e) => {
        setDisplay("none"), onMouseMove.cancel();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
          "div",
          {
            className: "absolute top-0 p-1 z-10 justify-center",
            style: {
              display: store.getReadOnly() ? "none" : display,
              left: `${pos[0]}px`,
              width: `${pos[1]}px`
            },
            children: BUTTONS.map(
              (b, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
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
        /* @__PURE__ */ (0, import_jsx_dev_runtime104.jsxDEV)(
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
var import_react122 = require("react"), import_draft_js7 = require("draft-js"), import_immutable2 = __toESM(require("immutable")), import_jsx_dev_runtime105 = require("react/jsx-dev-runtime"), customStyleMap = {
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
    wrapper: /* @__PURE__ */ (0, import_jsx_dev_runtime105.jsxDEV)("div", { className: "rounded bg-gray-100 p-2 my-2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/stuff/index.js",
      lineNumber: 53,
      columnNumber: 14
    }, this)
  },
  "code-block": {
    element: "pre",
    wrapper: /* @__PURE__ */ (0, import_jsx_dev_runtime105.jsxDEV)("pre", { className: "border font-mono py-2 px-3 rounded bg-gray-50 my-2" }, void 0, !1, {
      fileName: "app/modules/dms-custom/draft/editor/stuff/index.js",
      lineNumber: 57,
      columnNumber: 14
    }, this)
  },
  atomic: {
    element: "figure",
    wrapper: /* @__PURE__ */ (0, import_jsx_dev_runtime105.jsxDEV)("figure", { className: "relative z-10" }, void 0, !1, {
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
  let found = !1, direction = e.shiftKey ? -1 : 1, editorState = store.getEditorState(), contentState = editorState.getCurrentContent(), blockMap = contentState.getBlockMap(), selection = editorState.getSelection(), startKey = selection.getStartKey(), endKey = selection.getEndKey(), newBlockMap = blockMap.reduce((a, block) => {
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
      selection
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
var import_react123 = __toESM(require("react")), import_lodash41 = __toESM(require("lodash.throttle"));
var import_jsx_dev_runtime106 = require("react/jsx-dev-runtime"), resizableWrapper = (store) => (Component) => import_react123.default.forwardRef(({ compProps = {}, ...props }, ref) => {
  let {
    block,
    contentState,
    blockProps = {}
  } = props, {
    adjustWidth,
    width = null
  } = blockProps, compRef = import_react123.default.useRef(), [hovering, setHovering] = import_react123.default.useState(!1), [canResize, setCanResize] = import_react123.default.useState(0), [resizing, setResizing] = import_react123.default.useState(0), [screenX, setScreenX] = import_react123.default.useState(0), _onResize = import_react123.default.useCallback((e) => {
    if (e.preventDefault(), compRef.current && resizing) {
      let compRect = compRef.current.getBoundingClientRect(), diff = screenX - e.screenX, width2 = compRect.width - diff * resizing;
      setScreenX(e.screenX), adjustWidth(block, contentState, width2);
    }
  }, [compRef, resizing, screenX, adjustWidth, block, contentState]), onResize = import_react123.default.useMemo(() => (0, import_lodash41.default)(_onResize, 25), [_onResize]), onMouseUp = import_react123.default.useCallback((e) => {
    setResizing(0);
  }, []);
  import_react123.default.useEffect(() => (document.addEventListener("mousemove", onResize), document.addEventListener("mouseup", onMouseUp), () => {
    document.removeEventListener("mousemove", onResize), document.removeEventListener("mouseup", onMouseUp);
  }), [onResize, onMouseUp]);
  let onMouseMove = import_react123.default.useCallback((e) => {
    if (setHovering(!0), compRef.current) {
      let compRect = compRef.current.getBoundingClientRect();
      e.clientX >= compRect.x && e.clientX <= compRect.x + 20 ? setCanResize(-1) : e.clientX >= compRect.x + compRect.width - 20 && e.clientX <= compRect.x + compRect.width ? setCanResize(1) : setCanResize(0);
    }
  }, [compRef]), onMouseDown = import_react123.default.useCallback((e) => {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime106.jsxDEV)(
    "figure",
    {
      className: "relative",
      onMouseMove: store.getReadOnly() ? null : onMouseMove,
      onMouseOut: (e) => setHovering(!1),
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime106.jsxDEV)(
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
var import_jsx_dev_runtime107 = require("react/jsx-dev-runtime"), buttonPlugin = buttons_default(), {
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
var MyEditor = class extends import_react124.default.Component {
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
  handleDroppedFiles(selection, files, { getEditorState }) {
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
    return /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(
      EditorWrapper,
      {
        id: this.props.id,
        hasFocus: this.state.hasFocus,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)("div", { className: "px-2 pb-2 flow-root", children: /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(
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
          /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(Toolbar, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(BoldButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 196,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(ItalicButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 197,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(StrikeThroughButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 198,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(UnderlineButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 199,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(SubScriptButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 200,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(SuperScriptButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 201,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(CodeButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 202,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 204,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(HeaderOneButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 206,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(HeaderTwoButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 207,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(HeaderThreeButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 208,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 210,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(BlockQuoteButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 212,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(CodeBlockButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 213,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(OrderedListButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 214,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(UnorderedListButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 215,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 217,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(LeftAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 219,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(CenterAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 220,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(JustifyAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 221,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(RightAlignButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 222,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(Separator2, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 224,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(TextOutdentButton, {}, void 0, !1, {
              fileName: "app/modules/dms-custom/draft/editor/index.js",
              lineNumber: 226,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)(TextIndentButton, {}, void 0, !1, {
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
}, editor_default = img_loader_default(show_loading_default(MyEditor, LoadingOptions)), EditorWrapper = ({ children, hasFocus, id: id2, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime107.jsxDEV)("div", { className: `pt-16 relative rounded draft-js-editor
        w-full
      `, ...props, children }, void 0, !1, {
  fileName: "app/modules/dms-custom/draft/editor/index.js",
  lineNumber: 244,
  columnNumber: 5
}, this);

// app/modules/dms-custom/draft/editor/editor.read-only.js
var import_react125 = require("react"), import_draft_js10 = require("draft-js"), import_editor2 = __toESM(require("@draft-js-plugins/editor"));
var import_jsx_dev_runtime108 = require("react/jsx-dev-runtime"), positionablePlugin2 = positionable_default(), resizablePlugin2 = resizable_default(), imagePlugin2 = image_default({
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
), ReadOnlyEditor = ({ spellCheck = !0, isRaw = !0, value }) => value ? /* @__PURE__ */ (0, import_jsx_dev_runtime108.jsxDEV)("div", { className: "draft-js-editor read-only-editor flow-root", children: /* @__PURE__ */ (0, import_jsx_dev_runtime108.jsxDEV)(
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
var import_draft_js11 = require("draft-js"), import_jsx_dev_runtime109 = require("react/jsx-dev-runtime");
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
  return value && (data = import_draft_js11.EditorState.createWithContent((0, import_draft_js11.convertFromRaw)(data))), /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)("div", { className: "w-full relative", children: /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)(
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
  return value && (data = import_draft_js11.EditorState.createWithContent((0, import_draft_js11.convertFromRaw)(data))), /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)("div", { className: "relative w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime109.jsxDEV)(editor_read_only_default, { value: data }, void 0, !1, {
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
var import_jsx_dev_runtime110 = require("react/jsx-dev-runtime");
registerDataType("richtext", draft_default);
async function loader9({ request, params }) {
  return {
    data: await dmsDataLoader(blog_config_default, params["*"]),
    user: await checkAuth(request)
  };
}
async function action3({ request, params }) {
  let form = await request.formData();
  return dmsDataEditor(blog_config_default, JSON.parse(form.get("data")), params["*"]);
}
function DMS() {
  let params = (0, import_react128.useParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)(
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("h1", { children: "DMS Error ErrorBoundary" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("p", { children: error.message }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 48,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("p", { children: "The stack trace is:" }, void 0, !1, {
      fileName: "app/routes/__dms/blog/$.jsx",
      lineNumber: 49,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime110.jsxDEV)("pre", { children: error.stack }, void 0, !1, {
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
  action: () => action4,
  default: () => DMS2,
  loader: () => loader10
});
var import_react129 = require("react"), import_react130 = require("@remix-run/react");
var import_jsx_dev_runtime111 = require("react/jsx-dev-runtime");
registerDataType("richtext", draft_default);
async function loader10({ request, params }) {
  return console.log("loader", params["*"]), {
    data: await dmsDataLoader(siteConfig, params["*"]),
    user: await checkAuth(request)
  };
}
async function action4({ request, params }) {
  let form = await request.formData();
  return dmsDataEditor(siteConfig, JSON.parse(form.get("data")), params["*"]);
}
function DMS2() {
  let params = (0, import_react130.useParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)(
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("h1", { children: "DMS Error ErrorBoundary" }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 50,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("p", { children: error.message }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 51,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("p", { children: "The stack trace is:" }, void 0, !1, {
      fileName: "app/routes/__dms/site/$.jsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime111.jsxDEV)("pre", { children: error.stack }, void 0, !1, {
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
var import_react131 = require("@remix-run/react"), import_jsx_dev_runtime112 = require("react/jsx-dev-runtime");
function JokesRoute() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)("h1", { children: "J\u{1F92A}KES" }, void 0, !1, {
      fileName: "app/routes/jokes.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)("main", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime112.jsxDEV)(import_react131.Outlet, {}, void 0, !1, {
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
var assets_manifest_default = { version: "1c57983e", entry: { module: "/build/entry.client-77ZATCX7.js", imports: ["/build/_shared/chunk-OSBGASVG.js", "/build/_shared/chunk-LGT5I7BR.js", "/build/_shared/chunk-JE7OEZ56.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-YGOQAI7T.js", imports: ["/build/_shared/chunk-3D56MA2H.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-N7ARZ6IZ.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__auth": { id: "routes/__auth", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__auth-36MDPPDF.js", imports: ["/build/_shared/chunk-OQ2FZUN7.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__auth/login": { id: "routes/__auth/login", parentId: "routes/__auth", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/__auth/login-YNIDY7V4.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__auth/logout": { id: "routes/__auth/logout", parentId: "routes/__auth", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/__auth/logout-LADMCKIU.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama": { id: "routes/__dama", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__dama-7TFOQZQU.js", imports: ["/build/_shared/chunk-INBLTNRR.js", "/build/_shared/chunk-OQ2FZUN7.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/index.(cat)": { id: "routes/__dama/index.(cat)", parentId: "routes/__dama", path: "cat?", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/index.(cat)-STTBKZNP.js", imports: ["/build/_shared/chunk-FBJVWVF5.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/__dama/source/$sourceId.($page)": { id: "routes/__dama/source/$sourceId.($page)", parentId: "routes/__dama", path: "source/:sourceId/:page?", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/source/$sourceId.($page)-GLDXRVQE.js", imports: ["/build/_shared/chunk-BRSUGPAX.js", "/build/_shared/chunk-3D56MA2H.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-N7ARZ6IZ.js", "/build/_shared/chunk-OWKBK3ME.js", "/build/_shared/chunk-FBJVWVF5.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/source/create": { id: "routes/__dama/source/create", parentId: "routes/__dama", path: "source/create", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/source/create-GEBOOXOU.js", imports: ["/build/_shared/chunk-BRSUGPAX.js", "/build/_shared/chunk-3D56MA2H.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-N7ARZ6IZ.js", "/build/_shared/chunk-OWKBK3ME.js", "/build/_shared/chunk-FBJVWVF5.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/source/delete/$sourceId": { id: "routes/__dama/source/delete/$sourceId", parentId: "routes/__dama", path: "source/delete/:sourceId", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/source/delete/$sourceId-IOZ3IB7Y.js", imports: ["/build/_shared/chunk-OWKBK3ME.js", "/build/_shared/chunk-FBJVWVF5.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dama/view/delete/$viewId": { id: "routes/__dama/view/delete/$viewId", parentId: "routes/__dama", path: "view/delete/:viewId", index: void 0, caseSensitive: void 0, module: "/build/routes/__dama/view/delete/$viewId-RLZKXBCW.js", imports: ["/build/_shared/chunk-OWKBK3ME.js", "/build/_shared/chunk-FBJVWVF5.js", "/build/_shared/chunk-A25TSZXK.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dms": { id: "routes/__dms", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__dms-XV3ERRLL.js", imports: ["/build/_shared/chunk-INBLTNRR.js", "/build/_shared/chunk-OQ2FZUN7.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dms/blog/$": { id: "routes/__dms/blog/$", parentId: "routes/__dms", path: "blog/*", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/blog/$-E3IZQWX5.js", imports: ["/build/_shared/chunk-LVFMSCCA.js", "/build/_shared/chunk-TIM5QSKK.js", "/build/_shared/chunk-T2TL255Z.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-N7ARZ6IZ.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/__dms/blog/blog.config": { id: "routes/__dms/blog/blog.config", parentId: "routes/__dms", path: "blog/blog/config", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/blog/blog.config-HJLWSFEE.js", imports: ["/build/_shared/chunk-LVFMSCCA.js", "/build/_shared/chunk-T2TL255Z.js", "/build/_shared/chunk-N7ARZ6IZ.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__dms/site/$": { id: "routes/__dms/site/$", parentId: "routes/__dms", path: "site/*", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/site/$-VYWX7FXB.js", imports: ["/build/_shared/chunk-TIM5QSKK.js", "/build/_shared/chunk-T2TL255Z.js", "/build/_shared/chunk-V7BYGTPR.js", "/build/_shared/chunk-N7ARZ6IZ.js", "/build/_shared/chunk-E4ZT35EY.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/__dms/site/site.config": { id: "routes/__dms/site/site.config", parentId: "routes/__dms", path: "site/site/config", index: void 0, caseSensitive: void 0, module: "/build/routes/__dms/site/site.config-OG7I4IWH.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/jokes": { id: "routes/jokes", parentId: "root", path: "jokes", index: void 0, caseSensitive: void 0, module: "/build/routes/jokes-4IH2PFLL.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-1C57983E.js" };

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
  "routes/__dama/source/$sourceId.($page)": {
    id: "routes/__dama/source/$sourceId.($page)",
    parentId: "routes/__dama",
    path: "source/:sourceId/:page?",
    index: void 0,
    caseSensitive: void 0,
    module: sourceId_page_exports
  },
  "routes/__dama/source/delete/$sourceId": {
    id: "routes/__dama/source/delete/$sourceId",
    parentId: "routes/__dama",
    path: "source/delete/:sourceId",
    index: void 0,
    caseSensitive: void 0,
    module: sourceId_exports
  },
  "routes/__dama/view/delete/$viewId": {
    id: "routes/__dama/view/delete/$viewId",
    parentId: "routes/__dama",
    path: "view/delete/:viewId",
    index: void 0,
    caseSensitive: void 0,
    module: viewId_exports
  },
  "routes/__dama/source/create": {
    id: "routes/__dama/source/create",
    parentId: "routes/__dama",
    path: "source/create",
    index: void 0,
    caseSensitive: void 0,
    module: create_exports
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
