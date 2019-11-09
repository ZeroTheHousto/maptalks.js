describe('Map.BoxZoom', function () {
  let container, eventContainer
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)

  function dragMap (steps) {
    const center = map.getCenter()
    const size = map.getSize()
    const domPosition = GET_PAGE_POSITION(container)
    let point = map.coordinateToContainerPoint(center).add(domPosition)
    point = point.sub(size.toPoint().multi(1 / 4))
    happen.mousedown(eventContainer, {
      clientX: point.x,
      clientY: point.y,
      shiftKey: true
    })
    for (let i = 0; i < steps; i++) {
      happen.mousemove(eventContainer, {
        clientX: point.x + i,
        clientY: point.y + i
      })
    }
    happen.mouseup(eventContainer, {
      clientX: point.x + steps,
      clientY: point.y + steps
    })
  }

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center)
    container = setups.container
    map = setups.map
    map.config('zoomAnimationDuration', 50)
    eventContainer = map._panels.canvasContainer
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('drag box zoom', function (done) {
    const center = map.getCenter().toArray()
    const zoom = map.getZoom()
    map.on('animateend', function () {
      expect(zoom).not.to.be.eql(map.getZoom())
      expect(map.getCenter().toArray()).not.to.be.eql(center)
      done()
    })
    dragMap(10)
  })

  it('drag bigger box zoom', function (done) {
    const center = map.getCenter().toArray()
    const zoom = map.getZoom()
    map.on('animateend', function () {
      expect(zoom).to.be.eql(map.getZoom())
      expect(map.getCenter().toArray()).not.to.be.eql(center)
      done()
    })
    dragMap(1000)
  })
})
