/// <reference types="react" />
import { RouteProps } from "react-router-dom";
export interface NotAuthorizedRouteProps {
    redirect?: string;
    role?: string;
}
export declare function NotAuthorizedRoute(props: NotAuthorizedRouteProps & RouteProps): JSX.Element;
