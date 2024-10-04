"use client"
import { useFetchMarketsQuery } from "@/redux/api/markets.api";

const Page = () => {
    const { data: markets, isLoading, error } = useFetchMarketsQuery();

    // Add console.log to log markets if they exist
    if (markets) {
        console.log('Markets:', markets);
    }

    if (isLoading) return <div>Loading...</div>;
    return (
        <section className="container grid gap-6 items-center pt-6 pb-8 md:py-10">
            <h1 className="text-3xl font-extrabold">Marchés</h1>
            <ul>
                {markets?.map((market) => (
                    <li key={market.marketId}>{market.name}</li>
                ))}
            </ul>
        </section>
    );
}

export default Page