import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AuthGuard } from "./guards/auth.guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  // Requiere estar autenticado como admin hasta implementar flujo de token por email
  @Post("reset-password")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Request() req: any,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    if (req.user.role !== "admin") {
      throw new ForbiddenException(
        "Solo administradores pueden resetear contraseñas",
      );
    }
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch("change-password")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }
}
