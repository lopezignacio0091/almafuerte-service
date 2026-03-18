// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: LoginDto): Promise<any> {
    console.log("🔐 Autenticando:", input.email);

    // 1. Buscar usuario - Asegúrate que el método existe
    const user = await this.usersService.findUserByEmail(input.email);

    if (!user) {
      console.log("❌ Usuario no encontrado:", input.email);
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    // 3. Validar password - Opción A: Usando el método de la entidad
    let isValidPassword = false;
    try {
      if (user.comparePassword) {
        isValidPassword = await user.comparePassword(input.password);
      } else {
        // Opción B: Comparación directa con bcrypt
        isValidPassword = await bcrypt.compare(input.password, user.password);
      }
    } catch (error) {
      console.error("Error comparando passwords:", error);
      throw new UnauthorizedException("Error en autenticación");
    }

    if (!isValidPassword) {
      console.log("❌ Password incorrecto para:", input.email);
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    // 4. Verificar si el usuario está activo (si tienes la columna)
    // Si no tienes la columna isActive en DB, COMENTA esto:
    if (user.isActive === false) {
      throw new UnauthorizedException("Usuario desactivado");
    }

    // 5. Crear token JWT
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // 6. Remover password de la respuesta
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: "24h",
      user: userWithoutPassword,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException("Las contraseñas no coinciden");
    }

    await this.usersService.resetPassword(email, newPassword);
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(userId, changePasswordDto);
  }
}
