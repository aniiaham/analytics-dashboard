import React from "react";
import { analytics } from "../utils/analytics";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { getDate } from "../utils";

const Page = async () => {
  const TRACKING_DAYS = 7;
  const pageviews = await analytics.retrieveDays("pageview", 2);
  const totalPageViews = pageviews.reduce((acc, curr) => {
    return (
      acc +
      curr.events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!;
      }, 0)
    );
  }, 0);

  const avgVisitorsPerDay = (totalPageViews / TRACKING_DAYS).toFixed(1);

  const amtVisitorsToday = pageviews
    .filter((ev) => ev.date === getDate())
    .reduce((acc, curr) => {
      return (
        acc +
        curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0)
      );
    }, 0);

  const topContriesMap = new Map<string, number>();

  for (let i = 0; i < pageviews.length; i++) {
    const day = pageviews[i];
    if (!day) continue;

    for (let j = 0; j < day.events.length; j++) {
      const event = day.events[j];
      if (!event) continue;

      const key = Object.keys(event)[0]!;
      const value = Object.values(event)[0]!;

      const parsedKey = JSON.parse(key);

      const country = parsedKey?.country;

      if (country) {
        if (topContriesMap.has(country)) {
          const prevValue = topContriesMap.get(country)!;
          topContriesMap.set(country, prevValue + value);
        } else {
          topContriesMap.set(country, value);
        }
      }
    }
  }

  const topContries = [...topContriesMap.entries()]
    .sort((a, b) => {
      if (a[1] > b[1]) return -1;
      else return 1;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-6xl mx-auto text-white">
        <AnalyticsDashboard
          avgVisitorsPerDay={avgVisitorsPerDay}
          amtVisitorsToday={amtVisitorsToday}
          timeseriesPageViews={pageviews}
          topContries={topContries}
        />
      </div>
    </div>
  );
};
export default Page;
