"use client";
import Link from "next/link";
import { AuroraBackground } from "./aurora-background";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Container } from "./Container";

export const Hero = () => {
  return (
    <AuroraBackground>
      <div className="max-h-full h-full flex flex-col">
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
          <Container className="h-[30rem] flex  mt-10">
            <div className=" md:p-12 lg:px-16 lg:py-24">
              <div className="mx-auto text-center">
                <h2 className="text-3xl mb-2 font-bold text-gray-900 md:text-5xl">
                  Manage Your Healthcare with Ease
                </h2>

                <p className=" text-gray-500 sm:mt-4 sm:max-w-lg mx-auto">
                  CarePortal is your one-stop solution to book appointments at
                  nearby medical cabinets and manage them seamlessly. Whether
                  you&apos;re a patient looking for an appointment or a cabinet
                  manager keeping track of your schedule, CarePortal has got you
                  covered.
                </p>
              </div>
              <div className="flex justify-center mt-5">
                <button  className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
                    <Link href="/payment">
                     Manage your cabinet now
                    </Link>
                </button>
              </div>
            </div>
          </Container>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};
