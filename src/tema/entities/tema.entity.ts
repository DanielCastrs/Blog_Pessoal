import { IsNotEmpty } from 'class-validator';
import { Postagem } from '../../postagem/entities/postagem.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Decorador que indica que esta classe é uma entidade do banco de dados, associada à tabela 'tb_temas'
@Entity({ name: 'tb_temas' })
export class Tema {
  // Decorador que define a coluna 'id' como chave primária e gerada automaticamente
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Validação para garantir que o campo 'descricao' não seja vazio
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  descricao: string;

  // Relacionamento de um-para-muitos com a entidade Postagem
  // Um tema pode ter várias postagens associadas
  @OneToMany(() => Postagem, (postagem) => postagem.tema)
  postagem: Postagem[];
}
