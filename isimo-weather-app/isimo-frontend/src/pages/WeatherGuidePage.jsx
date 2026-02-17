import React from "react";
import WeatherGuide from "../components/WeatherGuide";
import { useLanguage } from "../context/LanguageContext";

function WeatherGuidePage() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white pt-20 pb-8">
      <div className=" flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl w-full">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border-slate-100 relative flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">
              {t.weatherGuideTitle}
            </h1>
            <p className="text-slate-500 sm:text-lg">
              {t.weatherGuideSubtitle}
            </p>
          </div>
        </div>
      </div>

      <WeatherGuide />
    </div>
  );
}

export default WeatherGuidePage;
