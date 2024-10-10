import { BsCloudRain } from "react-icons/bs"
import { BsCloudSnowFill } from "react-icons/bs"


const data = [

  {

   id: '0',
   img: 'src/assets/shelter.png',
   title: 'heaven of hope1',
   headcounts: '2-3',
   weather: <BsCloudRain className="rainy"/>,
   price: '2000',
   duration: "2-3 weeks"
   


  },

  {
    id: '1',
    img: 'src/assets/shelter.png',
    title: 'heaven of hope2',
    headcounts: '3-4',
    weather: <BsCloudSnowFill className="snowy"/>,
    price: '3000',
    duration: "3-4 weeks"
 
 
   }



]

export default data