describe('Map.Profile', function () {
  let container
  let map
  let tile
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
    tile = new maptalks.TileLayer('tile', {
      urlTemplate: '#',
      subdomains: [1, 2, 3],
      visible: false,
      renderer: 'canvas'
    })
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  describe('Layer can profile', function () {
    it('get tileLayer\'s profile', function () {
      const json = tile.toJSON()
      expect(json).to.be.ok()
      expect(json.options).to.eql(tile.config())
      expect(json.id).to.eql(tile.getId())
    })

    it('get tilelayer from a profile json', function () {
      let tileLayer = maptalks.Layer.fromJSON(null)
      expect(tileLayer).not.to.be.ok()
      const json = tile.toJSON()
      tileLayer = maptalks.Layer.fromJSON(json)
      expect(tileLayer).to.be.ok()
      expect(tileLayer.config()).to.eql(tile.config())
      expect(tileLayer.getId()).to.eql(tile.getId())
    })

    it('get vectorLayer\'s profile', function () {
      const vectorLayer = new maptalks.VectorLayer('vector')
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      vectorLayer.addGeometry(geometries)
      const style = {
        condition: [
          'all',
          ['==', '$type', 'Point'],
          ['!=', '$subType', 'Label']
        ],
        symbol: {
          markerFile: 'http://www.foo.com/foo.png'
        }
      }
      vectorLayer.setStyle(style)
      let json = vectorLayer.toJSON()
      expect(json).to.be.ok()
      expect(json.options).to.eql(vectorLayer.config())
      expect(json.id).to.eql(vectorLayer.getId())
      expect(json.style).to.eql(style)
      expect(json.geometries).to.be.ok()
      expect(json.geometries).to.have.length(geometries.length)

      for (let i = 0; i < geometries.length; i++) {
        if (!vectorLayer._styleGeometry(geometries[i])) {
          expect(geometries[i].toJSON()).to.be.eql(json.geometries[i])
        } else {
          const j = geometries[i].toJSON()
          if (!(geometries[i] instanceof maptalks.TextMarker)) {
            j.symbol = null
          }
          expect(j).to.be.eql(json.geometries[i])
        }
      }

      json = vectorLayer.toJSON({
        geometries: false
      })
      expect(json.geometries).not.to.be.ok()
    })

    it('get vectorlayer from a profile json', function () {
      const vectorLayer = new maptalks.VectorLayer('vector', { render: 'canvas' })
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      vectorLayer.addGeometry(geometries)
      const style = {
        condition: 'type === "Point"',
        symbol: {
          markerFile: 'http://www.foo.com/foo.png'
        }
      }
      vectorLayer.setStyle(style)
      const json = vectorLayer.toJSON()
      const layer = maptalks.Layer.fromJSON(json)
      expect(layer).to.be.ok()
      expect(layer.config()).to.eql(vectorLayer.config())
      expect(layer.getStyle()).to.eql(style)
      expect(layer.getId()).to.eql(vectorLayer.getId())
      expect(layer.getGeometries()).to.have.length(geometries.length)
      const layerGeos = layer.getGeometries()
      for (let i = 0; i < geometries.length; i++) {
        expect(geometries[i].toJSON()).to.be.eql(layerGeos[i].toJSON())
      }
    })
  })

  describe('Map can profile', function () {
    it('get simple Profile', function () {
      map.setBaseLayer(tile)
      let profile = map.toJSON()
      expect(profile).to.be.ok()
      const config = map.config()
      config.center = map.getCenter()
      config.zoom = map.getZoom()
      expect(profile.options).to.be.eql(config)
      expect(profile.baseLayer).to.be.ok()

      profile = map.toJSON({
        baseLayer: false,
        layers: false
      })
      expect(profile.baseLayer).not.to.be.ok()
      expect(profile.layers).to.be.ok()
      expect(profile.layers).to.have.length(0)
    })

    it('get map from a simple profile', function () {
      map.setBaseLayer(tile)
      const profile = map.toJSON()
      const container2 = document.createElement('div')
      container2.style.width = '800px'
      container2.style.height = '600px'
      document.body.appendChild(container2)
      const profileMap = maptalks.Map.fromJSON(container2, profile)

      expect(profileMap).to.be.ok()
      expect(profileMap.getBaseLayer()).to.be.ok()
    })

    it('get profile with various layers', function () {
      map.setBaseLayer(tile)
      const tile2 = new maptalks.TileLayer('road', {
        urlTemplate: '#',
        subdomains: ['1', '2', '3', '4', '5'],
        opacity: 0.6
      })
      map.addLayer(tile2)
      const vectorLayer = new maptalks.VectorLayer('vector-canvas', { render: 'canvas' })
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      vectorLayer.addGeometry(geometries)
      const vectorLayer2 = new maptalks.VectorLayer('vector')
      vectorLayer2.addGeometry(GEN_GEOMETRIES_OF_ALL_TYPES())
      map.addLayer([vectorLayer, vectorLayer2])

      const profile = map.toJSON()
      expect(profile.layers).to.have.length(3)
      expect(profile.layers[0]).to.be.eql(tile2.toJSON())
      expect(profile.layers[1]).to.be.eql(vectorLayer.toJSON())
      expect(profile.layers[2]).to.be.eql(vectorLayer2.toJSON())
    })

    it('get profile of selected layers', function () {
      map.setBaseLayer(tile)
      const tile2 = new maptalks.TileLayer('road', {
        urlTemplate: '#',
        subdomains: ['1', '2', '3', '4', '5'],
        opacity: 0.6
      })
      map.addLayer(tile2)
      const vectorLayer = new maptalks.VectorLayer('vector-canvas', { render: 'canvas' })
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      vectorLayer.addGeometry(geometries)
      const vectorLayer2 = new maptalks.VectorLayer('vector')
      vectorLayer2.addGeometry(GEN_GEOMETRIES_OF_ALL_TYPES())
      map.addLayer([vectorLayer, vectorLayer2])

      const profile = map.toJSON({
        layers: [
          {
            id: 'road'
          },
          {
            id: 'vector'
          }
        ]
      })
      expect(profile.layers).to.have.length(2)
      expect(profile.layers[0]).to.be.eql(tile2.toJSON())
      expect(profile.layers[1]).to.be.eql(vectorLayer2.toJSON())
    })

    it('get map from various profile', function () {
      map.setBaseLayer(tile)
      const tile2 = new maptalks.TileLayer('road', {
        urlTemplate: '#',
        subdomains: ['1', '2', '3', '4', '5'],
        opacity: 0.6
      })
      map.addLayer(tile2)
      const vectorLayer = new maptalks.VectorLayer('vector-canvas', { render: 'canvas' })
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      vectorLayer.addGeometry(geometries)
      const vectorLayer2 = new maptalks.VectorLayer('vector')
      vectorLayer2.addGeometry(GEN_GEOMETRIES_OF_ALL_TYPES())
      map.addLayer([vectorLayer, vectorLayer2])

      const profile = map.toJSON()
      const container2 = document.createElement('div')
      container2.style.width = '800px'
      container2.style.height = '600px'
      document.body.appendChild(container2)
      const profileMap = maptalks.Map.fromJSON(container2, profile)

      expect(profileMap).to.be.ok()
      expect(profileMap.getBaseLayer()).to.be.ok()
      const layers = profileMap.getLayers()
      expect(layers).to.have.length(3)
      expect(layers[0].toJSON()).to.be.eql(tile2.toJSON())
      expect(layers[1].toJSON()).to.be.eql(vectorLayer.toJSON())
      expect(layers[2].toJSON()).to.be.eql(vectorLayer2.toJSON())
      profileMap.remove()
    })
  })

  describe('profile basic geometries', function () {
    it('profile all types of basic geometries', function () {
      const all = GEN_GEOMETRIES_OF_ALL_TYPES()
      for (let i = 0; i < all.length; i++) {
        const g = all[i]
        const json = g.toJSON()
        const deser = maptalks.Geometry.fromJSON(json)
        const deserJSON = deser.toJSON()
        expect(json).not.to.be.empty()
        expect(json).to.be.eql(deserJSON)
      }
    })
  })

  describe('profile GeometryCollection', function () {
    it('profile a MultiLineString', function () {
      const expected = { feature: { type: 'Feature', geometry: { type: 'MultiLineString', coordinates: [[[121.111, 30.111], [121.222, 30.222]], [[121.333, 30.333], [121.444, 30.444]]] }, properties: { foo: 'bla' } }, options: {}, symbol: { lineColor: '#f00', polygonFill: '#000' } }
      const mls = new maptalks.MultiLineString([
        [
          { x: 121.111, y: 30.111 },
          { x: 121.222, y: 30.222 }
        ],
        [
          { x: 121.333, y: 30.333 },
          { x: 121.444, y: 30.444 }
        ]
      ], {
        symbol: {
          lineColor: '#f00',
          polygonFill: '#000'
        },
        properties: {
          foo: 'bla'
        }
      })
      const json = mls.toJSON()
      expect(json).to.be.eql(expected)

      const copy = maptalks.Geometry.fromJSON(json)
      const json2 = copy.toJSON()
      expect(json2).to.be.eql(json)
    })
  })

  describe('profile CurveLine and Label', function () {
    it('profile CurveLine', function () {
      const curve = new maptalks.ArcCurve(
        // 线端点坐标数组
        [[121.48416288620015, 31.24488412311837], [121.48394830947899, 31.242664302121515], [121.48595460182202, 31.242535881128543], [121.48695238357557, 31.244838259576046], [121.48944147354125, 31.24487495041167], [121.49018176322932, 31.242664302121515], [121.49290688758839, 31.242765204207824], [121.49358280426011, 31.245040058995645], [121.49601825004554, 31.245159303904526], [121.49715550666777, 31.242921143583686]],
        { draggable: true, arcDegree: 120 })
      curve.setProperties({
        foo: 1
      })
      curve.setSymbol({
        lineWidth: 2,
        lineColor: '#ff0000'
      })
      const json = curve.toJSON()
      const deser = maptalks.Geometry.fromJSON(json)
      expect(deser instanceof maptalks.ArcCurve).to.be.ok()
      const options = deser.config()
      expect(options.draggable).to.be.ok()
      expect(deser.getCoordinates()).to.be.eql(curve.getCoordinates())
      expect(deser.getProperties()).to.be.eql(curve.getProperties())
      expect(deser.getSymbol()).to.be.eql(curve.getSymbol())
    })

    it('profile Quadaric Bezier CurveLine', function () {
      const curve = new maptalks.QuadBezierCurve(
        // 线端点坐标数组
        [[121.48416288620015, 31.24488412311837], [121.48394830947899, 31.242664302121515], [121.48595460182202, 31.242535881128543], [121.48695238357557, 31.244838259576046], [121.48944147354125, 31.24487495041167], [121.49018176322932, 31.242664302121515], [121.49290688758839, 31.242765204207824], [121.49358280426011, 31.245040058995645], [121.49601825004554, 31.245159303904526], [121.49715550666777, 31.242921143583686]],
        { draggable: true })
      curve.setProperties({
        foo: 1
      })
      curve.setSymbol({
        lineWidth: 2,
        lineColor: '#ff0000'
      })
      const json = curve.toJSON()
      const deser = maptalks.Geometry.fromJSON(json)
      expect(deser instanceof maptalks.QuadBezierCurve).to.be.ok()
      const options = deser.config()
      expect(options.draggable).to.be.ok()
      expect(deser.getCoordinates()).to.be.eql(curve.getCoordinates())
      expect(deser.getProperties()).to.be.eql(curve.getProperties())
      expect(deser.getSymbol()).to.be.eql(curve.getSymbol())
    })

    it('profile Cubic Bezier CurveLine', function () {
      const curve = new maptalks.CubicBezierCurve(
        // 线端点坐标数组
        [[121.48416288620015, 31.24488412311837], [121.48394830947899, 31.242664302121515], [121.48595460182202, 31.242535881128543], [121.48695238357557, 31.244838259576046], [121.48944147354125, 31.24487495041167], [121.49018176322932, 31.242664302121515], [121.49290688758839, 31.242765204207824], [121.49358280426011, 31.245040058995645], [121.49601825004554, 31.245159303904526], [121.49715550666777, 31.242921143583686]],
        { draggable: true })
      curve.setProperties({
        foo: 1
      })
      curve.setSymbol({
        lineWidth: 2,
        lineColor: '#ff0000'
      })
      const json = curve.toJSON()
      const deser = maptalks.Geometry.fromJSON(json)
      expect(deser instanceof maptalks.CubicBezierCurve).to.be.ok()
      const options = deser.config()
      expect(options.draggable).to.be.ok()
      expect(deser.getCoordinates()).to.be.eql(curve.getCoordinates())
      expect(deser.getProperties()).to.be.eql(curve.getProperties())
      expect(deser.getSymbol()).to.be.eql(curve.getSymbol())
    })

    it('profile Label', function () {
      const options = {
        id: 'label',
        symbol: {
          markerLineColor: '#ff0000',
          markerLineWidth: 1,
          markerLineOpacity: 0.9,
          markerLineDasharray: null,
          markerFill: '#4e98dd',
          markerFillOpacity: 0.9,

          textFaceName: 'arial',
          textSize: 12,
          textFill: '#ff0000',
          textOpacity: 1,
          textSpacing: 30,
          textWrapWidth: null, // auto
          textWrapBefore: false,
          // 'textWrapCharacter': '\n',
          textLineSpacing: 8,
          textHorizontalAlignment: 'middle', // left middle right
          textVerticalAlignment: 'bottom' // top middle bottom
        },
        draggable: true,
        boxStyle: {
          padding: [12, 8],
          verticalAlignment: 'top',
          horizontalAlignment: 'right',
          minWidth: 300,
          minHeight: 200
        }
      }
      // 创建label
      const label = new maptalks.Label('文本标签', [100, 0], options)
      label.setProperties({
        foo: 1
      })
      const json = label.toJSON()
      const deser = maptalks.Geometry.fromJSON(json)
      expect(deser instanceof maptalks.Label).to.be.ok()
      expect(deser.getId()).to.be.eql('label')
      const deserOptions = deser.config()
      expect(deserOptions.draggable).to.be.ok()
      expect(deserOptions.textSymbol).to.be.ok()
      expect(deserOptions.boxStyle).to.be.ok()
      expect(deser.getContent()).to.be.eql(label.getContent())
      expect(deser.getCoordinates()).to.be.eql(label.getCoordinates())
      expect(deser.getProperties()).to.be.eql(label.getProperties())
      expect(deser.getTextSymbol()).to.be.eql(label.getTextSymbol())
      expect(deser.getBoxStyle()).to.be.eql(label.getBoxStyle())
    })
  })
})
