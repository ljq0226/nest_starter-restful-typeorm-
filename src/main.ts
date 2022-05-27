import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { logger } from '../src/core/middleware/logger.middleware';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //app.setGlobalPrefix('api'); // 全局路由前缀
  app.useGlobalFilters(new HttpExceptionFilter()); //应用过滤器
  app.useGlobalInterceptors(new TransformInterceptor()); //应用拦截器
  app.useGlobalPipes(new ValidationPipe()); //应用管道
  app.use(logger); //应用日志管理
  const config = new DocumentBuilder()
    .setTitle('XX平台')
    .setDescription('XX平台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); //配置swagger基本信息
  await app.listen(8080);
}
bootstrap();
