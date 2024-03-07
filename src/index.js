import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
const index = (() => {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <StrictMode>
      <App/>
    </StrictMode>
  )
})()
export default index