var code2ary = require('./code2ary');

function optiMAL(E) {
    let miniMAL = require('./miniMAL-node');
    let m = miniMAL(E);
    m.DEMO = (exp)=>m.EVAL(exp, true);
    m.EVAL = (exp, debug)=>{
        let src = exp;
        let steps = code2ary(src);
        let last;
        for (let step of steps) {
            let exp = step[0];
            let ast = step[1];
            try {
                if(debug) console.log('[EVAL] ' + exp + ' [AST] ' + JSON.stringify(ast));
                let val = m.eval(ast);
                last = val;
                if (typeof val === 'function') { if(debug) console.log('==> ' + 'function'); }
                else if (!(val instanceof Array) && val instanceof Object && Object.prototype.toString.call(val)!=='[object Object]') {
                    if(debug) console.log('==> ' + Object.prototype.toString.call(val) + ' ' + JSON.stringify(val));
                }
                else {
                    if(debug) console.log('==> ' + JSON.stringify(val));
                }
            } catch (e) {
                if(!debug) console.log('[EVAL] ' + exp + ' [AST] ' + JSON.stringify(ast));
                console.log(' [EXCEPTION]');
                if (e.stack) console.log(e.stack);
                else console.log(e);
                break;
            }
        }
        return last;
    }
    m.LOAD = (path, debug)=>{
        let src = require("fs").readFileSync(path);
        return m.EVAL(src, debug);
    }
    return m;
}

module.exports = optiMAL;
