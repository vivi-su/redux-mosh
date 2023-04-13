// currying can have one parameter instead of two or more parameters

function add(a){
    return function(b){
        return a+b;
    }
}

const add2 = a => b => a + b // (a, b) => a + b

add(1)(5); // add(1,5);
// N => 1