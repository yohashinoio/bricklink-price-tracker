import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { Box, Button, Flex, Menu, rem } from "@mantine/core";
import { IconEdit, IconLogout } from "@tabler/icons-react";
import React from "react";

type LayoutProps = {
    children: React.ReactNode;
} & PageProps;

export const Layout: React.FC<LayoutProps> = ({ children, auth }) => {
    return (
        <Flex direction={"column"} m={20} gap={10}>
            <Flex justify={"end"}>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Button variant="default">{auth.user.name}</Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={
                                <IconEdit
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                            onClick={() => router.get(route("profile.edit"))}
                        >
                            Profile
                        </Menu.Item>

                        <Menu.Item
                            onClick={() => router.post(route("logout"))}
                            leftSection={
                                <IconLogout
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                        >
                            Log Out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>

            <Flex justify={"center"}>
                <Box w={"60svw"}>{children}</Box>
            </Flex>
        </Flex>
    );
};
