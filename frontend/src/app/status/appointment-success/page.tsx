import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#000000] mb-2">
          Your appointment request has been
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold text-[#2ecc40] mb-12">
          successfully submitted!
        </h1>

        <div className="w-32 h-32 mb-12">
          <Image
            src="/checkMark.svg"
            alt="Success Checkmark"
            width={128}
            height={128}
            priority
          />
        </div>

        <p className="text-[#706e6e] max-w-md mb-16">
          We will send you an email after the appointment is confirmed, so stay
          in touch.
        </p>
        <Link href="/patient/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#d9d9d9] text-[#706e6e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </main>
    </div>
  );
}
