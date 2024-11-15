"use client";

import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownTrigger,
  Dropdown,
  Avatar,
} from "@nextui-org/react";
import Menu from "./Menu";
import { Logo } from "./Logo";

export default function App() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Navbar>
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">시간표 플랜업</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link color={isActive("/") ? "primary" : "foreground"} href="/">
            나의 시간표
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={isActive("/wizard") ? "primary" : "foreground"}
            href="/wizard"
          >
            시간표 만들기
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={isActive("/lecture") ? "primary" : "foreground"}
            href="/lecture"
          >
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
