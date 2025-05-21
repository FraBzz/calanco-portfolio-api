import { Module } from '@nestjs/common';
import { SupabaseModule } from "src/supabase/supabase.module";
import { WeatherService } from "./weather.service";
import { HttpModule } from '@nestjs/axios';
import { WeatherProvider } from './providers/weather.provider';
import { WeatherController } from './weather.controller';

@Module({
    imports: [SupabaseModule, HttpModule],
    controllers: [WeatherController],
    providers: [{
        provide: 'IWeatherService',
        useClass: WeatherService
    },
    {
        provide: 'IWeatherProvider',
        useClass: WeatherProvider,
    },],
    exports: ['IWeatherService'],
})

export class WeatherModule { }