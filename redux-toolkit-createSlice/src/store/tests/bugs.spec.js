import { loadBugs, addBug, getUnresolvedBugs, resolveBug, assignBugToUser } from "../bugs";
import configureStore from '../configureStore';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// // Solitary test

// import {addBug} from '../bugs';
// import { apiCallBegan } from '../api';
// import { bugAdded } from '../bugs';

// describe("bugsSlice", ()=>{
//     describe("action creators", ()=>{
//         it("addBug",()=>{
//             const bug = { description: "a" };
//             const result = addBug(bug)
//             const expected = {
//                 type:apiCallBegan.type,
//                 payload:{
//                     url:'/bugs',
//                     method:'post',
//                     data:bug,
//                     onSuccess:bugAdded.type
//                 }
//             }
//             expect(result).toEqual(expected)
//         })
//     })
// })

// we should not wirte solitary test, instead write the test that test behavior -> Social Test

// // Integration test 
// describe("bugsSlice", ()=>{
//     it("should handel the addBug action", async()=>{
//         //dispatch(addBug) => store
//         const store = configureStore();
//         const bug = {description:'a'};
//         await store.dispatch(addBug(bug));
//         expect(store.getState().entities.bugs.list).toHaveLength(1);
//     })
// })

//Unit test should not touch external resources -> mocking HTTP Calls

// describe("bugsSlice", () => {
//   it("should handle the addBug action", async () => {
//     const bug = { description: "a" };
//     const saveBug = {...bug, id:1};

//     const fakeAxios = new MockAdapter(axios);
//     fakeAxios.onPost('/bugs').reply(200, saveBug);

//     const store = configureStore();
//     await store.dispatch(addBug(bug));
//     expect(store.getState().entities.bugs.list).toContainEqual(saveBug);
//   });
// });


describe("bugsSlice", () => {
    let fakeAxios;
    let store;
    
    beforeEach(()=>{
     fakeAxios = new MockAdapter(axios);
     store = configureStore();
    });

    // Helper function
    const bugsSlice = () => store.getState().entities.bugs;
    const createState = () => ({
        entities:{
            bugs:{
                list:[]
            }
        }
    })
  
  describe("loading bugs", ()=>{
    describe("if the bugs exist in the cache",()=>{
    it("they should not be fetched from the server again", async()=>{
        fakeAxios.onGet("/bugs").reply(200,[{id:1}])
        
        //dispatch loadBugs two times and check if there is single backend call
        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
    })
    });

    describe("if the bugs don't exist in the cache", () => {
        it("they should be fetched from the server and put in the store",async()=>{
            fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

            await store.dispatch(loadBugs());

            expect(bugsSlice().list).toHaveLength(1);
        })

        describe("loading indicator",()=>{
          
            it("should be false if the server returns an error ", async () => {
            fakeAxios.onGet("/bugs").reply(500, [{ id: 1 }]);

            await store.dispatch(loadBugs());

            expect(bugsSlice().loading).toBe(false);
          });

          it("should be true while fetching the bugs", () => {
            // // fakeAxios documentation two ways to call
            // fakeAxios.onGet("/bugs").reply(200, [{id:1}]);
            fakeAxios.onGet("/bugs").reply(() => {
              expect(bugSlice().loading).toBe(true);
              return [200, [{ id: 1 }]];
            });

            store.dispatch(loadBugs());
          });
        } )
    });
  })

  it("should mark the bug as assinged to the user if it's saved to the server", async() =>{
    fakeAxios.onPatch("/bugs/1").reply(200,{id:1, userId:1})
    fakeAxios.onPost("/bugs").reply(200, {id:1});

    await store.dispatch(addBug({}));
    await store.dispatch(assignBugToUser(1));

    expect(bugsSlice().list[0].userId).toBe(1);
  })

    it("should not mark the bug as assinged to the user if it's not saved to the server", async () => {
      fakeAxios.onPatch("/bugs/1").reply(500);
      fakeAxios.onPost("/bugs").reply(200, { id: 1 ,userId:null});

      await store.dispatch(addBug({}));
      await store.dispatch(assignBugToUser(1));

      expect(bugsSlice().list[0].userId).not.toBe(1);
    });

  it("should mark the bug as resolved if it's saved to the server", async()=>{
      // AAA
    fakeAxios.onPost("/bugs").reply(200, {id:1});
    fakeAxios.onPatch("/bugs/1").reply(200, {id:1, resolved:true});

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).toBe(true);
  })

    it("should not mark the bug as resolved if it's not saved to the server", async () => {
      // AAA
      fakeAxios.onPatch("/bugs/1").reply(500);
      fakeAxios.onPost("/bugs").reply(200, { id: 1 });

      await store.dispatch(addBug({}));
      await store.dispatch(resolveBug(1));

      expect(bugsSlice().list[0].resolved).not.toBe(true);
    });

  it("should add the bug to the store if it's saved to the server", async () => {
    // Arrange
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    // Act
    await store.dispatch(addBug(bug));
    
    // Assertion
    expect(bugsSlice().list).toContainEqual(savedBug);
    
  });

    it("should not add the bug to the store if it's not saved to the server", async () => {
      // Arrange
      const bug = { description: "a" };
      fakeAxios.onPost("/bugs").reply(500);

      // Act
      await store.dispatch(addBug(bug));

      // Assert
      expect(bugsSlice().list).toHaveLength(0);
    });

    describe("selectors",()=>{
        it("getUnresolvedBugs", ()=>{
            // Arrange
            const state = createState();
            state.entities.bugs.list = [
              { id: 1, resolved: true },
              { id: 2 },
              { id: 3 },
            ];
            // Act
            const result = getUnresolvedBugs(state);
            // Assert
            expect(result).toHaveLength(2);
        })
    })


});


// describe("bugsSlice", () => {
//   let fakeAxios;
//   let store;

//   beforeEach(() => {
//     fakeAxios = new MockAdapter(axios);
//     store = configureStore();
//   });

//   const bugsSlice = () => store.getState().entities.bugs;

// });



