describe('Geometry.MultiLineString', function () {
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

  it('getCenter', function () {
    const mp = new maptalks.MultiLineString([])
    const coords = []
    coords[0] = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 3 }
    ]
    coords[1] = [
      { x: 5, y: 6 },
      { x: 7, y: 8 },
      { x: 6, y: 5 }
    ]
    mp.setCoordinates(coords)
    expect(mp.getCenter()).to.be.closeTo(new maptalks.Coordinate(4.333333333, 4.66666666))
  })

  it('getCenterInExtent', function () {
    const mp = new maptalks.MultiLineString([])
    const coords = []
    coords[0] = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 3 }
    ]
    coords[1] = [
      { x: 5, y: 6 },
      { x: 7, y: 8 },
      { x: 6, y: 5 }
    ]
    mp.setCoordinates(coords)
    let center = mp.getCenterInExtent(new maptalks.Extent(100, 100, 100.5, 100.5))
    expect(center === null).to.be.ok()
    center = mp.getCenterInExtent(new maptalks.Extent(2, 3, 2.5, 3.5))
    expect(center.x).to.be(2.25)
    expect(center.y).to.be(3.25)
  })

  it('getExtent', function () {
    const mp = new maptalks.MultiLineString([])
    const coords = []
    coords[0] = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 3 }
    ]
    coords[1] = [
      { x: 5, y: 6 },
      { x: 7, y: 8 },
      { x: 6, y: 5 }
    ]
    mp.setCoordinates(coords)

    const extent = mp.getExtent()
    expect(extent.getWidth()).to.be.above(0)
    expect(extent.getHeight()).to.be.above(0)
  })

  it('getSize', function () {
    const mp = new maptalks.MultiLineString([])
    const coords = []
    coords[0] = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 3 }
    ]
    coords[1] = [
      { x: 5, y: 6 },
      { x: 7, y: 8 },
      { x: 6, y: 5 }
    ]
    mp.setCoordinates(coords)
    layer.addGeometry(mp)
    const size = mp.getSize()

    expect(size.width).to.be.above(0)
    expect(size.height).to.be.above(0)
  })

  it('getCoordinates/setCoordinates', function () {
    const mp = new maptalks.MultiLineString([])

    expect(mp.getCoordinates()).to.be.empty()

    const coords = []
    coords[0] = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 3 }
    ]
    coords[1] = [
      { x: 5, y: 6 },
      { x: 7, y: 8 },
      { x: 6, y: 5 }
    ]
    mp.setCoordinates(coords)

    expect(mp.getCoordinates()).to.eql(coords)
  })

  describe('creation', function () {
    it('normal constructor', function () {
      const points = [
        [[100.0, 0.0], [101.0, 1.0]],
        [[102.0, 2.0], [103.0, 3.0]]
      ]
      const multiPolyline = new maptalks.MultiLineString(points)
      const coordinates = multiPolyline.getCoordinates()
      expect(coordinates).to.have.length(points.length)
      const geojsonCoordinates = maptalks.Coordinate.toNumberArrays(coordinates)
      expect(geojsonCoordinates).to.eql(points)
    })

    it('can be empty.', function () {
      const multiPolyline = new maptalks.MultiLineString()
      expect(multiPolyline.getCoordinates()).to.have.length(0)
      expect(multiPolyline.isEmpty()).to.be.ok()
    })
  })

  it('can have various symbols', function (done) {
    const points = [
      [[100.0, 0.0], [101.0, 1.0]],
      [[102.0, 2.0], [103.0, 3.0]]
    ]
    const vector = new maptalks.MultiLineString(points)
    COMMON_SYMBOL_TESTOR.testGeoSymbols(vector, map, done)
  })
})
