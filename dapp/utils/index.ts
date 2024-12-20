export const daysLeft = (deadline: number): string => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);

    return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (amount:number,goal: number): number => {
    return  Math.round(amount / goal) * 100;
};

export const checkIfImage = (url: string, callback: (exists: boolean) => void): void => {
    const img = new Image();
    img.src = url;

    if (img.complete) callback(true);

    img.onload = () => callback(true);
    img.onerror = () => callback(false);
};