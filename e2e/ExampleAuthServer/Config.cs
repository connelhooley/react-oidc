// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Models;
using System.Collections.Generic;

namespace ExampleAuthServer
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };
        }

        public static IEnumerable<ApiResource> GetApis()
        {
            return new ApiResource[]
            {
                new ApiResource("api1", "My API #1")
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new[]
            {
                new Client
                {
                    ClientId = "spa",
                    ClientName = "SPA Client",
                    ClientUri = "http://identityserver.io",

                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireClientSecret = false,

                    AccessTokenLifetime = 20,

                    RedirectUris =
                    {
                        "https://localhost:5001",
                        "https://localhost:5001/callback",
                        "https://localhost:5001/silent-callback",
                    },

                    PostLogoutRedirectUris = { "https://localhost:5001" },
                    AllowedCorsOrigins = { "https://localhost:5001" },

                    AllowedScopes = { "openid", "profile", "example-scope" }
                }
            };
        }
    }
}