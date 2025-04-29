const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

function setupSwagger(app) {
    // Override servers property at runtime to ensure localhost is used
    swaggerDocument.servers = [
        {
            url: "http://localhost:4000"
        }
    ];

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true
        }
    }));

    console.log("✅ Swagger documentation available at http://localhost:4000/docs");
}

module.exports = setupSwagger;
