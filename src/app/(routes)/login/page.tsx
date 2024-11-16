"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { Tabs, Tab, Input, Link, Button, Card, CardBody } from "@nextui-org/react";
import React from "react";

const Login = () => {
    const [selected, setSelected] = React.useState("login");

    // const handleSelectionChange = (newSelected: React.SetStateAction<string>) => {
    //     setSelected(newSelected);
    //     console.log("Selected:", newSelected);
    // };

    return (
        <>
            <Header />
            <PageInfo title="로그인" description="플랜업 사용을 위해 로그인하세요." />
            <div className="flex justify-center items-center">
                <Card className="max-w-full w-[340px] h-[300px]">
                    <CardBody className="overflow-hidden">
                        <Tabs fullWidth size="md" aria-label="Tabs form" selectedKey={selected} onSelectionChange={setSelected}>
                            <Tab key="login" title="로그인">
                                <form className="flex flex-col gap-4">
                                    <Input isRequired label="이메일" placeholder="학교 이메일로 로그인하세요" type="email" />
                                    <Input isRequired label="비밀번호" placeholder="비밀번호를 입력하세요" type="password" />
                                    <p className="text-center text-small">
                                        플랜업 사용이 처음이신가요?{" "}
                                        <Link size="sm" onPress={() => setSelected("sign-up")} className="cursor-pointer">
                                            회원가입
                                        </Link>
                                    </p>
                                    <div className="flex gap-2 justify-end">
                                        <Button fullWidth color="primary">
                                            로그인
                                        </Button>
                                    </div>
                                </form>
                            </Tab>
                            <Tab key="sign-up" title="회원가입">
                                <p className="text-center text-small my-4">
                                    계속하기를 눌러{" "}
                                    <Link size="sm" onPress={() => setSelected("sign-up")} className="cursor-pointer">
                                        서비스 이용약관
                                    </Link>
                                    에 동의합니다
                                </p>
                                <Link href="/register" className="w-full">
                                    <Button fullWidth color="primary">
                                        계속하기
                                    </Button>
                                </Link>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default Login;
