/// <reference types="react" />
import { RouteProps } from "react-router-dom";
export interface AuthorizedRouteProps {
    redirect?: string;
    role?: string;
}
export declare function AuthorizedRoute(props: AuthorizedRouteProps & RouteProps): JSX.Element;
