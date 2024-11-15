"use client";

import { DropdownItem, DropdownMenu } from "@nextui-org/react";

export default function Menu() {
  return (
    <DropdownMenu aria-label="Profile Actions" variant="flat">
      <DropdownItem key="profile" className="h-14 gap-2">
        <p className="font-semibold">플랜업을 사용하려면</p>
        <p className="font-semibold">로그인하세요.</p>
        {/* <p className="font-semibold">Signed in as</p> */}
        {/* <p className="font-semibold">zoey@example.com</p> */}
      </DropdownItem>
      <DropdownItem key="settings">나의 시간표</DropdownItem>
      <DropdownItem key="team_settings">시간표 만들기</DropdownItem>
      <DropdownItem key="analytics">개설과목 조회</DropdownItem>
      <DropdownItem key="logout" color="success">
        로그인
      </DropdownItem>
    </DropdownMenu>
  );
}
