import { WeatherResponseDto } from "../dto/weather-response.dto";

export interface IWeatherService {
    getWeatherByCity(city: string, days: number): Promise<WeatherResponseDto>;
}