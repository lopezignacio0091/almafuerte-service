import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/users/dto/user.dto';

type AuthResult = {
  accessToken: string;
  username: string;
  email: string;
  id: number;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Validar password (usando el método comparePassword de la entidad)
    // Nota: Tu UsersService necesita exponer validateCredentials o similar
    const isValidPassword = await user.comparePassword?.(input.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return this.signIn(userWithoutPassword);
  }

  async signIn(user: UserDto): Promise<AuthResult> {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.username,
    };

    console.log('JWT Payload:', payload);
    console.log('JWT Secret during sign:', process.env.JWT_SECRET);
    const accessToken = await this.jwtService.signAsync(payload);
    console.log('Generated token:', accessToken);

    return { accessToken, ...user };
  }
}
