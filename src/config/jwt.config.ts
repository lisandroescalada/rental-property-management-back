import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '7d');

  return {
    secret: configService.get<string>(
      'JWT_SECRET',
      'change_this_secret_in_production',
    ),
    signOptions: {
      expiresIn: expiresIn as any, // Permite tanto string como number
    },
  };
};


