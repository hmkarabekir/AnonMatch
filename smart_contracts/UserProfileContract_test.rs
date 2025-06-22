#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env, Symbol};

#[test]
fn test_create_profile() {
    let env = Env::default();
    let user = Address::generate(&env);
    
    let profile = UserProfileContract::create_profile(
        &env,
        user.clone(),
        symbol_short!("Alice"),
        25,
        symbol_short!("Software Engineer"),
        symbol_short!("I love coding and blockchain technology"),
        vec![&env, symbol_short!("coding"), symbol_short!("blockchain"), symbol_short!("music")]
    );
    
    assert_eq!(profile.user, user);
    assert_eq!(profile.display_name, symbol_short!("Alice"));
    assert_eq!(profile.age, 25);
    assert_eq!(profile.occupation, symbol_short!("Software Engineer"));
    assert_eq!(profile.bio, symbol_short!("I love coding and blockchain technology"));
    assert_eq!(profile.interests.len(), 3);
}

#[test]
fn test_update_profile() {
    let env = Env::default();
    let user = Address::generate(&env);
    
    // Create initial profile
    UserProfileContract::create_profile(
        &env,
        user.clone(),
        symbol_short!("Alice"),
        25,
        symbol_short!("Software Engineer"),
        symbol_short!("I love coding"),
        vec![&env, symbol_short!("coding")]
    );
    
    // Update profile
    let updated_profile = UserProfileContract::update_profile(
        &env,
        user.clone(),
        symbol_short!("Alice Smith"),
        26,
        symbol_short!("Senior Software Engineer"),
        symbol_short!("I love coding and blockchain technology"),
        vec![&env, symbol_short!("coding"), symbol_short!("blockchain")]
    );
    
    assert_eq!(updated_profile.display_name, symbol_short!("Alice Smith"));
    assert_eq!(updated_profile.age, 26);
    assert_eq!(updated_profile.occupation, symbol_short!("Senior Software Engineer"));
    assert_eq!(updated_profile.interests.len(), 2);
}

#[test]
fn test_get_profile() {
    let env = Env::default();
    let user = Address::generate(&env);
    
    let created_profile = UserProfileContract::create_profile(
        &env,
        user.clone(),
        symbol_short!("Bob"),
        30,
        symbol_short!("Designer"),
        symbol_short!("Creative designer"),
        vec![&env, symbol_short!("design"), symbol_short!("art")]
    );
    
    let retrieved_profile = UserProfileContract::get_profile(&env, user.clone()).unwrap();
    
    assert_eq!(retrieved_profile.user, created_profile.user);
    assert_eq!(retrieved_profile.display_name, created_profile.display_name);
    assert_eq!(retrieved_profile.age, created_profile.age);
    assert_eq!(retrieved_profile.occupation, created_profile.occupation);
    assert_eq!(retrieved_profile.bio, created_profile.bio);
    assert_eq!(retrieved_profile.interests.len(), created_profile.interests.len());
}

#[test]
fn test_get_nonexistent_profile() {
    let env = Env::default();
    let user = Address::generate(&env);
    
    let profile = UserProfileContract::get_profile(&env, user);
    assert!(profile.is_none());
}

#[test]
fn test_delete_profile() {
    let env = Env::default();
    let user = Address::generate(&env);
    
    // Create profile
    UserProfileContract::create_profile(
        &env,
        user.clone(),
        symbol_short!("Charlie"),
        28,
        symbol_short!("Artist"),
        symbol_short!("Passionate artist"),
        vec![&env, symbol_short!("art"), symbol_short!("painting")]
    );
    
    // Verify profile exists
    assert!(UserProfileContract::get_profile(&env, user.clone()).is_some());
    
    // Delete profile
    UserProfileContract::delete_profile(&env, user.clone());
    
    // Verify profile is deleted
    assert!(UserProfileContract::get_profile(&env, user).is_none());
}

#[test]
fn test_search_profiles() {
    let env = Env::default();
    
    // Create multiple profiles
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);
    
    UserProfileContract::create_profile(
        &env,
        user1.clone(),
        symbol_short!("Alice"),
        25,
        symbol_short!("Software Engineer"),
        symbol_short!("I love coding"),
        vec![&env, symbol_short!("coding"), symbol_short!("blockchain")]
    );
    
    UserProfileContract::create_profile(
        &env,
        user2.clone(),
        symbol_short!("Bob"),
        30,
        symbol_short!("Designer"),
        symbol_short!("Creative designer"),
        vec![&env, symbol_short!("design"), symbol_short!("art")]
    );
    
    UserProfileContract::create_profile(
        &env,
        user3.clone(),
        symbol_short!("Charlie"),
        28,
        symbol_short!("Artist"),
        symbol_short!("Passionate artist"),
        vec![&env, symbol_short!("art"), symbol_short!("painting")]
    );
    
    // Search for profiles with "art" interest
    let art_profiles = UserProfileContract::search_profiles(&env, symbol_short!("art"));
    assert_eq!(art_profiles.len(), 2); // Bob and Charlie have art interests
    
    // Search for profiles with "coding" interest
    let coding_profiles = UserProfileContract::search_profiles(&env, symbol_short!("coding"));
    assert_eq!(coding_profiles.len(), 1); // Only Alice has coding interest
}

#[test]
fn test_get_all_profiles() {
    let env = Env::default();
    
    // Create multiple profiles
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    
    UserProfileContract::create_profile(
        &env,
        user1.clone(),
        symbol_short!("Alice"),
        25,
        symbol_short!("Engineer"),
        symbol_short!("Tech enthusiast"),
        vec![&env, symbol_short!("tech")]
    );
    
    UserProfileContract::create_profile(
        &env,
        user2.clone(),
        symbol_short!("Bob"),
        30,
        symbol_short!("Designer"),
        symbol_short!("Creative person"),
        vec![&env, symbol_short!("design")]
    );
    
    let all_profiles = UserProfileContract::get_all_profiles(&env);
    assert_eq!(all_profiles.len(), 2);
    
    // Verify both profiles are in the list
    let user1_found = all_profiles.iter().any(|p| p.user == user1);
    let user2_found = all_profiles.iter().any(|p| p.user == user2);
    
    assert!(user1_found);
    assert!(user2_found);
}

#[test]
fn test_profile_verification() {
    let env = Env::default();
    let user = Address::generate(&env);
    
    // Create unverified profile
    let profile = UserProfileContract::create_profile(
        &env,
        user.clone(),
        symbol_short!("Alice"),
        25,
        symbol_short!("Engineer"),
        symbol_short!("Tech enthusiast"),
        vec![&env, symbol_short!("tech")]
    );
    
    assert!(!profile.verified);
    
    // Verify profile
    let verified_profile = UserProfileContract::verify_profile(&env, user.clone());
    assert!(verified_profile.verified);
    
    // Check that the profile is still verified when retrieved
    let retrieved_profile = UserProfileContract::get_profile(&env, user).unwrap();
    assert!(retrieved_profile.verified);
} 