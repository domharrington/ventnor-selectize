var Selectize = require('ventnor-selectize')
  , serviceLocator = {}
  , selectedOptions = [ 1, 2, 3 ]
  , service = { find: function (searchTerm, query, sort, options, cb) {} }
  , view = new Selectize(serviceLocator, selectedOptions, { service: service })

view.render().$el.appendTo('body')

// Emitted when the value changes
view.on('change', function (value) {
  alert(value)
})
