// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BudgetWise0G {
    struct Expense {
        uint256 amount;
        string category;
        uint256 timestamp;
        string storageRootHash;
    }

    mapping(address => uint256) public budgets;
    mapping(address => uint256) public totalSpent;
    mapping(address => Expense[]) private userExpenses;

    event BudgetSet(address indexed user, uint256 limit);
    event ExpenseAdded(address indexed user, uint256 amount, string category, string storageRootHash);

    function setBudget(uint256 _limit) external {
        budgets[msg.sender] = _limit;
        emit BudgetSet(msg.sender, _limit);
    }

    function addExpense(uint256 _amount, string calldata _category, string calldata _storageRootHash) external {
        userExpenses[msg.sender].push(Expense({
            amount: _amount,
            category: _category,
            timestamp: block.timestamp,
            storageRootHash: _storageRootHash
        }));
        
        totalSpent[msg.sender] += _amount;
        
        emit ExpenseAdded(msg.sender, _amount, _category, _storageRootHash);
    }

    function getBudgetStats(address _user) external view returns (uint256 limit, uint256 spent) {
        return (budgets[_user], totalSpent[_user]);
    }

    function getExpenses(address _user) external view returns (Expense[] memory) {
        return userExpenses[_user];
    }
}
