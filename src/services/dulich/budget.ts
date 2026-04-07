import moment from 'moment';
import type { Destination, ItineraryStop, MonthlyTravelStatistic, PopularDestinationStatistic, TravelCosts, TravelPlan } from './typing';

const emptyCosts = (): TravelCosts => ({
	food: 0,
	stay: 0,
	transport: 0,
});

export const getDestinationTotalCost = (destination?: Destination) => {
	if (!destination) return 0;
	return destination.avgCosts.food + destination.avgCosts.stay + destination.avgCosts.transport;
};

export const getCostsFromDestinations = (destinations: Destination[]) => {
	return destinations.reduce(
		(accumulator, destination) => ({
			food: accumulator.food + (destination.avgCosts.food || 0),
			stay: accumulator.stay + (destination.avgCosts.stay || 0),
			transport: accumulator.transport + (destination.avgCosts.transport || 0),
		}),
		emptyCosts(),
	);
};

export const getCostsTotal = (costs?: TravelCosts) => {
	if (!costs) return 0;
	return (costs.food || 0) + (costs.stay || 0) + (costs.transport || 0);
};

export const getBudgetProgress = (expected: number, actual: number) => {
	const percent = expected > 0 ? Math.min((actual / expected) * 100, 100) : actual > 0 ? 100 : 0;
	return {
		percent,
		overBudget: actual > expected,
		status: actual > expected ? ('exception' as const) : ('active' as const),
	};
};

export const sortByDestinationCost = (left: Destination, right: Destination, direction: 'asc' | 'desc') => {
	const diff = getDestinationTotalCost(left) - getDestinationTotalCost(right);
	return direction === 'asc' ? diff : -diff;
};

export const getItineraryCosts = (stops: ItineraryStop[], destinations: Destination[]) => {
	const selectedDestinations = stops
		.map((stop) => destinations.find((destination) => destination.id === stop.destinationId))
		.filter((destination): destination is Destination => Boolean(destination));

	return getCostsFromDestinations(selectedDestinations);
};

export const getItineraryTravelMinutes = (stops: ItineraryStop[]) => {
	return stops.reduce((total, stop) => total + (stop.transitMinutes || 0), 0);
};

const getMonthBuckets = (monthCount = 12) => {
	return Array.from({ length: monthCount }, (_, index) => moment().subtract(monthCount - index - 1, 'months').startOf('month'));
};

const isSameMonth = (value: string, month: moment.Moment) => moment(value).format('YYYY-MM') === month.format('YYYY-MM');

export const getMonthlyTravelStatistics = (plans: TravelPlan[], monthCount = 12): MonthlyTravelStatistic[] => {
	return getMonthBuckets(monthCount).map((month) => {
		const monthlyPlans = plans.filter((plan) => isSameMonth(plan.createdAt, month));
		return {
			month: month.format('MM/YYYY'),
			itineraryCount: monthlyPlans.length,
			expectedBudget: monthlyPlans.reduce((sum, plan) => sum + getCostsTotal(plan.expectedCosts), 0),
			actualBudget: monthlyPlans.reduce((sum, plan) => sum + getCostsTotal(plan.actualCosts), 0),
		};
	});
};

export const getPopularDestinations = (plans: TravelPlan[], destinations: Destination[], limit = 6): PopularDestinationStatistic[] => {
	const counter = new Map<number, number>();

	plans.forEach((plan) => {
		plan.stops.forEach((stop) => {
			counter.set(stop.destinationId, (counter.get(stop.destinationId) || 0) + 1);
		});
	});

	return Array.from(counter.entries())
		.map(([destinationId, count]) => ({
			destinationId,
			count,
			name: destinations.find((destination) => destination.id === destinationId)?.name || 'Không xác định',
		}))
		.sort((left, right) => right.count - left.count)
		.slice(0, limit);
};

export const getPlanSnapshot = (stops: ItineraryStop[], destinations: Destination[]) => {
	const selectedDestinations = stops
		.map((stop) => destinations.find((destination) => destination.id === stop.destinationId))
		.filter((destination): destination is Destination => Boolean(destination));

	return {
		expectedCosts: getCostsFromDestinations(selectedDestinations),
		totalTravelMinutes: getItineraryTravelMinutes(stops),
	};
};
