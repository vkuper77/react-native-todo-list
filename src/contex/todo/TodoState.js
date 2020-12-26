import React, { useReducer, useContext } from 'react'
import { Alert } from 'react-native'
import { ScreenContext } from '../screen/screenContext'
import {
  ADD_TODO,
  CLEAR_ERROR,
  FETCH_TODOS,
  HIDE_LOADER,
  REMOVE_TODO,
  SHOW_ERROR,
  SHOW_LOADER,
  UPDATE_TODO,
} from '../types'
import { TodoContext } from './todoContext'
import { todoReducer } from './todoReducer'

export const TodoState = ({ children }) => {
  const initialstate = {
    todos: [],
    loading: false,
    error: null,
  }

  const { changeScreen } = useContext(ScreenContext)

  const [state, dispatch] = useReducer(todoReducer, initialstate)

  const addTodo = (title) => {
    fetch('https://rn-todo-app-c12d0.firebaseio.com/todos.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then((response) => response.json())
      .then((data) => dispatch({ type: ADD_TODO, title, id: data.name }))
  }

  const removeTodo = (id) => {
    const todo = state.todos.find((t) => t.id === id)
    Alert.alert(
      'Удаление элемента',
      `Вы уверены, что хотите удалить "${todo.title}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            changeScreen(null)
            await fetch(
              `https://rn-todo-app-c12d0.firebaseio.com/todos/${id}.json`,
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              }
            )
            dispatch({ type: REMOVE_TODO, id })
          },
        },
      ],
      { cancelable: false }
    )
  }

  const fetchTodos = () => {
    showLoader()
    clearError()
    fetch('https://rn-todo-app-c12d0.firebaseio.com/todos.json', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => data.json())
      .then((data) => {
        const todos = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }))
        dispatch({ type: FETCH_TODOS, todos })
      })
      .catch((e) => {
        showError('Что-то пошло не так...')
      })
      .finally(() => hideLoader())
  }

  const updateTodo = (id, title) => {
    clearError()
    fetch(`https://rn-todo-app-c12d0.firebaseio.com/todos/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then(() => dispatch({ type: UPDATE_TODO, id, title }))
      .catch((e) => {
        showError('Что-то пошло не так...')
      })
  }

  const showLoader = () => dispatch({ type: SHOW_LOADER })
  const hideLoader = () => dispatch({ type: HIDE_LOADER })
  const showError = (error) => dispatch({ type: SHOW_ERROR, error })
  const clearError = () => dispatch({ type: CLEAR_ERROR })

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        fetchTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}