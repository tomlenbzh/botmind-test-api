import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS_CONFIG: CorsOptions = {
  origin: true,
  methods: 'GET,PUT,POST,DELETE'
};
