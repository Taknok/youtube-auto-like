export class Logger {
  constructor(debug = false) {
    this.verbose = debug
  }

  debug(msg) {
    if (this.verbose) {
      console.log("yal-debug: " + msg)
    }
  }

  info(msg) {
    console.log("yal-info: " + msg)
  }

  error = console.error.bind(console)

}
