'use client';
import { useParams } from 'next/navigation';
import { calculateBarPercentage } from "@/utils";
import XBox from "@/components/XBox";
import XButton from "@/components/XButton";
import React, { useEffect, useRef, useState } from "react";
import { useContract } from "@/hook/useContract";
import { Idea } from "@/types";
import {Progress} from "@nextui-org/react";
import {Logo} from "@/components/Icons";


const Details: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { reqGetIdea, reqContribute, reqRefund,loading, error } = useContract();
    const [amount, setAmount] = useState('');
    const [idea, setIdea] = useState<Idea | undefined>(undefined);
    const hasFetched = useRef(false);
    const defaultImg = "http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg";

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const data = await reqGetIdea(Number(id));
                console.log(data)
                setIdea(data);
            } catch (err) {
                console.error("获取想法时出错:", err);
            }
        };
        if (!hasFetched.current && !loading) {
            hasFetched.current = true;
            fetchIdeas();
        }
    }, [reqGetIdea, loading, id]);


    const handleFund = async () => {
        const account = localStorage.getItem("address");
        if (!account) {
            console.error("No account found in local storage.");
            return;
        }

        try {
            // 调用贡献请求
            await reqContribute(account, Number(id), Number(amount));
            console.log("投资成功!!!")
            // 提示用户投资成功
            // message.success('投资成功');
            //
            // // 刷新数据
            // fetchData();
            //
            // // 关闭模态框
            // closeModal();
        } catch (error) {
            console.error("Error during contribution:", error);
            // message.error('投资失败，请稍后重试。');
        }

        console.log("Donate button clicked!", amount);
    };

    const handleRefund = async ()=>{
        const account = localStorage.getItem("address");
        if (!account) {
            console.error("No account found in local storage.");
            return;
        }

        try {
            // 调用贡献请求
            await reqRefund(account, Number(id));
            console.log("投资成功!!!");
        } catch (error) {
            console.error("Error during contribution:", error);
            // message.error('投资失败，请稍后重试。');
        }

    }

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

    if (!idea) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="font-epilogue text-lg text-white">未找到想法</p>
            </div>
        );
    }

    const progress = calculateBarPercentage(idea.amount, idea.goal);

    return (
        <div className="min-w-[600px]">
            <div className="w-full flex md:flex-row flex-col gap-[30px]">
                <div className="flex-1 flex-col">
                    <img src={defaultImg} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
                </div>
                <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
                    <XBox title="目标金额:ETH" value={`${idea.goal}`} />
                    <XBox title="当前金额:ETH" value={`${idea.amount}`} />
                    <XBox title="已投资:ETH" value={`${idea.amount}`} />
                </div>
            </div>

            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">发起人</h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div
                                className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <Logo/>
                            </div>
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{idea.initiator}</h4>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">状态</h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div
                                className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <img src="/thirdweb.png" alt="user" className="w-[60%] h-[60%] object-contain"/>
                            </div>
                            <Progress
                                aria-label="Funding Progress"
                                className="max-w-md"
                                color="success"
                                showValueLabel={true}
                                size="md"
                                value={progress}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">截止日期</h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div
                                className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <Logo/>
                            </div>
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                                    {new Date(Number(idea.endTime) * 1000).toISOString().split('T')[0]}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                {idea.story}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>
                    <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                        <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                            Fund The Idea
                        </p>
                        <div className="mt-[30px]">
                            <input
                                type="number"
                                placeholder="ETH 0.1"
                                step="0.01"
                                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back
                                    it because you believe in it.</h4>
                                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support
                                    the project for no reward, just because it speaks to you.</p>
                            </div>
                            <XButton
                                btnType="button"
                                title="Fund"
                                styles="w-full bg-[#8c6dfd]"
                                handleClick={handleFund}
                            />

                            <XButton
                                btnType="button"
                                title="Refund"
                                styles="w-full bg-yellow-500 mt-10"
                                handleClick={handleRefund}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Details;