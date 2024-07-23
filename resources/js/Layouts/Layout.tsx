import { Container } from "@mantine/core";
import React from "react";

type LayoutProps = {
    children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Container size={"xs"} my={32}>
            {children}
        </Container>
    );
};
