import { Controller, Get, HttpException, HttpStatus, Inject, Query } from '@nestjs/common';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { ApiResponse, ApiQuery, ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ 
    summary: 'Get weather forecast', 
    description: 'Retrieves weather forecast data for a specified city with optional number of forecast days' 
  })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 3 })
  @ApiResponse({ status: 200, type: WeatherResponseDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getWeather(@Query() query: WeatherQueryDto): Promise<ApiResponseDto<WeatherResponseDto>> {
    try {
      const data = await this.weatherService.getWeatherByCity(query.city, query.days);
      return {
        type: 'success',
        status: 200,
        data,
        message: 'Weather data retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException({
        type: 'error',
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date()
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
