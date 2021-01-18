import './Main.css';
//import { findAllByTestId } from '@testing-library/react';
import React from 'react'

import SingleButton from './SingleButton';
import SignUp from './SignUp'
import Feed from './Feed';
import { Button } from 'bootstrap';

class Main extends React.Component{
  constructor(props){
    super(props);
    this.connect = this.connect.bind(this);
    this.signUp = this.signUp.bind(this);

    this.state = {
      connected: this.props.isConnected,
      loading: false,
      usersMatches: []
    };

  }
  //pretnet list of our heros existing mataches. This will actually be user objects
  //NOTE: We will need another mapping for this. Each user's matches. Will be used for NOTE above to sort out existing matches
  

  async connect(e){
    e.preventDefault();
    this.setState({loading:true});
    await this.props.connectBlockchain();
    this.setState({connected:true,loading:false});
    let usersMatches = await this.props.getMatches();
    this.setState({usersMatches:usersMatches});
  }

  signUp = async(e,sex,handle)=>{
    e.preventDefault();
    await this.props.join(sex,handle);
    await this.setState({page:2});    

  }

  burnTokens(e,n){
    e.preventDefault();
    if(this.props.balance < n){
      alert("Not enough tokens");
    }else{
        //Call the burn tokens function. Needs to be added. But converts LUV to score
        console.log("LUV burned");
    }
  }

  render(){

    let content;
    if(this.state.loading){
        <h1>Loading Please wait...</h1>
    }
    <h1>Loading. Please wait...</h1>
    //Connect Wallet Page 
    if(!this.state.connected){ 
      content =     
      <SingleButton 
      title="LoveCoin"
      subtitle="The worlds first dating cryptocurrency"
      btn="Get Started"
      foo={this.connect}
      />
    }else{
        //Sign Up Page
        if(!this.props.user.isUser){
            content = 
            <SignUp
                signUp ={this.signUp}
            />
        }else{
            //Feed page
            let feedList;
            if(this.props.user.male){ //If user is male
                feedList = this.femaleUsers;
            }else{
                feedList = this.femaleLikes;
            }
            content = 
            <Feed
            male={this.props.user.male}
            like = {this.props.like}
            accept = {this.props.accept}
            getFeed = {this.props.getFeed}
            />

        }
    }

    let statsPanel;
    if(this.props.user.isUser){
        console.log(this.usersMatches);
    statsPanel=<div>
        <h1>User Stats</h1>
        <form onSubmit = {(e)=>{
          this.burnTokens(e,10);
        }}>
          <button>Self Love</button>
        </form>
        <p>Score: {this.props.user.score}</p>    
        <p> Balance: {this.props.balance} LUV</p> 
        <h1>Your Matches</h1>
        {this.state.usersMatches.map(match=>(
                    <p>{match.handle}[{12}]</p>
                ))}

    </div>
    }else{
      statsPanel=<div>
        <button>LUV on uniswap</button>
      </div>
    }

    return (
      <div className="App">
      <div className="row">
        <div className="col-md-10">
          <header className="App-header">
            {content}
          </header>
        </div>
        <div className="col-md-2">
          <div>
            <h1>Global Stats</h1>
            <p>Global Male Scores: {this.props.globals.male_scores}</p>
            <p>Global Female Scores: {this.props.globals.female_scores}</p>
            <p>Users: {this.props.globals.male_count+this.props.globals.female_count}</p>
            <p>LUV price: ??? ETH</p>
          </div>
            {statsPanel}
        </div>
      </div>
      </div>
    );
  }
  
}

export default Main;
