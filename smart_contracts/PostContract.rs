#![no_std]
use soroban_sdk::{contractimpl, Address, Env, Symbol, Vec, String, BytesN, Map, u64};

#[derive(Clone)]
pub struct Post {
    pub id: u64,
    pub content: String,
    pub timestamp: u64,
    pub author: Address,
}

pub struct PostContract;

#[contractimpl]
impl PostContract {
    pub fn create_post(env: Env, author: Address, content: String, timestamp: u64) {
        let id = env.storage().get::<_, u64>(&Symbol::short("post_id")).unwrap_or(0) + 1;
        let post = Post { id, content, timestamp, author };
        env.storage().set(&id, &post);
        env.storage().set(&Symbol::short("post_id"), &id);
    }

    pub fn get_post(env: Env, id: u64) -> Option<Post> {
        env.storage().get(&id)
    }

    pub fn get_all_posts(env: Env) -> Vec<Post> {
        // For simplicity, this is a placeholder. Real implementation would iterate storage.
        Vec::new(&env)
    }
}
