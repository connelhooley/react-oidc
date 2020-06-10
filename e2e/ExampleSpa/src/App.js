import React from "react";
import { AuthProvider, SignInButton, SignOutButton, NotAuthorized, Authorized, useUser } from "@connelhooley/react-oidc";

function App() {
  const oidcSettings = {
      authority: "https://localhost:5000",
      client_id: "example-client-id",
      response_type: "code",
      response_mode: "query",
      scope: "openid profile example-scope",
      redirect_uri: "https://localhost:5001/callback",
      silent_redirect_uri: "https://localhost:5001/silent-callback",
      post_logout_redirect_uri: "https://localhost:5001/",
      clockSkew: 10,
      automaticSilentRenew: true,
      accessTokenExpiringNotificationTime: 0,
  };
  return (
      <BrowserRouter>
          <AuthProvider
              oidcSettings={oidcSettings}
              signInCallbackRoute="/callback"
              silentSignInCallbackRoute="/silent-callback"
              signInCallbackFallbackRoute="/"
              defaultAuthorizedRouteRedirect="/"
              defaultNotAuthorizedRouteRedirect="/">
                  <Switch>
                      <Route exact path="/">
                          <HomePage />
                          <NotAuthorized>
                            <SignInButton id="sign-in-button">Sign In</SignInButton>
                          </NotAuthorized>
                          <Authorized>
                            <SignOutButton id="sign-out-button">Sign Out</SignOutButton>
                          </Authorized>
                      </Route>
                  </Switch>
          </AuthProvider>
      </BrowserRouter>
  );
}

function HomePage() {
  const user = useUser();
  if (user) {
    return (
      <ul id="signed-in">
        <li id="token">{user.token}</li>
        <li id="name">{user.name}</li>
        <li id ="email">{user.email}</li>
        <li id="role">{user.role}</li>
      </ul>
    );
  } else {
    return (
      <p id="signed-out">User is not signed in</p>
    );
  }
}

export default App;
