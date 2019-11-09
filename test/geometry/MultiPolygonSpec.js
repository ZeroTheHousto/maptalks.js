describe('Geometry.MultiPolygon', function () {
  let container
  let map
  const center = new maptalks.Coordinate(118.846825, 32.046534)
  let layer

  beforeEach(function () {
    const setups = COMMON_CREATE_MAP(center)
    container = setups.container
    map = setups.map
    layer = new maptalks.VectorLayer('id')
    map.addLayer(layer)
  })

  afterEach(function () {
    map.remove()
    REMOVE_CONTAINER(container)
  })

  it('getCenter', function () {
    const mp = new maptalks.MultiPolygon([])
    const coords = []
    coords[0] = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 8, y: 5 }
      ]
    ]
    coords[1] = [
      [
        { x: 5, y: 6 },
        { x: 7, y: 8 },
        { x: 6, y: 5 }
      ]
    ]
    mp.setCoordinates(coords)
    expect(mp.getCenter().toArray()).to.be.eql([5, 5])
  })

  it('getCenterInExtent', function () {
    const mp = new maptalks.MultiPolygon([])
    const coords = []
    coords[0] = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 8, y: 5 }
      ]
    ]
    coords[1] = [
      [
        { x: 5, y: 6 },
        { x: 7, y: 8 },
        { x: 6, y: 5 }
      ]
    ]
    mp.setCoordinates(coords)
    let center = mp.getCenterInExtent(new maptalks.Extent(100, 100, 100.5, 100.5))
    expect(center === null).to.be.ok()
    center = mp.getCenterInExtent(new maptalks.Extent(2, 3, 2.5, 3.5))
    expect(center.x).to.be(2.25)
    expect(center.y).to.be(3.125)
  })

  it('getExtent', function () {
    const mp = new maptalks.MultiPolygon([])
    const coords = []
    coords[0] = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 3 }
      ]
    ]
    coords[1] = [
      [
        { x: 5, y: 6 },
        { x: 7, y: 8 },
        { x: 6, y: 5 }
      ]
    ]
    mp.setCoordinates(coords)

    const extent = mp.getExtent()
    expect(extent.getWidth()).to.be.above(0)
    expect(extent.getHeight()).to.be.above(0)
  })

  it('getSize', function () {
    const mp = new maptalks.MultiPolygon([])
    const coords = []
    coords[0] = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 3 }
      ]
    ]
    coords[1] = [
      [
        { x: 5, y: 6 },
        { x: 7, y: 8 },
        { x: 6, y: 5 }
      ]
    ]
    mp.setCoordinates(coords)
    layer.addGeometry(mp)
    const size = mp.getSize()

    expect(size.width).to.be.above(0)
    expect(size.height).to.be.above(0)
  })

  it('getCoordinates/setCoordinates', function () {
    const mp = new maptalks.MultiPolygon([])

    expect(mp.getCoordinates()).to.be.empty()

    const coords = []
    coords[0] = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 3 },
        { x: 1, y: 2 }
      ]
    ]
    coords[1] = [
      [
        { x: 5, y: 6 },
        { x: 7, y: 8 },
        { x: 6, y: 5 },
        { x: 5, y: 6 }
      ]
    ]
    mp.setCoordinates(coords)

    expect(mp.getCoordinates()).to.eql(coords)
  })

  describe('creation', function () {
    it('normal constructor', function () {
      const points = [
        [
          [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
        ],
        [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
          [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
        ]
      ]
      const multiPolygon = new maptalks.MultiPolygon(points)
      const coordinates = multiPolygon.getCoordinates()
      expect(coordinates).to.have.length(points.length)
      const geojsonCoordinates = maptalks.Coordinate.toNumberArrays(coordinates)
      expect(geojsonCoordinates).to.eql(points)
    })

    it('can be empty.', function () {
      const multiPolygon = new maptalks.MultiPolygon()
      expect(multiPolygon.getCoordinates()).to.have.length(0)
      expect(multiPolygon.isEmpty()).to.be.ok()
    })
  })

  it('can have various symbols', function (done) {
    const points = [
      [
        [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
      ],
      [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
      ]
    ]
    const vector = new maptalks.MultiPolygon(points)
    COMMON_SYMBOL_TESTOR.testGeoSymbols(vector, map, done)
  })

  it('multipolygon with circle', function () {
    const circle = new maptalks.Circle([-0.131049, 51.503568], 1000)
    const polygon = new maptalks.Polygon([[[-0.131049, 51.503568], [-0.107049, 51.503568], [-0.107049, 51.501568], [-0.131049, 51.501568]]])
    const multiPolygon = new maptalks.MultiPolygon([polygon, circle]).copy()
    const target = { type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: [[[[-0.131049, 51.503568], [-0.107049, 51.503568], [-0.107049, 51.501568], [-0.131049, 51.501568], [-0.131049, 51.503568]]], [[[-0.11661744184584677, 51.503568], [-0.11669889881443396, 51.50452285062761], [-0.1169429583294459, 51.50546688241593], [-0.1173468648233893, 51.50638939910766], [-0.11790605070029869, 51.507279948219946], [-0.11861418768967269, 51.50812843947551], [-0.11946325820770198, 51.508925259129285], [-0.12044364593293722, 51.50966137889634], [-0.12154424458287849, 51.51032845824551], [-0.12275258366594244, 51.51091893890134], [-0.12405496978954034, 51.51142613048205], [-0.1254366419211692, 51.51184428630444], [-0.1268819388386646, 51.51216866849609], [-0.1283744768647921, 51.5123956016771], [-0.12989733585686736, 51.51252251460397], [-0.13143325132955397, 51.512547969302545], [-0.13296481051634146, 51.51247167736096], [-0.13447465012450266, 51.51229450319727], [-0.1359456535267327, 51.512018454265615], [-0.1373611451300576, 51.51164665831061], [-0.13870507970329982, 51.51118332792885], [-0.13996222449895868, 51.510633712838796], [-0.14111833209187807, 51.510004040398826], [-0.14216030196485008, 51.50930144504929], [-0.14307632900408862, 51.50853388747623], [-0.14385603721848383, 51.50771006441357], [-0.1444905971696926, 51.50683931010576], [-0.14497282578804516, 51.5059314905472], [-0.14529726745502103, 51.50499689169612], [-0.14546025544473196, 51.50404610293117], [-0.14545995304843018, 51.50308989706889], [-0.14529637393263783, 51.50213910830382], [-0.14497138152069056, 51.501204509452805], [-0.14448866742839073, 51.500296689894185], [-0.14385370921445428, 51.49942593558649], [-0.14307370794733743, 51.49860211252383], [-0.14215750630933144, 51.497834554950714], [-0.14111548818232222, 51.49713195960118], [-0.13995946086083677, 51.496502287161206], [-0.13870252123422233, 51.4959526720711], [-0.1373589074555639, 51.49548934168945], [-0.13594383777444818, 51.49511754573439], [-0.1344733383542689, 51.494841496802735], [-0.13296406201106947, 51.494664322639096], [-0.13143309991687602, 51.49458803069746], [-0.12989778837936683, 51.49461348539603], [-0.1283755128717985, 51.494740398322904], [-0.1268835115093907, 51.49496733150397], [-0.1254386801816736, 51.495291713695565], [-0.12405738152426693, 51.49570986951795], [-0.12275525988081881, 51.49621706109872], [-0.12154706433113915, 51.49680754175449], [-0.12044648178107309, 51.49747462110366], [-0.11946598199460823, 51.49821074087072], [-0.11861667631865203, 51.49900756052455], [-0.11790819170209943, 51.49985605178006], [-0.11734856143937122, 51.50074660089234], [-0.11694413388408975, 51.501669117584015], [-0.11669950018062991, 51.50261314937245], [-0.11661744184584677, 51.503568]]]] }, properties: null }
    const geojson = multiPolygon.toGeoJSON()
    expect(geojson).to.be.eqlGeoJSON(target)

    let geometry = maptalks.GeoJSON.toGeometry(geojson)
    expect(geometry instanceof maptalks.MultiPolygon).to.be.ok()

    const json = multiPolygon.toJSON()
    geometry = maptalks.Geometry.fromJSON(json)
    expect(geometry instanceof maptalks.MultiPolygon).to.be.ok()
  })
})
