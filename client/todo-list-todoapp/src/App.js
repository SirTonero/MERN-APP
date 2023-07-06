import {useState, useEffect} from 'react'
import myImage from './img/dareylogo.png'
import axios from 'axios'
import "./App.css";

function App() {
  const [itemText,setItemText ] = useState('')
  const [listItems, setListItems] = useState([])
  const [isUpdating, setIsUpdating] = useState('')
  const [updateItemText, setUpdateItemText] = useState('')


  //Add new todo item to the Database
  const addItem = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5500/api/item', {item: itemText})
      setListItems(prev =>[...prev, res.data])
      setItemText('')
    }catch(err){
      console.log(err)
    }
  }


//Create a function to fetch all todo items from database --  we will use useEffect Hook
useEffect(()=>{
  const getItemsList = async () => {
    try{
      const res = await axios.get('http://localhost:5500/api/items')
      setListItems(res.data)
      console.log('render')
    }catch(err){
      console.log(err)
    }
  }
  getItemsList()
},[]);

//Delete item When we click on Delete
const deleteItem = async (id) => {
  try{
    const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
    const newListItems = listItems.filter(item => item._id !== id)
    setListItems(newListItems)
    
  }catch(err){
    console.log(err)
  }
}


// Update Item
const updateItem = async (e) => {
  e.preventDefault()
  try{
    const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: updateItemText})
    console.log(res.data)
    const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating )
    const updatedItem = listItems[updatedItemIndex].item = updateItemText
    setUpdateItemText('');
    setIsUpdating('');
  }catch(err){
    console.log(err)
  }
}
//before updating item we need to show input field where we will create our updated item
const renderUpdateForm = () => (
  <form className='update-form' onSubmit={(e)=>{updateItem(e)}}>
    <input className='update-new-input' type='text' placeholder='New Item' onChange={e=>{setUpdateItemText(e.target.value)}} value ={updateItemText} />
    <button className='update-new-btn' type='submit'>Update</button>
  </form>
)


  return (
    <div className="App">
      <img src={myImage} alt="logo" width="200" height="200"  />
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder="Add todo Item" onChange={e => {setItemText(e.target.value)}} value={itemText} />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems" >
        {
          listItems.map(item => (
            <div className="todo-item"  key={item._id} >
              {
                isUpdating === item._id
                ? renderUpdateForm()
                : <>
                    <p className="item-content">{item.item}</p>
                    <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>Update</button>
                    <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>Delete</button>
                  </>
              }
              
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
