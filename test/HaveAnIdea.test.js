const HaveAnIdea = artifacts.require("HaveAnIdea");

contract("HaveAnIdea", accounts => {
    let contractInstance;
    const [owner, funder1, funder2] = accounts;

    beforeEach(async () => {
        contractInstance = await HaveAnIdea.new();
    });

    it("should return money to the funder if the idea is unsuccessful", async () => {
        // 创建一个新想法
        const title = "Test Idea";
        const story = "This is a test story";
        const goal = web3.utils.toWei("1", "ether");
        const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const img = "test_image.png";

        await contractInstance.createIdea(owner, title, story, goal, endTime, img);

        // 贡献一些资金
        await contractInstance.contribute(1, { from: funder1, value: web3.utils.toWei("0.5", "ether") });
        await contractInstance.contribute(1, { from: funder2, value: web3.utils.toWei("0.3", "ether") });

        // 退钱，应该可以成功
        const initialBalance = await web3.eth.getBalance(funder1);
        await contractInstance.returnMoney(1, { from: funder1 });

        // 检查 funder1 的余额是否增加
        const finalBalance = await web3.eth.getBalance(funder1);
        assert(finalBalance > initialBalance, "Funder1 should have received their funds back");
    });
});