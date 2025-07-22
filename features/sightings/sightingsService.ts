import { API_CONFIG } from "@/api/config";
import { Sighting } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiClient = axios.create({
	baseURL: API_CONFIG.baseURL,
	timeout: API_CONFIG.timeout,
});

const CACHED_SIGHTINGS_KEY = "cachedSightings";

export const fetchSightings = async (): Promise<Sighting[]> => {
	const response = await apiClient.get<Sighting[]>("/ufoSightings");
	return response.data;
};

export const saveSightingsToCache = async (data: Sighting[]) => {
	try {
		await AsyncStorage.setItem(CACHED_SIGHTINGS_KEY, JSON.stringify(data));
	} catch (e) {
		console.warn("Failed to save to cache", e);
	}
};

export const getSightingsFromCache = async (): Promise<Sighting[] | null> => {
	try {
		const json = await AsyncStorage.getItem(CACHED_SIGHTINGS_KEY);
		if (json) {
			return JSON.parse(json);
		}
		return null;
	} catch (e) {
		console.warn("Failed to load from cache", e);
		return null;
	}
};
