import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"


export const Navbar = ()=>{

    return (
    <header>
        <nav className="flex items-center justify-between max-w-7xl px-5 2xl:px-0 mx-auto  h-16">
            <div className="hidden lg:block">
                <Logo />
            </div>
            <div className="block lg:hidden">
                <Image width={50} height={50} alt="logo" src="/logoCare.png" />
            </div>
            <div className="flex items-center gap-x-2 z-10">
                <Button variant="secondary">
                    <Link href="/payment">
                        Book an appointment
                    </Link>
                </Button>
                <button  className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] px-3  hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] lg:px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
                    <Link href="/cabinets/signin">
                    Sign in
                    </Link>
                </button>
            </div>
        </nav>
    </header>
    )
}