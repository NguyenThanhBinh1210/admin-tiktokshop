import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouteElements from './useRouteElement'
const App = () => {
  const routeElements = useRouteElements()

  return (
    <div className='dark:bg-[#13131A] mobile:h-screen'>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
