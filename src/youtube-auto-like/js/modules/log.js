export class Logger {
  constructor(debug = false) {
    this.debug = debug
  }

  debug(msg) {
    if (this.debug) {
      console.log("yal-debug: " + msg)
    }
  }

  info(msg) {
    console.log("yal-info: " + msg)
  }

  error = console.error.bind(console)

}
