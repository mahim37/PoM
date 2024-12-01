module parent_address::main_module_working_sure {
    use std::vector;
    use std::string::{String, utf8};
    use std::signer;

    const ENOT_OWNER: u64 = 101;
    const ETOKEN_ALREADY_REGISTERED: u64 = 102;

    struct TokenRegistry has key {
        tokens: vector<TokenRegistration>
    }

    struct TokenRegistration has store, drop, copy {
        token_name: String,
        token_address: address,
        sender: address,
        votes: u64
    }

    fun init_module(owner: &signer) {
        move_to(owner, TokenRegistry {
            tokens: vector::empty()
        });
    }

    public entry fun register_token(
        sender: &signer,
        token_name: String,
        token_address: address
    ) acquires TokenRegistry {
        
        let registry = borrow_global_mut<TokenRegistry>(@parent_address);
        
        let len = vector::length(&registry.tokens);
        let i = 0;
        while (i < len) {
            let token = vector::borrow(&registry.tokens, i);
            assert!(token.token_name != token_name, ETOKEN_ALREADY_REGISTERED);
            i = i + 1;
        };

        let registration = TokenRegistration {
            token_name,
            token_address,
            sender: signer::address_of(sender),
            votes: 0
        };

        vector::push_back(&mut registry.tokens, registration);
    }


    public entry fun add_token_votes(
        sender: &signer,
        token_name: String,
        votes: u64
    ) acquires TokenRegistry {
        let registry = borrow_global_mut<TokenRegistry>(@parent_address);
        let len = vector::length(&registry.tokens);
        let i = 0;
        while (i < len) {
            let token = vector::borrow_mut(&mut registry.tokens, i);
            if (token.token_name == token_name) {
                token.votes = token.votes + votes;
            };
            i = i + 1;
        };
    }

    #[view]
    public fun get_token_sender(token_name: String): address 
    acquires TokenRegistry {
        let registry = borrow_global<TokenRegistry>(@parent_address);
        let len = vector::length(&registry.tokens);
        let i = 0;
        while (i < len) {
            let token = vector::borrow(&registry.tokens, i);
            if (token.token_name == token_name) {
                return token.sender
            };
        };
        @0x0
    }

    #[view]
    public fun get_token_registration(token_name: String): address 
    acquires TokenRegistry {
        let registry = borrow_global<TokenRegistry>(@parent_address);
        let len = vector::length(&registry.tokens);
        let i = 0;
        while (i < len) {
            let token = vector::borrow(&registry.tokens, i);
            if (token.token_name == token_name) {
                return token.token_address
            };
            i = i + 1;
        };
        @0x0
    }

    #[view]
    public fun get_token_votes(token_name: String): u64 
    acquires TokenRegistry {
        let registry = borrow_global<TokenRegistry>(@parent_address);
        let len = vector::length(&registry.tokens);
       
        let i = 0;
        while (i < len) {
            let token = vector::borrow(&registry.tokens, i);
            if (token.token_name == token_name) {
                return token.votes
            };
            i = i + 1;
        };
        0
    }


    #[test(account = @parent_address, test_addr = @0x1)]
    #[test_timeout = 3000000]
    fun test_token_registration(account: signer, test_addr: signer) 
    acquires TokenRegistry {
        init_module(&account);
        register_token(&test_addr, utf8(b"BTC"), @0x123);
        add_token_votes(&test_addr, utf8(b"BTC"), 100);
        let votes = get_token_votes(utf8(b"BTC"));
        assert!(votes == 100, 1004);

        // Another token
        register_token(&test_addr, utf8(b"ETH"), @0x124);
        add_token_votes(&test_addr, utf8(b"ETH"), 200);
        let votes = get_token_votes(utf8(b"ETH"));
        assert!(votes == 200, 1005);
    }
}