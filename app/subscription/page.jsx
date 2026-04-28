import Subscription from "@/components/PagesComponent/Subscription/Subscription";
import axios from "axios";

export const generateMetadata = async () => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    const endPoint = (process.env.NEXT_PUBLIC_END_POINT || "/api/").replace(/^\/?/, "/");

    if (!apiUrl) {
        return {
            title: process.env.NEXT_PUBLIC_META_TITLE,
            description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
            keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
        };
    }

    const fetchUrl = `${apiUrl}${endPoint}seo-settings?page=subscription`;
    try {
        const response = await axios.get(fetchUrl);
        const subscription = response?.data?.data[0]

        return {
            title: subscription?.title ? subscription?.title : process.env.NEXT_PUBLIC_META_TITLE,
            description: subscription?.description ? subscription?.description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: subscription?.image ? [subscription?.image] : [],
            },
            keywords: subscription?.keywords ? subscription?.keywords : process.env.NEXT_PUBLIC_META_kEYWORDS
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
};

const SubscriptionPage = () => {
    return (
        <Subscription />
    )
}

export default SubscriptionPage