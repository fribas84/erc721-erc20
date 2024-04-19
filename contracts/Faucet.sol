// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function mint(address to, uint256 amount) external;
}

contract Faucet is Ownable {
    using Address for address payable;

    address public myTokenAddress;
    uint256 public ethBalance;
    mapping(address => mapping( uint8 =>uint)) lastRequest;

    constructor(address _ERC20Address) {
        myTokenAddress = _ERC20Address;
    }

    function requestTokens() external {
        require(
        lastRequest[msg.sender][0] + 1 days < block.timestamp,
        "You can only request once per day"
        );
        lastRequest[msg.sender][0] = block.timestamp;
        IERC20(myTokenAddress).mint(msg.sender, 10000*10**18);
        emit TokensTransfered(msg.sender, 10000*10**18);
    }

    function requestEth() external {
        require(
        lastRequest[msg.sender][1] + 1 days < block.timestamp,
        "You can only request ETH once per day"
        );

        require(ethBalance >= 0.02 ether, "Not enough ETH in the faucet");
        lastRequest[msg.sender][1] = block.timestamp;
        ethBalance -= 0.02 ether;

        Address.sendValue(payable(msg.sender), 0.2 ether);
        emit EthTransfered(msg.sender, 0.02 ether);
    }

    function _depositEth() internal {
        ethBalance += msg.value;
        emit EthDeposited(msg.sender, msg.value);
    }

    function depositEth() external payable {
        _depositEth();
    }   
    fallback() external payable {
        _depositEth();
    }

    receive() external payable {
        _depositEth();
    }

    event EthDeposited(address indexed user, uint256 amount);
    event TokensTransfered(address indexed user, uint256 amount);
    event EthTransfered(address indexed user, uint256 amount);
}
