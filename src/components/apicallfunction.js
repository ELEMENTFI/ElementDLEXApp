
import axios from "axios";
import fireDb from '../firebasefile';
require('dotenv').config();

export const calltokenForUsers =async()=>{
            
    let formData = new FormData();
    formData.append('client_id', process.env.REACT_APP_CLIENT_ID);
    formData.append('client_secret', process.env.REACT_APP_CLIENT_SECRET);
    formData.append('grant_type', 'client_credentials');
    formData.append('scope', 'email');

    const requestOptions = {
      method: 'POST',
      body: formData,
    }
    // const response = await axios.post("https://api.elementpad.io/elementsapi/oauth2/token?client_id=cEZoGE19mLmQdIPPjXtj2osurm8NRLHK&client_secret=VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW&grant_type=client_credentials&scope=email");
    const response = await fetch('https://api.elementpad.io/elementsapi/oauth2/token', requestOptions);
    const data = await response.json();
  // console.log("fetch token",{ data },process.env.REACT_APP_CLIENT_ID,process.env.REACT_APP_CLIENT_SECRET)

    // setToken(data.access_token)
    let response2 = await fetch(`https://api.elementpad.io/elementsapi/v1/txHistory/`, {
        // method: 'GET',
        // mode: 'no-cors',
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        //   // 'Authorization': `Bearer ${token}`
        }
      }
      )
    //console.log(response2);
      const data2 = await response2.json();
    console.log("fetch txhistory",{ data2 })
    //   setToken(data2)
    return data2;
        
}
export const callapiforuserslist =async()=>{
       
  let formData = new FormData();
  formData.append('client_id',  process.env.REACT_APP_CLIENT_ID);
  formData.append('client_secret', process.env.REACT_APP_CLIENT_SECRET);
  formData.append('grant_type', 'client_credentials');
  formData.append('scope', 'email');

  const requestOptions = {
    method: 'POST',
    body: formData,
  }
  // const response = await axios.post("https://api.elementpad.io/elementsapi/oauth2/token?client_id=cEZoGE19mLmQdIPPjXtj2osurm8NRLHK&client_secret=VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW&grant_type=client_credentials&scope=email");
  const response = await fetch('https://api.elementpad.io/elementsapi/oauth2/token', requestOptions);
  const data = await response.json();
//console.log("fetch token",{ data })

  // setToken(data.access_token)
  let response2 = await fetch(`https://api.elementpad.io/elementsapi/v1/users`, {
      // method: 'GET',
      // mode: 'no-cors',
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      //   // 'Authorization': `Bearer ${token}`
      }
    }
    )
  //console.log(response2);
    const data2 = await response2.json();
  //console.log("fetch users",{ data2 })
    return (data2)
      
}
export const postusertx =async(a,b,c,d,tvl,amt,as1,as2,fees)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id:  process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
  //console.log("done1",response.data);
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    // console.log("date",date);
    const options2 = {
      method: 'POST',
      url: 'https://api.elementpad.io/elementsapi/v1/txHistory',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: {
        'algoAddress':a,
        'transactionHash':b,
        'escrowAddress':c,
        'transactionType':d,
        "tvl":tvl,
        "amount":amt,
        "asset1":as1,
        "asset2":as2,
        "fees": fees,
        "time":date
      }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
    //  return response2;
     window.location.reload();
    }).catch(function (error) {
    //console.error("done2",error);
    });



  }).catch(function (error) {
  //console.error(error);
  });
      
}
export const postuserdetail =async(userdata)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id:  process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
  //console.log("done1",response.data);

    const options2 = {
      method: 'POST',
      url: 'https://api.elementpad.io/elementsapi/v1/users/',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: userdata
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
      window.location.reload();
    }).catch(function (error) {
    //console.error("done2",error);
    });



  }).catch(function (error) {
  //console.error(error);
  });
      
}
export const postuserstatus =async(userdata)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id:  process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
  //console.log("done1",response.data);

    const options2 = {
      method: 'POST',
      url: 'https://api.elementpad.io/elementsapi/v1/visits/',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: userdata
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
    //console.log("done2",response2.data);
    }).catch(function (error) {
    //console.error("done2",error);
    });



  }).catch(function (error) {
  //console.error(error);
  });
      
}

//---------------------Launchpad Start--------------------------------------

export const connectWalletLaunchpad =async(algoAddress, connectWallet)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id: 'cEZoGE19mLmQdIPPjXtj2osurm8NRLHK',
      client_secret: 'VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW',
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
    console.log("done1",response.data);
    // const current = new Date();
    // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    
    
    
    // console.log("date",date);

    const options1 = {
      method: 'GET',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options1).then(function (responseGet) {
      console.log("done2",responseGet.data);
      let getData = responseGet.data;
      let mapGetData =[];
      responseGet.data.map((r, i)=>{
        if(r.algoAddress === algoAddress)
        {
          r.algoAddress = algoAddress;
          r.connectWallet = connectWallet;
          console.log("GET data", r);
          mapGetData = r;
        }
        else{
          mapGetData = {
            "algoAddress": algoAddress,
            "totalTxns": 0,
            "connectWallet": connectWallet,
            "appOptIn": "",
            "assetOptIn": "",
            "donate": "",
            "amount": 0.0
          }
        }
      })

    const options2 = {
      method: 'POST',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: mapGetData
      //  {
      //   'algoAddress':algoAddress,
      //   'totalTxns':totalTxns,
      //   'connectWallet':connectWallet,
      //   'appOptIn':appOptin,
      //   "assetOptIn":assetOptin,
      //   "donate":donate,
      //   "amount":amount,
      // }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
      console.log("done2",response2.data);
    }).catch(function (error) {
      console.error("done2",error);
    });
    }).catch(function (error) {
      console.error("done2",error);
    });





  }).catch(function (error) {
    console.error(error);
  });
      
}

export const appOptinLaunchpad =async(algoAddress, appOpt)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id: 'cEZoGE19mLmQdIPPjXtj2osurm8NRLHK',
      client_secret: 'VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW',
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
    console.log("done1",response.data);
    // const current = new Date();
    // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    
    
    
    // console.log("date",date);

    const options1 = {
      method: 'GET',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options1).then(function (responseGet) {
      console.log("done2",responseGet.data);
      let getData = responseGet.data;
      let mapGetData =[];
      responseGet.data.map((r, i)=>{
        if(r.algoAddress === algoAddress)
        {
          r.algoAddress = algoAddress;
          r.appOptIn = appOpt;
          r.totalTxns = r.totalTxns + 1;
          console.log("GET data", r);
          mapGetData = r;
        }
        // else{
        //   mapGetData = {
        //     "algoAddress": algoAddress,
        //     "totalTxns": 0,
        //     "connectWallet": "",
        //     "appOptIn": "",
        //     "assetOptIn": "",
        //     "donate": "",
        //     "amount": 0.0
        //   }
        // }
      })

    const options2 = {
      method: 'PUT',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: mapGetData
      //  {
      //   'algoAddress':algoAddress,
      //   'totalTxns':totalTxns,
      //   'connectWallet':connectWallet,
      //   'appOptIn':appOptin,
      //   "assetOptIn":assetOptin,
      //   "donate":donate,
      //   "amount":amount,
      // }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
      console.log("done2",response2.data);
    }).catch(function (error) {
      console.error("done2",error);
    });
    }).catch(function (error) {
      console.error("done2",error);
    });
  }).catch(function (error) {
    console.error(error);
  });
      
}

export const assetOptinLaunchpad =async(algoAddress, assetOpt)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id: 'cEZoGE19mLmQdIPPjXtj2osurm8NRLHK',
      client_secret: 'VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW',
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
    console.log("done1",response.data);
    // const current = new Date();
    // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    
    
    
    // console.log("date",date);

    const options1 = {
      method: 'GET',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options1).then(function (responseGet) {
      console.log("done2",responseGet.data);
      let getData = responseGet.data;
      let mapGetData =[];
      responseGet.data.map((r, i)=>{
        if(r.algoAddress === algoAddress)
        {
          r.algoAddress = algoAddress;
          r.assetOptIn = assetOpt;
          r.totalTxns = r.totalTxns + 1;
          console.log("GET data", r);
          mapGetData = r;
        }
        // else{
        //   mapGetData = {
        //     "algoAddress": algoAddress,
        //     "totalTxns": 0,
        //     "connectWallet": "",
        //     "appOptIn": "",
        //     "assetOptIn": "",
        //     "donate": "",
        //     "amount": 0.0
        //   }
        // }
      })

    const options2 = {
      method: 'PUT',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: mapGetData
      //  {
      //   'algoAddress':algoAddress,
      //   'totalTxns':totalTxns,
      //   'connectWallet':connectWallet,
      //   'appOptIn':appOptin,
      //   "assetOptIn":assetOptin,
      //   "donate":donate,
      //   "amount":amount,
      // }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
      console.log("done2",response2.data);
    }).catch(function (error) {
      console.error("done2",error);
    });
    }).catch(function (error) {
      console.error("done2",error);
    });
  }).catch(function (error) {
    console.error(error);
  });
      
}

export const donateLaunchpad =async(algoAddress, donateAlgo)=>{
       
  const options = {
    method: 'POST',
    url: 'https://api.elementpad.io/elementsapi/oauth2/token',
    headers: {'Content-Type': 'application/json'},
    data: {
      client_id: 'cEZoGE19mLmQdIPPjXtj2osurm8NRLHK',
      client_secret: 'VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW',
      grant_type: 'client_credentials',
      scope: 'email'
    }
  };
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.request(options).then(function (response) {
    console.log("done1",response.data);
    // const current = new Date();
    // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    
    
    
    // console.log("date",date);

    const options1 = {
      method: 'GET',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options1).then(function (responseGet) {
      console.log("done2",responseGet.data);
      let getData = responseGet.data;
      let mapGetData =[];
      responseGet.data.map((r, i)=>{
        if(r.algoAddress === algoAddress)
        {
          r.algoAddress = algoAddress;
          r.donate = r.donate + parseFloat(donateAlgo);
          r.totalTxns = r.totalTxns + 1;
          console.log("GET data", r);
          mapGetData = r;
        }
        // else{
        //   mapGetData = {
        //     "algoAddress": algoAddress,
        //     "totalTxns": 0,
        //     "connectWallet": "",
        //     "appOptIn": "",
        //     "assetOptIn": "",
        //     "donate": "",
        //     "amount": 0.0
        //   }
        // }
      })

    const options2 = {
      method: 'PUT',
      url: 'https://api.elementpad.io/elementsapi/v1/lpTracker',
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`    
      },
      data: mapGetData
      //  {
      //   'algoAddress':algoAddress,
      //   'totalTxns':totalTxns,
      //   'connectWallet':connectWallet,
      //   'appOptIn':appOptin,
      //   "assetOptIn":assetOptin,
      //   "donate":donate,
      //   "amount":amount,
      // }
    };
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.request(options2).then(function (response2) {
      console.log("done2",response2.data);
    }).catch(function (error) {
      console.error("done2",error);
    });
    }).catch(function (error) {
      console.error("done2",error);
    });
  }).catch(function (error) {
    console.error(error);
  });
      
}

// algoAddress, totalTxns, connectWallet, appOptin, assetOptin, donate, amount

//-------------------------------------Launchpad End-----------------------------------
/// firebase
export const createpair =(escaddr,a,b,c,aid,bid,cid,)=>{
  let ref2=fireDb.database().ref(`createpair/${localStorage.getItem("walletAddress")}`);
  // let ref2=fireDb.database().ref(`createpair/${L}`);

  const db = ref2.push().key;                                                                             
  ref2.child(db).set({
    key:db,profileURL:localStorage.getItem("walletAddress"),algoAddress:escaddr,asset1Name:a,asset2Name:b,asset3Name:c,accountType:aid,profileName:bid ,twitterName:cid
        // key:db,profileURL:L,algoAddress:escaddr,asset1Name:a,asset2Name:b,asset3Name:c,accountType:aid,profileName:bid ,twitterName:cid
  })
  .then(()=>{
    console.log("done")
  })
}

export const createtxhash =(escaddr,txn,typev,am,a)=>{
  let ref2=fireDb.database().ref(`createtxhash/${localStorage.getItem("walletAddress")}`);
  const db = ref2.push().key;                                                                             
  ref2.child(db).set({
    key:db,escrowAddress:escaddr,transactionHash:txn,algoAddress:localStorage.getItem("walletAddress"),assetName:a,transactionType:typev,amount:am
  })
  .then(()=>{
    console.log("done")
  })
}
export const createtpairhistory =(escaddr,tvlvalue,vl,fee,asname1,asname2,asname3,id1,id2,id3)=>{
  let ref2=fireDb.database().ref(`createpairhistory`);
  const db = ref2.push().key;                                                                             
  ref2.child(db).set({
    key:db,escrowAddress:escaddr,tvl:tvlvalue,volume:vl,fees:fee,asset1name:asname1,asset2name:asname2,asset3name:asname3,as1id:id1,as2id:id2,as3id:id3
  })
  .then(()=>{
    console.log("done")
  })
}

// export const updatepairhistory =(escaddr,tvlvalue,vl,fee,asname1,asname2,asname3,id1,id2,id3)=>{
  export const updatepairhistory =(as1Id,as2Id,f,t,v)=>{           
    let r=[];
           
    fireDb.database().ref("createpairhistory").on("value", (data) => {          
      if (data) {             
        let a=data.val()                   
        Object.keys(a).map(async(k)=>{ 
          if(parseInt(a[k].as1id) === parseInt(as1Id) & parseInt(a[k].as2id) ===parseInt(as2Id)) {
            r.push({          
              key:k,
              escrowAddress:a[k].escrowAddress,
              tvl:a[k].tvl,
              volume:a[k].volume,
              fees:a[k].fees,
              asset1name:a[k].asset1name,
              asset2name:a[k].asset2name,
              asset3name:a[k].asset3name,
              as1id:a[k].as1id,as2id:a[k].as2id,as3id:a[k].as3id
            }) 
          }                                  
          //console.log("proff",a[k])
                        
        })            
      }
    console.log("rvalue",r);
    if(r.length === 0 || r === undefined || r === null|| r ===""){}
    else{
    let ref2=fireDb.database().ref(`createpairhistory`);
      const db = ref2.push().key;                                                                             
      ref2.child(r[0].key).update({
            escrowAddress:r[0].escrowAddress,
              tvl:t,
              volume:v,
              fees: (f + parseInt(r[0].fees)),
              asset1name:r[0].asset1name,
              asset2name:r[0].asset2name,
              asset3name:r[0].asset3name,
              as1id:r[0].as1id,as2id:r[0].as2id,as3id:r[0].as3id
      })
      .then(()=>{
        console.log("done")
      })
    }
    })
    
                     
                  
       
  
}
export const getmethod =(as1id,as2id)=>{           
  let r=[];
         
  fireDb.database().ref("createpairhistory").on("value", (data) => {          
    if (data) {             
      let a=data.val()                   
      Object.keys(a).map(async(k)=>{                                    
        //console.log("proff",a[k])
        r.push({          
          key:k,
          escrowAddress:a[k].escrowAddress,
          tvl:a[k].tvl,
          volume:a[k].volume,
          fees:a[k].fees,
          asset1name:a[k].asset1name,
          asset2name:a[k].asset2name,
          asset3name:a[k].asset3name,
          as1id:a[k].as1id,as2id:a[k].as2id,as3id:a[k].as3id
        })                
      })            
    }
  console.log("rvalue",r);
  });                  
                
    return r; 
}
export const getpairedtokens =()=>{           
  let r=[];
         
  fireDb.database().ref("createpair").child(localStorage.getItem('walletAddress')).on("value", (data) => {          
    if (data) {             
      let a=data.val()                   
      Object.keys(a).map(async(k)=>{                                    
        // console.log("proff",a[k].algoAddress)
        r.push({          
          key:k,profileURL:a[k].profileURL,
          algoAddress:a[k].algoAddress,asset1Name:a[k].asset1Name,
          asset2Name:a[k].asset2Name,asset3Name:a[k].asset3Name,
          accountType:a[k].accountType,profileName:a[k].profileName ,
          twitterName:a[k].twitterName

        })                
      })            
    }
  console.log("rvalue",r);
  });                  
                
    return r; 
}
export const gettxhistory =()=>{           
  let r=[];
         
  fireDb.database().ref("createtxhash").child(localStorage.getItem('walletAddress')).on("value", (data) => {          
    if (data) {             
      let a=data.val()                   
      Object.keys(a).map(async(k)=>{                                    
        // console.log("proff",a[k].algoAddress)
        r.push({          
          key:k,escrowAddress:a[k].escrowAddress,
          transactionHash:a[k].transactionHash,
          algoAddress:a[k].algoAddress,
          assetName:a[k].assetName,
          transactionType:a[k].transactionType,amount:a[k].amount
        })                
      })            
    }
  console.log("gettxhistory",r);
  });                  
                
    return r; 
}