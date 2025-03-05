import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //* Habilitar CORS para poder consumir la API desde un lugar que no sea localhost:3000
  app.enableCors({
    origin: 'https://beyondlimitsapp.netlify.app',  // Cambia esto al dominio de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],    // Los métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Los encabezados permitidos
  });
  
  /*
    * Configuracion de ValidationPipe (Nos sirve para validar las columnas en los DTO):
    * whitelist: true: Esta opción de configuración indica que el ValidationPipe permitirá solo propiedades cuyos nombres estén definidos explícitamente en la clase DTO.  Si se recibe una propiedad en la solicitud que no está en la clase DTO, se descartará automáticamente.
    * forbidNonWhitelisted: true: Esta opción trabaja en conjunto con la anterior. Si forbidNonWhitelisted se establece en true, significa que cualquier propiedad no definida en la clase DTO será rechazada y no se procesará. Esto ayuda a garantizar que solo se procesen las propiedades permitidas y definidas explícitamente en la clase DTO.
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  );
    
  /*
    *Inicia el servidor de tu aplicación NestJS en el puerto 3000 y bloquea la ejecución del programa hasta que el servidor esté en funcionamiento. Una vez que el servidor está escuchando en el puerto 3000, el programa continuará ejecutando cualquier otra lógica que puedas tener después de esta línea.
  */

  app.useStaticAssets(path.join(__dirname, "../uploads"))
  
  await app.listen( process.env.PORT ?? 3000);
}
bootstrap();
