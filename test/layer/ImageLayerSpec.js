describe('Layer.ImageLayer', function () {
  let container
  let map
  let layer
  const center = new maptalks.Coordinate(118.846825, 32.046534)

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '100px'
    container.style.height = '100px'
    document.body.appendChild(container)
    const option = {
      zoom: 14,
      center: center
    }
    map = new maptalks.Map(container, option)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('add and remove', function (done) {
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const layer = new maptalks.ImageLayer('images', {
      url: TILE_IMAGE,
      extent: extent.toJSON()
    }, {
      renderer: 'canvas'
    })
    layer.on('layerload', function () {
      expect(layer).to.be.painted(1, 1)
      map.removeLayer(layer)
      done()
    })
    layer.addTo(map)
  })

  it('add with array', function (done) {
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const layer = new maptalks.ImageLayer('images', [
      {
        url: TILE_IMAGE,
        extent: extent.toJSON()
      }
    ], {
      renderer: 'canvas'
    })
    layer.on('layerload', function () {
      expect(layer).to.be.painted(1, 1, [0, 0, 0, 255])
      done()
    })
    layer.addTo(map)
  })

  it('image opacity', function (done) {
    map.setBearing(20)
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const layer = new maptalks.ImageLayer('images', [
      {
        url: TILE_IMAGE,
        extent: extent.toJSON(),
        opacity: 0.5
      }
    ], {
      renderer: 'canvas'
    })
    layer.on('layerload', function () {
      if (maptalks.Browser.ie) {
        expect(layer).to.be.painted(0, 1, [0, 0, 0, 58])
      } else {
        expect(layer).to.be.painted(0, 1, [0, 0, 0, 104])
      }
      done()
    })
    layer.addTo(map)
  })

  it('#getImages', function () {
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const images = [
      {
        url: TILE_IMAGE,
        extent: extent.toJSON()
      }
    ]
    const layer = new maptalks.ImageLayer('images', images, {
      renderer: 'canvas'
    })
    expect(layer.getImages()).to.be.eql(images)
  })

  it('#setImages', function () {
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const images = [
      {
        url: TILE_IMAGE,
        extent: extent.toJSON()
      }
    ]
    const layer = new maptalks.ImageLayer('images', {
      renderer: 'canvas'
    }).addTo(map)
    expect(layer.getImages()).to.be.eql([])

    layer.setImages(images)
    expect(layer.getImages()).to.be.eql(images)
  })

  it('#setImages and dispose images', function (done) {
    if (!maptalks.Browser.webgl) {
      done()
      return
    }
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const images = [
      {
        url: TILE_IMAGE,
        extent: extent.toJSON()
      }
    ]
    const images2 = [
      {
        url: TILE_IMAGE + '2',
        extent: extent.toJSON()
      }
    ]
    const layer = new maptalks.ImageLayer('images', images, {
      renderer: 'gl'
    })
    layer.once('layerload', function () {
      layer.setImages(images2)
      layer.once('layerload', function () {
        done()
      })
    })
    layer.addTo(map)
  })

  it('#setImages and paint', function (done) {
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const images = [
      {
        url: TILE_IMAGE,
        extent: extent.add([2, 2]).toJSON()
      }
    ]
    const images2 = [
      {
        url: TILE_IMAGE,
        extent: extent.toJSON()
      }
    ]
    const layer = new maptalks.ImageLayer('images', images, {
      renderer: 'canvas'
    })
    layer.once('layerload', function () {
      expect(layer).not.to.be.painted(1, 1)
      layer.setImages(images2)
      layer.once('layerload', function () {
        expect(layer).to.be.painted(1, 1)
        done()
      })
    })
    layer.addTo(map)
  })

  it('add with gl renderer', function (done) {
    if (!maptalks.Browser.webgl) {
      done()
      return
    }
    const extent = new maptalks.Rectangle(center, 100, 100).getExtent()
    const layer = new maptalks.ImageLayer('images', [
      {
        url: TILE_IMAGE,
        extent: extent
      }
    ], {
      renderer: 'gl'
    })
    layer.on('layerload', function () {
      // expect(layer).to.be.painted(1, 1);
      done()
    })
    layer.addTo(map)
  })
})
