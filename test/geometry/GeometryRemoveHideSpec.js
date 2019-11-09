describe('Geometry.RemoveHide', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let layer
  const context = {
  }

  beforeEach(function () {
    container = document.createElement('canvas')
    container.style.width = '800px'
    container.style.height = '600px'
    container.width = 800
    container.height = 600
    document.body.appendChild(container)
    const option = {
      zoom: 17,
      center: center
    }
    map = new maptalks.Map(container, option)

    layer = new maptalks.VectorLayer('canvas')
    map.addLayer(layer)
    context.layer = layer
    context.container = container
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
  // override marker's default symbol by a 10 * 10 ellipse
  geometries[0].setSymbol({
    markerType: 'ellipse',
    markerWidth: 10,
    markerHeight: 10,
    markerFill: '#000'
  })
  for (let i = 0, len = geometries.length; i < len; i++) {
    testRemoveHide.call(this, geometries[i], context)
  }
})

function testRemoveHide (geometry, _context) {
  function setupGeometry () {
    if (geometry.getLayer()) {
      geometry.remove()
    }
  }

  function getTestPoints (geometry) {
    const layer = _context.layer
    const map = layer.getMap()
    const coordinates = [
      geometry.getCenter(),
      geometry.getFirstCoordinate(),
      geometry.getLastCoordinate()
    ]
    const points = []
    for (let i = 0; i < coordinates.length; i++) {
      points.push(map.coordinateToContainerPoint(coordinates[i]))
    }
    return points
  }

  function isDrawn (p, canvas) {
    let i
    if (Array.isArray(p)) {
      for (i = 0; i < p.length; i++) {
        if (isDrawn(p[i], canvas)) {
          return true
        }
      }
      return false
    }
    const context = canvas.getContext('2d')
    for (i = -1; i <= 1; i++) {
      for (let ii = -1; ii <= 1; ii++) {
        const imgData = context.getImageData(p.x + i, p.y + ii, 1, 1).data
        if (imgData[3] > 0) {
          return true
        }
      }
    }
    return false
  }

  function test (fn, done) {
    setupGeometry()
    const layer = _context.layer
    const map = layer.getMap()
    layer.clear()
    layer._clearAllListeners()
    map.setCenter(geometry.getFirstCoordinate())
    if (geometry instanceof maptalks.Polygon || geometry instanceof maptalks.LineString) {
      geometry.setSymbol({
        lineWidth: 2,
        lineColor: '#000000',
        lineOpacity: 1,
        polygonFill: '#000000',
        polygonOpacity: 1
      })
    }
    const testPoints = getTestPoints(geometry)
    layer.once('layerload', function () {
      if (layer.isEmpty()) {
        return
      }
      expect(isDrawn(testPoints, _context.container)).to.be.ok()
      layer.once('layerload', function () {
        expect(isDrawn(testPoints, _context.container)).not.to.be.ok()
        done()
      })
      layer.once('remove', function () {
        expect(isDrawn(testPoints, _context.container)).not.to.be.ok()
        done()
      })
      layer.once('hide', function () {
        expect(isDrawn(testPoints, _context.container)).not.to.be.ok()
        done()
      })
      fn()
    })

    layer.addGeometry(geometry)
  }

  const type = geometry.getType()
  context('Type of ' + type + ' geometry', function () {
    it('should be removed', function (done) {
      test(function () {
        geometry.remove()
      }, done)
    })

    it('should be removed by layer', function (done) {
      test(function () {
        _context.layer.removeGeometry(geometry)
      }, done)
    })

    it('should be cleared by layer', function (done) {
      test(function () {
        _context.layer.clear()
      }, done)
    })

    it('should be hided with layer', function (done) {
      test(function () {
        _context.layer.hide()
      }, done)
    })

    it('should be removed with layer', function (done) {
      test(function () {
        _context.layer.remove()
      }, done)
    })

    it('should be removed with layer by map', function (done) {
      test(function () {
        const map = _context.layer.getMap()
        map.removeLayer(_context.layer)
      }, done)
    })

    it('should be hided', function (done) {
      test(function () {
        geometry.hide()
      }, done)
    })

    it('should be removed when it is being edited', function (done) {
      setupGeometry()
      const layer = _context.layer
      const map = layer.getMap()
      layer.config('drawImmediate', true)
      layer.clear()
      map.setCenter(geometry.getFirstCoordinate())
      if (!(geometry instanceof maptalks.Marker) && !(geometry instanceof maptalks.MultiPoint)) {
        geometry.setSymbol({
          lineWidth: 5,
          lineColor: '#000000',
          lineOpacity: 1,
          polygonFill: '#000000',
          polygonOpacity: 1
        })
      } else {
        geometry.setSymbol({
          markerType: 'pie',
          markerHeight: 24,
          markerWidth: 24,
          markerFill: '#de3333',
          markerLineColor: '#ffffff',
          markerLineWidth: 1,
          opacity: 1
        })
      }
      const testPoints = getTestPoints(geometry)
      layer.addGeometry(geometry)
      geometry.startEdit()
      const editLayer = (geometry instanceof maptalks.GeometryCollection) ? geometry.getGeometries()[0]._editor._editStageLayer : geometry._editor._editStageLayer
      editLayer.once('layerload', function () {
        if (layer.isEmpty()) {
          return
        }
        expect(isDrawn(testPoints, _context.container)).to.be.ok()
        layer.on('layerload', function () {
          if (layer.isEmpty()) {
            expect(isDrawn(testPoints, _context.container)).not.to.be.ok()
            layer._clearListeners()
            done()
          }
        })
        setTimeout(function () {
          // layer throws layerload event right after editLayer in current frame
          // remove the geometry in the next frame
          geometry.remove()
        }, 1)
      })
    })
  })
}
