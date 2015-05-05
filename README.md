# ventnor-selectize

A [ventnor](https://github.com/bengourley/ventnor) [selectize](https://github.com/brianreavis/selectize.js) view

[![build status](https://secure.travis-ci.org/domharrington/ventnor-selectize.svg)](http://travis-ci.org/domharrington/ventnor-selectize)
[![dependency status](https://david-dm.org/domharrington/ventnor-selectize.svg)](https://david-dm.org/domharrington/ventnor-selectize)

## Installation

```
npm install --save ventnor-selectize
```

## Usage
```js
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

```

### `var view = new Selectize(serviceLocator, selectedOptions, options)`

- `serviceLocator` - a service locator instance
- `selectedOptions` - the options to be selected (as an array)

Options must include:
- `service` a service with a `find()` function that has a signature of `function (searchTerm, query, sort, options, cb)`

Options can include:
- `logger` - defaults to `console`

## Credits
[Dom Harrington](https://github.com/domharrington/)

## License

ISC
