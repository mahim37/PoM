module token_owner::test {
    #[test_only]
    use std::signer;
    #[test_only]
    use token_owner::fungible_asset_pom_hello;
    use std::debug;

    #[test(owner=@token_owner)]
    fun test_init_module(owner: &signer) {
        token_owner::fungible_asset_pom_hello::test_init_module(owner);
    }

    #[test(
        owner=@token_owner,
        parent_address=@token_owner,
        user1=@0x123
    )]
    fun test_mint(owner: &signer, parent_address: &signer, user1: &signer){
        // Initialising the tests
        token_owner::fungible_asset_pom_hello::test_init_module(owner);

        // Checking from owner
        token_owner::fungible_asset_pom_hello::admin_mint(owner, signer::address_of(parent_address), 1000);
        let balance = token_owner::fungible_asset_pom_hello::balance(signer::address_of(parent_address));
        assert!(balance == 1000, 1);

        // Checking from parent_address
        token_owner::fungible_asset_pom_hello::admin_mint(parent_address, signer::address_of(user1), 1000);
        let balance = token_owner::fungible_asset_pom_hello::balance(signer::address_of(user1));
        assert!(balance == 1000, 2);
    }
}