import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { IWeatherProvider } from './interfaces/weather.provider.interface';

describe('WeatherService', () => {
  let service: WeatherService;

  const mockWeatherApiResponse = {
    location: {
      name: 'Roma',
    },
    current: {
      temp_c: 25,
      humidity: 60,
      wind_kph: 10,
      condition: {
        text: 'Sunny',
      },
    },
    forecast: {
      forecastday: [
        {
          date: '2025-05-24',
          day: {
            maxtemp_c: 26,
            mintemp_c: 16,
            condition: {
              text: 'Sunny',
            },
          },
        },
        {
          date: '2025-05-25',
          day: {
            maxtemp_c: 28,
            mintemp_c: 18,
            condition: {
              text: 'Partly cloudy',
            },
          },
        },
        {
          date: '2025-05-26',
          day: {
            maxtemp_c: 24,
            mintemp_c: 15,
            condition: {
              text: 'Light rain',
            },
          },
        },
      ],
    },
  };

  const mockWeatherProvider: IWeatherProvider = {
    fetchCurrent: jest.fn(),
    fetchForecast: jest.fn().mockImplementation((city: string, days: number) => {
      if (city === 'error') {
        throw new Error('City not found');
      }
      return Promise.resolve(mockWeatherApiResponse);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: 'IWeatherProvider',
          useValue: mockWeatherProvider,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeatherByCity', () => {
    it('should return weather data with forecast', async () => {
      const result = await service.getWeatherByCity('Roma', 3);

      expect(result).toBeDefined();
      expect(result.location).toBe('Roma');
      expect(result.temperature).toBe(25);
      expect(result.humidity).toBe(60);
      expect(result.wind).toBe(10);
      expect(result.condition).toBe('sunny');
        // Verifica che il forecast non includa il giorno corrente
      expect(result.forecast).toHaveLength(2);
      expect(result.forecast[0].date).toBe('2025-05-25');
      expect(result.forecast[1].date).toBe('2025-05-26');
    });

    it('should throw error for invalid city', async () => {
      await expect(service.getWeatherByCity('error', 3)).rejects.toThrow('City not found');
    });

    it('should map conditions correctly', async () => {
      const result = await service.getWeatherByCity('Roma', 3);
      
      expect(result.forecast[0].condition).toBe('cloudy'); // "Partly cloudy"
      expect(result.forecast[1].condition).toBe('rainy');  // "Light rain"
    });

    it('should generate appropriate advice based on conditions', async () => {
      const result = await service.getWeatherByCity('Roma', 3);
      
      expect(result.advice).toBe('Perfect day to be outside!'); // sunny + temp > 20
    });
  });

  describe('condition mapping', () => {
    it('should map various weather conditions correctly', async () => {
      const testCases = [
        { input: 'Sunny', expected: 'sunny' },
        { input: 'Partly cloudy', expected: 'cloudy' },
        { input: 'Light rain', expected: 'rainy' },
        { input: 'Thunderstorm', expected: 'stormy' },
        { input: 'Mist', expected: 'foggy' },
        { input: 'Unknown', expected: 'cloudy' }, // fallback case
      ];

      for (const testCase of testCases) {
        mockWeatherApiResponse.current.condition.text = testCase.input;
        const result = await service.getWeatherByCity('Roma', 1);
        expect(result.condition).toBe(testCase.expected);
      }
    });
  });

  describe('advice generation', () => {
    it('should generate appropriate advice for different conditions', async () => {
      const testCases = [
        { condition: 'Light rain', temp: 15, expectedAdvice: 'Don\'t forget your umbrella!' },
        { condition: 'Thunderstorm', temp: 18, expectedAdvice: 'Better stay indoors.' },
        { condition: 'Sunny', temp: 25, expectedAdvice: 'Perfect day to be outside!' },
        { condition: 'Cloudy', temp: 15, expectedAdvice: 'Mild weather today.' },
      ];

      for (const testCase of testCases) {
        mockWeatherApiResponse.current.condition.text = testCase.condition;
        mockWeatherApiResponse.current.temp_c = testCase.temp;
        const result = await service.getWeatherByCity('Roma', 1);
        expect(result.advice).toBe(testCase.expectedAdvice);
      }
    });
  });
});
