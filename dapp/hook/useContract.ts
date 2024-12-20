import { useEffect, useState } from 'react';
import {initContract, addIdea, listIdeas, getIdea, contribute, refund} from '@/service/ethers';

export const useContract = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWeb3 = async () => {
            try {
                await initContract();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : '发生未知错误');
            } finally {
                setLoading(false);
            }
        };
        loadWeb3();
    }, []);

    const reqAddIdea = async (account:string, title: string, story: string, amount: number, deadline: number, img: string) => {
        return await addIdea(account, title, story, amount, deadline, img);
    };

    const reqListIdeas = async ()=>{
        return await listIdeas();
    }

    const reqGetIdea = async (index:number)=>{
        return await getIdea(index);
    }

    const reqContribute= async (account:string, id: number,fund:number) =>{
        return await contribute(account,id,fund);
    }

    const reqRefund = async (account:string, id: number)=>{
        return await refund(account,id);
    }
    return { reqAddIdea, reqGetIdea, reqListIdeas, reqContribute,reqRefund,loading, error};
};