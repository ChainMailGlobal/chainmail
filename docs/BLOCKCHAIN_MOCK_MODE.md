# Blockchain Mock Mode

## Overview

The CMRAgent platform supports **mock mode** for blockchain integration during development and testing. This allows you to test the complete workflow without spending real cryptocurrency on gas fees.

## Configuration

### Mock Mode (Default)

By default, the system uses mock mode for Ethereum anchoring:

\`\`\`bash
# No environment variables needed for mock mode
# Mock mode is active by default
\`\`\`

### Real Blockchain Mode

To use real Ethereum/Polygon blockchain:

\`\`\`bash
ETHEREUM_USE_REAL=true
ETHEREUM_RPC_URL=https://polygon-rpc.com  # or your preferred RPC
ETHEREUM_PRIVATE_KEY=your_private_key_here
\`\`\`

## Mock Mode Behavior

### Ethereum Anchoring (CMRA Signup)

**Mock Mode:**
- Generates realistic-looking transaction hashes (0x...)
- Creates random block numbers
- No real blockchain transactions
- No gas fees
- Instant confirmation

**Real Mode:**
- Submits actual transactions to Ethereum/Polygon
- Requires gas fees (ETH/MATIC)
- Real transaction confirmation time
- Permanent blockchain record

### XRP Ledger (Witness Sessions)

XRP Ledger integration uses the **testnet by default**:

\`\`\`bash
# Default: XRP Testnet (free test XRP)
XRPL_NETWORK=testnet

# Production: XRP Mainnet (real XRP required)
XRPL_NETWORK=mainnet
XRPL_WALLET_SEED=your_wallet_seed
\`\`\`

## Development Workflow

### Phase 1: Development (Mock Mode)
\`\`\`bash
# No configuration needed
# All blockchain features work in mock mode
\`\`\`

### Phase 2: Testing (Testnets)
\`\`\`bash
# Ethereum: Use Mumbai testnet
ETHEREUM_USE_REAL=true
ETHEREUM_RPC_URL=https://rpc-mumbai.maticvigil.com
ETHEREUM_PRIVATE_KEY=your_test_wallet_key

# XRP: Use testnet (default)
XRPL_NETWORK=testnet
\`\`\`

### Phase 3: Production (Mainnets)
\`\`\`bash
# Ethereum: Use Polygon mainnet (low fees)
ETHEREUM_USE_REAL=true
ETHEREUM_RPC_URL=https://polygon-rpc.com
ETHEREUM_PRIVATE_KEY=your_production_wallet_key

# XRP: Use mainnet
XRPL_NETWORK=mainnet
XRPL_WALLET_SEED=your_production_wallet_seed
\`\`\`

## Mock Data Examples

### Mock Ethereum Transaction
\`\`\`json
{
  "txHash": "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
  "blockNumber": 12847392,
  "anchorHash": "a3f5d8c9e2b1f4a6d8c9e2b1f4a6d8c9e2b1f4a6d8c9e2b1f4a6d8c9e2b1f4a6"
}
\`\`\`

### Mock XRP Transaction
\`\`\`json
{
  "txHash": "E3F5D8C9E2B1F4A6D8C9E2B1F4A6D8C9E2B1F4A6D8C9E2B1F4A6D8C9E2B1F4A6",
  "ledgerIndex": 78234567,
  "anchorHash": "b4e6c7d8f3a2e5b7c8d9f4a3e6b8c9d0f5a4e7b9c0d1f6a5e8b0c2d3f7a6e9b1"
}
\`\`\`

## Verification in Mock Mode

Mock mode simulates successful verification:
- Hash generation works normally
- Verification always returns `true`
- Useful for testing UI/UX flows
- **Not suitable for security audits**

## Switching to Production

When ready for production:

1. **Test on testnets first** (Mumbai for Ethereum, XRP Testnet)
2. **Verify all workflows** work correctly
3. **Fund production wallets** with small amounts
4. **Update environment variables** to production values
5. **Monitor first transactions** closely
6. **Document all transaction hashes** for audit trail

## Security Notes

- **Never commit private keys** to version control
- **Use environment variables** for all sensitive data
- **Test thoroughly on testnets** before mainnet
- **Keep backup of wallet seeds** in secure location
- **Monitor gas prices** on Ethereum/Polygon
- **Start with small amounts** on mainnet

## Cost Estimates

### Ethereum/Polygon Mainnet
- Transaction cost: ~$0.01-0.10 per anchor (Polygon)
- Recommended: Use Polygon for low fees

### XRP Ledger Mainnet
- Transaction cost: ~0.00001 XRP (~$0.00002)
- Very low cost, suitable for high volume

## Support

For issues with blockchain integration:
1. Check environment variables
2. Verify network connectivity
3. Check wallet balances (for real mode)
4. Review console logs for detailed errors
5. Contact support at vercel.com/help
