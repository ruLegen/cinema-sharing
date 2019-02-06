function removeItem(array, action) {
    
    let newArray = array.slice()
    newArray.splice(action.payload-1, 1)
    return newArray
  }
function addItem(array,action)
{
    return [ ...array, action.payload ]
  
}
  export {removeItem,addItem}