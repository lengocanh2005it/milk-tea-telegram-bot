import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        url: configService.get<string>('database_url', ''),
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/modules/database/migrations/*.js'],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
