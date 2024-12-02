import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
const config = new Configuration({
//   apiKey: ir.NEXT_PUBLIC_NEYNAR_API_KEY,
  apiKey: "73FD3AEB-B7C5-43EB-8899-9AA9AE65DD52",
  baseOptions: {
    headers: {
      "x-neynar-experimental": false,
    },
  },
});

const client = new NeynarAPIClient(config);

export const fetchAllFollowing = async (fid) => {
    let cursor = "";
    let users = [];
    do {
   
      const result = await client.fetchUserFollowers({
        fid:fid,
        limit: '100',
        });
    //   console.log(result);
      users = users.concat(result.users);
      cursor = result.next.cursor;
//   console.log(cursor);
    } while (cursor !== "" && cursor !== null);
  
    return users;
  };
  export const searchUserByUsername = async (username) => {
    try{
      const result = await client.lookupUserByUsername({
        username: username,
      });
      return result;
    }
    catch(err){
      console.log("Error! while fetching farcaster!", err);
      return {};
    }

  }
  export const fun = async() => { 
    const rishFID = 808326;
    const rishFollowings = await fetchAllFollowing(rishFID);
    // await console.log(rishFollowings);
    await console.log(rishFollowings.length);
  } 


  