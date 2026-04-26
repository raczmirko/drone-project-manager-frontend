import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import {NotificationProvider} from './providers/NotificationProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
        </LocalizationProvider>
    </NotificationProvider>
  </StrictMode>,
)
