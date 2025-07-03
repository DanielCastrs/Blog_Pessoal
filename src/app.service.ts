import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Pagina inicia: \n 1 - http://localhost:4000/postagens/ \n 2 - http://localhost:4000/usuarios/all \n 3 - http://localhost:4000/temas/';
  }
}
