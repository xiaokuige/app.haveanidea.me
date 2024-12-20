"use client";
import React, { useState } from 'react';
//@ts-ignore
import { Card, Input, Button, Textarea, Spacer } from '@nextui-org/react';

const PForm = () => {
    const [formState, setFormState] = useState({
        title: "",
        goal: "",
        endTime: undefined,
        info: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handleSubmit....")
    };
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        }}>
            <Card style={{
                width: '100%',
                minWidth: '600px',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#ffffff',
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: '#4A4A4A',
                    fontSize: '26px',
                    fontWeight: 'bold',
                }}>
                    🌱 创建你的众筹想法
                </h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        fullWidth
                        label="标题"
                        name="title"
                        value={formState.title}
                        onChange={handleChange} // 添加 onChange
                        required
                    />
                    <Spacer y={2} />
                    <Input
                        fullWidth
                        label="目标金额"
                        name="goal"
                        type="number"
                        value={formState.goal || ''}
                        onChange={handleChange} // 添加 onChange
                        required
                    />
                    <Spacer y={2} />
                    <Input
                        fullWidth
                        label="结束时间"
                        name="endTime"
                        type="date"
                        value={formState.endTime}
                        onChange={handleChange}
                        required
                    />
                    <Spacer y={2} />
                    <Textarea
                        fullWidth
                        label="介绍"
                        name="info"
                        value={formState.info}
                        onChange={handleChange} // 添加 onChange
                        required
                    />
                    <Spacer y={2} />
                    <Button fullWidth type="submit" color="success" style={{ padding: '12px', fontSize: '16px' }}>
                        发起
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default PForm;