'use client';
import IdeaCard from "@/components/IdeaCard";
import { useContract } from "@/hook/useContract";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Idea } from "@/types";

export default function Home() {
    const router = useRouter();
    const { reqListIdeas, loading, error } = useContract();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const data = await reqListIdeas();
                console.log(data)
                setIdeas(data);
            } catch (err) {
                console.error("获取想法时出错:", err);
            }
        };
        if (!hasFetched.current && !loading) {
            hasFetched.current = true;
            fetchIdeas();
        }
    }, [reqListIdeas, loading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="font-epilogue text-lg text-white">加载中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="font-epilogue text-lg text-red-500">错误: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#121212] rounded-[10px] min-h-screen">
            <h1 className="font-epilogue font-semibold text-2xl text-white mb-4">
                🌱 所有想法 ({ideas.length})
            </h1>
            <p className="font-epilogue font-medium text-lg leading-6 text-gray-400 mb-6">
                {ideas.length === 0 ? "您还没有创建任何想法......" : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((data: Idea) => (
                    <IdeaCard key={data.index} title={data.title} description={data.story}
                        image={data.img} handleClick={() => router.push(`/details/${data.index}`)}
                    />
                ))}
            </div>
        </div>
    );
}