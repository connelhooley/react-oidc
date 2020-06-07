# React OIDC

A few opinionated React components wrapping [oidc-client](https://github.com/IdentityModel/oidc-client-js/) using the [Hooks API](https://reactjs.org/docs/hooks-intro.html).

``` bash
npm install @connelhooley/react-oidc
```

To use this plugin, the oidc server you are interacting with must supply the following additional claims:

- `name`
- `email`
- `role`

# AuthProvider

All other components in this library must be placed inside a single `AuthProvider` component. Place this component as close to your root component as possible but under a react router. The `AuthProvider` component handles sign-in callback routes. All other routes should be handled by its children. It also sets up the user context so information about the logged in user can be accessed by its children, see [useUser](#useuser) for more information.

``` jsx
export function App() {
    const oidcSettings = {
        authority: "https://example-authority.com",
        client_id: "example-client-d",
        response_type: "code",
        response_mode: "query",
        scope: "openid profile another-example-scope",
        redirect_uri: "https://this-app.com/callback",
        silent_redirect_uri: "https://this-app.com/silent-callback",
        post_logout_redirect_uri: "https://this-app.com/",
        clockSkew: 60,
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
                defaultNotAuthorizedRouteRedirect="/"
                loadingComponentFactory= {() => <Loading />}>
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                    </Switch>
            </AuthProvider>
        </BrowserRouter>
    );
}
```

- The `oidcSettings` prop is the config class sent to the `oidc-client` library.
- The `signInCallbackRoute` prop is the route that completes the sign in process when the user is redirected back to the application. It must match up with the `redirect_uri` property in the `oidcSettings` prop. Defaults to `"/callback"`.
- The `silentSignInCallbackRoute` prop is the route that refreshes the user token in the background via an iframe. It must match up with the `silent_redirect_uri` property in the `oidcSettings` prop. Defaults to `"/silent-callback"`.
- The `signInCallbackFallbackRoute` prop is the route the user is redirected to if an error occurs finding the return URL in state. Defaults to `"/"`.
- The `defaultAuthorizedRouteRedirect` prop is the route the user is redirected to, when they try an access an "authorized" route and they are not signed in. See [AuthorizedRoute](#authorizedroute) for more information. Defaults to `"/"`.
- The `defaultNotAuthorizedRouteRedirect` prop is the route the user is redirected to, when they try an access a "not authorized" route and they are signed in. See [NotAuthorizedRoute](#notauthorizedroute) for more information. Defaults to `"/"`.
- The `loadingComponentFactory` prop is a function that returns the component to be rendered when the user is completing the sign in process. This is optional, if it is not provided no element is rendered.

# useUser

Returns information about the signed in user. The returned object can be either:

- An `object` containing information about the user when the user is signed in.
- `false` when the user is not signed in.
- `undefined` when the user is signing in.

``` js
export function HomePage() {
    const user = useUser();
    if (user) {
        return (
            <h1>Signed in</h1>
            <p>{user.id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>{user.token}</p>
        );
    } else if (user == false) {
        return (
            <h1>Not signed in</h1>
        );
    } else {
        return (
            <h1>Signing in</h1>
        );
    }
}
```

The user object contains the user's token and this can be used to create `Authorization` bearer headers in HTTP clients, below is a quick example using fetch:

``` js
const user = useUser();
const authHeader = user
    ? { "Authorization": `Bearer ${user.token}` }
    : undefined;
const res = await fetch("https://example.com", {
    method: "GET",
    headers: {
        "Accept": "application/json",
        ...(authHeader ?? {}),
    },
});
```

# Authorized

Only renders its children if the user is authenticated.

``` jsx
export function Example() {
    return (
        <Authorized>
            <p>The user is signed in</p>
        </Authorized>
    );
}
```

You can also provide a role and the `Authorized` component will only render its children if the user is authenticated and has that role.

``` jsx
export function Example() {
    return (
        <Authorized role="admin">
            <p>The user is signed in and is an admin</p>
        </Authorized>
        <Authorized role="customer">
            <p>The user is signed in and is a customer</p>
        </Authorized>
    );
}
```

# NotAuthorized

Only renders its children if the user is not authenticated.

``` jsx
export function Example() {
    return (
        <NotAuthorized>
            <p>The user is not signed in</p>
        </NotAuthorized>
    );
}
```

# Authorizing

Only renders its children if the user is currently signing in.

``` jsx
export function Example() {
    return (
        <Authorizing>
            <p>The user is in the process of signing in</p>
        </Authorizing>
    );
}
```

# AuthorizedRoute

Only renders its children if its route is matched and the user is currently signed in. If the user is not signed in, the component redirects to the `defaultAuthorizedRouteRedirect` value specified in the parent `AuthProviderRouter`s props.

``` jsx
export function Routes() {
    return (
        <Switch>
            <Route path="/">
                <HomePage />
            </Route>
            <AuthorizedRoute path="/profile">
                <ProfilePage />
            </Route>
        </Switch>
    );
}
```

You can also provide a redirect value in the `AuthorizedRoute`s props to configure where the route redirects to if the user is not signed in.

``` jsx
export function Routes() {
    return (
        <Switch>
            <Route path="/">
                <HomePage />
            </Route>
            <AuthorizedRoute path="/profile" redirect="/profile-404">
                <ProfilePage />
            </Route>
            <Route path="/profile-404">
                <ProfileNotFoundPage />
            </Route>
        </Switch>
    );
}
```

# NotAuthorizedRoute

Only renders its children if its route is matched and the user is not currently signed in. If the user is signed in, the component redirects to the `defaultNotAuthorizedRouteRedirect` value specified in the parent `AuthProviderRouter`s props.

``` jsx
export function Routes() {
    return (
        <Switch>
            <Route path="/">
                <HomePage />
            </Route>
            <NotAuthorizedRoute path="/register">
                <RegistrationPage />
            </Route>
        </Switch>
    );
}
```

You can also provide a redirect value in the `NotAuthorizedRoute`s props to configure where the route redirects to if the user is signed in.

``` jsx
export function Routes() {
    return (
        <Switch>
            <Route path="/">
                <HomePage />
            </Route>
            <NotAuthorizedRoute path="/register" redirect="/already-registered">
                <RegistrationPage />
            </Route>
            <Route path="/already-registered">
                <AlreadyRegisteredPage />
            </Route>
        </Switch>
    );
}
```

# SignInButton

Starts sign in process by redirecting the user when clicked.

``` js
export function Nav() {
    return (
        <SignInButton>Click here to sign in</SignInButton>
    );
}
```

All props are passed down to the underlying button meaning the component can be styled using CSS-in-JS libraries such as `styled-components`.

# SignOutButton

Starts sign out process by redirecting the user when clicked.

``` js
export function Nav() {
    return (
        <SignOutButton>Click here to sign out</SignOutButton>
    );
}
```

All props are passed down to the underlying button meaning the component can be styled using CSS-in-JS libraries such as `styled-components`.
