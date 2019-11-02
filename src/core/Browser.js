import { IS_NODE } from './util'

let Browser = {}

if (!IS_NODE) {
  const ua = navigator.userAgent.toLowerCase()
  const doc = document.documentElement

  const ie = 'ActiveXObject' in window

  const webkit = ua.indexOf('webkit') !== -1
  const phantomjs = ua.indexOf('phantom') !== -1
  const android23 = ua.search('android [23]') !== -1
  const chrome = ua.indexOf('chrome') !== -1
  const gecko = ua.indexOf('gecko') !== -1 && !webkit && !window.opera && !ie

  const mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1
  const msPointer = !window.PointerEvent && window.MSPointerEvent
  const pointer = (window.PointerEvent && navigator.pointerEnabled) || msPointer

  const ie3d = ie && ('transition' in doc.style)
  const webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23
  const gecko3d = 'MozPerspective' in doc.style
  const opera12 = 'OTransition' in doc.style
  const any3d = (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs

  let chromeVersion = 0
  if (chrome) {
    chromeVersion = ua.match(/chrome\/([\d.]+)/)[1]
  }

  const touch = !phantomjs && (pointer || 'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch))

  let webgl
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')
    webgl = gl && gl instanceof WebGLRenderingContext
  } catch (err) {
    webgl = false
  }

  const devicePixelRatio = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI))

  Browser = {
    ie: ie,
    ielt9: ie && !document.addEventListener,
    edge: 'msLaunchUri' in navigator && !('documentMode' in document),
    webkit: webkit,
    gecko: gecko,
    android: ua.indexOf('android') !== -1,
    android23: android23,
    chrome: chrome,
    chromeVersion: chromeVersion,
    safari: !chrome && ua.indexOf('safari') !== -1,
    phantomjs: phantomjs,

    ie3d: ie3d,
    webkit3d: webkit3d,
    gecko3d: gecko3d,
    opera12: opera12,
    any3d: any3d,

    mobile: mobile,
    mobileWebkit: mobile && webkit,
    mobileWebkit3d: mobile && webkit3d,
    mobileOpera: mobile && window.opera,
    mobileGecko: mobile && gecko,

    touch: !!touch,
    msPointer: !!msPointer,
    pointer: !!pointer,

    retina: devicePixelRatio > 1,
    devicePixelRatio,

    language: navigator.browserLanguage ? navigator.browserLanguage : navigator.language,
    ie9: (ie && document.documentMode === 9),
    ie10: (ie && document.documentMode === 10),

    webgl: webgl
  }
}

export default Browser
