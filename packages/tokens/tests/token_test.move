module token_owner::test {
    #[test_only]
    use std::signer;
    #[test_only]
    use token_owner::fungible_asset_pom;
    use std::debug;

    #[test(owner=@token_owner)]
    fun test_init_module(owner: &signer) {
        fungible_asset_pom::test_init_module(owner);
    }

    #[test(
        owner=@token_owner,
        parent_address=@token_owner,
        user1=@0x123
    )]
    fun test_mint(owner: &signer, parent_address: &signer, user1: &signer){
        // Initialising the tests
        fungible_asset_pom::test_init_module(owner);

        // Checking from owner
        fungible_asset_pom::admin_mint(owner, signer::address_of(parent_address), 1000);
        let balance = fungible_asset_pom::balance(signer::address_of(parent_address));
        assert!(balance == 1000, 1);

        // Checking from parent_address
        fungible_asset_pom::admin_mint(parent_address, signer::address_of(user1), 1000);
        let balance = fungible_asset_pom::balance(signer::address_of(user1));
        assert!(balance == 1000, 2);
    }
}