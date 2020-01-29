const {getAST,getDependencies,transform}  = require("./parser");
const ast = getAST("./src/stuty.js");
// console.log("ast::",ast)

console.log(getDependencies(ast));
//console.log(transform(ast))