import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { IWeatherProvider } from "../interfaces/weather.provider.interface";
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherProvider implements IWeatherProvider {
    private readonly apiKey: string;
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.apiKey = this.configService.get<string>('WEATHER_API_KEY');
    }    async fetchCurrent(city: string): Promise<any> {
        const encodedCity = encodeURIComponent(city);
        const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${encodedCity}`;
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }
    async fetchForecast(city: string, days = 3): Promise<any> {
        const encodedCity = encodeURIComponent(city);
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${encodedCity}&days=${days}`;
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }

}