// Optional .NET Aspire orchestration for the Jagthorn frontend.
//
// The app is a static React/Vite SPA and runs perfectly well on its own with
// `npm run dev`. This AppHost simply launches that dev server as an Aspire
// resource so it shows up in the Aspire dashboard — handy if you later add
// backend services to orchestrate alongside it.
var builder = DistributedApplication.CreateBuilder(args);

builder
    .AddNpmApp(name: "web", workingDirectory: "../web", scriptName: "dev")
    // Aspire allocates a port and passes it to Vite via the PORT env var
    // (see web/vite.config.ts, which reads process.env.PORT).
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
