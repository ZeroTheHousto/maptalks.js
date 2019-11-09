describe('OverlayLayer', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)
    const option = {
      zoom: 17,
      center: center
    }
    map = new maptalks.Map(container, option)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  describe('geometries', function () {
    it('addGeometry', function () {
      const layer = new maptalks.VectorLayer('vector')
      layer.setId('id')
      // map.addLayer(layer);
      const geometry = new maptalks.Polygon([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 },
          { x: 121.333, y: 30.333 }
        ]
      ])

      expect(function () {
        // layer.addGeometry(geometry);
        layer.addGeometry(geometry, true)
      }).to.not.throwException()
    })

    it('getGeometries', function () {
      const layer = new maptalks.VectorLayer('vector')
      layer.setId('id')
      // map.addLayer(layer);
      const count = 10
      for (let i = 0; i < count; i++) {
        const geometry = new maptalks.Polygon([
          [
            { x: 121.111, y: 30.111 },
            { x: 121.222, y: 30.222 },
            { x: 121.333, y: 30.333 }
          ]
        ])
        layer.addGeometry(geometry)
      }
      const geometries = layer.getGeometries()

      expect(geometries).to.have.length(count)
    })

    it('getGeometryById', function () {
      const layer = new maptalks.VectorLayer('vector')
      layer.setId('id')
      // map.addLayer(layer);
      const geometry = new maptalks.Polygon([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 },
          { x: 121.333, y: 30.333 }
        ]
      ])
      geometry.setId('id')
      layer.addGeometry(geometry)

      expect(layer.getGeometryById('id')).to.not.be(null)
      expect(layer.getGeometryById(null)).to.be(null)
      expect(layer.getGeometryById('')).to.be(null)
    })

    it('Geometry\'s id changed', function () {
      const layer = new maptalks.VectorLayer('vector')
      layer.setId('id')
      // map.addLayer(layer);
      const geometry = new maptalks.Polygon([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 },
          { x: 121.333, y: 30.333 }
        ]
      ])
      layer.addGeometry(geometry)
      geometry.setId('id')
      geometry.setId('new-id')
      expect(layer.getGeometryById('new-id')).to.not.be(null)
      expect(layer.getGeometryById('id')).to.be(null)

      // new id is the same with old id
      geometry.setId('new-id')
      expect(layer.getGeometryById('new-id')).to.not.be(null)

      geometry.setId(null)
      expect(layer.getGeometryById('new-id')).to.be(null)
      expect(layer.getGeometryById('id')).to.be(null)

      geometry.remove()
      expect(layer.getGeometryById('new-id')).to.be(null)
      expect(layer.getGeometryById('id')).to.be(null)
    })

    it('removeGeometry', function () {
      const layer = new maptalks.VectorLayer('layer')
      layer.setId('id')
      // map.addLayer(layer);
      const polygon = new maptalks.Polygon([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 },
          { x: 121.333, y: 30.333 }
        ]
      ])
      polygon.setId('polygon')
      const polyline = new maptalks.LineString([
        { x: 121.111, y: 30.111 },
        { x: 121.222, y: 30.222 }
      ])
      polyline.setId('polyline')
      layer.addGeometry(polygon)
      layer.addGeometry(polyline)

      let got

      layer.removeGeometry('polyline')
      got = layer.getGeometryById('polyline')
      expect(got).to.be(null)

      layer.removeGeometry(polygon)
      got = layer.getGeometryById('polygon')
      expect(got).to.be(null)
    })

    it('clear', function () {
      const layer = new maptalks.VectorLayer('layer')
      layer.setId('id')
      // map.addLayer(layer);
      const polygon = new maptalks.Polygon([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 },
          { x: 121.333, y: 30.333 }
        ]
      ])
      polygon.setId('polygon')
      const polyline = new maptalks.LineString([
        { x: 121.111, y: 30.111 },
        { x: 121.222, y: 30.222 }
      ])
      polyline.setId('polyline')
      layer.addGeometry(polygon)
      layer.addGeometry(polyline)

      layer.clear()

      const geometries = layer.getGeometries()
      expect(geometries).to.be.empty()
    })

    it('getExtent', function () {
      const layer = new maptalks.VectorLayer('layer')
      layer.setId('id')
      expect(layer.getExtent()).not.to.be.ok()
      // map.addLayer(layer);
      const polygon = new maptalks.Polygon([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 },
          { x: 121.333, y: 30.333 }
        ]
      ])
      polygon.setId('polygon')
      const polyline = new maptalks.LineString([
        { x: 121.111, y: 30.111 },
        { x: 121.222, y: 30.222 }
      ])
      polyline.setId('polyline')
      layer.addGeometry(polygon)
      layer.addGeometry(polyline)

      const extent = polygon.getExtent().combine(polyline.getExtent())

      expect(layer.getExtent().toJSON()).to.be.eql(extent.toJSON())
    })
  })

  describe('visibility', function () {
    it('should be true if initialized with default visibility', function () {
      const layer = new maptalks.VectorLayer('id')

      expect(layer.isVisible()).to.be.ok()
    })

    it('should be false after hide', function () {
      const layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      layer.hide()

      expect(layer.isVisible()).to.not.be.ok()
    })

    it('should be true after hide then show', function () {
      const layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      layer.hide()
      layer.show()

      expect(layer.isVisible()).to.be.ok()
    })
  })

  describe('addGeometry', function () {
    it('can be called on layer not on map', function () {
      const layer = new maptalks.VectorLayer('id')
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center)
      geo1.setId(gid)
      layer.addGeometry(geo1, true)

      expect(layer.getGeometryById(gid)).to.equal(geo1)
    })

    it('can be called on layer on map that not loaded', function () {
      const layer = new maptalks.VectorLayer('id')
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center)
      geo1.setId(gid)
      layer.addGeometry(geo1, true)
      map.addLayer(layer)

      expect(layer.getGeometryById(gid)).to.equal(geo1)
    })

    it('can be called if geometry is cleared by another layer', function () {
      const layer1 = new maptalks.VectorLayer('1')
      const layer2 = new maptalks.VectorLayer('2')
      const gid = 'g1'
      const geo = new maptalks.Marker(center)
      geo.setId(gid)
      layer1.addGeometry(geo, true)
      map.addLayer(layer1)
      layer1.clear()
      layer2.addGeometry(geo)
      expect(layer2.getGeometryById(gid)).to.be.ok()
    })

    it('will fail if geometry is added to another layer', function () {
      const layer1 = new maptalks.VectorLayer('1')
      const layer2 = new maptalks.VectorLayer('2')
      const gid = 'g1'
      const geo = new maptalks.Marker(center)
      geo.setId(gid)
      layer1.addGeometry(geo, true)
      map.addLayer(layer1)

      expect(function () {
        layer2.addGeometry(geo)
      }).to.throwException(function (e) {
        expect(e).to.be.a(Error)
      })
    })

    it('shold throw error if geometry to be added has same id', function () {
      const layer = new maptalks.VectorLayer('id')
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center)
      geo1.setId(gid)
      layer.addGeometry(geo1)
      const geo2 = new maptalks.Marker(center)
      geo2.setId(gid)

      expect(layer.addGeometry).withArgs(geo2).to.throwException()
      expect(function () {
        layer.addGeometry(geo2)
      }).to.throwException(function (e) {
        expect(e).to.be.a(Error)
      })
    })

    it('fit map view after added', function (done) {
      const layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const center1 = center.add(new maptalks.Coordinate(Math.random(), Math.random()))
      const center2 = center.add(new maptalks.Coordinate(Math.random(), Math.random()))
      const geo1 = new maptalks.Marker(center1)
      const geo2 = new maptalks.Marker(center2)
      layer.on('addgeo', function () {
        const center = center1.add(center2).multi(1 / 2)
        expect(map.getCenter()).to.be.closeTo(center)
        done()
      })
      layer.addGeometry([geo1, geo2], true)
    })

    it('support rest parameters', function (done) {
      const layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const center1 = center.add(new maptalks.Coordinate(Math.random(), Math.random()))
      const center2 = center.add(new maptalks.Coordinate(Math.random(), Math.random()))
      const geo1 = new maptalks.Marker(center1)
      const geo2 = new maptalks.Marker(center2)
      layer.on('addgeo', function () {
        expect(layer.getCount()).to.be(2)
        done()
      })
      layer.addGeometry(geo1, geo2)
    })

    it('support rest parameters and fit map view', function (done) {
      const layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const center1 = center.add(new maptalks.Coordinate(Math.random(), Math.random()))
      const center2 = center.add(new maptalks.Coordinate(Math.random(), Math.random()))
      const geo1 = new maptalks.Marker(center1)
      const geo2 = new maptalks.Marker(center2)
      layer.on('addgeo', function () {
        const center = center1.add(center2).multi(1 / 2)
        expect(map.getCenter()).to.be.closeTo(center)
        done()
      })
      layer.addGeometry(geo1, geo2, true)
    })
  })

  describe('getGeometry', function () {
    it('return null if called with non-existed id', function () {
      const layer = new maptalks.VectorLayer('id')

      expect(layer.getGeometryById('non-existed')).to.equal(null)
    })

    it('return value is empty after call clear', function () {
      const layer = new maptalks.VectorLayer('id')
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center, { id: gid })
      layer.addGeometry(geo1)

      expect(layer.clear().getGeometries()).to.be.empty()
    })

    it('selectAll', function () {
      const layer = new maptalks.VectorLayer('id')
      expect(layer.filter(function () { return true })).to.be.empty()
      const points = [
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 1,
            foo2: 'test1',
            foo3: true
          }
        }),
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 2,
            foo2: 'test2',
            foo3: false
          }
        }),
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 3,
            foo2: 'test3',
            foo3: true
          }
        }),
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 4,
            foo2: 'test4',
            foo3: true
          }
        })
      ]
      const selection = layer.addGeometry(points).filter(function () { return true })
      expect(selection).to.have.length(points.length)
      for (let i = 0; i < points.length; i++) {
        expect(selection[i].toJSON()).to.be.eql(points[i].toJSON())
      }
    })

    function genPoints () {
      const points = [
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 1,
            foo2: 'test1',
            foo3: true
          }
        }),
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 2,
            foo2: 'test2',
            foo3: false
          }
        }),
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 3,
            foo2: 'test3',
            foo3: true
          }
        }),
        new maptalks.Marker([0, 0], {
          properties: {
            foo1: 4,
            foo2: 'test4',
            foo3: true
          }
        })
      ]
      return points
    }

    it('filter by properties', function () {
      const layer = new maptalks.VectorLayer('id')
      const points = genPoints()
      let selection = layer.addGeometry(points).filter(function (geometry) {
        return geometry.getType() === 'Point' && geometry.getProperties().foo1 > 0 && geometry.getProperties().foo2.indexOf('test') >= 0
      })

      expect(selection).to.have.length(points.length)
      for (let i = points.length - 1; i >= 0; i--) {
        expect(selection[i].toJSON()).to.be.eql(points[i].toJSON())
      }

      expect(layer.filter(function (geometry) {
        return geometry.getProperties().foo3 === true
      })).to.have.length(3)

      selection = layer.filter(function (geometry) {
        return geometry.getType() !== 'Point'
      })
      expect(selection).to.be.empty()
    })

    it('filter by feature-filter', function () {
      const layer = new maptalks.VectorLayer('id')
      const points = genPoints()
      let selection = layer.addGeometry(points).filter([
        'all',
        ['==', '$type', 'Point'],
        ['>', 'foo1', 0]
      ])

      expect(selection).to.have.length(points.length)
      for (let i = points.length - 1; i >= 0; i--) {
        expect(selection[i].toJSON()).to.be.eql(points[i].toJSON())
      }

      expect(layer.filter(function (geometry) {
        return geometry.getProperties().foo3 === true
      })).to.have.length(3)

      selection = layer.filter(function (geometry) {
        return geometry.getType() !== 'Point'
      })
      expect(selection).to.be.empty()
    })
  })

  describe('isEmpty', function () {
    it('return true when clear', function () {
      const layer = new maptalks.VectorLayer('id').addTo(map)
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center, { id: gid })
      layer.addGeometry(geo1)
      layer.clear()
      expect(layer.isEmpty()).to.be.ok()
    })

    it('return true when removing geometry', function () {
      const layer = new maptalks.VectorLayer('id').addTo(map)
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center, { id: gid })
      layer.addGeometry(geo1)
      layer.removeGeometry(geo1)
      expect(layer.isEmpty()).to.be.ok()
    })

    it('return true when geometry removes itself', function () {
      const layer = new maptalks.VectorLayer('id').addTo(map)
      const gid = 'g1'
      const geo1 = new maptalks.Marker(center, { id: gid })
      layer.addGeometry(geo1)
      geo1.remove()
      expect(layer.isEmpty()).to.be.ok()
    })
  })
})
