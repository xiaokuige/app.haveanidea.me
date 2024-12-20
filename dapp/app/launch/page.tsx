"use client";
import React, { useState } from 'react';
import FormField from "@/components/FormField";
import XButton from "@/components/XButton";
import Loader from "@/components/Loader";
import { MoneyIcon } from "@/components/Icons";
import XAlert from "@/components/XAlert";
import {useContract} from "@/hook/useContract";
import { useRouter } from 'next/navigation';

const Launch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {reqAddIdea} = useContract();
    const router = useRouter();
    const [form, setForm] = useState({
        title: '',
        story: '',
        goal: 0.001,
        endTime: '',
        img: ''
    });
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleFormFieldChange = (field:any, e:any) => {
        const value = e.target.value;
        if (field === 'goal') {
            setForm({ ...form, [field]: Number(value) });
        } else {
            setForm({ ...form, [field]: value });
        }
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setIsLoading(true);
        const account = localStorage.getItem("address");
        if (!account) {
            setIsLoading(false);
            showAlert("Please connect your wallet.");
            return;
        }
        if (!form.title || !form.story || form.goal <= 0 || !form.endTime || !form.img) {
            setIsLoading(false);
            showAlert("Please fill in all required fields correctly.");
            return;
        }
        const deadline = Math.floor(new Date(form.endTime).getTime() / 1000);
        try {
            await reqAddIdea(account, form.title, form.story, form.goal, deadline, form.img);
            router.push('/');
        } catch (error) {
            console.error("Error submitting form:", error);
            showAlert("Submit the idea failed. Please try again!");
        } finally {
            setIsLoading(false);
        }
    };

    const showAlert = (message:any) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 relative">
            {isLoading && <Loader />}
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white mb-4">🌱 Launch an Idea</h1>
            <XAlert message={alertMessage} color="danger" visible={alertVisible} onClose={() => setAlertVisible(false)}/>
            <form onSubmit={handleSubmit} className="w-full mt-16 flex flex-col gap-6">
                <FormField
                    labelName="Idea Title *"
                    placeholder="Write a title"
                    inputType="text"
                    value={form.title}
                    handleChange={(e) => handleFormFieldChange('title', e)}
                />
                <FormField
                    labelName="Story *"
                    placeholder="Write your idea story"
                    isTextArea
                    inputType="text"
                    value={form.story}
                    handleChange={(e) => handleFormFieldChange('story', e)}
                />
                <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
                    <MoneyIcon />
                    <h4 className="font-epilogue font-bold text-[25px] text-white ml-2">You will get 100% of the raised amount</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                    <FormField
                        labelName="Goal *"
                        placeholder="ETH 0.50"
                        inputType="number"
                        value={form.goal.toString()}
                        handleChange={(e) => handleFormFieldChange('goal', e)}
                    />
                    <FormField
                        labelName="End Date *"
                        placeholder="End Date"
                        inputType="date"
                        value={form.endTime}
                        handleChange={(e) => handleFormFieldChange('endTime', e)}
                    />
                </div>
                <FormField
                    labelName="Campaign Image *"
                    placeholder="Place image URL of your idea"
                    inputType="url"
                    value={form.img}
                    handleChange={(e) => handleFormFieldChange('img', e)}
                />

                <div className="flex justify-center items-center mt-4">
                    <XButton btnType="submit" title="Submit Idea" styles="bg-[#1dc071] hover:bg-[#1abc6b] transition"/>
                </div>
            </form>
        </div>
    );
}

export default Launch;