import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTopSlowly = () => {
      const duration = 1000; // time in ms
      const start = window.scrollY;
      const startTime = performance.now();

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutCubic(progress);

        window.scrollTo(0, start * (1 - ease));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    scrollToTopSlowly();
  }, [pathname]);

  return null;
}
