"use client"
import { Wave } from 'react-css-spinners'

import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function landingPage(){
    const router = useRouter(); 
    useEffect(()=>{
    const timer = setTimeout(() =>{
        router.push("/login");
    },3000);
    return ()=> clearTimeout(timer);

    },[]);
return(
<>
<div className='flex justify-center items-center h-screen '>
<Wave
    color="#1E3A8A"
    size={100}
    thickness={15}
/>
</div>












</>
);






}