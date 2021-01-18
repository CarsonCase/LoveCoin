import React from 'react'

class Feed extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            index: 0,
            loading: true,
            feed: [],
            feedLookup: []
        }
    }

    async componentDidMount(){
        this.setState({loading:true});
        let feeds = await this.props.getFeed();
        this.setState({feedLookup:feeds[1]});
        this.setState({feed:feeds[0]});
        this.setState({loading:false});

    }
    //Helper function to dry up code
    present(){
        let user = this.state.feed[this.state.index];
        return (
            <div>
                <h1>{user.handle}</h1>
                <h3>Score: {user.score}</h3>
                <h5>{this.state.feedLookup[this.state.index]}</h5>

            </div>

        );
    }

    handleLike = async(e)=>{
        e.preventDefault();
        this.setState({loading:true});
        if(this.props.male === true){
            await this.props.like(this.state.feedLookup[this.state.index]);
        }else{
            await this.props.accept(this.state.feedLookup[this.state.index]);
        }
        this.setState({loading:false});
        this.next();
    }

    next = ()=>{
        this.setState({index:this.state.index+1});
    }


    render(){
        let content;

        if(this.state.loading ===true){
            content = <div>
                <h1>Loading...</h1>
            </div>
        }else{
            if(this.state.index >= this.state.feed.length){
                content = 
                    <div>
                        <h1>Uh oh!</h1>
                        <h2>Looks like your feed is empty. Refresh  the page to reload</h2>
                </div>
               
                
            }else{
                if(this.props.male){
                    content =
                        <div>
                        {this.present()}
                            <button onClick={this.handleLike}>Like</button>
                            <button onClick = {this.next}>Skip</button>
                        </div>
                      
            
                }else if(this.props.male === false){
                    content =
                        <div>
                            <h2>You have a like from:</h2>
                            <h1>{this.present()}</h1>
                            <button onClick={this.handleLike}>Accept</button>
                            <button onClick = {this.next}>Skip</button>                       
                        </div>
                       
            
                }
        
            }
    
        }
        return(
            <div>
            {content}
            </div>
            )
    }
}

export default Feed;