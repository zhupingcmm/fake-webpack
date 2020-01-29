/**
 * @author pzhu
 * @description parse the source code / generate AST / transform AST to compiled code
 */
const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const {transformFromAst} = require("babel-core");

module.exports ={
    /**
     * @getAST generarte AST tree
     * @param path source code path
     * @return soucrce code AST code tree
     */
    getAST:(path)=>{
        //1. read the souce code from the disk
        const source = fs.readFileSync(path,"utf-8");
        //2.use babylon parse the source code and return AST tree code
        return babylon.parse(source,{
            sourceType: "module"
        })
    },
    /**
     * @getDependencies get ast dependencies
     * 
     */
    getDependencies:(ast)=>{
        let dependencies = [];
        //parse the ast dependencies
        traverse(ast,{
            ImportDeclaration: ( {node})=>{
                dependencies.push(node.source.value);
            }
        });

        console.log("dependencies::",dependencies)
        return dependencies;
    },
    /**
     * @transform transform AST to sourcode
     */
    transform: (ast)=>{
        const{code}=transformFromAst(ast,null,{
            //use babel-preset-env
            presets:["env"]
        });
        return code;
    }
}