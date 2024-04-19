// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract EtherWallet {
    using Address for address payable;

    enum TOKENS {
        ETH,
        MYTOKEN
    }

    IERC20 public myToken;

    mapping(address => mapping(TOKENS => uint)) balances;

    constructor(address _ERC20Address) {
        myToken = IERC20(_ERC20Address);
    }

    function depositMyToken(uint _amount) public {
        require(myToken.balanceOf(msg.sender) >= _amount, "Not enough tokens");
        myToken.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender][TOKENS.MYTOKEN] += _amount;
        emit depositResult(msg.sender, TOKENS.MYTOKEN, _amount);
    }

    function withdrawMyToken(uint _amount) public {
        require(
            balances[msg.sender][TOKENS.MYTOKEN] >= _amount,
            "Not enough tokens"
        );
        balances[msg.sender][TOKENS.MYTOKEN] -= _amount;
        myToken.transfer(msg.sender, _amount);
        emit withdrawResult(msg.sender, TOKENS.MYTOKEN, _amount);
    }

    function depositEth() public payable {
        balances[msg.sender][TOKENS.ETH] += msg.value;
        emit depositResult(msg.sender, TOKENS.ETH, msg.value);
    }

    function withdrawETH(uint _amount) public {
        require(balances[msg.sender][TOKENS.ETH] >= _amount);
        balances[msg.sender][TOKENS.ETH] -= _amount;
        Address.sendValue(payable(msg.sender), _amount);
        emit withdrawResult(msg.sender, TOKENS.ETH, _amount);
    }

    function balanceOf() public view returns (uint,uint ) {
        return (balances[msg.sender][TOKENS.ETH], balances[msg.sender][TOKENS.MYTOKEN]);
    }

    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}

    event withdrawResult(address indexed, TOKENS, uint amount);
    event depositResult(address indexed, TOKENS, uint amount);
}
