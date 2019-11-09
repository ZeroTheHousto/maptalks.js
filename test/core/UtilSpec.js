describe('Util', function () {
  describe('replace variable', function () {
    it('replace variables with value', function () {
      const str = '{foo} is not {foo2}.'
      const r = maptalks.StringUtil.replaceVariable(str, { foo: 'apple', foo2: 'pear' })
      expect(r).to.eql('apple is not pear.')
    })

    it('replace variables without value', function () {
      const str = '{foo} is not {foo2}.'
      const r = maptalks.StringUtil.replaceVariable(str, { foo: 'apple' })
      expect(r).to.eql('apple is not .')
    })

    it('input null', function () {
      const str = '{foo} is not {foo2}.'
      const r = maptalks.StringUtil.replaceVariable(str, null)
      expect(r).to.eql(' is not .')
    })
  })

  it('sign', function () {
    expect(maptalks.Util.sign(-2)).to.be.eql(-1)
    expect(maptalks.Util.sign(2)).to.be.eql(1)
  })

  it('now', function () {
    const now = Date.now()
    const now2 = maptalks.Util.now()

    expect(now2 >= now).to.be.ok()
  })

  it('getSymbolStamp', function () {
    let symbol = {
      markerType: 'ellipse',
      markerFill: {
        type: 'radial',
        colorStops: [
          [0.40, 'rgba(17, 172, 263, 1)'],
          [0.00, 'rgba(17, 172, 263, 0)']
        ]
      },
      markerWidth: 10,
      markerHeight: 10
    }
    let expected = 'markerType=ellipse;markerFill=radial_0,rgba(17, 172, 263, 0),0.4,rgba(17, 172, 263, 1);markerWidth=10;markerHeight=10'
    expect(maptalks.Util.getSymbolStamp(symbol)).to.be.eql(expected)

    symbol = [
      {
        markerFile: 'foo.png',
        markerWidth: 5,
        markerHeight: 5
      },
      {
        markerType: 'ellipse',
        markerFill: {
          type: 'radial',
          colorStops: [
            [0.40, 'rgba(17, 172, 263, 1)'],
            [0.00, 'rgba(17, 172, 263, 0)']
          ]
        },
        markerWidth: 10,
        markerHeight: 10
      }
    ]
    expected = '[ markerFile=foo.png;markerWidth=5;markerHeight=5 , markerType=ellipse;markerFill=radial_0,rgba(17, 172, 263, 0),0.4,rgba(17, 172, 263, 1);markerWidth=10;markerHeight=10 ]'
    expect(maptalks.Util.getSymbolStamp(symbol)).to.be.eql(expected)
  })

  describe('split content', function () {
    const style = {
      textFaceName: 'sans-serif',
      textSize: 18,
      textFill: '#333333',
      textWrapWidth: 100,
      textLineSpacing: 8
    }
    const font = maptalks.StringUtil.getFont(style); const wrapWidth = style.textWrapWidth

    function concat (texts) {
      return texts.map(function (t) {
        return t.text
      }).join('')
    }

    it('split short text', function () {
      const shortText = 'short text.'
      const shorts = maptalks.StringUtil.splitContent(shortText, font, wrapWidth)
      for (let i = 0, l = shorts.length; i < l; i++) {
        const w = maptalks.StringUtil.stringWidth(shorts[i].text, font)
        expect(w).to.be.below(wrapWidth)
      }
      expect(concat(shorts)).to.be.eql(shortText)
    })

    it('split long text', function () {
      const longText = 'This is a long text : 213232132323213213123213213123213213213123123123123123123123123123123123123123.'
      const longs = maptalks.StringUtil.splitContent(longText, font, wrapWidth)
      for (let i = 0, l = longs.length; i < l; i++) {
        const w = maptalks.StringUtil.stringWidth(longs[i].text, font)
        expect(w).not.to.be.above(wrapWidth)
      }
      expect(concat(longs)).to.be.eql(longText)
    })

    it('split chinese text', function () {
      const chineseText = '这是一段需要分割的中文长文本字符串;这是一段需要分割的中文长文本字符串;这是一段需要分割的中文长文本字符串。'
      const texts = maptalks.StringUtil.splitContent(chineseText, font, wrapWidth)
      for (let i = 0, l = texts.length; i < l; i++) {
        const w = maptalks.StringUtil.stringWidth(texts[i].text, font)
        expect(w).not.to.be.above(wrapWidth)
      }
      expect(concat(texts)).to.be.eql(chineseText)
    })

    it('split chi-eng text', function () {
      const text = '这是一段w需要分割的   中文1wreqdf we长文dfsdf本字符  串;这是一段  dfs需要qweqwdsd分sdfg割的fg  中文长gdf文fsdfsd本字符串;这是   一段需sdgsd要分割的dfsdf  中文长文 sdfsdf本字符串。'
      const texts = maptalks.StringUtil.splitContent(text, font, wrapWidth)
      for (let i = 0, l = texts.length; i < l; i++) {
        const w = maptalks.StringUtil.stringWidth(texts[i].text, font)
        expect(w).not.to.be.above(wrapWidth)
      }
      expect(concat(texts)).to.be.eql(text)
    })

    it('split text with a small wrapWidth', function () {
      const shorts = maptalks.StringUtil.splitContent('foo', font, 2)
      for (let i = 0; i < shorts.length; i++) {
        const w = maptalks.StringUtil.stringWidth(shorts[i].text, font)
        expect(w).to.be.below(wrapWidth)
      }
      expect(shorts.length).to.be(1)
      expect(concat(shorts)).to.be.eql('')
    })
  })
})
