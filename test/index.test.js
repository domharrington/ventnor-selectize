
var SelectizeView
  , assert = require('assert')
  , service = { find: function () {} }
  , jsdom = require('jsdom')
  , jquery = require('jquery')

before(function (done) {
  jsdom.env('<body></body>', [], function (errors, window) {
    if (errors) return done(new Error(errors))
    global.window = window
    global.document = window.document
    global.$ = window.$ = jquery(window)

    global.navigator = window.navigator = {}
    require.cache[require.resolve('jquery')].exports = window.$
    SelectizeView = require('../')

    done()
  })
})

describe('ventnor-selectize', function () {

  it('should throw if no service provided', function () {
    assert.throws(function () {
      // jshint nonew: false
      new SelectizeView({}, [], {})
    }, /no service provided/)
  })

  it('should default selected to []', function () {
    var view = new SelectizeView({}, undefined, { service: service })
    assert.deepEqual(view.selected, [])
  })

  it('should initialize a <select> element', function () {
    var view = new SelectizeView({}, [], { service: service })

    view.render().$el.appendTo('body')
    assert.equal($('select').length, 1)
  })

  it('should set the placeholder', function () {
    var view = new SelectizeView({}, [], { service: service, placeholder: 'placeholder' })

    view.render().$el.appendTo('body')
    assert.equal($('body select:not(.selectized)').attr('placeholder'), 'placeholder')
  })

  describe('#initialize()', function () {
    it('should call find on the service with the selected options', function (done) {

      var selected = [ 1, 2, 3 ]

      function find(str, query) {
        assert.deepEqual(query, { _id: { $in: selected } })
        done()
      }

      var view = new SelectizeView({}, selected, { service: { find: find } })
      view.render().$el.appendTo('body')
    })

    it('should add each item to the selectize instance', function (done) {
      function find(str, q, sort, opts, cb) {
        cb(null, { results: [ { _id: 1, name: 'name' } ] })
      }

      var view = new SelectizeView({}, [], { service: { find: find } })
      view.render().$el.appendTo('body')

      setTimeout(function () {
        assert.deepEqual(view.el.selectize.options, { 1: { value: 1, text: 'name', '$order': 1 } })
        done()
      }, 2)
    })
  })

  describe('#updateSelection()', function () {

    it('should update the `selected` property', function (done) {
      var view = new SelectizeView({}, [], { service: service })

      view.render().$el.appendTo('body')

      setTimeout(function () {
        view.el.selectize.addOption({ value: 1, text: 'text' })
        view.el.selectize.addItem(1, false)

        process.nextTick(function () {
          view.updateSelection()
          assert.deepEqual(view.selected, [ '1' ])
          done()
        })
      }, 2)
    })

    it('should emit a `change` event', function (done) {
      var view = new SelectizeView({}, [], { service: service })

      view.render().$el.appendTo('body')

      setTimeout(function () {
        view.on('change', function () { done() })
        view.updateSelection()
      }, 2)
    })

  })

  describe('#load()', function () {

    it('should call `service.find()`', function (done) {
      var called = false

      function find(str, q, sort, opts, cb) {
        if (str) {
          assert.equal(str, 'search query')
          called = true
        }
        cb(null, { results: [] })
      }

      var view = new SelectizeView({}, [], { service: { find: find } })

      view.load('search query', function () {
        assert.equal(called, true)
        return done()
      })
    })

    it('should callback with each item in selectize format', function (done) {
      function find(str, q, sort, opts, cb) {
        cb(null, { results: str ? [ { _id: 1, name: 'name' } ] : [] })
      }

      var view = new SelectizeView({}, [], { service: { find: find } })

      view.load('search query', function (items) {
        assert.deepEqual(items, [ { value: 1, text: 'name' } ])
        return done()
      })
    })

  })

})
