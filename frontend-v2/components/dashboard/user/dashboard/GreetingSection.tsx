"use client";

import { useEffect, useState } from "react";

export default function GreetingSection() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-start">

      <div>

        <h1 className="text-3xl font-bold">
          Good Morning, Amrit
        </h1>

        <p className="text-gray-400 mt-1">
          Give your best services for customers 😊
        </p>

      </div>

      <div className="text-right">

        <h2 className="text-3xl font-mono font-bold tracking-wider">
          {time}
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          {new Date().toDateString()}
        </p>

      </div>

    </div>
  );
}