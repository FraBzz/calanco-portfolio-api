import { Inject, Injectable } from '@nestjs/common';
import { IWeatherService } from './interfaces/weather.service.interface';
import { IWeatherProvider } from './interfaces/weather.provider.interface';
import { WeatherResponseDto, ForecastDayDto } from './dto/weather-response.dto';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(
    @Inject('IWeatherProvider')
    private readonly weatherProvider: IWeatherProvider,
  ) { }

  async getWeatherByCity(city: string, days: number): Promise<WeatherResponseDto> {
    // const data = await this.weatherProvider.fetchCurrent(city);
    const data = await this.weatherProvider.fetchForecast(city, days);    const forecast: ForecastDayDto[] = data.forecast.forecastday.slice(1).map((day) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: this.mapCondition(day.day.condition.text),
    }));


    const response: WeatherResponseDto = {
      location: data.location.name,
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      wind: data.current.wind_kph,
      condition: this.mapCondition(data.current.condition.text),
      forecast: forecast,
      advice: this.generateAdvice(data.current.temp_c, data.current.condition.text),
    };

    // console.log(response)

    return response;
  }

  private mapCondition(apiCondition: string): WeatherResponseDto['condition'] {
    const cond = apiCondition.toLowerCase();

    if (cond.includes('sun')) return 'sunny';
    if (cond.includes('cloud')) return 'cloudy';
    if (cond.includes('rain') || cond.includes('drizzle')) return 'rainy';
    if (cond.includes('storm') || cond.includes('thunder')) return 'stormy';
    if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) return 'foggy';

    return 'cloudy';
  }

  private generateAdvice(temp: number, condition: string): string {
    const mapped = this.mapCondition(condition);
    if (mapped === 'rainy') return 'Don\'t forget your umbrella!';
    if (mapped === 'stormy') return 'Better stay indoors.';
    if (mapped === 'sunny' && temp > 20) return 'Perfect day to be outside!';
    return 'Mild weather today.';
  }

  async getWeatherForecast(city: string, days: number): Promise<ForecastDayDto[]> {
    const data = await this.weatherProvider.fetchForecast(city, days);    const forecast: ForecastDayDto[] = data.forecast.forecastday.map((day) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: this.mapCondition(day.day.condition.text),
    }));

    return forecast;
  }
}
