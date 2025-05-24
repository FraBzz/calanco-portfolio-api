import { ApiProperty } from '@nestjs/swagger';

export class ForecastDayDto {  @ApiProperty({
    example: '2025-05-16',
    description: 'Data del giorno della previsione (formato ISO)',
  })
  date: string;
  @ApiProperty({
    example: 28,
    description: 'Temperatura massima prevista per il giorno (°C)',
  })
  maxTemp: number;

  @ApiProperty({
    example: 17,
    description: 'Temperatura minima prevista per il giorno (°C)',
  })
  minTemp: number;

  @ApiProperty({
    example: 'sunny',
    description: 'Condizione meteorologica generale',
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'],
  })
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
}

export class WeatherResponseDto {
  @ApiProperty({
    example: 'Roma',
    description: 'Nome della località per cui sono stati richiesti i dati',
  })
  location: string;

  @ApiProperty({
    example: 23.4,
    description: 'Temperatura attuale in gradi Celsius',
  })
  temperature: number;

  @ApiProperty({
    example: 65,
    description: 'Umidità relativa in percentuale',
  })
  humidity: number;

  @ApiProperty({
    example: 12,
    description: 'Velocità del vento in km/h',
  })
  wind: number;

  @ApiProperty({
    example: 'sunny',
    description: 'Condizione meteorologica attuale',
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'],
  })
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';

  @ApiProperty({
    description: 'Previsioni meteo per i prossimi giorni',
    type: [ForecastDayDto],
  })
  forecast: ForecastDayDto[];

  @ApiProperty({
    example: 'Giornata perfetta per uscire!',
    description: 'Suggerimento dinamico basato sulle condizioni meteo',
  })
  advice: string;
}
