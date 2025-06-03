'use client'

import { store } from '@/app/lib/store'
import React from 'react'
import { Provider } from 'react-redux'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
} 