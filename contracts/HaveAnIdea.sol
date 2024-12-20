// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HaveAnIdea {

    // 投资人结构定义
    struct Funder {
        address payable addr;
        uint amount;
    }

    // 资金使用请求结构定义
    struct Use {
        string info;
        uint goal;
        uint agreeAmount;
        uint disagree;
        bool over;
        mapping(uint => uint) agree;
    }

    struct Idea {
        address payable initiator;
        string name;
        string title;
        string story;
        string img;
        uint goal;
        uint endTime;
        bool success;
        uint amount;
        uint numFunders;
        uint numUses;
        mapping(uint => Funder) funders;
        mapping(uint => Use) uses;
    }

    uint public numIdeas;
    mapping(uint => Idea) public ideas;

    function createIdea(address payable initiator,string memory title, string memory story, uint goal, uint endTime,string memory img) public returns(uint) {
        require(endTime > block.timestamp);
        numIdeas = numIdeas + 1;
        Idea storage idea = ideas[numIdeas];
        idea.initiator = initiator;
        idea.title = title;
        idea.story = story;
        idea.goal = goal;
        idea.endTime = endTime;
        idea.success = false;
        idea.amount = 0;
        idea.numFunders = 0;
        idea.numUses = 0;
        idea.img = img;
        return numIdeas;
    }

    function contribute(uint ID) public payable {
        // 贡献的钱必须大于0，不能超过差额
        require(msg.value > 0 && msg.value <= ideas[ID].goal - ideas[ID].amount);
        // 时间上必须还没结束
        require(ideas[ID].endTime > block.timestamp);
        // 必须是未完成的众筹
        require(ideas[ID].success == false);

        Idea storage idea = ideas[ID];
        idea.amount += msg.value;
        idea.numFunders = idea.numFunders + 1;
        idea.funders[idea.numFunders].addr = msg.sender;
        idea.funders[idea.numFunders].amount = msg.value;
        // 考虑本项目是否达成目标
        idea.success = idea.amount >= idea.goal;
    }

    // 退钱
    function returnMoney(uint ID) public {
        require(ID <= numIdeas && ID >= 1);
        require(ideas[ID].success == false);

        Idea storage idea = ideas[ID];
        for(uint i=1; i<=idea.numFunders; i++)
            if(idea.funders[i].addr == msg.sender) {
                idea.funders[i].addr.transfer(idea.funders[i].amount);
                idea.amount -= idea.funders[i].amount;
                idea.funders[i].amount = 0;
            }
    }

    function newUse(uint ID, uint goal, string memory info) public {
        require(ID <= numIdeas && ID >= 1);
        require(ideas[ID].success == true);
        require(goal <= ideas[ID].amount);
        require(msg.sender == ideas[ID].initiator);
        Idea storage idea = ideas[ID];
        idea.numUses = idea.numUses + 1;
        idea.uses[idea.numUses].info = info;
        idea.uses[idea.numUses].goal = goal;
        idea.uses[idea.numUses].agreeAmount = 0;
        idea.uses[idea.numUses].disagree = 0;
        idea.uses[idea.numUses].over = false;
        idea.amount = idea.amount - goal;
    }

    function agreeUse(uint ID, uint useID, bool agree) public {
        require(ID <= numIdeas && ID >= 1);
        require(useID <= ideas[ID].numUses && useID >= 1);
        require(ideas[ID].uses[useID].over == false);

        for(uint i=1; i<=ideas[ID].numFunders; i++)
            if(ideas[ID].funders[i].addr == msg.sender) {
                if(ideas[ID].uses[useID].agree[i] == 1) {
                    ideas[ID].uses[useID].agreeAmount -= ideas[ID].funders[i].amount;
                } else if(ideas[ID].uses[useID].agree[i] == 2) {
                    ideas[ID].uses[useID].disagree -= ideas[ID].funders[i].amount;
                }
                if(agree) {
                    ideas[ID].uses[useID].agreeAmount += ideas[ID].funders[i].amount;
                    ideas[ID].uses[useID].agree[i] = 1;
                } else {
                    ideas[ID].uses[useID].disagree += ideas[ID].funders[i].amount;
                    ideas[ID].uses[useID].agree[i] = 2;
                }
            }
        checkUse(ID, useID);
    }

    function checkUse(uint ID, uint useID) public {
        require(ID <= numIdeas && ID >= 1);
        require(ideas[ID].uses[useID].over == false);

        if(ideas[ID].uses[useID].agreeAmount >= ideas[ID].goal / 2) {
            ideas[ID].uses[useID].over = true;
            ideas[ID].initiator.transfer(ideas[ID].uses[useID].goal);
        }
        if(ideas[ID].uses[useID].disagree > ideas[ID].goal / 2) {
            ideas[ID].amount = ideas[ID].amount + ideas[ID].uses[useID].goal;
            ideas[ID].uses[useID].over = true;
        }
    }

    function getUseLength(uint ID) public view returns (uint) {
        require(ID <= numIdeas && ID >= 1);
        return ideas[ID].numUses;
    }

    function getUse(uint ID, uint useID, address addr) public view returns (string memory, uint, uint, uint, bool, uint) {
        require(ID <= numIdeas && ID >= 1);
        require(useID <= ideas[ID].numUses && useID >= 1);

        Use storage u = ideas[ID].uses[useID];
        uint agree = 0;
        for(uint i=1; i<=ideas[ID].numFunders; i++)
            if(ideas[ID].funders[i].addr == addr) {
                agree = ideas[ID].uses[useID].agree[i];
                break;
            }
        return (u.info, u.goal, u.agreeAmount, u.disagree, u.over, agree);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getMyFundings(address addr, uint ID) public view returns (uint) {
        uint res = 0;
        for(uint i=1; i<=ideas[ID].numFunders; i++) {
            if(ideas[ID].funders[i].addr == addr)
                res += ideas[ID].funders[i].amount;
        }
        return res;
    }
}