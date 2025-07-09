import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  //vai fazer a validação do usuario, incluindo username e senha
  async validateUser(username: string, password: string): Promise<any> {
    // está indo na classe UsuarioService e pegando metodo buscar por usuario e colocando o valor que foi inserido
    // na validação
    const buscaUsuario = await this.usuarioService.findByUsuario(username);
    //caso o buscar usuario foi NULL ou undefined ele vai inverter o valor para TRUE e vai lançar a mensagem e para o codigo
    if (!buscaUsuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    //Vai entrar na class bcript resgatar um methodo compararSenha e comparar senha digitada X Senha do banco
    // O buscarUsuario tem a senha do banco de dados pq o findByUsuario buscou os dados do usuario no banco
    // O Retorno do metodo abaixo será True / False
    const matchPassword = await this.bcrypt.compararSenhas(
      password,
      buscaUsuario.senha,
    );
    // matchPassword é boolean mas o buscarUsuario é string, porém se a variavel tiver valor é considerado verdadeiro
    // Caso a variavel estiver vazia ela é considerada
    if (buscaUsuario && matchPassword) {
      //desestruturação
      //A desestruturação extrai a propriedade senha do objeto buscaUsuario e armazena o restante das propriedades em um novo objeto chamado resposta
      const { senha, ...resposta } = buscaUsuario;
      return resposta;
    }

    return null;
  }

  //vai incluid um objeto Login/senha que o usuario vai digitar na hora
  async login(usuarioLogin: UsuarioLogin) {
    //vai armazenar o login do usuario em uma subject ou seja o dono do token
    const payload = { sub: usuarioLogin.usuario };
    //buscaUsuario vai ter os dados do usuario passado, ele vai usar methodo findByusuario da class UsuarioService
    const buscaUsuario = await this.usuarioService.findByUsuario(
      usuarioLogin.usuario,
    );

    return {
      id: buscaUsuario?.id,
      nome: buscaUsuario?.nome,
      usuario: usuarioLogin.usuario,
      senha: '',
      foto: buscaUsuario?.foto,

      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
