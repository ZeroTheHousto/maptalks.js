// var CommonSpec = require('./CommonSpec');

describe('Geometry.Circle', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let layer

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center, null, {
      width: 800,
      height: 600
    })
    container = setups.container
    map = setups.map
    layer = new maptalks.VectorLayer('v').addTo(map)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('setCoordinates', function () {
    const circle = new maptalks.Circle({ x: 0, y: 0 }, 1)
    circle.setCoordinates({ x: 1, y: 1 })
    expect(circle.getCoordinates().toArray()).to.be.eql([1, 1])
  })

  it('getCenter', function () {
    const circle = new maptalks.Circle({ x: 0, y: 0 }, 1)
    const got = circle.getCenter()

    expect(got.x).to.eql(0)
    expect(got.y).to.eql(0)
  })

  it('getExtent', function () {
    const circle = new maptalks.Circle({ x: 0, y: 0 }, 1)
    const extent = circle.getExtent()
    expect(extent.getWidth()).to.be.above(0)
    expect(extent.getHeight()).to.be.above(0)
  })

  it('getSize', function () {
    const circle = new maptalks.Circle({ x: 0, y: 0 }, 100)
    layer.addGeometry(circle)
    const size = circle.getSize()

    expect(size.width).to.be.above(0)
    expect(size.height).to.be.above(0)
  })

  it('setRadius/getRadius', function () {
    const circle = new maptalks.Circle({ x: 0, y: 0 }, 1)

    expect(circle.getRadius()).to.eql(1)

    circle.setRadius(20)

    expect(circle.getRadius()).to.eql(20)
  })

  it('getShell', function () {
    const circle = new maptalks.Circle({ x: 0, y: 0 }, 1)
    const shell = circle.getShell()

    const num = circle.options.numberOfShellPoints
    expect(shell).to.have.length(num)
    let sumx = 0; let sumy = 0; const len = shell.length
    for (let i = 0; i < len; i++) {
      sumx += shell[i].x
      sumy += shell[i].y
    }
    expect(sumx / len).to.be.approx(0)
    expect(sumy / len).to.be.approx(0)
    expect(map.computeLength(shell[0], [0, 0])).to.be.approx(circle.getRadius())
    expect(map.computeLength(shell[num / 4], [0, 0])).to.be.approx(circle.getRadius())
    expect(map.computeLength(shell[num * 3 / 4], [0, 0])).to.be.approx(circle.getRadius())
    expect(map.computeLength(shell[num / 2], [0, 0])).to.be.approx(circle.getRadius())
  })

  describe('geometry fires events', function () {
    it('canvas events', function () {
      const vector = new maptalks.Circle(center, 1)
      new COMMON_GEOEVENTS_TESTOR().testCanvasEvents(vector, map, vector.getCenter())
    })
  })

  describe('change shape and position', function () {
    it('events', function () {
      const spy = sinon.spy()

      const vector = new maptalks.Circle(center, 1)
      vector.on('shapechange positionchange', spy)

      function evaluate () {
        const rnd = Math.random() * 0.001
        const coordinates = new maptalks.Coordinate(center.x + rnd, center.y + rnd)
        const radius = 1000 * rnd

        vector.setCoordinates(coordinates)
        expect(spy.calledOnce).to.be.ok()
        expect(vector.getCoordinates()).to.eql(coordinates)
        spy.reset()
        vector.setRadius(radius)
        expect(spy.calledOnce).to.be.ok()
        expect(radius).to.be(vector.getRadius())
        spy.reset()
      }

      evaluate()

      // svg
      layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      layer.addGeometry(vector)
      evaluate()
      vector.remove()
      // canvas
      layer = new maptalks.VectorLayer('canvas', { render: 'canvas' })
      layer.addGeometry(vector)
      map.addLayer(layer)
      evaluate()
    })
  })

  describe('can be treated as a polygon', function () {
    it('has shell', function () {
      const vector = new maptalks.Circle(center, 100)
      const shell = vector.getShell()
      expect(shell).to.have.length(vector.options.numberOfShellPoints)
    })

    it('but doesn\'t have holes', function () {
      const vector = new maptalks.Circle(center, 100)
      const holes = vector.getHoles()
      expect(holes).to.be.empty()
    })

    it('toGeoJSON exported an polygon', function () {
      const vector = new maptalks.Circle(center, 100)
      const geojson = vector.toGeoJSON().geometry
      expect(geojson.type).to.be.eql('Polygon')
      expect(geojson.coordinates[0]).to.have.length(vector.options.numberOfShellPoints)
    })
  })

  describe('compute length and area', function () {
    it('length', function () {
      const vector = new maptalks.Circle(center, 100)
      const result = Math.PI * 2 * 100
      const length = vector.getLength()
      expect(length).to.be(result)
    })

    it('area', function () {
      const vector = new maptalks.Circle(center, 100)
      const result = Math.PI * 100 * 100
      const length = vector.getArea()
      expect(length).to.be(result)
    })
  })

  it('can have various symbols', function (done) {
    const vector = new maptalks.Circle(center, 100)
    COMMON_SYMBOL_TESTOR.testGeoSymbols(vector, map, done)
  })

  it('Circle.containsPoint', function () {
    const geometry = new maptalks.Circle(center, 20, {
      symbol: {
        lineWidth: 6,
        lineOpacity: 0,
        polygonOpacity: 0
      }
    })
    layer = new maptalks.VectorLayer('id', { drawImmediate: true })
    map.addLayer(layer)
    layer.addGeometry(geometry)

    const p1 = new maptalks.Point(400 + 20 + 6, 300)
    expect(geometry.containsPoint(p1)).not.to.be.ok()

    const p2 = new maptalks.Point(400 + 20 + 2, 300)
    expect(geometry.containsPoint(p2)).to.be.ok()

    const p3 = new maptalks.Point(400, 300)
    expect(geometry.containsPoint(p3)).to.be.ok()
  })

  it('redraw when map is pitched', function (done) {
    const circle = new maptalks.Circle(center, 20, {
      symbol: {
        polygonFill: '#f00',
        lineWidth: 6
      }
    })
    layer = new maptalks.VectorLayer('id', circle, { drawImmediate: true })
    layer.once('layerload', function () {
      expect(layer).to.be.painted()
      layer.once('layerload', function () {
        expect(layer).to.be.painted()
        done()
      })
      map.setPitch(60)
    })
    map.addLayer(layer)
  })

  it('redraw when map not pitched', function (done) {
    map.setPitch(60)
    const circle = new maptalks.Circle(center, 20, {
      symbol: {
        polygonFill: '#f00',
        lineWidth: 6
      }
    })
    layer = new maptalks.VectorLayer('id', circle, { drawImmediate: true })
    layer.once('layerload', function () {
      expect(layer).to.be.painted()
      layer.once('layerload', function () {
        expect(layer).to.be.painted()
        done()
      })
      map.setPitch(0)
    })
    map.addLayer(layer)
  })
})
