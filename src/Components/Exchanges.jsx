import {axios} from "axios"
import { server } from "../main"
import { useEffect } from "react"

const Exchanges = () => {
  useEffect(() => {
    const fetchExchanges = async()=>{
      const {data} = await axios.get(`${server}/exchanges`);
      console.log(data);
    }   
    fetchExchanges();
  }, [])
  
  return (
    <div>Exchanges</div>
  )
}

export default Exchanges