import { ApiProperty } from '@nestjs/swagger';

export class ForecastDayDto {  @ApiProperty({
    example: '2025-05-16',
    description: 'Date of the forecast day (ISO format)',
  })
  date: string;
  @ApiProperty({
    example: 28,
    description: 'Maximum temperature expected for the day (°C)',
  })
  maxTemp: number;

  @ApiProperty({
    example: 17,
    description: 'Minimum temperature expected for the day (°C)',
  })
  minTemp: number;

  @ApiProperty({
    example: 'sunny',
    description: 'General weather condition',
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'],
  })
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
}

export class WeatherResponseDto {
  @ApiProperty({
    example: 'Roma',
    description: 'Name of the location for which data was requested',
  })
  location: string;

  @ApiProperty({
    example: 23.4,
    description: 'Current temperature in degrees Celsius',
  })
  temperature: number;

  @ApiProperty({
    example: 65,
    description: 'Relative humidity percentage',
  })
  humidity: number;

  @ApiProperty({
    example: 12,
    description: 'Wind speed in km/h',
  })
  wind: number;

  @ApiProperty({
    example: 'sunny',
    description: 'Current weather condition',
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'],
  })
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';

  @ApiProperty({
    description: 'Weather forecast for the next few days',
    type: [ForecastDayDto],
  })
  forecast: ForecastDayDto[];

  @ApiProperty({
    example: 'Perfect day to go out!',
    description: 'Dynamic suggestion based on weather conditions',
  })
  advice: string;
}
