import './index.css'

import { createRoot } from 'react-dom/client'
import Router from './Router'
import { createTheme, ThemeProvider } from 'flowbite-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModelProvider } from './hooks/useModel'
import { ToastProvider } from './hooks/toast/ToastContext'

const customTheme = createTheme({
  button: {
    color: {
      primary: 'bg-red-500 hover:bg-red-600',
      secondary: 'bg-blue-500 hover:bg-blue-600'
    },
    size: {
      lg: 'px-6 py-3 text-lg'
    }
  }
})
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={customTheme}>
    <ModelProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ToastProvider>
    </ModelProvider>
  </ThemeProvider>
)
