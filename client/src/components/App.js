import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import VisiblePlayerList from '../containers/VisiblePlayerList'

const App = () => (
  <div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <div>test</div>
    <AddTodo />
    <VisibleTodoList />

    <VisiblePlayerList />

    <Footer />
  </div>
)

export default App
