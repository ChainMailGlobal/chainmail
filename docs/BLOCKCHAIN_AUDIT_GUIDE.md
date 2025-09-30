# Blockchain Audit & Verification Guide

## Overview

CMRAgent uses a dual blockchain integration system to provide cryptographic proof and immutable audit trails for all compliance-critical operations:

- **Ethereum/Polygon** - CMRA agent onboarding and registration
- **XRP Ledger** - Witness session recordings and Form 1583 executions

## Architecture

### CMRA Onboarding (Ethereum Anchor)

When a CMRA agent completes registration:

1. **Data Collection** - All onboarding data is collected (ID, address, Form 1583-A, role, etc.)
2. **Hash Generation** - SHA-256 hash is computed from all onboarding artifacts
3. **Blockchain Recording** - Hash is written to Ethereum/Polygon blockchain
4. **Database Storage** - Transaction hash and block number stored in `cmra_agents` table

**Database Fields:**
- `eth_anchor_hash` - SHA-256 hash of onboarding data
- `eth_anchor_tx_hash` - Ethereum transaction hash
- `eth_anchor_block` - Block number where anchor was recorded
- `eth_anchor_timestamp` - Timestamp of blockchain recording

### Witness Sessions (XRP Ledger Anchor)

When a witness session is completed:

1. **Artifact Collection** - PDF, video, face captures, timestamps collected
2. **Hash Generation** - SHA-256 hash computed from all session artifacts
3. **Blockchain Recording** - Hash written to XRP Ledger with memo field
4. **Database Storage** - Transaction hash and ledger sequence stored in `witness_sessions` table

**Database Fields:**
- `xrpl_anchor_hash` - SHA-256 hash of session artifacts
- `xrpl_tx_hash` - XRP Ledger transaction hash
- `xrpl_ledger_seq` - Ledger sequence number
- `xrpl_anchor_timestamp` - Timestamp of blockchain recording

## Audit Verification Process

### Verifying CMRA Onboarding

**Step 1: Retrieve Agent Data**
\`\`\`bash
GET /api/audit/verify-cmra
Body: { "agentId": "cmra_123456" }
\`\`\`

**Step 2: Recompute Hash**
- Collect all original onboarding data
- Generate SHA-256 hash using same algorithm
- Compare with `eth_anchor_hash` in database

**Step 3: Verify on Blockchain**
- Visit Polygonscan: `https://polygonscan.com/tx/{eth_anchor_tx_hash}`
- Confirm transaction exists and is confirmed
- Verify block number matches `eth_anchor_block`
- Check transaction data contains the anchor hash

**Step 4: Validate Timestamp**
- Confirm `eth_anchor_timestamp` matches blockchain timestamp
- Verify it aligns with agent creation date

### Verifying Witness Sessions

**Step 1: Retrieve Session Data**
\`\`\`bash
GET /api/audit/verify-session
Body: { "sessionId": "session_123456" }
\`\`\`

**Step 2: Recompute Hash**
- Collect all session artifacts (PDF, video URLs, face data)
- Generate SHA-256 hash using same algorithm
- Compare with `xrpl_anchor_hash` in database

**Step 3: Verify on XRP Ledger**
- Visit XRP Explorer: `https://livenet.xrpl.org/transactions/{xrpl_tx_hash}`
- Confirm transaction exists and is validated
- Verify ledger sequence matches `xrpl_ledger_seq`
- Check memo field contains the anchor hash

**Step 4: Validate Timestamp**
- Confirm `xrpl_anchor_timestamp` matches ledger timestamp
- Verify it aligns with session completion time

## API Endpoints

### Verify CMRA Agent
\`\`\`
POST /api/audit/verify-cmra
Body: { "agentId": "string" }

Response:
{
  "success": true,
  "agent": { ... },
  "blockchain": {
    "anchorHash": "string",
    "transactionHash": "string",
    "blockNumber": number,
    "timestamp": "string"
  },
  "auditReport": { ... }
}
\`\`\`

### Verify Witness Session
\`\`\`
POST /api/audit/verify-session
Body: { "sessionId": "string" }

Response:
{
  "success": true,
  "session": { ... },
  "blockchain": {
    "anchorHash": "string",
    "transactionHash": "string",
    "ledgerSequence": number,
    "timestamp": "string"
  },
  "auditReport": { ... }
}
\`\`\`

## Security Considerations

### What's Stored On-Chain
- ✅ SHA-256 hashes (non-invertible)
- ✅ Session/agent IDs (non-sensitive)
- ✅ Timestamps
- ❌ NO personally identifiable information (PII)
- ❌ NO document contents
- ❌ NO video data

### Hash Generation
All hashes are generated using SHA-256 with consistent serialization:
\`\`\`typescript
const dataString = JSON.stringify({
  // Ordered fields for consistent hashing
  field1: value1,
  field2: value2,
  // ...
})
const hash = crypto.createHash('sha256').update(dataString).digest('hex')
\`\`\`

### Wallet Security
- Production wallets use secure private keys from environment variables
- Keys are never logged or exposed in responses
- Minimal XRP/ETH amounts used for transactions
- Read-only verification requires no private keys

## Benefits

### For CMRA Agents
- **Cryptographic Proof** - Onboarding is permanently notarized on Ethereum
- **Compliance Confidence** - Immutable record of USPS compliance
- **Audit Ready** - Instant verification for inspectors

### For Customers
- **Trust** - Witness sessions are irrefutably recorded on XRP Ledger
- **Transparency** - Anyone can verify session integrity
- **Legal Protection** - Blockchain timestamp proves document execution time

### For Auditors/Inspectors
- **Independent Verification** - No need to trust the platform
- **Tamper-Proof** - Blockchain ensures data hasn't been modified
- **Instant Audit** - Verify compliance in seconds, not days

## Environment Variables

\`\`\`bash
# Ethereum/Polygon Configuration
ETHEREUM_RPC_URL=https://polygon-rpc.com
ETHEREUM_PRIVATE_KEY=your_private_key_here

# XRP Ledger Configuration
XRPL_NETWORK=wss://xrplcluster.com
XRPL_WALLET_SEED=your_wallet_seed_here
\`\`\`

## Troubleshooting

### Transaction Not Found
- Verify network (testnet vs mainnet)
- Check transaction hash is correct
- Ensure sufficient confirmations

### Hash Mismatch
- Verify data serialization order
- Check for any data modifications
- Ensure same timestamp format

### Network Issues
- Check RPC endpoint availability
- Verify wallet has sufficient balance
- Confirm network connectivity

## Support

For audit verification support or questions:
- Email: compliance@streamlinewitness.com
- Documentation: https://docs.streamlinewitness.com/audit
