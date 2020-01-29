const {getAST,getDependencies,transform} = require("./parser");
const path = require("path");
const fs = require("fs");
module.exports = class{
    constructor(options){
        this.entry= options.entry;
        this.output = options.output;
        this.modules = [];
    }

    run(){
        //1. start parse entry file, and return entryModule object
        const entryModule = this.buildModule(this.entry,true);
        //console.log("entryModule::",entryModule);
        //2. put the entryModule to the modules queue
        this.modules.push(entryModule);
        //3. Cycle analysis the dependency and push the result to the modules queue
        this.modules.forEach(_module=>{
            _module.dependencies.forEach(dependency=>{
                this.modules.push(this.buildModule(dependency))
            })
        })

        //console.log("this.modules::",this.modules);
        //invoke emitFiles method 
        this.emitFiles();

    }

    /**
     * 
     * @param {String} filename compile file path
     * @param {boolean} isEntry if the file is the enrty file  
     * @returns {Object} return a object contain filename dependencise source code
     */
    buildModule(filename,isEntry){

        let ast;
        if(isEntry){
            ast = getAST(filename)
        }else{

            const absolutePath = path.join(process.cwd(),"./src",filename)
            console.log("absolutePath::",absolutePath);
            ast = getAST(absolutePath);

        }

        return{
            filename,
            dependencies:getDependencies(ast),
            source:transform(ast)
        }
    }

    emitFiles(){
        const outputPath = path.join(this.output.path,this.output.filename);
        let modules = "";
        this.modules.map(_module=>{
            modules += `'${_module.filename}' : function(require,module,exports){${_module.source}},`;
        });

        const bundle = `(function(modules){
            function require(filename){
                var fn = modules[filename];
                var module = {exports:{}};
                fn(require, module, module.exports);
                return module.exports;
            }
            require('${this.entry}')
        }({${modules}}))`;

        console.log("bundle",bundle);

        fs.writeFile(outputPath, bundle, "utf-8");

    }
}