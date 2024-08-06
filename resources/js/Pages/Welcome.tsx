import { Head, router } from "@inertiajs/react";
import { Button, Flex, Group, Title } from "@mantine/core";

export default function Welcome() {
    return (
        <>
            <Head title="BrickLink Price Tracker" />

            <Flex
                h={"100svh"}
                w={"100%"}
                justify={"center"}
                align={"center"}
                direction={"column"}
                gap={"lg"}
                p={"lg"}
            >
                <Title ta={"center"} textWrap="balance">
                    Welcome to BrickLink Price Tracker!
                </Title>

                <Group>
                    <Button
                        variant="default"
                        onClick={() => router.get(route("login"))}
                    >
                        Log in
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => router.get(route("register"))}
                    >
                        Register
                    </Button>
                </Group>
            </Flex>
        </>
    );
}
