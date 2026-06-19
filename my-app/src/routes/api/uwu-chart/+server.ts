import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
    const CA = "UWUy7J86LUiBv5SjAUZ53LMGhtnqvbQ7QNSSkyupump";
    const toTime = Math.floor(Date.now() / 1000);
    const fromTime = toTime - (14 * 4 * 3600); 

    try {
        const response = await fetch(`https://public-api.birdeye.so/defi/ohlcv?address=${CA}&type=4H&time_from=${fromTime}&time_to=${toTime}`, {
            headers: {
                "X-API-KEY": env.BIRDEYE_API_KEY || "", // The server injects the key securely here
                "x-chain": "solana"
            }
        });
        
        const data = await response.json();
        return json(data);
    } catch (error) {
        return json({ error: "Failed to fetch data" }, { status: 500 });
    }
}