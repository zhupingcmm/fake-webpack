const Compiler = require("./compiler");
const options = require("../fakepack.config")

const compiler = new Compiler(options);
compiler.run()