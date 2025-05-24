import { Test, TestingModule } from '@nestjs/testing';
import { WeatherProvider } from './weather.provider';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('WeatherProvider', () => {
  let provider: WeatherProvider;
  let configService: ConfigService;

  const mockApiKey = 'test-api-key';
  
  const mockWeatherResponse = {
    data: {
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
        ],
      },
    },
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(mockApiKey),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherProvider,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    provider = module.get<WeatherProvider>(WeatherProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should get API key from config service', () => {
    expect(configService.get).toHaveBeenCalledWith('WEATHER_API_KEY');
  });

  describe('fetchCurrent', () => {
    it('should fetch current weather data', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockWeatherResponse));

      const result = await provider.fetchCurrent('Roma');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('current.json'),
      );
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('key=test-api-key'),
      );
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('q=Roma'),
      );
      expect(result).toEqual(mockWeatherResponse.data);
    });

    it('should handle API errors', async () => {
      mockHttpService.get.mockReturnValueOnce(
        of({
          data: {
            error: {
              code: 1006,
              message: 'No matching location found.',
            },
          },
        }),
      );

      const result = await provider.fetchCurrent('NonExistentCity');
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('No matching location found.');
    });
  });

  describe('fetchForecast', () => {
    it('should fetch forecast data with default days', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockWeatherResponse));

      const result = await provider.fetchForecast('Roma');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('forecast.json'),
      );
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('days=3'),
      );
      expect(result).toEqual(mockWeatherResponse.data);
    });

    it('should fetch forecast data with specified days', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockWeatherResponse));

      const result = await provider.fetchForecast('Roma', 5);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('days=5'),
      );
      expect(result).toEqual(mockWeatherResponse.data);
    });

    it('should use HTTPS', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockWeatherResponse));

      await provider.fetchForecast('Roma');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\//),
      );
    });

    it('should URL encode city names with spaces', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockWeatherResponse));

      await provider.fetchForecast('New York');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('q=New%20York'),
      );
    });
  });
});
