// Example Code
// Do Not Use

import { NextApiRequest, NextApiResponse } from "next";

interface TokenResponse {
    access_token: string;
    error?: string;
    error_description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        const tokenUrl = "https://oauth2.googleapis.com/token";
        
        const body = new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
            redirect_uri: `${process.env.NEXT_PUBLIC_FRONTEND_URL}login/oauth/callback`,
            grant_type: "authorization_code",
        });

        try {
            const response = await fetch(tokenUrl, {
                method: "POST",
                body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data: TokenResponse = await response.json();

            if (data.error) {
                return res.status(400).json({ error: data.error_description });
            }

            return res.status(200).json({ access_token: data.access_token });
        } catch (error) {
            console.error("구글 API 요청 실패:", error);
            return res.status(500).json({ error: "토큰 요청에 실패했습니다." });
        }
    } else {
        res.status(405).json({ error: "허용되지 않는 HTTP 메서드입니다." });
    }
}
