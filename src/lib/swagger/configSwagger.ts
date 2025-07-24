import { SwaggerDocumentOptions, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
};

export const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
        authAction: {
            defaultBearerAuth: {
                name: 'jwtAuth',
                schema: {
                    description: 'Default',
                    type: 'http',
                    in: 'header',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiY2VjZjlhLTI0OTYtMTFlZS1iMTk4LWI4MDhjZjk1Y2U5YiIsInVzZXJuYW1lIjoiYWRtaW4tMUBqZmtkbHMuY29tIiwidHlwZSI6InN0YWZmIiwicm9sZXMiOlsiQURNSU4iXSwicm9sZUtleXMiOltdLCJzY2hvb2xJZCI6MzIsImlhdCI6MTY4OTY2MjA2NCwiZXhwIjoxNzA1MjE0MDY0fQ.Kk0j_twiPC4KmjA0CHVg72zVS00lWw23DDGmKlZ7x_o',
            },
        },
    },
};
