import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CreateCatDto } from './dtos/create-cat.dto';
import { Cat } from './entities/cat.entity';
import { ICatsService } from './interfaces/cat-service.interface';

@ApiExcludeController()
@Controller('cats')
export class CatsController {
    constructor(
        @Inject('ICatsService') private catsService: ICatsService,
      ) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get()
  async findAlByFilter(
    @Query('age') age: number,
    @Query('breed') breed: string,
  ) {
    return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
  }

  @Get(':id')
  findOne(@Param() params: any): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }
  //   findOne(@Param('id') id: string): string {
  //     return `This action returns a #${id} cat`;
  //   }
}

// import { Controller, Get, Res } from '@nestjs/common';
// import { Response } from 'express'; // Import necessario per usare @Res con Express

// @Controller('cats') // 'cats' sarà il prefisso per tutte le route di questo controller, es: GET /cats
// export class CatsController {
//   // ✅ Metodo standard: Nest gestisce automaticamente la response
//   @Get()
//   findAll(): string {
//     // Restituisce direttamente la risposta. NestJS torna status 200 e impacchetta come JSON/text
//     return 'This action returns all cats';
//   }

//   // ✅ Metodo alternativo: usando @Res per controllare manualmente la response
//   @Get('custom')
//   findCustom(@Res() res: Response) {
//     // Con @Res, sei tu a dover gestire tutto: status, headers e risposta
//     res.status(200).json({ message: 'This action returns all cats (custom)' });
//   }

//   // ✅ Metodo misto: uso @Res solo per aggiungere un header/cookie, ma lascio a Nest il resto
//   @Get('passthrough')
//   findWithPassthrough(@Res({ passthrough: true }) res: Response) {
//     res.setHeader('X-Cat-Header', 'Meow');
//     return { message: 'Cats with custom header' }; // NestJS si occupa della response
//   }
// }
