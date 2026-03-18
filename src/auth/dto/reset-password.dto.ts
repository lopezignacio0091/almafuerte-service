import { IsEmail, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @IsString()
  @MinLength(6, {
    message: "La nueva contraseña debe tener al menos 6 caracteres",
  })
  newPassword: string;

  @IsString()
  @MinLength(6, {
    message: "La confirmación debe tener al menos 6 caracteres",
  })
  confirmPassword: string;
}
