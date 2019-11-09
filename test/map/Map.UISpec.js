
describe('#Map', function () {
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
      center: center
    }
    map = new maptalks.Map(container, option)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  describe('Map.UI.InfoWindow', function () {
    it('show/hide/isVisible', function () {
      const options = {
        title: 'title',
        content: 'content',
        animation: null
      }
      const win = new maptalks.ui.InfoWindow(options)
      win.addTo(map)
      const pos = map.getCenter()
      win.show(pos)
      expect(win.isVisible()).to.be.ok()
      win.hide()
      expect(win.isVisible()).not.to.be.ok()
    })
  })

  describe('Map.UI.Menu', function () {
    it('addTo', function () {
      const options = {
        position: null,
        beforeOpen: null,
        items: [
          { item: 'item1' },
          { item: 'item2' }
        ],
        width: 160
      }
      const menu = new maptalks.ui.Menu(options)

      expect(function () {
        menu.addTo(map)
      }).to.not.throwException()
    })

    it('setItems', function () {
      const menu = new maptalks.ui.Menu()
      const items = [
        { item: 'item1' },
        { item: 'item2' }
      ]

      expect(function () {
        menu.setItems(items)
      }).to.not.throwException()
    })

    it('close/remove', function () {
      const options = {
        position: null,
        beforeOpen: null,
        items: [
          { item: 'item1' },
          { item: 'item2' }
        ],
        width: 160
      }
      const menu = new maptalks.ui.Menu(options)
      menu.addTo(map)
      const pos = new maptalks.Coordinate(10, 10)
      menu.show(pos)

      expect(function () {
        // menu.close();
        menu.remove()
      }).to.not.throwException()
    })

    it('show/hide/isVisible', function () {
      const options = {
        animation: null,
        position: null,
        beforeOpen: null,
        items: [
          { item: 'item1' },
          { item: 'item2' }
        ],
        width: 160
      }
      const menu = new maptalks.ui.Menu(options)
      menu.addTo(map)
      const pos = map.getCenter()
      menu.show(pos)
      expect(menu.isVisible()).to.be.ok()
      menu.hide()
      expect(menu.isVisible()).not.to.be.ok()
    })
  })
})
