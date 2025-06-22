#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_purchase_and_check_premium() {
        let env = Env::default();
        let contract = PremiumContract;
        let user = Address::random(&env);
        assert!(!contract.is_premium(env.clone(), user.clone()));
        contract.purchase_premium(env.clone(), user.clone());
        assert!(contract.is_premium(env, user));
    }
} 