'use client'

import {
  ChakraProvider,
  extendTheme,
  useColorMode,
  localStorageManager,
} from '@chakra-ui/react'
import { useEffect } from 'react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

function SyncChakraWithLocalStorage() {
  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => {
    const update = () => {
      const nextraTheme = localStorage.getItem('theme')
      if (nextraTheme && nextraTheme !== colorMode) {
        setColorMode(nextraTheme)
      }
    }
    update()
    
    const interval = setInterval(update, 100)
    return () => clearInterval(interval)
  }, [colorMode, setColorMode])

  return null
}

export function ColorModeSyncWrapper({ children }) {
  return (
    <ChakraProvider theme={theme} colorModeManager={localStorageManager} resetCSS={false} cssVarsRoot="body #chakra-scope">
      <SyncChakraWithLocalStorage />
      {children}
    </ChakraProvider>
  )
}