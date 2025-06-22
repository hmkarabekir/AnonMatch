#![no_std]
use soroban_sdk::{contractimpl, Address, Env, Symbol, Vec, String};

#[derive(Clone)]
pub struct UserProfile {
    pub name: String,
    pub birthdate: String,
    pub gender: String,
    pub country: String,
    pub profession: String,
}

pub struct UserProfileContract;

#[contractimpl]
impl UserProfileContract {
    pub fn create_profile(
        env: Env,
        user: Address,
        name: String,
        birthdate: String,
        gender: String,
        country: String,
        profession: String,
    ) {
        let profile = UserProfile { name, birthdate, gender, country, profession };
        env.storage().set(&user, &profile);
    }

    pub fn update_profile(
        env: Env,
        user: Address,
        name: String,
        birthdate: String,
        gender: String,
        country: String,
        profession: String,
    ) {
        let profile = UserProfile { name, birthdate, gender, country, profession };
        env.storage().set(&user, &profile);
    }

    pub fn get_profile(env: Env, user: Address) -> Option<UserProfile> {
        env.storage().get(&user)
    }
}
