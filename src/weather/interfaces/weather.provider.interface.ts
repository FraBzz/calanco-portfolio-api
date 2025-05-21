export interface IWeatherProvider {
    fetchCurrent(city: string): Promise<any>;
    fetchForecast(city: string, days: number): Promise<any>
}