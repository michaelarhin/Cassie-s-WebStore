import { useLayoutEffect } from "react";

export function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour < 7 || hour >= 19;
}

export default function AutomaticTheme() {
  useLayoutEffect(() => {
    const update = () => {
      const dark = isNightTime(new Date());
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:ital,wght@0,300;0,400;0,500;1,300&display=swap"
    />
  );
}