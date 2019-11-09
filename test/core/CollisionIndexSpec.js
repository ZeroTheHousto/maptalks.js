describe('Collision.Spec', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)

  beforeEach(function () {
    container = document.createElement('div')
    container.style.width = '20px'
    container.style.height = '20px'
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

  it('insert and collides', function () {
    const index = new maptalks.CollisionIndex()
    const box = [0, 0, 10, 10]
    expect(index.collides(box)).not.to.be.ok()
    index.insertBox([0, 0, 10, 10])
    expect(index.collides(box)).to.be.ok()
    expect(index.collides([2, 3, 5, 8])).to.be.ok()
  })

  it('bulk insert', function () {
    const index = new maptalks.CollisionIndex()
    const box = [0, 0, 10, 10]
    index.bulkInsertBox([[0, 0, 10, 10]])
    expect(index.collides(box)).to.be.ok()
    expect(index.collides([2, 3, 5, 8])).to.be.ok()
  })

  it('clear', function () {
    const index = new maptalks.CollisionIndex()
    const box = [0, 0, 10, 10]
    index.insertBox(box)
    index.clear()
    expect(index.collides(box)).not.to.be.ok()
    index.insertBox(box)
    expect(index.collides(box)).to.be.ok()
  })
})
