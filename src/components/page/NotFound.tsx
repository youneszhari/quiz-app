import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate();
    return (
        <section className="flex flex-col items-center w-full py-12 text-center md:py-24">
        <img
            src="/placeholder.svg"
            width="400"
            height="300"
            alt="Illustration"
            className="rounded-xl object-cover"
            style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <div className="container flex flex-col items-center justify-center gap-2 px-4 md:gap-4 lg:gap-6">
            <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Lost in the clouds</h1>
            <p className="text-gray-500 md:w-2/4 lg:w-1/2 xl:w-1/3 dark:text-gray-400">
                Whoops, looks like you took a wrong turn. Let&#x27;s get you back home.
            </p>
            </div>
            <Button
            onClick={() => navigate('/')}
            
            >
            Go back home
            </Button>
        </div>
    </section>
  )
}

export default NotFound