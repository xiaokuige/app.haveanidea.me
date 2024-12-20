import Web3 from 'web3';
import HaveAnIdea from './HaveAnIdea.json';
import {Idea} from "@/types";

let web3: Web3 | null = null;
let contract: any = null;

const initializeWeb3 = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
    } else {
        throw new Error("Ethereum provider is not available.");
    }
};

export const initContract = async (): Promise<void> => {
    if (!web3) {
        await initializeWeb3();
    }
    if (web3) {
        contract = new web3.eth.Contract(HaveAnIdea.abi, '0x23E06eCF8480081aaEb07057a7dA937A7616d3CA');
    } else {
        throw new Error("Web3 is not initialized");
    }
};

export const addIdea = async (account: string, title: string, story: string, goal: number, deadline: number, img: string) => {
    deadline = Math.floor(Date.now() / 1000) + 86400;
    return  await contract.methods.createIdea(account, title, story, Web3.utils.toWei(goal.toString(), 'ether'), deadline, img).send({
        from: account,
        gas: "1000000"
    });
};

export const listIdeas = async (): Promise<Idea[]> => {
    try {
        const length = await contract.methods.numIdeas().call();
        const result: Idea[] = [];
        for (let i = 1; i <= length; i++) {
            result.push(await getIdea(i));
        }
        return result;
    } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : '未知错误';
        throw new Error(`获取资金信息失败: ${errorMessage}`);
    }
};

export const getIdea = async (index: number): Promise<Idea> => {
    if (!contract) {
        throw new Error('合约未初始化');
    }
    const data = await contract.methods.ideas(index).call();
    data.goal = parseFloat(Web3.utils.fromWei(data.goal, 'ether'));
    data.amount = parseFloat(Web3.utils.fromWei(data.amount, 'ether'));
    return { index, ...data };
};

export const contribute= async (account:string,id:number, value:number) =>{
    return await contract.methods.contribute(id).send({from: account, value: Web3.utils.toWei(value.toString(10), 'ether')});
}

export const refund= async (account:string,id: number)=> {
    return await contract.methods.returnMoney(id).send({from: account, gas: 1000000})
}
