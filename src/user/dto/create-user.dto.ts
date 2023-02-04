import { IsEmail, IsString, Length } from 'class-validator';

export class createUserDto {
  @IsEmail()
  @Length(6, 30, {
    message: 'Почта должна быть указана в формате example@example.com',
  })
  email: string;

  @IsString()
  @Length(4, 15, {
    message: 'Доступная длина имени/никнейма - от 5 до 15 знаков',
  })
  fullName: string;

  @IsString()
  @Length(6, 15, { message: 'Пароль должен быть не короче 6 знаков' })
  password: string;
}
