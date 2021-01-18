import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'
import LoveCoin from "../abis/LoveCoin.json"
import Main from "./Main.js"

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loveCoin: {},
      loveCoinBalance: '0',
      user: {},
      loading: false,
      isConnected: false,
      globals: {
        female_scores: '0',
        male_scores: '0',
        female_count: 0,
        male_count: 0
      },
      feed:[]
    }
  }

  connectBlockchain = async()=>{
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  loadBlockchainData = async()=>{
    //this.setState({loading:true});
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account:accounts[0]});
    const netId = await web3.eth.net.getId();
        //Load LoveCoin Contract
        const loveCoinData = LoveCoin.networks[netId]
        if(loveCoinData){
          const loveCoin = new web3.eth.Contract(LoveCoin.abi,loveCoinData.address);
          this.setState({loveCoin:loveCoin});
          let user = await loveCoin.methods.users(this.state.account).call();
          this.setState({user:user});
          let loveCoinBalance = await loveCoin.methods.balanceOf(this.state.account).call();
          console.log(loveCoinBalance);
          loveCoinBalance = web3.utils.fromWei(loveCoinBalance,"ether");
          this.setState({loveCoinBalance: loveCoinBalance.toString()});

          let m = await loveCoin.methods.male_score_sum().call();
          let f = await loveCoin.methods.female_score_sum().call();
          let mc = await loveCoin.methods.maleUserCount().call();
          let fc = await loveCoin.methods.femaleUserCount().call();
          this.setState({
            globals:{
              female_scores: f.toString(),
              male_scores: m.toString(),
              female_count: Number(fc),
              male_count: Number(mc)
            }

          });
      
        }else{
          window.alert("LoveCoin Contract not yet deployed to blockchain :(");
        }

    this.setState({loading:false});
    
  }

  loadWeb3 = async()=>{
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      this.setState({isConnected:true});
    }
    else if (window.web3){
      weindow.web3 = new Web3(window.web3.currentProvider);
      this.setState({isConnected:true});
    }
    else{
      window.alert("Non-Ethereum browser detected. You should consider using MetaMask!");
    }
  }

  //Join As new user function
  join = async(sex,handle)=>{
    await this.setState({loading:true});
    await this.state.loveCoin.methods.join(sex,handle).send({from:this.state.account});
    await this.loadBlockchainData();
    this.setState({loading:false});
  }

  getFeed = async()=>{
    if(this.state.isConnected){
      let feed=[];
      let feedLookup=[]
      let feedLength;
      let matches = await this.getMatches();

      //If user is male then itterate over all females 
      //In the future find ways to jumble this up so it's more random. Not important for small ammounts of users though
      if(this.state.user.male ===true){
        feedLength = await this.state.loveCoin.methods.femaleUserCount().call();
        for(let i=0; i < feedLength; i++){
          let addition = await this.state.loveCoin.methods.femaleUsers(0).call();
          let p = await this.getUserFromAddress(addition);
          if(!matches.some(o=>JSON.stringify(o)===JSON.stringify(p))){
            feedLookup.push(addition);
            feed.push(p);  
          }
        }

      }
      //If user is female then itterate over all her likes
      else if(this.state.user.male ===false){
        feedLength = await this.state.loveCoin.methods.numberOfLikes(this.state.account).call();
        for(var i=0; i<feedLength; i++){
          let addition = await this.state.loveCoin.methods.have_liked(this.state.account,i).call();
          let p = await this.getUserFromAddress(addition);
          if(!matches.some(o=>JSON.stringify(o)===JSON.stringify(p))){
            feedLookup.push(addition);
            feed.push(p);
          }
        }
      }
      return[feed,feedLookup];
    }
  }

  like=async(who)=>{
    await this.state.loveCoin.methods.like(who).send({from:this.state.account});
  }

  accept = async(who)=>{  //What this guy says ^
    await this.state.loveCoin.methods.accept(who).send({from:this.state.account});
  }

  async getUserFromAddress(address){
    let user = await this.state.loveCoin.methods.users(address).call();
    return user;
  }

  getMatches =async()=>{
    let matches = [];
    //THIS IS NOT SUSTAINABLE. CHANGE THIS LATER
    if(this.state.user.male){
      for(let i=0; i< this.state.globals.female_count;i++){
        let female = await this.state.loveCoin.methods.femaleUsers(i).call();
        let state = await this.state.loveCoin.methods.states(female,this.state.account).call();
        if(state==2){
          let user = await this.state.loveCoin.methods.users(female).call();
          matches.push(user);
        }

      }
    }else if(this.state.user.male === false){
      let numLikes = await this.state.loveCoin.methods.numberOfLikes(this.state.account).call();
      for(let i=0; i<numLikes; i++){
        let male = await this.state.loveCoin.methods.have_liked(this.state.account,i).call();
        let state = await this.state.loveCoin.methods.states(this.state.account,male).call();
        if(state==2){
          let user = await this.state.loveCoin.methods.users(male).call();
          matches.push(user);
        }
      }
    }
    return matches;
  }

  burnTokens = async(e,ammount)=>{
    e.preventDefault();
    this.setState({loading:true});
    console.log(web3.utils.toWei(ammount,"Ether"));
    await this.state.loveCoin.methods.burn(web3.utils.toWei(ammount,"Ether")).send({from:this.state.account});
    this.setState({loading:false});
  }

  render() {
    if(this.state.loading){
      return(
      content = <h1>Loading... Please be Patient with me</h1>
      );
    }else{
      return (
        <div>
          <Navbar account={this.state.account} />
          <Main
            connected = {this.state.isConnected}
            connectBlockchain ={this.connectBlockchain}
            join = {this.join}
            account = {this.state.account}
            balance = {this.state.loveCoinBalance}
            user = {this.state.user}
            globals = {this.state.globals}
            getFeed = {this.getFeed}
            like = {this.like}
            accept = {this.accept}
            getMatches = {this.getMatches}
            burnTokens = {this.burnTokens}
            />
        </div>
      );
  
    }
  }
}

export default App;
