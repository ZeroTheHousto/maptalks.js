describe('TileConfig', function () {
  let map, container

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '1px'
    container.style.height = '1px'
    document.body.appendChild(container)
  })

  afterEach(function () {
    if (map) {
      map.remove()
    }
    REMOVE_CONTAINER(container)
  })

  it('should getTilePrjExtent with 3857 projection', function () {
    const option = {
      zoom: 13,
      center: [-0.09, 51.505]
    }
    map = new maptalks.Map(container, option)
    const z = 13; const x = 4093; const y = 2724

    // getTileConfig
    const size = 256
    const srs = map.getSpatialReference()
    const projection = srs.getProjection()
    const tileSystem = maptalks.TileSystem.getDefault(projection)
    const fullExtent = srs.getFullExtent()
    const tileConfig = new maptalks.TileConfig(tileSystem, fullExtent, new maptalks.Size(size, size))

    // tileCoordToExtent
    const res = srs.getResolution(z)
    const extent = tileConfig.getTilePrjExtent(x, y, res)

    expect(extent.contains(projection.project(new maptalks.Coordinate(-0.09, 51.5)))).to.be.ok()
  })

  it('should getTilePrjExtent with baidu projection', function () {
    const option = {
      zoom: 13,
      center: [121, 31],
      spatialReference: {
        projection: 'BAIDU'
      }
    }
    map = new maptalks.Map(container, option)

    const z = 13; const x = 1644; const y = 440

    // getTileConfig
    const size = 256
    const srs = map.getSpatialReference()
    const projection = srs.getProjection()
    const tileSystem = maptalks.TileSystem.getDefault(projection)
    const fullExtent = srs.getFullExtent()
    const tileConfig = new maptalks.TileConfig(tileSystem, fullExtent, new maptalks.Size(size, size))

    // tileCoordToExtent
    const res = srs.getResolution(z)
    const extent = tileConfig.getTilePrjExtent(x, y, res)

    expect(extent.contains(projection.project(new maptalks.Coordinate(121, 30.996)))).to.be.ok()
  })

  it('tile index in full extent', function () {
    const tileSystem = [1, 1, -20037508.34, -20037508.34]
    const fullExtent = {
      bottom: 3574191.5907699764,
      left: 11581589.65334464,
      right: 11588412.424935361,
      top: 3579213.587178574
    }

    const tileConfig = new maptalks.TileConfig(tileSystem, fullExtent, new maptalks.Size(256, 256))
    const fullIndex = tileConfig._getTileFullIndex(19.109257071294063)
    console.log(fullIndex.toString())
    expect(fullIndex.toString()).to.be.eql('6463,4826,6464,4827')
  })
})
