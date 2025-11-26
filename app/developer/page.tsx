"use client";
import { Instagram, Link2Icon, Linkedin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <section className="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,158,0.2),transparent_70%)] blur-3xl"></div>

      <div className="p-4 flex justify-center items-center relative z-10">
        <Link
          className="p-2 border border-white/20 rounded-md text-neutral-300 backdrop-blur-sm hover:text-white hover:border-white/40 transition"
          href={"/"}
        >
          Back To Home
        </Link>
      </div>

      <Head />
    </section>
  );
};

export default Page;

function Head() {
  return (
    <div className="h-[90vh] w-full flex justify-center items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center"
      >
        {/* Subtext */}
        <motion.p
          className="
          text-3xl md:text-4xl font-bold 
          bg-gradient-to-r from-fuchsia-500 via-purple-400 to-blue-400
          bg-clip-text text-transparent
          animate-gradient-slow
        "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Developed by
        </motion.p>

        {/* Main Name */}
        <motion.h1
          className="
          text-5xl md:text-9xl font-extrabold tracking-tight mt-2
          bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500
          bg-clip-text text-transparent
          animate-gradient-slow
          animate-pulse
        "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2 }}
        >
          Azimuddeen Khan 
          <span className="text-red-500 animate-pulse">{" </> "}.</span>
        </motion.h1>

        {/* Social Icons */}
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <FloatingIcon
            href="https://www.instagram.com/everazim.2?igsh=MTk5N2sxb3ZtZmVveQ%3D%3D&utm_source=qr"
            color="text-pink-400"
          >
            <Instagram />
          </FloatingIcon>

          <FloatingIcon
            href="https://www.linkedin.com/in/azimuddeen-khan?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            color="text-blue-400"
          >
            <Linkedin />
          </FloatingIcon>

          <FloatingIcon
            href="https://everazim.online/about"
            color="text-blue-600"
          >
            <Link2Icon />
          </FloatingIcon>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Reusable floating animated button */
function FloatingIcon({ href, children, color }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      className={`p-3 border border-white/20 rounded-xl shadow-lg backdrop-blur-md ${color}`}
      whileHover={{ scale: 1.15, y: -4 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      {children}
    </motion.a>
  );
}
