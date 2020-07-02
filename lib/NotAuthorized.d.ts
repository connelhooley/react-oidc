import { PropsWithChildren } from "react";
export interface NotAuthorizedProps {
    role?: string;
}
export declare function NotAuthorized({ children, role }: PropsWithChildren<NotAuthorizedProps>): JSX.Element;
