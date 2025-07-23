import { DEVICE_WIDTH } from "@/constants/Dimensions";
import { Sighting } from "@/types";
import { groupSightingsByWeek } from "@/utilities/groupSightingsByWeek";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export const useWeeklySightings = (data: Sighting[]) => {
  const [weekIndex, setWeekIndex] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [weekKeys, setWeekKeys] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const grouped = groupSightingsByWeek(data);
    const keys = Object.keys(grouped);
    setWeekKeys(keys);
    setWeeklyData(keys.map((key) => grouped[key]));
    setWeekIndex(keys.length - 1); // Start from the last week
  }, [data]);

  useEffect(() => {
    if (direction === 0) {
      slideAnim.setValue(0);
      return;
    }
    slideAnim.setValue(direction * DEVICE_WIDTH);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [weekIndex, direction]);

  const handlePrev = () => {
    if (weekIndex <= 0) return;
    Animated.timing(slideAnim, {
      toValue: DEVICE_WIDTH,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setDirection(-1);
      setWeekIndex((i) => i - 1);
    });
  };

  const handleNext = () => {
    if (weekIndex >= weeklyData.length - 1) return;
    Animated.timing(slideAnim, {
      toValue: -DEVICE_WIDTH,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setDirection(1);
      setWeekIndex((i) => i + 1);
    });
  };

  return {
    weekIndex,
    weeklyData,
    weekKeys,
    slideAnim,
    handlePrev,
    handleNext,
  };
}; 