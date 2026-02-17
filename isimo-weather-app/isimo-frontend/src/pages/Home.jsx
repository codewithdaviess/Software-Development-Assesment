import React from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import LocationList from "../components/LocationList";
import WeatherGuide from "../components/WeatherGuide";

const MotionDiv = motion.div;

function Home() {
  const easeTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="w-full bg-white">
      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeTransition}
      >
        <Hero />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeTransition, delay: 0.1 }}
      >
        <LocationList />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeTransition, delay: 0.2 }}
      >
        <WeatherGuide />
      </MotionDiv>
    </div>
  );
}

export default Home;
