// Smart Contract Simulation for Data Sharing Agreements
// This simulates blockchain interactions for the chat data sharing feature

class SmartContractSimulator {
  constructor() {
    this.contracts = new Map();
    this.transactions = [];
    this.blockNumber = 1000000;
  }

  // Create a new data sharing contract
  createDataSharingContract(userAddress, botAddress, terms) {
    const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const contract = {
      id: contractId,
      userAddress: userAddress,
      botAddress: botAddress,
      terms: terms,
      status: 'pending', // pending, user_approved, bot_approved, both_approved, executed, cancelled
      userApproval: false,
      botApproval: false,
      createdAt: new Date(),
      executedAt: null,
      dataShared: false,
      sharedData: null
    };

    this.contracts.set(contractId, contract);
    
    console.log(`🔗 Smart Contract Created: ${contractId}`);
    console.log(`📋 Terms: ${JSON.stringify(terms)}`);
    
    return contractId;
  }

  // Approve contract by user
  approveByUser(contractId, userAddress) {
    const contract = this.contracts.get(contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    if (contract.userAddress !== userAddress) {
      throw new Error('Unauthorized: Only contract creator can approve');
    }
    
    contract.userApproval = true;
    contract.status = contract.botApproval ? 'both_approved' : 'user_approved';
    
    this.recordTransaction(contractId, 'user_approval', {
      userAddress: userAddress,
      timestamp: new Date()
    });
    
    console.log(`✅ User approved contract: ${contractId}`);
    
    return {
      success: true,
      status: contract.status,
      message: 'Contract approved by user'
    };
  }

  // Approve contract by bot (auto-approval)
  approveByBot(contractId, botAddress) {
    const contract = this.contracts.get(contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    if (contract.botAddress !== botAddress) {
      throw new Error('Unauthorized: Only bot can approve');
    }
    
    contract.botApproval = true;
    contract.status = contract.userApproval ? 'both_approved' : 'bot_approved';
    
    this.recordTransaction(contractId, 'bot_approval', {
      botAddress: botAddress,
      timestamp: new Date()
    });
    
    console.log(`🤖 Bot auto-approved contract: ${contractId}`);
    
    return {
      success: true,
      status: contract.status,
      message: 'Contract auto-approved by bot'
    };
  }

  // Execute contract when both parties approve
  executeContract(contractId) {
    const contract = this.contracts.get(contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    if (contract.status !== 'both_approved') {
      throw new Error('Contract not ready for execution');
    }
    
    // Simulate blockchain transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        contract.status = 'executed';
        contract.executedAt = new Date();
        contract.dataShared = true;
        
        // Simulate data sharing
        contract.sharedData = {
          userData: {
            age: '25-30',
            location: 'İstanbul',
            interests: ['Teknoloji', 'Blockchain', 'Yazılım'],
            bio: 'Blockchain teknolojisi meraklısı'
          },
          botData: contract.terms.botData || {
            age: '28-35',
            location: 'Dünya çapında',
            interests: ['Seyahat', 'Teknoloji', 'Kültür'],
            bio: 'Dijital göçebe ve teknoloji tutkunu'
          }
        };
        
        this.recordTransaction(contractId, 'execution', {
          timestamp: new Date(),
          blockNumber: this.blockNumber++
        });
        
        console.log(`⚡ Contract executed: ${contractId}`);
        console.log(`📊 Data shared between parties`);
        
        resolve({
          success: true,
          status: contract.status,
          sharedData: contract.sharedData,
          message: 'Contract executed successfully'
        });
      }, 2000); // Simulate blockchain processing time
    });
  }

  // Get contract status
  getContractStatus(contractId) {
    const contract = this.contracts.get(contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    return {
      id: contract.id,
      status: contract.status,
      userApproval: contract.userApproval,
      botApproval: contract.botApproval,
      createdAt: contract.createdAt,
      executedAt: contract.executedAt,
      dataShared: contract.dataShared
    };
  }

  // Get shared data (only if contract is executed)
  getSharedData(contractId) {
    const contract = this.contracts.get(contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    if (!contract.dataShared) {
      throw new Error('Data not yet shared');
    }
    
    return contract.sharedData;
  }

  // Record transaction for audit trail
  recordTransaction(contractId, action, data) {
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contractId: contractId,
      action: action,
      data: data,
      timestamp: new Date(),
      blockNumber: this.blockNumber++
    };
    
    this.transactions.push(transaction);
    
    console.log(`📝 Transaction recorded: ${transaction.id}`);
    console.log(`🔍 Action: ${action}`);
  }

  // Get transaction history for a contract
  getTransactionHistory(contractId) {
    return this.transactions.filter(tx => tx.contractId === contractId);
  }

  // Cancel contract
  cancelContract(contractId, userAddress) {
    const contract = this.contracts.get(contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    if (contract.userAddress !== userAddress) {
      throw new Error('Unauthorized: Only contract creator can cancel');
    }
    
    if (contract.status === 'executed') {
      throw new Error('Cannot cancel executed contract');
    }
    
    contract.status = 'cancelled';
    
    this.recordTransaction(contractId, 'cancellation', {
      userAddress: userAddress,
      timestamp: new Date()
    });
    
    console.log(`❌ Contract cancelled: ${contractId}`);
    
    return {
      success: true,
      status: contract.status,
      message: 'Contract cancelled successfully'
    };
  }

  // Get all contracts for a user
  getUserContracts(userAddress) {
    const userContracts = [];
    
    for (const [contractId, contract] of this.contracts) {
      if (contract.userAddress === userAddress || contract.botAddress === userAddress) {
        userContracts.push({
          id: contract.id,
          status: contract.status,
          createdAt: contract.createdAt,
          executedAt: contract.executedAt,
          dataShared: contract.dataShared
        });
      }
    }
    
    return userContracts;
  }

  // Simulate blockchain network status
  getNetworkStatus() {
    return {
      network: 'Stellar Testnet',
      blockHeight: this.blockNumber,
      gasPrice: '0.00001 XLM',
      status: 'connected',
      lastBlockTime: new Date()
    };
  }
}

// Export singleton instance
const smartContract = new SmartContractSimulator();

export default smartContract;

// Helper functions for chat integration
export const createDataSharingAgreement = (userAddress, botData) => {
  const terms = {
    dataTypes: ['age', 'location', 'interests', 'bio'],
    duration: 'permanent',
    purpose: 'chat_data_sharing',
    botData: botData
  };
  
  const botAddress = `bot_${botData.id}_${Date.now()}`;
  const contractId = smartContract.createDataSharingContract(userAddress, botAddress, terms);
  
  // Auto-approve by bot
  setTimeout(() => {
    smartContract.approveByBot(contractId, botAddress);
  }, 1000);
  
  return contractId;
};

export const approveDataSharing = async (contractId, userAddress) => {
  try {
    const result = smartContract.approveByUser(contractId, userAddress);
    
    if (result.status === 'both_approved') {
      // Execute contract
      const executionResult = await smartContract.executeContract(contractId);
      return executionResult;
    }
    
    return result;
  } catch (error) {
    console.error('Error approving data sharing:', error);
    throw error;
  }
};

export const getContractInfo = (contractId) => {
  try {
    return smartContract.getContractStatus(contractId);
  } catch (error) {
    console.error('Error getting contract info:', error);
    throw error;
  }
}; 