import React from "react";
import { useLanguage } from "../context/LanguageContext";

function WeatherGuide() {
  const { t } = useLanguage();

  const weatherGuide = [
    {
      icon: "\u2600\ufe0f",
      title: t.sunnyTitle,
      short: t.sunnyDesc,
    },
    {
      icon: "\u2601\ufe0f",
      title: t.cloudyTitle,
      short: t.cloudyDesc,
    },
    {
      icon: "\ud83c\udf27\ufe0f",
      title: t.rainyTitle,
      short: t.rainyDesc,
    },
    {
      icon: "\u26c8\ufe0f",
      title: t.stormTitle,
      short: t.stormDesc,
    },
    {
      icon: "\u2744\ufe0f",
      title: t.snowyTitle,
      short: t.snowyDesc,
    },
    {
      icon: "\ud83c\udf2b\ufe0f",
      title: t.foggyTitle,
      short: t.foggyDesc,
    },
  ];

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-500 mb-12">
          {t.weatherGuide}
        </h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {weatherGuide.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-slate-100 text-center"
            >
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.short}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherGuide;
