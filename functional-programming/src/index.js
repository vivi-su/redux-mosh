import {compose, pipe} from 'lodash/fp'; // fp means functional programming

// // solution 1
//     let input = "  JavaScript  ";
//     let output = "<div>" + input.trim() +"</div>";

// // solution 2 : using functional programming approach
// // trim
// // wrapInDiv
//     const trim = str =>str.trim();
//     // const wrapInDiv = str => "<div>" + str +"</div>" 
//     const wrapInDiv = str => `<div>${str}</div>`;
//     const toLowerCase = str => str.toLowerCase();

//     const result = wrapInDiv(toLowerCase(trim(input)));

// // solution 3: use loadash compose
// const transform = compose(wrapInDiv, toLowerCase, trim); // with the compose, we always need to start from very right, that is the reason to use pipe
// transform(input);

// // solution 4: use loadash pipe
// const transform2 = pipe(trim, toLowerCase, wrapInDiv );
// transform2(input);

// Currying

let input = "   JavaScript    ";
let output = "<div>" + input.trim() + "</div>";

const trim = (str) => str.trim();
const wrapInDiv = (str) => `<div>${str}</div>`;
const wrap = type => str => `<${type}>${str}</${type}>`;
const toLowerCase = (str) => str.toLowerCase();

const transform = pipe(trim, toLowerCase, wrap("div"));
console.log(transform(input));

/** 
* Pure Functions = immutability = Redux
* 1. No random values
* 2. No current data/time
* 3. No global state (Dom, files, db, etc) 
* 
* ex. 
* function func(a, b){
* 
* }

* Benefits
* 1. Self-documenting
* 2. Easily testable
* 3. Concurrency
* 4. Cacheable
*/ 

    function myFunction1(number) {
        return number * Math.random();
    } // This is not a pure function

    function myFunction2(number){
        return number * 2;
    } // This is a pure function

    function isEligible1(age) {
        return age > minAge;
    } // This is not a pure function

    function isEligible2(age, minAge) {
        return age > minAge;
    } // This is a pure function


    /**
     * Practice immutability with updating objects
     * 
     */

    const person = {
        name: " John",
        address:{
            country:"USA",
            city:"San Francisco"
        }
    };
    const updated = {...person, name:"Bob"};
    // updated.address.city = "New York";
    // console.log(person); 
    // // original person's city also changed to New York, this is not what we want
    
    // instead we want to do deep spread to prevent the address reference change
    const updated1 = {
        ...person,
        address:{
            ...person.address,
            city:"New York"
        },
        name:"Bob"
    };
    console.log(person); 

    // Updating Array

    const numbers = [1, 2, 3];

    // Adding

    const added = [4, ...numbers]; // [4, 1, 2, 3]

    // Adding numbers before 2
    const index = numbers.indexOf(2);
    const anotherAdded = [
        ...numbers.slice(0, index),
        4,
        ...numbers.slice(index)
    ]; // [1, 4, 2, 3]

    // Removing

    const removed = numbers.filter(n => n !== 2); // [1 , 3]; 

    // Updating (Replace 2 to 20)

    const updatedArray = numbers.map(n => n=== 2 ? 20 : n); // [1, 20 , 3]


    /**
     *  Enforcing Immutability
     * 
     *  Libraries
     *    1. immutable
     *    2. Immer
     *    3. Mori 
     */

    // Immutable Library : need to use getter and setter -> better to use Immer Library

    let book = {title: "Harry Potter" };

    function publish(book) {
        book.isPublished = true;
    } // we should not directly mutate book

    publish(book);

    console.log(book);

    /*----------------------------------*/
    import { Map } from 'immutable';
    
    let book1 = Map({title: "Harry Potter" });

    function publish1(book1){
        return book1.set("isPublished", true);
    }

    book1 = publish1(book1);

    console.log(book1.get("title"));
    console.log(book1.toJS()); // convert to plain JS object

    // Immer Library

    import { produce } from 'immer';

    let book3 = { title: "Harry Potter" };

    function publish3(book3){
       return produce(book3, draftBook => {
            draftBook.isPublished = true;
        });
    }

   let updatedBook3 = publish3(book3);
   console.log(updatedBook3);


   // Exercise - wite code in a functional style to conver the input to the output

   let inputE = { tag: "JAVASCRIPT" };
   // output = "(javascript)";

   const toLowerCaseE = str => str.toLowerCase();
   const wrapE = str => `"(${str})"`;
   console.log(toLowerCaseE(inputE.tag)); // javascript
   const transformE = pipe(toLowerCaseE, wrapE);
   console.log(transformE(inputE.tag)); // "(javascript)"

   // Exercise - we have a recipe object as follows:

        const recipe = {
            name: "Spaghetti Bolognese",
            ingredients: [ "egg", "salt"]
        }

        /**
            * Assuming that this object is immutable, write code to
            *   - Add s new ingredient("cream")
            *   - Replace "egg" with "egg white"  
            *   - Remove an ingredient("egg")
            */

        const recipeAddCream = {
            ...recipe,
            ingredients:[...recipe.ingredients, "cream"]
        }

        console.log(recipeAddCream); // ["egg", "salt", "cream"]

        const recipeReplaceToEggwhite = recipeAddCream.ingredients.map((ing) =>
          ing === "egg" ? "eggWhite" : ing
        );
        console.log(recipeReplaceToEggwhite); // ["eggWhite", "salt", "cream"]

        const recipeRemoveEgg =recipeAddCream.ingredients.filter(ing=> ing !== "egg");

        console.log(recipeRemoveEgg); // ["salt", "cream"]