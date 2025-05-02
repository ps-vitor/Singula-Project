import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import  React from  'react'
import  ReactDOM  from  'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


