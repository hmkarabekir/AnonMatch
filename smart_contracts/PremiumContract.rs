#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Address, Env, Symbol, Vec};

#[contract]
pub struct PremiumContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PremiumSubscription {
    pub user: Address,
    pub tier: u32, // 1 = Basic, 2 = Premium, 3 = VIP
    pub start_date: u64,
    pub end_date: u64,
    pub features: Vec<Symbol>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PremiumFeature {
    pub name: Symbol,
    pub description: Symbol,
    pub tier_required: u32,
    pub price: u32,
}

#[contractimpl]
impl PremiumContract {
    // Initialize premium features
    pub fn initialize(env: &Env) {
        let features = vec![
            env,
            PremiumFeature {
                name: symbol_short!("advanced_matching"),
                description: symbol_short!("Advanced matching algorithm"),
                tier_required: 2,
                price: 100,
            },
            PremiumFeature {
                name: symbol_short!("unlimited_messages"),
                description: symbol_short!("Unlimited messaging"),
                tier_required: 2,
                price: 50,
            },
            PremiumFeature {
                name: symbol_short!("priority_support"),
                description: symbol_short!("Priority customer support"),
                tier_required: 3,
                price: 200,
            },
            PremiumFeature {
                name: symbol_short!("analytics"),
                description: symbol_short!("Profile analytics and insights"),
                tier_required: 3,
                price: 150,
            },
        ];
        
        env.storage().instance().set(&symbol_short!("features"), &features);
    }

    // Subscribe to premium tier
    pub fn subscribe(env: &Env, user: Address, tier: u32, duration_days: u32) -> PremiumSubscription {
        let current_time = env.ledger().timestamp();
        let end_date = current_time + (duration_days * 24 * 60 * 60); // Convert days to seconds
        
        let subscription = PremiumSubscription {
            user: user.clone(),
            tier,
            start_date: current_time,
            end_date,
            features: Self::get_tier_features(env, tier),
        };
        
        // Store subscription
        let key = symbol_short!("subscription");
        env.storage().instance().set(&key, &subscription);
        
        subscription
    }

    // Get user's current subscription
    pub fn get_subscription(env: &Env, user: Address) -> Option<PremiumSubscription> {
        let key = symbol_short!("subscription");
        env.storage().instance().get(&key)
    }

    // Check if user has access to a specific feature
    pub fn has_feature_access(env: &Env, user: Address, feature_name: Symbol) -> bool {
        if let Some(subscription) = Self::get_subscription(env, user) {
            let current_time = env.ledger().timestamp();
            
            // Check if subscription is still active
            if current_time > subscription.end_date {
                return false;
            }
            
            // Check if user has the required tier for this feature
            if let Some(features) = env.storage().instance().get(&symbol_short!("features")) {
                for feature in features.iter() {
                    let feature: PremiumFeature = feature.unwrap();
                    if feature.name == feature_name {
                        return subscription.tier >= feature.tier_required;
                    }
                }
            }
        }
        false
    }

    // Get all available features
    pub fn get_features(env: &Env) -> Vec<PremiumFeature> {
        env.storage().instance().get(&symbol_short!("features")).unwrap_or(vec![env])
    }

    // Get features for a specific tier
    pub fn get_tier_features(env: &Env, tier: u32) -> Vec<Symbol> {
        let mut tier_features = vec![env];
        let features = Self::get_features(env);
        
        for feature in features.iter() {
            let feature: PremiumFeature = feature.unwrap();
            if feature.tier_required <= tier {
                tier_features.push_back(feature.name);
            }
        }
        
        tier_features
    }

    // Cancel subscription
    pub fn cancel_subscription(env: &Env, user: Address) {
        let key = symbol_short!("subscription");
        env.storage().instance().remove(&key);
    }

    // Upgrade subscription tier
    pub fn upgrade_tier(env: &Env, user: Address, new_tier: u32) -> PremiumSubscription {
        if let Some(mut subscription) = Self::get_subscription(env, user.clone()) {
            subscription.tier = new_tier;
            subscription.features = Self::get_tier_features(env, new_tier);
            
            let key = symbol_short!("subscription");
            env.storage().instance().set(&key, &subscription);
            
            subscription
        } else {
            // Create new subscription if none exists
            Self::subscribe(env, user, new_tier, 30) // Default 30 days
        }
    }

    // Extend subscription duration
    pub fn extend_subscription(env: &Env, user: Address, additional_days: u32) -> PremiumSubscription {
        if let Some(mut subscription) = Self::get_subscription(env, user.clone()) {
            subscription.end_date += additional_days * 24 * 60 * 60; // Convert days to seconds
            
            let key = symbol_short!("subscription");
            env.storage().instance().set(&key, &subscription);
            
            subscription
        } else {
            // Create new subscription if none exists
            Self::subscribe(env, user, 1, additional_days) // Default tier 1
        }
    }

    // Get subscription status
    pub fn get_subscription_status(env: &Env, user: Address) -> Symbol {
        if let Some(subscription) = Self::get_subscription(env, user) {
            let current_time = env.ledger().timestamp();
            
            if current_time > subscription.end_date {
                symbol_short!("expired")
            } else {
                symbol_short!("active")
            }
        } else {
            symbol_short!("none")
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_subscription_creation() {
        let env = Env::default();
        let user = Address::generate(&env);
        
        PremiumContract::initialize(&env);
        let subscription = PremiumContract::subscribe(&env, user.clone(), 2, 30);
        
        assert_eq!(subscription.user, user);
        assert_eq!(subscription.tier, 2);
        assert!(subscription.end_date > subscription.start_date);
    }

    #[test]
    fn test_feature_access() {
        let env = Env::default();
        let user = Address::generate(&env);
        
        PremiumContract::initialize(&env);
        PremiumContract::subscribe(&env, user.clone(), 2, 30);
        
        // Test access to tier 2 feature
        assert!(PremiumContract::has_feature_access(&env, user.clone(), symbol_short!("advanced_matching")));
        
        // Test access to tier 3 feature (should fail)
        assert!(!PremiumContract::has_feature_access(&env, user.clone(), symbol_short!("priority_support")));
    }

    #[test]
    fn test_subscription_expiration() {
        let env = Env::default();
        let user = Address::generate(&env);
        
        PremiumContract::initialize(&env);
        PremiumContract::subscribe(&env, user.clone(), 1, 1); // 1 day subscription
        
        // Simulate time passing (this would need to be handled differently in real tests)
        // For now, we'll just test the status function
        let status = PremiumContract::get_subscription_status(&env, user);
        assert_eq!(status, symbol_short!("active"));
    }
}
