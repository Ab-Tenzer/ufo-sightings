import {
	fetchSightings,
	getSightingsFromCache,
	saveSightingsToCache,
} from "@/features/sightings/sightingsService";
import { Sighting } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SightingsState {
	data: Sighting[];
	loading: boolean;
	error: string | null;
	isOfflineData: boolean;
}

const initialState: SightingsState = {
	data: [],
	loading: false,
	error: null,
	isOfflineData: false,
};

export const getSightings = createAsyncThunk<
	{ data: Sighting[]; isOffline: boolean },
	void,
	{ rejectValue: string }
>("sightings/getSightings", async (_, { rejectWithValue, dispatch }) => {
	// First, try to load cached data and dispatch it for instant UI feedback
	const cached = await getSightingsFromCache();
	if (cached) {
		dispatch(
			getSightings.fulfilled(
				{ data: cached, isOffline: true },
				"cache", // unique requestId for cache
				undefined // arg is void
			)
		);
	}

	try {
		// Then, fetch fresh data from the API
		const data = await fetchSightings();
		await saveSightingsToCache(data);
		return { data, isOffline: false };
	} catch (err) {
		// If API fails and there's no cache, reject the promise
		if (!cached) {
			return rejectWithValue(
				"Failed to fetch sightings and no offline data available"
			);
		}
		// If API fails but we have cache, just return the cached data again
		return { data: cached, isOffline: true };
	}
});

const sightingsSlice = createSlice({
	name: "sightings",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getSightings.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getSightings.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload.data;
				state.isOfflineData = action.payload.isOffline;
			})
			.addCase(getSightings.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ?? action.error.message ?? "Failed to fetch sightings";
			});
	},
});

export default sightingsSlice.reducer;
