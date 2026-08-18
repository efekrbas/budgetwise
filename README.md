# BudgetWise 0G 🚀

**BudgetWise 0G** is a decentralized budget tracker built on the [0G Network](https://0g.ai/), providing ultra-fast, secure, and verifiable expense tracking using Web3 AI and DA (Data Availability).

This project was built for the **0G Bridge by AKINDO** Hackathon.

---

## 🎯 The Problem

Traditional budgeting apps are centralized, putting users' financial data at risk of data harvesting and censorship. Existing decentralized apps suffer from slow transaction times, high gas fees, and expensive on-chain storage. 

**BudgetWise** solves this by leveraging the 0G network for near-instant transaction finality, scalable data availability, and intelligent AI-driven financial advice.

## 🧠 0G Integration

This project integrates multiple 0G components to deliver a seamless decentralized experience:

1. **0G Chain (EVM)**: Smart contracts (`BudgetWise0G.sol`) track user budgets and aggregate total spending on-chain.
2. **0G Storage / DA**: Expense details and receipts are uploaded to 0G Storage. Only the lightweight `storageRootHash` (Merkle Root) is stored on the 0G Chain, ensuring low gas costs while maintaining verifiable data integrity.

## 🏗 Architecture Diagram

```mermaid
graph TD;
    UI[Frontend: Next.js + React Three Fiber] -->|Connect Wallet| Wallet[Web3 Wallet / wagmi]
    Wallet -->|Transactions| 0GChain[0G Galileo Testnet]
    UI -->|Upload Expense Data| API[Next.js API Route]
    API -->|@0glabs/0g-ts-sdk| 0GStorage[0G Storage Node]
    0GStorage -.->|Returns Root Hash| API
    API -.->|Hash| UI
    UI -->|Call addExpense| 0GChain
    0GChain -->|Stores Root Hash| Contract[BudgetWise0G Smart Contract]
    UI -->|AI Inference| AI[0G AI Compute Network]
```

## 🛠 Local Deployment & Setup

Follow these steps to run the project locally and deploy the smart contract to the 0G Network.

### 1. Prerequisites
- Node.js (v18+)
- Metamask or compatible Web3 wallet

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_wallet_private_key_here
RPC_URL=https://evmrpc-testnet.0g.ai
```
*(Ensure your wallet has testnet tokens from the 0G Faucet).*

### 4. Deploy Smart Contract
Compile and deploy the `BudgetWise0G` smart contract to the 0G Galileo Testnet:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network 0g-galileo
```
Copy the deployed contract address and update `CONTRACT_ADDRESS` in `src/app/page.tsx`.

### 5. Run the Frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and connect your wallet!

---

## 💎 Design & UI (UI/UX Pro Max)

The frontend features a premium, award-winning 3D design:
- **WebGL Background**: Custom wavy shader built with React Three Fiber (`@react-three/fiber`) and Three.js.
- **Glassmorphism**: Fully customized TailwindCSS `glass-panel` UI that blurs the 3D background behind cards.
- **Microinteractions**: Smooth hover states, focus rings, and seamless wallet connection flows using `wagmi` and `viem`.

## 📜 License
MIT
