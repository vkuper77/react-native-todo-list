import React, { useState, useContext } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Navbar } from './components/Navbar'
import { THEME } from './theme'
import { MainScreen } from './screens/MainScreen'
import { TodoScreen } from './screens/TodoScreen'
import { ScreenContext } from './contex/screen/screenContext'

export const MainLayout = () => {
  const { todoId } = useContext(ScreenContext)

  return (
    <View style={styles.wrapper}>
      <Navbar title="Todo App" />
      <View style={styles.container}>
        {todoId ? <TodoScreen /> : <MainScreen />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.PADdING_HORIZONTAL,
    paddingVertical: 10,
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
})
