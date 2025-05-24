import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { IWeatherService } from './interfaces/weather.service.interface';
import { WeatherResponseDto } from './dto/weather-response.dto';

describe('WeatherController', () => {
  let controller: WeatherController;

  const mockWeatherData: WeatherResponseDto = {
    location: 'Roma',
    temperature: 25,
    humidity: 60,
    wind: 10,
    condition: 'sunny',    forecast: [
      {
        date: '2025-05-25',
        maxTemp: 28,
        minTemp: 18,
        condition: 'sunny'
      },
      {
        date: '2025-05-26',
        maxTemp: 27,
        minTemp: 17,
        condition: 'cloudy'
      }
    ],
    advice: 'Perfect day to be outside!'
  };

  const mockWeatherService: IWeatherService = {
    getWeatherByCity: jest.fn().mockImplementation((city: string, days: number) => {
      if (city === 'error') {
        throw new Error('City not found');
      }
      return Promise.resolve(mockWeatherData);
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: 'IWeatherService',
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data successfully', async () => {
      const result = await controller.getWeather({ city: 'Roma', days: 3 });

      expect(result).toBeDefined();
      expect(result.type).toBe('success');
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockWeatherData);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(mockWeatherService.getWeatherByCity).toHaveBeenCalledWith('Roma', 3);
    });

    it('should handle errors correctly', async () => {
      const result = await controller.getWeather({ city: 'error', days: 3 });

      expect(result).toBeDefined();
      expect(result.type).toBe('error');
      expect(result.status).toBe(500);
      expect(result.message).toBe('City not found');
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.data).toBeUndefined();
    });

    it('should work with optional days parameter', async () => {
      const result = await controller.getWeather({ city: 'Roma' });

      expect(result).toBeDefined();
      expect(result.type).toBe('success');
      expect(result.data).toEqual(mockWeatherData);
      expect(mockWeatherService.getWeatherByCity).toHaveBeenCalledWith('Roma', undefined);
    });
  });
});
