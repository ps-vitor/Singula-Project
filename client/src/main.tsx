// ./client/src/main.tsx

import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import  ReactDOM  from  'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


