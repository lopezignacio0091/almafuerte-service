import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; // Bearer <token>

    if (!authorization) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de token inválido');
    }

    const token = parts[1];

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      console.log('Token received:', token);
      console.log('JWT Secret used:', process.env.JWT_SECRET);
      const tokenPayload = await this.jwtService.verifyAsync(token);
      console.log('Token payload:', tokenPayload);
      
      request.user = {
        sub: tokenPayload.sub,
        id: tokenPayload.sub, // Asegurar que id esté disponible como sub
        username: tokenPayload.username,
        email: tokenPayload.email,
        role: tokenPayload.role,
        name: tokenPayload.name,
      };

      return true;
    } catch (error) {
      console.log('JWT Verification error:', error.name, error.message);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }
      throw new UnauthorizedException('No autorizado');
    }
  }
}
