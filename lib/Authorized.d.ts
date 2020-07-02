import { PropsWithChildren } from "react";
export interface AuthorizedProps {
    role?: string;
}
export declare function Authorized({ role, children }: PropsWithChildren<AuthorizedProps>): JSX.Element;
