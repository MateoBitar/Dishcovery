// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

// Bootstrap function to start the NestJS application
async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);  // Create app instance

    // Enable CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });
    console.log('CORS enabled');

    app.use(bodyParser.json({ limit: '50mb' }));  // Configure body parser
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // Configure URL-encoded parser
    console.log('Body parser configured with 10mb limit');

    const port = parseInt(process.env.PORT || '3000', 10);  // Get port from env or default to 3000
    
    await app.listen(port, 'localhost');  // Start listening on the specified port
    
    console.log(`Server successfully bound to port ${port}`);
    console.log(`Server running on http://localhost:${port}/graphql`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap();  // Start the application
