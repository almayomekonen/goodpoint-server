import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerCustomOptions, swaggerDocumentOptions } from './configSwagger';
import metadata from 'src/metadata';

/**
 * Set up Swagger documentation in a Nest.js application.
 * @param {INestApplication} app - The Nest.js application instance.
 * @returns {void}
 */
export async function bootstrapSwagger(app: INestApplication) {
    // todo- addBearerAuth to make it work
    const options = new DocumentBuilder()
        .setTitle('API')
        .setDescription(
            `\n\n### These are our Swagger API docs. Unfortunately, for security reasons, the endpoints don't work, but they show a color abstraction of our endpoints. \n\n## Servers\n- [local Server](http://localhost:8080/)\n- [Development Server](https://goodpoint2-t.carmel6000.com/)\n\n## Security\n- JWT (type: apiKey, name: access_token, in: query)`,
        )
        .setExternalDoc('see further docs here', 'https://hilma.atlassian.net/wiki/spaces/GO/pages/696221697/2')
        .setVersion('1.0')
        .addTag('api')
        .addServer('http://localhost:8080/', 'local Server')
        .addServer('https://goodpoint2-t.carmel6000.com/', 'Development Server')
        .addBearerAuth(undefined, 'jwtAuth')
        .setContact('David Feldman', null, 'davidFeld@hilma.tech')
        .build();

    await SwaggerModule.loadPluginMetadata(metadata);
    const document = SwaggerModule.createDocument(app, options, swaggerDocumentOptions);

    SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}
