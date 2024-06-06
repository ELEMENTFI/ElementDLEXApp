import MyAlgoConnect from '@randlabs/myalgo-connect';
const algosdk = require('algosdk');
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const myAlgoConnect = new MyAlgoConnect();
export const Rewardtau =async(creatoraddress,applicationid)=>{     
     let setTotalrewardallocatedtau = "";
    // const[totalstakeelemalgo,setTotalStakeelemalgo]=useState("");  
  const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
  let accountInfoResponse1 = await client.accountInformation(creatoraddress).do();

for (let i = 0; i < accountInfoResponse1['created-apps'].length; i++) { 
   console.log("Application's global state:");
  if (accountInfoResponse1['created-apps'][i].id == parseInt(applicationid)) {
      console.log("Application's global state:");
      for (let n = 0; n < accountInfoResponse1['created-apps'][i]['params']['global-state'].length; n++) {
          console.log(accountInfoResponse1['created-apps'][i]['params']['global-state'][n]);
          let enc = accountInfoResponse1['created-apps'][i]['params']['global-state'][n];
          console.log("encode",enc);
          var decodedString = window.atob(enc.key);
          // if(enc['key'] === "R0E="){
          //   setTotalStakeelemalgo = accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'];
          //   console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
          // }
          // if(enc['key'] === "VFNVTEM="){
          //   setTotalreward( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
          //   console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
          // }
          if(enc['key'] === "VFNM"){
            setTotalrewardallocatedtau = accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'];
            console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
          }
      }
      
  }
}       
    return setTotalrewardallocatedtau;
            
    }