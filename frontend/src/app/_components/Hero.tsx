"use client";
import Link from "next/link";
import { AuroraBackground } from "./aurora-background";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Container } from "./Container";
import Image from "next/image";

export const Hero = () => {
  return (
    <AuroraBackground>
      <div className="max-h-full h-full flex flex-col ">
        <Navbar />
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex-grow flex mt-20"
        >
          <Container className="h-[40rem] flex  mt-10">
            <div className="">
              <div className="mx-auto">
                <h2 className="text-3xl mb-2 font-bold text-center md:text-start lg:max-w-[90%] text-gray-900 md:text-5xl">
                  Manage Your Healthcare with Ease
                </h2>

                <p className=" text-gray-500 sm:mt-4 sm:max-w-lg text-center md:text-start">
                  CarePortal is your one-stop solution to book appointments at
                  nearby medical cabinets and manage them seamlessly. Whether
                  you&apos;re a patient looking for an appointment or a cabinet
                  manager keeping track of your schedule, CarePortal has got you
                  covered.
                </p>
              </div>
              <div className="flex justify-center md:justify-start mt-5">
                <Link href="/auth">
                  <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
                    Manage your cabinet now
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Image
                src="/dashboard-image.svg"
                width={700}
                height={700}
                alt="dashboard image"
                className="aspect-video"
              />
            </div>
          </Container>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};
