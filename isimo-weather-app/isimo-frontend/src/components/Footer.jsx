import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full  bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-500">davies.</p>
        <p className="text-sm text-slate-500">(c) {year} All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
