import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// --- IN-MEMORY CACHE ---
// This stores the data on your server so you don't spam the Birdeye API
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes

export async function GET() {
    const CA = "UWUy7J86LUiBv5SjAUZ53LMGhtnqvbQ7QNSSkyupump";
    const currentTime = Date.now();

    // 1. Check if we have fresh data in the cache (younger than 5 minutes)
    if (cachedData && (currentTime - cacheTimestamp) < CACHE_DURATION_MS) {
        console.log("🟢 Serving chart data from Server Cache!");
        return json(cachedData);
    }

    // 2. If no cache, we MUST fetch from Birdeye
    const toTime = Math.floor(currentTime / 1000);
    const fromTime = toTime - (14 * 4 * 3600); 

    try {
        console.log("🟡 Fetching fresh chart data from Birdeye...");
        const response = await fetch(`https://public-api.birdeye.so/defi/ohlcv?address=${CA}&type=4H&time_from=${fromTime}&time_to=${toTime}`, {
            headers: {
                "X-API-KEY": env.BIRDEYE_API_KEY || "", 
                "x-chain": "solana"
            }
        });
        
        const data = await response.json();

        if (!response.ok) {
            console.error("🚨 Birdeye API Rejected Request:", data);
            return json({ error: "API rejected request", details: data }, { status: response.status });
        }

        // 3. Save the fresh data to our cache before sending it back
        cachedData = data;
        cacheTimestamp = currentTime;

        return json(data);
    } catch (error) {
        console.error("🚨 Server fetch error:", error);
        return json({ error: "Failed to fetch data" }, { status: 500 });
    }
}