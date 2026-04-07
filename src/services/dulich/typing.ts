export type DestinationType = 'bien' | 'nui' | 'thanh-pho' | 'van-hoa' | 'sinh-thai';

export interface DestinationAvgCosts {
	food: number;
	stay: number;
	transport: number;
}

export interface Destination {
	id: number;
	name: string;
	type: DestinationType;
	location: string;
	description: string;
	imageUrl: string;
	rating: number;
	visitTime: number;
	avgCosts: DestinationAvgCosts;
}

export interface ItineraryStop {
	id: number;
	destinationId: number;
	day: number;
	order: number;
	transitMinutes: number;
}

export interface TravelCosts {
	food: number;
	stay: number;
	transport: number;
}

export interface TravelPlan {
	id: number;
	name: string;
	createdAt: string;
	expectedCosts: TravelCosts;
	actualCosts: TravelCosts;
	totalTravelMinutes: number;
	stops: ItineraryStop[];
}

export interface MonthlyTravelStatistic {
	month: string;
	itineraryCount: number;
	expectedBudget: number;
	actualBudget: number;
}

export interface PopularDestinationStatistic {
	destinationId: number;
	name: string;
	count: number;
}
