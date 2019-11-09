describe('Geometry.ConnectorLine', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let layer

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center)
    container = setups.container
    map = setups.map
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  describe('connect geometries', function () {
    it('can connect geometries with each other', function () {
      layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      layer.addGeometry(geometries)
      for (let i = 0; i < geometries.length; i++) {
        for (let ii = 0; ii < geometries.length; ii++) {
          const conn = new maptalks.ConnectorLine(geometries[i], geometries[ii])
          layer.addGeometry(conn)
          expect(conn.getConnectSource()).to.be.eql(geometries[i])
          expect(conn.getConnectTarget()).to.be.eql(geometries[ii])
        }
      }
    })

    it('can connect geometries with panel', function () {
      const panel = new maptalks.control.Panel({
        position: { // 放置panel的位置
          top: '150',
          left: '150'
        },
        draggable: true, // 能否拖动
        custom: false, // content值能否为html
        content: '面板内容'
      })
      map.addControl(panel)
      layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      layer.addGeometry(geometries)
      for (let i = 0; i < geometries.length; i++) {
        const conn = new maptalks.ArcConnectorLine(geometries[i], panel)
        layer.addGeometry(conn)
        expect(conn.getConnectSource()).to.be.eql(geometries[i])
        expect(conn.getConnectTarget()).to.be.eql(panel)
      }
    })

    it('can connect geometries with UIMarker', function () {
      const uimarker = new maptalks.ui.UIMarker(map.getCenter(), {
        draggable: true,
        content: 'UIMarker'
      })
      map.addControl(uimarker)
      layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      layer.addGeometry(geometries)
      for (let i = 0; i < geometries.length; i++) {
        const conn = new maptalks.ArcConnectorLine(geometries[i], uimarker)
        layer.addGeometry(conn)
        expect(conn.getConnectSource()).to.be.eql(geometries[i])
        expect(conn.getConnectTarget()).to.be.eql(uimarker)
      }
    })

    it('remove connector line', function () {
      layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      layer.addGeometry(geometries)
      for (let i = 0; i < geometries.length; i++) {
        for (let ii = 0; ii < geometries.length; ii++) {
          const conn = new maptalks.ConnectorLine(geometries[i], geometries[ii])
          layer.addGeometry(conn)
          conn.remove()
          expect(conn.getLayer()).not.to.be.ok()
        }
      }
    })

    it('setConnectSource and setConnectTarget', function () {
      layer = new maptalks.VectorLayer('id')
      map.addLayer(layer)
      const geometries = GEN_GEOMETRIES_OF_ALL_TYPES()
      layer.addGeometry(geometries)
      for (let i = 0; i < geometries.length; i++) {
        for (let ii = 0; ii < geometries.length; ii++) {
          const conn = new maptalks.ConnectorLine()
          expect(conn.getConnectSource()).not.to.be.ok()
          expect(conn.getConnectTarget()).not.to.be.ok()
          conn.setConnectSource(geometries[i])
          conn.setConnectTarget(geometries[ii])
          expect(conn.getConnectSource()).to.be.eql(geometries[i])
          expect(conn.getConnectTarget()).to.be.eql(geometries[ii])
          layer.addGeometry(conn)
        }
      }
    })
  })
})
