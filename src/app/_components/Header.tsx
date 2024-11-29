"use client";

import { usePathname } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownTrigger, Dropdown, Avatar } from "@nextui-org/react";
import Menu from "./Menu";
import { Logo } from "./icon/LogoIcon";

export default function App() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <Navbar>
            <NavbarBrand>
                <Link href="/" className="">
                    <Logo />
                    <p className="font-bold text-black dark:text-white">플랜업</p>
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-8" justify="center">
                <NavbarItem>
                    <Link color={isActive("/timetable") ? "primary" : "foreground"} href="/timetable" className="font-medium">
                        나의 시간표
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color={isActive("/wizard") ? "primary" : "foreground"} href="/wizard" className="font-medium">
                        시간표 만들기
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color={isActive("/lecture") ? "primary" : "foreground"} href="/lecture" className="font-medium">
                        개설과목 조회
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="default"
                            name="Jason Hughes"
                            size="sm"
                            src="/defaultAvatar.png"
                        />
                    </DropdownTrigger>
                    <Menu />
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}
