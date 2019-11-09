describe('Geometry.main', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let layer
  const context = {
    map: map,
    layer: layer
  }

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center)
    container = setups.container
    map = setups.map
    layer = new maptalks.VectorLayer('canvas')
    map.addLayer(layer)
    context.map = map
    context.layer = layer
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('constructor options', function () {
    it('some common options', function () {
      const symbol = {
        markerFile: 'file',
        markerWidth: 10,
        markerHeight: 15
      }
      const properties = {
        foo1: 1,
        foo2: 'test',
        foo3: true
      }
      const id = '1'
      const marker = new maptalks.Marker([0, 0], {
        id: id,
        symbol: symbol,
        properties: properties
      })

      expect(marker.getProperties()).to.be.eql(properties)
      expect(marker.getSymbol()).to.be.eql(symbol)
      expect(marker.getId()).to.be.eql(id)
    })
  })

  it('flash', function (done) {
    const geometry = new maptalks.Marker(map.getCenter()).addTo(layer)
    geometry.flash(100, 4, function () {
      done()
    })
  })

  // 测试所有类型Geometry的公共方法
  const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()

  for (let i = 0, len = geometries.length; i < len; i++) {
    registerGeometryCommonTest.call(this, geometries[i], context)
  }
})
// 测试Geometry的公共方法
function registerGeometryCommonTest (geometry, _context) {
  function setupGeometry () {
    // var layer = new maptalks.VectorLayer('common_test_layer');
    if (geometry.getLayer()) {
      geometry.remove()
    }
    _context.layer.addGeometry(geometry)
    // map.addLayer(layer);
  }

  function teardownGeometry () {
    geometry.remove()
    // map.removeLayer('common_test_layer');
  }

  const type = geometry.getType()
  context(type + ':getter and setters.', function () {
    it('id', function () {
      geometry.setId('id')
      const id = geometry.getId()
      expect(id).to.be('id')
      geometry.setId(null)
      expect(geometry.getId()).to.not.be.ok()
    })

    it('Layer', function () {
      expect(geometry.getLayer()).to.not.be.ok()
      const layer = new maptalks.VectorLayer('id')
      layer.addGeometry(geometry)
      expect(geometry.getLayer()).to.be.ok()
      // delete
      geometry.remove()
      expect(geometry.getLayer()).to.not.be.ok()
    })

    it('Map', function () {
      setupGeometry()

      expect(geometry.getMap()).to.be.ok()

      teardownGeometry()

      expect(geometry.getMap()).to.not.be.ok()
    })

    it('Type', function () {
      const type = geometry.getType()
      expect(type).to.not.be.empty()
    })

    it('Properties', function () {
      const oldProps = geometry.getProperties()

      let props = { foo_num: 1, foo_str: 'str', foo_bool: false }
      geometry.setProperties(props)

      props = geometry.getProperties()
      expect(props).to.eql(props)

      geometry.setProperties(oldProps)
      expect(geometry.getProperties()).to.not.eql(props)
    })
  })

  context(type + ':can be measured.', function () {
    it('it has geodesic length', function () {
      const length = geometry.getLength()
      if (geometry instanceof maptalks.Marker) {
        expect(length === 0).to.be.ok()
      } else {
        expect(length > 0).to.be.ok()
      }
    })

    it('it has geodesic area', function () {
      const types = [maptalks.Polygon, maptalks.MultiPolygon]
      const area = geometry.getArea()
      let hit = false
      for (let i = 0, len = types.length; i < len; i++) {
        if (geometry instanceof types[i]) {
          hit = true
          break
        }
      }
      if (!hit) {
        expect(area === 0).to.be.ok()
      } else {
        expect(area > 0).to.be.ok()
      }
    })

    it('it has extent', function () {
      setupGeometry()

      const extent = geometry.getExtent()
      expect(extent).to.be.a(maptalks.Extent)
      expect(extent).to.not.be.empty()

      teardownGeometry()
    })

    it('it has size', function () {
      setupGeometry()

      const size = geometry.getSize()
      expect(size).to.be.a(maptalks.Size)
      expect(size.width).to.be.above(0)
      expect(size.height).to.be.above(0)

      teardownGeometry()
    })

    it('it has center', function () {
      let center = geometry.getCenter()
      expect(center).to.be.a(maptalks.Coordinate)
      expect(center.x).to.be.a('number')
      expect(center.y).to.be.a('number')

      setupGeometry()

      center = geometry.getCenter()
      expect(center).to.be.a(maptalks.Coordinate)
      expect(center.x).to.be.a('number')
      expect(center.y).to.be.a('number')

      teardownGeometry()
    })
  })

  context(type + ':can show and hide.', function () {
    it('show and hide', function () {
      geometry.show()
      expect(geometry.isVisible()).to.be.ok()
      geometry.hide()
      expect(geometry.isVisible()).to.not.be.ok()

      setupGeometry()

      geometry.show()
      expect(geometry.isVisible()).to.be.ok()
      geometry.hide()
      expect(geometry.isVisible()).to.not.be.ok()

      teardownGeometry()

      geometry.show()
      expect(geometry.isVisible()).to.be.ok()
    })
  })

  context(type + ':copy', function () {
    it('copy', function () {
      const json = geometry.toJSON()

      const cloned = geometry.copy()

      const clonedJson = cloned.toJSON()

      expect(clonedJson).to.eql(json)
    })
  })

  it(type + ':translate', function () {
    const coord = maptalks.Coordinate.toNumberArrays(geometry.getCoordinates())
    geometry.translate(-1, -1)
    const coord2 = maptalks.Coordinate.toNumberArrays(geometry.getCoordinates())
    expect(coord).not.to.be.eql(coord2)
  })

  context(type + ':remove', function () {
    it('remove from layer', function () {
      // layer not on map
      const layer = new maptalks.VectorLayer('svg')
      layer.addGeometry(geometry)
      expect(geometry.getLayer()).to.be.ok()
      expect(geometry.getMap()).to.not.be.ok()
      geometry.remove()
      expect(geometry.getLayer()).to.not.be.ok()

      setupGeometry()

      expect(geometry.getLayer()).to.be.ok()
      expect(geometry.getMap()).to.be.ok()
      geometry.remove()
      expect(geometry.getLayer()).to.not.be.ok()

      const canvasLayer = new maptalks.VectorLayer('event_test_canvas', { render: 'canvas' })
      canvasLayer.addGeometry(geometry)
      _context.map.addLayer(canvasLayer)

      expect(geometry.getLayer()).to.be.ok()
      expect(geometry.getMap()).to.be.ok()
      geometry.remove()
      expect(geometry.getLayer()).to.not.be.ok()

      teardownGeometry()
    })
  })

  context(type + ':some internal methods should be tested.', function () {
    it('painter', function () {
      setupGeometry()

      let painter = geometry._getPainter()
      expect(painter).to.be.ok()
      geometry.remove()

      const canvasLayer = new maptalks.VectorLayer('event_test_canvas', { render: 'canvas' })
      canvasLayer.addGeometry(geometry)
      _context.map.addLayer(canvasLayer)

      painter = geometry._getPainter()
      expect(painter).to.be.ok()

      teardownGeometry()
    })

    it('getExternalResources', function () {
      let symbol, resource
      const type = geometry.getType()
      if (geometry instanceof maptalks.TextMarker) {
        return
      }
      if (type === 'Point') {
        symbol = {
          markerFile: 'http://foo.com/foo.png'
        }
        geometry.setSymbol(symbol)
        resource = geometry._getExternalResources()
        expect(resource).to.have.length(1)
        expect(resource[0][0]).to.be(symbol.markerFile)
      } else {
        symbol = {
          polygonPatternFile: 'url(\'http://foo.com/foo.png\')',
          linePatternFile: 'url(\'http://foo.com/foo2.png\')'
        }
        geometry.setSymbol(symbol)
        resource = geometry._getExternalResources()
        expect(resource).to.have.length(2)
        expect(resource[0][0]).to.be('http://foo.com/foo.png')
        expect(resource[1][0]).to.be('http://foo.com/foo2.png')
      }
    })

    it('getProjection', function () {
      let projection = geometry._getProjection()
      expect(projection).not.to.be.ok()

      setupGeometry()

      projection = geometry._getProjection()
      expect(projection.code).to.be(_context.map.getProjection().code)

      teardownGeometry()
    })

    it('getMeasurer', function () {
      let measurer = geometry._getMeasurer()
      expect(measurer).to.be(maptalks.projection.EPSG4326)

      geometry.config('defaultProjection', 'identity')

      measurer = geometry._getMeasurer()
      expect(measurer).to.be(maptalks.projection.IDENTITY)

      geometry.config('defaultProjection', 'baidu')

      measurer = geometry._getMeasurer()
      expect(measurer).to.be(maptalks.projection.BAIDU)
    })
  })
}
