import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IWeatherService } from './interfaces/weather.service.interface';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(
    @Inject('IWeatherService')
    private readonly weatherService: IWeatherService) {}
    
  @Get()
  @ApiQuery({ name: 'days', required: false, type: Number, example: 3 })
  @ApiResponse({ status: 200, type: WeatherResponseDto })
  async getWeather(@Query() query: WeatherQueryDto): Promise<ApiResponseDto<WeatherResponseDto>> {
    try {
      const data = await this.weatherService.getWeatherByCity(query.city, query.days);
      return {
        type: 'success',
        status: 200,
        data,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        type: 'error',
        message: error.message,
        status: 500,
        timestamp: new Date()
      };
    }
  }
}
