let tokenize = (str)=>{
    let re = /[\s,]*([()'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|[^\s,('"`;@)]*)/g;
    let result = [];
    while((token = re.exec(str)[1]) !== '') {
        if(token[0] === ';') continue;
        if(token.match(/^-?[0-9][0-9.]*$/)) token = parseFloat(token, 10);
        result.push(token);
    }
    return result;
}

let read_token = (code, exp)=>{
    if(code.length===0) return undefined;
    let token = code.shift();
    exp.push(token);
    return token;
}

let read_list = (code, exp)=>{
    let result = [];
    let sexp;
    while((ast = read_sexp(code, exp)) !== undefined) {
        result.push(ast);
    }
    return result;
}

let read_sexp = (code, exp)=>{
    let token = read_token(code, exp);
    if (token === undefined) return undefined;
    let ch = token[0];
    switch(ch) {
        case '(':
            return read_list(code, exp);
        case ')':
            return undefined;
        case '\'':
            let ast = read_sexp(code, exp);
            return  ['`', ast];
        case '"':
            token = JSON.parse(token);
            return ['`', token.replace(/(^"|"$)/g, '')];
        case '@':
            token = token.replace(/(^@|@$)/g, '');
            token = token.replace(/(@@)/g, '@');
            let re;
            if (re = token.match(/(\/(?:\\\/|[^/])*\/)([a-z]*)/)) {
                let re1 = re[1].replace(/(^\/|\/$)/g, '');
                return re[2]==='' ? ["RegExp", ['`', re1]] : ["RegExp", ['`', re1], ['`', re[2]]];
            }
            return JSON.parse(token);
        case '#':
            switch(token) {
                case '#null':
                case '#nil':
                case '#n':
                    return null;
                case '#false':
                case '#f':
                    return false;
                case '#true':
                case '#t':
                    return true;
            }
            return token;
        default:
            return token;
    }
}

let join_sexp = (exp)=>{
    if(exp.length===0) return "";
    let last = exp.shift();
    let result = '' + last;
    while (exp.length>0) {
        let token = exp.shift();
        if(token!==')' && last!=='(' && last!=="'") result += ' ';
        result += token;
        last = token;
    }
    return result;
}

let code2ary = (text)=>{
    let code = tokenize(text);
    let result = [];
    let sexp;
    while(true) {
        let exp = [];
        let ast = read_sexp(code, exp);
        if (ast === undefined) break;
        result.push([join_sexp(exp), ast]);
    }
    return result;
}

module.exports = code2ary;
