const {getAST,getDependencies,transform}  = require("./parser");
const ast = getAST("./src/index.js");
console.log(getDependencies(ast));
console.log(transform(ast))