
describe('Map.ScrollZoom', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let delay
  function scrollMap (delta) {
    happen.once(container, {
      type: (maptalks.Browser.gecko ? 'DOMMouseScroll' : 'mousewheel'),
      detail: delta
    })
  }

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center)
    container = setups.container
    map = setups.map
    map.config('zoomAnimationDuration', 10)
    delay = map.options.zoomAnimationDuration
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  describe('scroll map', function () {
    it('scroll up to zoomin', function (done) {
      const z = map.getZoom()
      const onZoomEnd = function () {
        const z2 = map.getZoom()
        expect(z2 < z).to.be.ok()
        done()
      }

      map.on('zoomend', onZoomEnd)
      scrollMap(100)
    })

    it('scroll down map to zoomout', function (done) {
      const z = map.getZoom()

      const onZoomEnd = function () {
        const z2 = map.getZoom()
        expect(z2 > z).to.be.ok()
        done()
      }
      map.on('zoomend', onZoomEnd)
      scrollMap(-100)
    })
  })

  describe('scrollZoom can be disable', function () {
    it('disables scrollZoom', function (done) {
      map.config('scrollWheelZoom', false)
      const spy = sinon.spy()
      map.on('zoomend', spy)
      scrollMap(-100)
      setTimeout(function () {
        expect(spy.called).not.to.be.ok()
        done()
      }, delay + 41)
    })

    it('disables by zoomable', function (done) {
      map.config('zoomable', false)
      const spy = sinon.spy()
      map.on('zoomend', spy)
      scrollMap(-100)
      setTimeout(function () {
        expect(spy.called).not.to.be.ok()
        done()
      }, delay + 41)
    })
  })
})
