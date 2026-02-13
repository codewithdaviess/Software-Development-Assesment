import React from 'react'
import Hero from '../components/Hero';
import LocationList from '../components/LocationList';

function Home() {
  return (
    <div>
        <div className="pt-24 lg:pt-30 "></div>
        <Hero />
        <div className="pt-8 lg:pt-20 "></div>
        <LocationList />
    </div>
  )
}

export default Home