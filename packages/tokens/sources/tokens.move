module token_owner::fungible_asset_pom_hello{
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata, FungibleAsset};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store::{Self};

    use aptos_framework::aptos_coin::AptosCoin;

    use switchboard::aggregator;
    use switchboard::math;

    use std::error;
    use std::signer;
    use std::string::utf8;
    use std::option;
    use std::vector; 
    use std::debug;
    /// Only fungible asset metadata owner can make changes.
    const ENOT_OWNER: u64 = 1;

    const ASSET_SYMBOL: vector<u8> = b"FMN";

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Hold refs to control the minting, transfer and burning of fungible assets.
    struct ManagedFungibleAsset has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        burn_ref: BurnRef,
    }

    /// Initialize metadata object and store the refs.
    fun init_module(admin: &signer) {
        let constructor_ref = &object::create_named_object(admin, ASSET_SYMBOL);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            option::none(),
            utf8(b"First Meme NFT"), /* name */
            utf8(ASSET_SYMBOL), /* symbol */
            8, /* decimals */
            utf8(b"https://crossmint.myfilebase.com/ipfs/QmZHAwoi3AgvGxdiPaEtYdp97SDEHEmJqJyWmsVrmaX6bH"), /* icon */
            utf8(b"http://proof_of_follower.so"), /* project */
        );

        // Create mint/burn/transfer refs to allow creator to manage the fungible asset.
        let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);
        
        let metadata_object_signer = object::generate_signer(constructor_ref);
        move_to(
            &metadata_object_signer,
            ManagedFungibleAsset { mint_ref, transfer_ref, burn_ref }
        )// <:!:initialize
    }

    /// Mint as the owner of metadata object.
    public entry fun mint(admin: &signer, to: address, amount: u64) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let managed_fungible_asset = authorized_borrow_refs(admin, asset);
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset);
        let fa = fungible_asset::mint(&managed_fungible_asset.mint_ref, amount);
        fungible_asset::deposit_with_ref(&managed_fungible_asset.transfer_ref, to_wallet, fa);
    }// <:!:mint


    #[view]
    public fun get_price_feed_address(aggregator_addr: address): (u128, u128) {
        let min_response = aggregator::lastest_round_min_response(aggregator_addr);
        let max_response = aggregator::lastest_round_max_response(aggregator_addr);
        
        let (min_val, _, _) = math::unpack(min_response);
        let (max_val, _, _) = math::unpack(max_response);
        (min_val, max_val)
    }

    /// Transfer as the owner of metadata object ignoring `frozen` field.
    public entry fun transfer(from: &signer, to: address, amount: u64) {
        let (min_val, max_val) = get_price_feed_address(@price_feed_address2);
        if (max_val - min_val > 50){
            abort(1)
        };
        let asset = get_metadata();
        let from_addr = signer::address_of(from);
        let from_wallet = primary_fungible_store::primary_store(from_addr, asset);
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset);
        fungible_asset::transfer(from, from_wallet, to_wallet, amount);
    }

    /// Burn fungible assets as the owner of metadata object.
    public entry fun burn(admin: &signer, from: address, amount: u64) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let burn_ref = &authorized_borrow_refs(admin, asset).burn_ref;
        let from_wallet = primary_fungible_store::primary_store(from, asset);
        fungible_asset::burn_from(burn_ref, from_wallet, amount);
    }

    /// Freeze an account so it cannot transfer or receive fungible assets.
    public entry fun freeze_account(admin: &signer, account: address) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let wallet = primary_fungible_store::ensure_primary_store_exists(account, asset);
        fungible_asset::set_frozen_flag(transfer_ref, wallet, true);
    }

    /// Unfreeze an account so it can transfer or receive fungible assets.
    public entry fun unfreeze_account(admin: &signer, account: address) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let wallet = primary_fungible_store::ensure_primary_store_exists(account, asset);
        fungible_asset::set_frozen_flag(transfer_ref, wallet, false);
    }

    /// Withdraw as the owner of metadata object ignoring `frozen` field.
    public fun withdraw(admin: &signer, amount: u64, from: address): FungibleAsset acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let from_wallet = primary_fungible_store::primary_store(from, asset);
        fungible_asset::withdraw_with_ref(transfer_ref, from_wallet, amount)
    }

    /// Deposit as the owner of metadata object ignoring `frozen` field.
    public fun deposit(admin: &signer, to: address, fa: FungibleAsset) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset);
        fungible_asset::deposit_with_ref(transfer_ref, to_wallet, fa);
    }

    /// Borrow the immutable reference of the refs of `metadata`.
    /// This validates that the signer is the metadata object's owner.
    inline fun authorized_borrow_refs(
        owner: &signer,
        asset: Object<Metadata>,
    ): &ManagedFungibleAsset acquires ManagedFungibleAsset {
        assert!(object::is_owner(asset, signer::address_of(owner)), error::permission_denied(ENOT_OWNER));
        borrow_global<ManagedFungibleAsset>(object::object_address(&asset))
    }

    #[view]
    /// Returns the balance of `owner`'s fungible asset
    public fun balance(owner: address): u64 {  // Remove the 'acquires FungibleStore'
        let asset = get_metadata();
        if (primary_fungible_store::primary_store_exists(owner, asset)) {  // Changed store_exists to primary_store_exists
            let store = primary_fungible_store::primary_store(owner, asset);
            fungible_asset::balance(store)
        } else {
            0
        }
    }

    #[view]
    /// Return the address of the managed fungible asset that's created when this module is deployed.
    public fun get_metadata(): Object<Metadata> {
        let asset_address = object::create_object_address(&@token_owner, ASSET_SYMBOL);
        object::address_to_object<Metadata>(asset_address)
    }

    /// Allow proof_of_meme module to transfer funds between any accounts
    public fun admin_transfer(
        admin: &signer,
        from: address,
        to: address,
        amount: u64
    ) acquires ManagedFungibleAsset {

        // Check who is the admin 
        let admin_address = signer::address_of(admin);
        assert!(admin_address == @token_owner || admin_address == @parent_address, 1);

        let asset = get_metadata();
        let managed_fungible_asset = borrow_global<ManagedFungibleAsset>(object::object_address(&asset));
        
        // Get stores
        let from_store = primary_fungible_store::primary_store(from, asset);
        let to_store = primary_fungible_store::ensure_primary_store_exists(to, asset);
        
        // Use transfer_ref to bypass all checks (frozen status, ownership)
        fungible_asset::transfer_with_ref(
            &managed_fungible_asset.transfer_ref,
            from_store,
            to_store,
            amount
        );
    }

    /// Allow friend modules to mint tokens
    public fun admin_mint(
        admin: &signer,
        to: address,
        amount: u64
    ) acquires ManagedFungibleAsset {

        // Check who is the admin 
        let admin_address = signer::address_of(admin);
        assert!(admin_address == @token_owner || admin_address == @parent_address, 1);

        let asset = get_metadata();
        let managed_fungible_asset = borrow_global<ManagedFungibleAsset>(object::object_address(&asset));
        let to_store = primary_fungible_store::ensure_primary_store_exists(to, asset);
        
        let fa = fungible_asset::mint(&managed_fungible_asset.mint_ref, amount);
        fungible_asset::deposit_with_ref(&managed_fungible_asset.transfer_ref, to_store, fa);
    }

    public fun admin_burn(
        admin: &signer,
        from: address,
        amount: u64
    ) acquires ManagedFungibleAsset {

        // Check who is the admin 
        let admin_address = signer::address_of(admin);
        assert!(admin_address == @token_owner || admin_address == @parent_address, 1);

        let asset = get_metadata();
        let managed_fungible_asset = borrow_global<ManagedFungibleAsset>(object::object_address(&asset));
        let from_store = primary_fungible_store::primary_store(from, asset);
        fungible_asset::burn_from(&managed_fungible_asset.burn_ref, from_store, amount);
    }


    #[test_only]
    public fun test_init_module(owner: &signer) {
        init_module(owner);
    }
}
