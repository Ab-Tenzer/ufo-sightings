import {
	OfflineNotice,
	SpaceshipAnimation,
	WeeklyChart,
	WeeklyHeader,
	WeekNavigation,
} from "@/components/bar-chat";
import {
	ErrorMessage,
	Header,
	LoadingIndicator,
	ThemedView,
} from "@/components/general";
import { useSightings } from "@/hooks/useSightings";
import { useWeeklySightings } from "@/hooks/useWeeklySightings";

export default function HomeScreen() {
	const { data, loading, error, isOfflineData } = useSightings();
	const { weekIndex, weeklyData, weekKeys, slideAnim, handlePrev, handleNext } = useWeeklySightings(data);

	const currentWeekData = weeklyData[weekIndex] || {};
	const currentWeekKey = weekKeys[weekIndex];

	if (loading && !data.length) return <LoadingIndicator />;
	if (error && !data.length) return <ErrorMessage message={error} />;

	return (
		<ThemedView style={{ flex: 1, alignItems: "center" }}>
			<Header type="homeHeader" />
			{isOfflineData && <OfflineNotice />}
			<WeeklyHeader weekKey={currentWeekKey} />
			{Object.keys(currentWeekData).length > 0 && (
				<WeeklyChart data={currentWeekData} animation={slideAnim} />
			)}

			<WeekNavigation
				onPrev={handlePrev}
				onNext={handleNext}
				disablePrev={weekIndex <= 0}
				disableNext={weekIndex >= weeklyData.length - 1}
			/>
			<SpaceshipAnimation />
		</ThemedView>
	);
}
