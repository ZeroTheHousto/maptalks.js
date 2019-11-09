describe('Map.Event', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let eventContainer

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '20px'
    container.style.height = '20px'
    document.body.appendChild(container)
    const option = {
      zoomAnimation: false,
      zoom: 17,
      center: center
    }
    map = new maptalks.Map(container, option)
    eventContainer = map._panels.canvasContainer
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('prevent click longer than 300ms', function (done) {
    const domPosition = GET_PAGE_POSITION(container)
    const point = map.coordinateToContainerPoint(center).add(domPosition)
    const spy = sinon.spy()
    map.on('click', spy)

    happen.mousedown(eventContainer, {
      clientX: point.x,
      clientY: point.y
    })
    setTimeout(function () {
      happen.click(eventContainer, {
        clientX: point.x,
        clientY: point.y
      })
      expect(spy.called).not.to.be.ok()
      done()
    }, 500)
  })

  it('mimic click event after touch', function () {
    const domPosition = GET_PAGE_POSITION(container)
    const point = map.coordinateToContainerPoint(center).add(domPosition)
    const spy = sinon.spy()
    map.on('click', spy)

    happen.once(eventContainer, {
      type: 'touchstart',
      touches: [{
        clientX: point.x,
        clientY: point.y
      }]
    })
    happen.once(eventContainer, {
      type: 'touchend',
      touches: [{
        clientX: point.x,
        clientY: point.y
      }]
    })
    expect(spy.called).to.be.ok()
  })

  it('mimic dblclick event after double touch', function () {
    const domPosition = GET_PAGE_POSITION(container)
    const point = map.coordinateToContainerPoint(center).add(domPosition)
    const spy = sinon.spy()
    map.on('dblclick', spy)

    happen.once(eventContainer, {
      type: 'touchstart',
      touches: [{
        clientX: point.x,
        clientY: point.y
      }]
    })
    happen.once(eventContainer, {
      type: 'touchend',
      touches: [{
        clientX: point.x,
        clientY: point.y
      }]
    })
    happen.once(eventContainer, {
      type: 'touchstart',
      touches: [{
        clientX: point.x,
        clientY: point.y
      }]
    })
    happen.once(eventContainer, {
      type: 'touchend',
      touches: [{
        clientX: point.x,
        clientY: point.y
      }]
    })
    expect(spy.called).to.be.ok()
  })

  it('listen click once', function () {
    const domPosition = GET_PAGE_POSITION(container)
    const point = map.coordinateToContainerPoint(center).add(domPosition)
    const spy = sinon.spy()
    map.once('click', spy)
    happen.mousedown(eventContainer, {
      clientX: point.x,
      clientY: point.y
    })
    happen.click(eventContainer, {
      clientX: point.x,
      clientY: point.y
    })
    expect(spy.called).to.be.ok()
    spy.reset()
    happen.click(eventContainer, {
      clientX: point.x,
      clientY: point.y
    })
    expect(spy.called).not.to.be.ok()
  })

  it('it ignore click without mousedown', function () {
    const domPosition = GET_PAGE_POSITION(container)
    const point = map.coordinateToContainerPoint(center).add(domPosition)
    const spy = sinon.spy()
    map.on('click', spy)
    happen.click(eventContainer, {
      clientX: point.x,
      clientY: point.y
    })
    expect(spy.called).not.to.be.ok()
  })

  it('ignore events out of container extent', function () {
    const domPosition = GET_PAGE_POSITION(container)
    const x = domPosition.x + 2
    const y = domPosition.y + 2
    const spy = sinon.spy()
    map.on('click', spy)
    happen.mousedown(eventContainer, {
      clientX: x,
      clientY: y
    })
    happen.click(eventContainer, {
      clientX: x,
      clientY: y
    })
    expect(spy.called).to.be.ok()
    spy.reset()
    map.setPitch(80)
    happen.mousedown(eventContainer, {
      clientX: x,
      clientY: y
    })
    happen.click(eventContainer, {
      clientX: x,
      clientY: y
    })
    expect(spy.called).not.to.be.ok()
  })
})
