
describe('VectorLayer with GeoJSON', function () {
  // examples are from geoJSON.org
  const geoJSONs = [

    { type: 'Point', coordinates: [100.0, 0.0] },
    {
      type: 'LineString',
      coordinates: [[100.0, 0.0], [101.0, 1.0]]
    },
    // Polygon without Holes
    {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    // Polygon with Holes
    {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
      ]
    },
    {
      type: 'MultiPoint',
      coordinates: [[100.0, 0.0], [101.0, 1.0]]
    },
    {
      type: 'MultiLineString',
      coordinates: [
        [[100.0, 0.0], [101.0, 1.0]],
        [[102.0, 2.0], [103.0, 3.0]]
      ]
    },
    {
      type: 'MultiPolygon',
      coordinates: [
        [
          [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
        ],
        [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
          [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
        ]
      ]
    },
    {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [100.0, 0.0]
        },
        {
          type: 'LineString',
          coordinates: [[101.0, 0.0], [102.0, 1.0]]
        }
      ]
    },
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [102.0, 0.5] },
          properties: { prop0: 'value0' }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
            ]
          },
          properties: {
            prop0: 'value0',
            prop1: 0.0
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                [100.0, 1.0], [100.0, 0.0]]
            ]
          },
          properties: {
            prop0: 'value0',
            prop1: { this: 'that' }
          }
        }
      ]
    }
  ]

  let container
  let map

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)
    const option = {
      zoom: 17,
      center: [100, 0]
    }
    map = new maptalks.Map(container, option)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('create', function () {
    const count = geoJSONs.length + 2
    const layer = new maptalks.VectorLayer('v', { visible: true }).addTo(map)
    layer.addGeometry(geoJSONs)
    const json = layer.toJSON()
    expect(json).to.be.ok()
    expect(json.geometries).to.have.length(count)
    let i; const len = geoJSONs.length
    for (i = 0; i < len - 1; i++) {
      expect(json.geometries[i].feature.geometry).to.be.eql(geoJSONs[i])
    }
    const collection = geoJSONs[len - 1]
    for (i = len - 1; i < len - 1 + collection.features.length; i++) {
      expect(json.geometries[i].feature).to.be.eql(collection.features[i - len + 1])
    }
  })

  it('create with only one geometry', function () {
    const layer = new maptalks.VectorLayer('v', geoJSONs[2]).addTo(map)
    expect(layer.getCount()).to.be.eql(1)
  })

  it('from/toJSON', function () {
    const count = geoJSONs.length + 2
    const layer = new maptalks.VectorLayer('v', geoJSONs).addTo(map)
    const json = layer.toJSON()
    expect(json).to.be.ok()
    expect(json.geometries).to.have.length(count)
    const layer2 = maptalks.Layer.fromJSON(json)
    expect(layer2).to.be.a(maptalks.VectorLayer)
    expect(layer2.getCount()).to.be.eql(count)
  })

  it('add again', function (done) {
    const count = geoJSONs.length + 2
    const layer = new maptalks.VectorLayer('v', geoJSONs).addTo(map)
    expect(layer.getCount()).to.be(count)
    map.removeLayer(layer)
    expect(layer.getCount()).to.be(count)
    layer.on('layerload', function () {
      expect(layer.getCount()).to.be(count)
      expect(layer).to.be.painted(0, -5)
      done()
    })
    map.addLayer(layer)
  })
})
