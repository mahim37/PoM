import { searchUserByUsername } from './farcaster.mjs';

export const getScore = async (username, c, d) => {
    try {
        const res = await searchUserByUsername(username);
        const follower_count = res.user.follower_count || 0;
        const following_count = res.user.following_count || 0;
        const verified = res.user.verified_accounts ? 1 : 0;
        const power_badge = res.user.power_badge ? 1 : 0;

        console.log('Follower Count:', follower_count);

        const safeLog = (value) => Math.log(value + 1);

        const R =
            safeLog(follower_count + 1) *
                (1 + safeLog(following_count + 1) / safeLog(follower_count + 1)) +
            c * verified +
            d * power_badge;

        return R;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return 1;
    }
};


