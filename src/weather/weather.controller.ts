import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IWeatherService } from './interfaces/weather.service.interface';
import { WeatherQueryDto } from './dto/weather-query.dto';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(
    @Inject('IWeatherService')
    private readonly weatherService: IWeatherService) {}
    
  @Get()
  @ApiQuery({ name: 'days', required: false, type: Number, example: 3 })
  @ApiResponse({ status: 200, type: WeatherResponseDto })
  async getWeather(@Query() query: WeatherQueryDto): Promise<WeatherResponseDto> {
    return this.weatherService.getWeatherByCity(query.city, query.days);
  }
}
