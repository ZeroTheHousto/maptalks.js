describe('#MapPan', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '2px'
    container.style.height = '2px'
    document.body.appendChild(container)
    const option = {
      zoomAnimation: false,
      zoom: 17,
      center: center
    }
    map = new maptalks.Map(container, option)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('panTo without animation', function () {
    const coord = center.substract(1, 1)
    map.panTo(coord, { animation: false })
    expect(map.getCenter()).to.be.closeTo(coord)
  })

  it('panTo', function (done) {
    const coord = center.substract(1, 1)
    map.once('moveend', function () {
      expect(map.getCenter()).to.be.closeTo(coord)
      done()
    })
    map.panTo(coord, { animation: true })
  })

  it('when panning map to a point, call the callback function in each frame', function (done) {
    const coord = center.substract(1, 1)
    const spy = sinon.spy()
    const t = 100
    map.panTo(coord, {
      animation: true,
      duration: t
    }, spy)
    expect(spy.called).to.not.be.ok()
    setTimeout(function () {
      expect(spy.called).to.be.ok()
      done()
    }, 50)
  })

  it('panBy without animation', function (done) {
    map.setBearing(90)
    const offset = { x: 20, y: 0 }
    map.once('moveend', function () {
      expect(+map.getCenter().x.toFixed(6)).to.be.eql(center.x)
      expect(map.getCenter().y).not.to.be.eql(center.y)
      done()
    })
    map.panBy(offset, { animation: false })
  })

  it('panBy with animation', function (done) {
    const offset = { x: 20, y: 20 }
    map.once('moveend', function () {
      expect(map.getCenter()).not.to.be.eql(center)
      done()
    })
    map.panBy(offset, { animation: true })
  })

  it('panBy with callback', function (done) {
    const offset = { x: 20, y: 20 }
    const spy = sinon.spy()
    const t = 100
    map.panBy(offset, { animation: true, duration: t }, spy)
    expect(spy.called).to.not.be.ok()
    setTimeout(function () {
      expect(spy.called).to.be.ok()
      done()
    }, 50)
  })

  it('change zoom or center during panning', function (done) {
    const coord = center.substract(1, 1)
    const newCenter = center.add(1, 1)
    map.once('moveend', function () {
      expect(map.getCenter()).to.be.closeTo(newCenter)
      done()
    })
    map.panTo(coord, { animation: true })
    map.setCenterAndZoom(newCenter, map.getZoom() + 1)
  })
})
