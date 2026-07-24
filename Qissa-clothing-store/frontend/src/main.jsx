import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f1712',
            color: '#f8f4f1',
            fontSize: '0.85rem',
            borderRadius: '0.6rem',
            padding: '0.75rem 1rem',
          },
        }}
      />
    </Provider>
  </StrictMode>,
)
