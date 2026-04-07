import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	DEFAULT_DESTINATIONS,
	DEFAULT_TRAVEL_PLANS,
	TRAVEL_STORAGE_KEYS,
	getBudgetProgress,
	getCostsFromDestinations,
	getCostsTotal,
	getItineraryCosts,
	getItineraryTravelMinutes,
	getMonthlyTravelStatistics,
	getPlanSnapshot,
	getPopularDestinations,
	type Destination,
	type ItineraryStop,
	type TravelCosts,
	type TravelPlan,
} from '@/services/dulich';

type DestinationFormPayload = Omit<Destination, 'id'>;

type ItineraryDirection = 'up' | 'down';

const EMPTY_COSTS: TravelCosts = {
	food: 0,
	stay: 0,
	transport: 0,
};

const safeParse = <T,>(key: string, fallback: T) => {
	if (typeof window === 'undefined') return fallback;

	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch (error) {
		return fallback;
	}
};

const normalizeStops = (stops: ItineraryStop[]) => {
	const grouped = stops
		.slice()
		.sort((left, right) => left.day - right.day || left.order - right.order)
		.reduce<Record<number, ItineraryStop[]>>((accumulator, stop) => {
			const current = accumulator[stop.day] || [];
			return {
				...accumulator,
				[stop.day]: [...current, stop],
			};
		}, {});

	return Object.entries(grouped).flatMap(([day, items]) =>
		items.map((stop, index) => ({
			...stop,
			day: Number(day),
			order: index + 1,
		})),
	);
};

export default () => {
	const [destinations, setDestinations] = useState<Destination[]>(() => safeParse(TRAVEL_STORAGE_KEYS.destinations, DEFAULT_DESTINATIONS));
	const [itineraryStops, setItineraryStops] = useState<ItineraryStop[]>(() => safeParse(TRAVEL_STORAGE_KEYS.itineraryStops, []));
	const [travelPlans, setTravelPlans] = useState<TravelPlan[]>(() => safeParse(TRAVEL_STORAGE_KEYS.travelPlans, DEFAULT_TRAVEL_PLANS));
	const [draftName, setDraftName] = useState<string>(() => safeParse(TRAVEL_STORAGE_KEYS.draftName, 'Hành trình mới'));
	const [draftActualCosts, setDraftActualCosts] = useState<TravelCosts>(() => safeParse(TRAVEL_STORAGE_KEYS.draftActualCosts, EMPTY_COSTS));

	useEffect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TRAVEL_STORAGE_KEYS.destinations, JSON.stringify(destinations));
	}, [destinations]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TRAVEL_STORAGE_KEYS.itineraryStops, JSON.stringify(itineraryStops));
	}, [itineraryStops]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TRAVEL_STORAGE_KEYS.travelPlans, JSON.stringify(travelPlans));
	}, [travelPlans]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TRAVEL_STORAGE_KEYS.draftName, draftName);
	}, [draftName]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TRAVEL_STORAGE_KEYS.draftActualCosts, JSON.stringify(draftActualCosts));
	}, [draftActualCosts]);

	const addDestination = useCallback((item: DestinationFormPayload) => {
		setDestinations((prev) => {
			const maxId = prev.length ? Math.max(...prev.map((destination) => destination.id)) : 0;
			return [...prev, { ...item, id: maxId + 1 }];
		});
	}, []);

	const updateDestination = useCallback((id: number, updatedItem: Partial<DestinationFormPayload>) => {
		setDestinations((prev) => prev.map((destination) => (destination.id === id ? { ...destination, ...updatedItem } : destination)));
	}, []);

	const deleteDestination = useCallback((id: number) => {
		setDestinations((prev) => prev.filter((destination) => destination.id !== id));
		setItineraryStops((prev) => normalizeStops(prev.filter((stop) => stop.destinationId !== id)));
	}, []);

	const addToItinerary = useCallback((destinationId: number, day = 1) => {
		setItineraryStops((prev) => {
			if (prev.some((stop) => stop.destinationId === destinationId)) return prev;
			const maxId = prev.length ? Math.max(...prev.map((stop) => stop.id)) : 0;
			const sameDayStops = prev.filter((stop) => stop.day === day);
			return normalizeStops([...prev, { id: maxId + 1, destinationId, day, order: sameDayStops.length + 1, transitMinutes: 0 }]);
		});
	}, []);

	const updateItineraryStop = useCallback((id: number, updatedItem: Partial<ItineraryStop>) => {
		setItineraryStops((prev) => normalizeStops(prev.map((stop) => (stop.id === id ? { ...stop, ...updatedItem } : stop))));
	}, []);

	const deleteItineraryStop = useCallback((id: number) => {
		setItineraryStops((prev) => normalizeStops(prev.filter((stop) => stop.id !== id)));
	}, []);

	const moveItineraryStop = useCallback((id: number, direction: ItineraryDirection) => {
		setItineraryStops((prev) => {
			const orderedStops = normalizeStops(prev);
			const currentStop = orderedStops.find((stop) => stop.id === id);
			if (!currentStop) return prev;

			const dayStops = orderedStops.filter((stop) => stop.day === currentStop.day);
			const otherStops = orderedStops.filter((stop) => stop.day !== currentStop.day);
			const currentIndex = dayStops.findIndex((stop) => stop.id === id);
			const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
			if (nextIndex < 0 || nextIndex >= dayStops.length) return prev;

			const swapped = [...dayStops];
			[swapped[currentIndex], swapped[nextIndex]] = [swapped[nextIndex], swapped[currentIndex]];

			return normalizeStops([...otherStops, ...swapped]);
		});
	}, []);

	const clearItinerary = useCallback(() => {
		setItineraryStops([]);
	}, []);

	const updateDraftName = useCallback((name: string) => {
		setDraftName(name);
	}, []);

	const updateDraftActualCosts = useCallback((updatedItem: Partial<TravelCosts>) => {
		setDraftActualCosts((prev) => ({ ...prev, ...updatedItem }));
	}, []);

	const saveCurrentItinerary = useCallback(() => {
		if (!itineraryStops.length) return null;

		const snapshot = getPlanSnapshot(itineraryStops, destinations);
		const maxId = travelPlans.length ? Math.max(...travelPlans.map((plan) => plan.id)) : 0;
		const plan: TravelPlan = {
			id: maxId + 1,
			name: draftName.trim() || `Hành trình ${moment().format('DD/MM/YYYY')}`,
			createdAt: moment().toISOString(),
			expectedCosts: snapshot.expectedCosts,
			actualCosts: draftActualCosts,
			totalTravelMinutes: snapshot.totalTravelMinutes,
			stops: itineraryStops,
		};

		setTravelPlans((prev) => [...prev, plan]);
		return plan;
	}, [destinations, draftActualCosts, draftName, itineraryStops, travelPlans.length]);

	const itineraryDestinations = useMemo(
		() =>
			itineraryStops
				.slice()
				.sort((left, right) => left.day - right.day || left.order - right.order)
				.map((stop) => ({
					...stop,
					destination: destinations.find((item) => item.id === stop.destinationId),
				}))
				.filter((item) => Boolean(item.destination)),
		[destinations, itineraryStops],
	);

	const expectedCosts = useMemo(() => getItineraryCosts(itineraryStops, destinations), [destinations, itineraryStops]);
	const actualTotal = useMemo(() => getCostsTotal(draftActualCosts), [draftActualCosts]);
	const expectedTotal = useMemo(() => getCostsTotal(expectedCosts), [expectedCosts]);
	const travelMinutesTotal = useMemo(() => getItineraryTravelMinutes(itineraryStops), [itineraryStops]);
	const budgetProgress = useMemo(() => getBudgetProgress(expectedTotal, actualTotal), [actualTotal, expectedTotal]);
	const monthlyStatistics = useMemo(() => getMonthlyTravelStatistics(travelPlans), [travelPlans]);
	const popularDestinations = useMemo(() => getPopularDestinations(travelPlans, destinations), [destinations, travelPlans]);
	const featuredDestinations = useMemo(() => destinations.slice().sort((left, right) => right.rating - left.rating).slice(0, 6), [destinations]);

	return {
		destinations,
		setDestinations,
		addDestination,
		updateDestination,
		deleteDestination,
		addToItinerary,
		updateItineraryStop,
		deleteItineraryStop,
		moveItineraryStop,
		clearItinerary,
		itineraryStops,
		itineraryDestinations,
		travelPlans,
		draftName,
		updateDraftName,
		draftActualCosts,
		updateDraftActualCosts,
		saveCurrentItinerary,
		expectedCosts,
		expectedTotal,
		actualTotal,
		travelMinutesTotal,
		budgetProgress,
		monthlyStatistics,
		popularDestinations,
		featuredDestinations,
		getCostsFromDestinations,
		getCostsTotal,
	};
};
