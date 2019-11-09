describe('#Sector', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let layer

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center)
    container = setups.container
    map = setups.map
    layer = new maptalks.VectorLayer('id')
    map.addLayer(layer)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('setCoordinates', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1, 30, 60)
    sector.setCoordinates({ x: 180, y: -75 })
    expect(sector.getCoordinates().toArray()).to.be.eql([180, -75])
  })

  it('getCenter', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1, 30, 60)
    const got = sector.getCenter()

    expect(got.x).to.eql(0)
    expect(got.y).to.eql(0)
  })

  it('getExtent', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1, 30, 60)
    const extent = sector.getExtent()
    expect(extent.getWidth()).to.be.above(0)
    expect(extent.getHeight()).to.be.above(0)
  })

  it('getSize', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1, 30, 60)
    layer.addGeometry(sector)
    const size = sector.getSize()

    expect(size.width).to.be.above(0)
    expect(size.height).to.be.above(0)
  })

  it('getRadius/getStartAngle/getEndAngle', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1, 30, 60)
    const r = sector.getRadius()
    const s = sector.getStartAngle()
    const e = sector.getEndAngle()

    expect(r).to.eql(1)
    expect(s).to.eql(30)
    expect(e).to.eql(60)
  })

  it('setRadius/setStartAngle/setEndAngle', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1, 30, 60)
    sector.setRadius(2)
    sector.setStartAngle(60)
    sector.setEndAngle(120)
    const r = sector.getRadius()
    const s = sector.getStartAngle()
    const e = sector.getEndAngle()

    expect(r).to.eql(2)
    expect(s).to.eql(60)
    expect(e).to.eql(120)
  })

  it('getShell', function () {
    const sector = new maptalks.Sector({ x: 0, y: 0 }, 1000, 0, 90)
    const shell = sector.getShell()

    expect(shell).to.have.length(sector.options.numberOfShellPoints)
    const num = sector.options.numberOfShellPoints
    expect(shell).to.have.length(num)
    expect(map.computeLength(shell[1], [0, 0])).to.be.approx(sector.getRadius(), 1E-5)
    expect(shell[1].x).to.be.above(0)
    expect(shell[1].y).to.be.eql(0)

    expect(map.computeLength(shell[shell.length - 2], [0, 0])).to.be.approx(sector.getRadius(), 1E-5)
    expect(shell[shell.length - 2].y).to.be.above(0)
    expect(shell[shell.length - 2].x).to.be.approx(0, 1E-3)
  })

  describe('geometry fires events', function () {
    it('canvas events', function () {
      const vector = new maptalks.Sector(center, 1, 0, 270)
      new COMMON_GEOEVENTS_TESTOR().testCanvasEvents(vector, map, vector.getCenter())
    })
  })

  describe('change shape and position', function () {
    it('events', function () {
      const spy = sinon.spy()

      const vector = new maptalks.Sector(center, 1, 0, 270)
      vector.on('shapechange positionchange', spy)

      function evaluate () {
        const rnd = Math.random() * 0.001
        const coordinates = new maptalks.Coordinate(center.x + rnd, center.y + rnd)

        vector.setCoordinates(coordinates)
        expect(spy.calledOnce).to.be.ok()
        expect(vector.getCoordinates()).to.eql(coordinates)
        spy.reset()

        const radius = 1000 * rnd
        vector.setRadius(radius)
        expect(spy.calledOnce).to.be.ok()
        expect(radius).to.be(vector.getRadius())
        spy.reset()

        const sangle = 20
        vector.setStartAngle(sangle)
        expect(spy.calledOnce).to.be.ok()
        expect(sangle).to.be(vector.getStartAngle())
        spy.reset()

        const eangle = 20
        vector.setEndAngle(eangle)
        expect(spy.calledOnce).to.be.ok()
        expect(eangle).to.be(vector.getEndAngle())
        spy.reset()
      }

      evaluate()

      // svg
      layer = new maptalks.VectorLayer('svg')
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
      const vector = new maptalks.Sector(center, 1, 0, 270)
      const shell = vector.getShell()
      expect(shell).to.have.length(vector.options.numberOfShellPoints)
    })

    it('but doesn\'t have holes', function () {
      const vector = new maptalks.Sector(center, 1, 0, 270)
      const holes = vector.getHoles()
      expect(holes).to.be.empty()
    })

    it('toGeoJSON exported an polygon', function () {
      const vector = new maptalks.Sector(center, 1, 0, 270)
      const geojson = vector.toGeoJSON().geometry
      expect(geojson.type).to.be.eql('Polygon')
      expect(geojson.coordinates[0]).to.have.length(vector.options.numberOfShellPoints)
    })
  })

  describe('compute length and area', function () {
    it('length', function () {
      const vector = new maptalks.Sector(center, 1, 0, 270)
      const length = vector.getLength()
      expect(length).to.be.above(0)
    })

    it('area', function () {
      const vector = new maptalks.Sector(center, 1, 0, 270)
      const area = vector.getArea()
      expect(area).to.be.above(0)
    })
  })

  it('can have various symbols', function (done) {
    const vector = new maptalks.Sector(center, 1, 0, 270)
    COMMON_SYMBOL_TESTOR.testGeoSymbols(vector, map, done)
  })

  /* it("Sector._containsPoint", function() {
        layer.clear();
        var geometry = new maptalks.Sector(center, 10, 90, 405, {
            symbol: {
                'lineWidth': 6
            }
        });
        layer.addGeometry(geometry);

        var spy = sinon.spy();
        geometry.on('click', spy);

        happen.click(canvasContainer, {
            clientX: 400 + 8 + (10 - 3),
            clientY: 300 + 8 - (10 - 2)
        });
        expect(spy.called).to.not.be.ok();

        happen.click(canvasContainer, {
            clientX: 400 + 8,
            clientY: 300 + 8 - 10
        });
        expect(spy.called).to.be.ok();
    }); */
})
