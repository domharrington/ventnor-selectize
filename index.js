module.exports = VentnorSelectize

var View = require('ventnor')

require('selectize')

function VentnorSelectize(serviceLocator, selected, options) {
  View.apply(this, arguments)
  this.$el = $('<select multiple/>')
  if (!options || !options.service) throw new Error('no service provided')
  this.service = options.service

  this.$el.addClass('control control--choice control--multiline')
  this.el = this.$el[0]
  this.$el.attr('placeholder', options.placeholder)
  this.selected = selected || []
}

VentnorSelectize.prototype = Object.create(View.prototype)

VentnorSelectize.prototype.initialize = function () {
  this.service.find('', { _id: { $in: this.selected } }, [], {}, function (err, res) {
    if (err) return this.serviceLocator.logger.error('Cannot find existing items')

    res.results.forEach(function (model) {
      // The item needs to be added to the list
      // of selectize options in order to be selected
      this.el.selectize.addOption({ value: model._id, text: model.name })
      // Select the added option
      this.el.selectize.addItem(model._id)
    }.bind(this))
    this.el.selectize.on('change', this.updateSelection.bind(this))
  }.bind(this))
}

VentnorSelectize.prototype.updateSelection = function () {
  this.selected = this.el.selectize.getValue()
  this.emit('change', this.selected)
}

VentnorSelectize.prototype.load = function (query, cb) {

  this.service.find(query, {}, [], {}, function (err, data) {
    if (err) return this.serviceLocator.logger.error('Cannot load new items')
    cb(data.results.map(function (model) {
      return { value: model._id, text: model.name }
    }))
  }.bind(this))

}

VentnorSelectize.prototype.render = function () {
  setTimeout(function () {
    this.$el.selectize(
      { delimiter: ','
      , persist: false
      , create: false
      , onInitialize: this.initialize.bind(this)
      , load: this.load.bind(this)
      , preload: true
      })
  }.bind(this), 0)
  return this
}
