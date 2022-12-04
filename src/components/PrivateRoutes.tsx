import { Navigate, Outlet } from "react-router-dom"
import { getAcecessToken } from '../helpers/getAccessToken'

const PrivateRoutes = () => {
 

  const  token: boolean = getAcecessToken()
  console.log(token)


  return (
    token ? <Outlet /> : <Navigate to="/"/>
  )
}

export default PrivateRoutes