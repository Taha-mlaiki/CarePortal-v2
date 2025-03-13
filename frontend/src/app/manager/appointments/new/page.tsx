


import { BackButton } from '@/components/BackButton'
import { AppointmentStatus } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { AppointmentForm } from '../_components/AppointmentForm'

const New = ({params}:{params:{cabinetId:string}}) => {
    
  return (
    <div className='p-2'>
      <BackButton />
      <div className='mt-2 flex justify-center'>
        <div className='max-w-2xl px-5 w-full'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Create an appointment</h1>
                <Image width={100} height={100} src="/Calendar.svg" alt='image appointment' />
            </div>
            <div className='mt-16'>
                <AppointmentForm cabinetId={params.cabinetId} />
            </div>  
        </div>
      </div>
    </div>
  )
}

export default New
