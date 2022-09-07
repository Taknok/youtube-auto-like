// init de log function
var log = () => {}

class Log {
  constructor(debug = false) {
    this.debug = debug
  }

  debug(msg) {

  }

  error = console.error.bind(console)

}

options.debug ? console.log.bind(console) : function () {};