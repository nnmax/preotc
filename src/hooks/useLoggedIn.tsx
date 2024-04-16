'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { noop } from 'lodash-es'
import { LoggedInLocalStorageKey } from '@/constant'

const LoggedInContext = createContext<{
  loggedIn: boolean
  setLoggedIn: (loggedIn: boolean) => void
}>({
  loggedIn: false,
  setLoggedIn: noop,
})
if (process.env.NODE_ENV === 'development') {
  LoggedInContext.displayName = 'LoggedInContext'
}

export const LoggedInProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loggedIn, _setLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    _setLoggedIn(Boolean(window.localStorage.getItem(LoggedInLocalStorageKey)))
  }, [])

  const setLoggedIn = (_loggedIn: boolean) => {
    if (_loggedIn) {
      window.localStorage.setItem(LoggedInLocalStorageKey, 'true')
    } else {
      window.localStorage.removeItem(LoggedInLocalStorageKey)
    }
    _setLoggedIn(_loggedIn)
  }

  return (
    <LoggedInContext.Provider
      value={useMemo(() => ({ loggedIn, setLoggedIn }), [loggedIn])}
    >
      {children}
    </LoggedInContext.Provider>
  )
}

export default function useLoggedIn() {
  return useContext(LoggedInContext)
}
