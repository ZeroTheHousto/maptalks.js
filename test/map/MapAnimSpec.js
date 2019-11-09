describe('Map.Anim', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '2px'
    container.style.height = '2px'
    document.body.appendChild(container)
    const option = {
      zoomAnimation: false,
      zoom: 17,
      center: center,
      baseLayer: new maptalks.TileLayer('tile', {
        urlTemplate: TILE_IMAGE,
        subdomains: [1, 2, 3],
        renderer: 'canvas'
      })
    }
    map = new maptalks.Map(container, option)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('animateTo', function (done) {
    const center = map.getCenter().add(0.1, 0.1)
    const zoom = map.getZoom() - 1
    const pitch = map.getPitch() + 10
    const bearing = map.getBearing() + 60
    map.getBaseLayer().config('durationToAnimate', 300)
    map.on('animateend', function () {
      expect(map.getCenter().toArray()).to.be.closeTo(center.toArray())
      expect(map.getZoom()).to.be.eql(zoom)
      expect(map.getPitch()).to.be.eql(pitch)
      expect(map.getBearing()).to.be.approx(bearing)
      done()
    })
    map.animateTo({
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing
    }, {
      duration: 300
    })
  })

  it('rotate', function (done) {
    const pitch = map.getPitch() + 10
    const bearing = map.getBearing() + 60
    map.getBaseLayer().config('durationToAnimate', 300)
    map.on('animateend', function () {
      expect(map.getPitch()).to.be.eql(pitch)
      expect(map.getBearing()).to.be.approx(bearing)
      done()
    })
    map.animateTo({
      pitch: pitch,
      bearing: bearing
    }, {
      duration: 300
    })
  })

  it('zoomOut', function (done) {
    const zoom = map.getZoom() - 5
    map.getBaseLayer().config('durationToAnimate', 300)
    map.on('animateend', function () {
      expect(map.getZoom()).to.be.eql(zoom)
      done()
    })
    map.animateTo({
      zoom: zoom
    }, {
      duration: 300
    })
  })

  it('disable zoom by zoomable', function (done) {
    map.config('zoomable', false)
    const cur = map.getZoom()
    const zoom = map.getZoom() - 5
    map.getBaseLayer().config('durationToAnimate', 300)
    map.on('animateend', function () {
      expect(map.getZoom()).to.be.eql(cur)
      done()
    })
    map.animateTo({
      zoom: zoom
    }, {
      duration: 300
    })
  })

  // it('interrupt animateTo by _stopAnim', function (done) {
  //     var center = map.getCenter().add(0.1, 0.1);
  //     var zoom = map.getZoom() - 4;
  //     // var pitch = map.getPitch() + 10;
  //     var bearing = map.getBearing() + 60;
  //     map.on('animateinterrupted', function () {
  //         expect(map.getCenter().toArray()).not.to.be.closeTo(center.toArray());
  //         expect(map.getZoom()).not.to.be.eql(zoom);
  //         expect(map.getPitch()).not.to.be.eql(pitch);
  //         expect(map.getBearing()).not.to.be.eql(bearing);
  //         done();
  //     });
  //     var player = map.animateTo({
  //         center : center,
  //         zoom : zoom,
  //         // pitch : pitch,
  //         bearing : bearing
  //     }, {
  //         'duration' : 200
  //     });
  //     setTimeout(function () {
  //         map._stopAnim(player);
  //     }, 100);
  // });

  it('interupt animateTo by scrollZoom', function (done) {
    map.config('zoomAnimationDuration', 100)
    const cur = map.getZoom()
    const zoom = map.getZoom() - 4
    map.on('animateinterupted', function () {
      expect(map.getZoom()).not.to.be.eql(zoom)
    })
    let zoomendCount = 0
    map.on('zoomend', function () {
      zoomendCount++
      if (zoomendCount === 2) {
        // zoomend fired by scrollzoom
        done()
      }
    })
    map.animateTo({
      zoom: zoom
    }, {
      duration: 2000
    })
    setTimeout(function () {
      happen.once(container, {
        type: (maptalks.Browser.gecko ? 'DOMMouseScroll' : 'mousewheel'),
        detail: 100
      })
    }, 100)
  })
})
