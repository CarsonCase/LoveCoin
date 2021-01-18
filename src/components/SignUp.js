import React, {useState} from 'react';

const welcome = (props)=>{
    let name;
    return(
        <div>
            <h1>Looks like you're new around here..</h1>
            <h2>Let's get you set up</h2>
            <h2>We'll start with a name</h2>
            <form onSubmit={(e)=>{props.handleSubmit(e,name)}}>
                <input onChange={(e)=>{name=e.target.value}}></input>
                <button>That's My Name</button>
            </form>
        </div>
    );
}

const question1 = (props)=>{
    let option;
    return(
        <div>
            <h1>That's a great name {props.name}</h1>
            <h2>Are you a fella or a lady?</h2>
            <form onSubmit={(e)=>{props.handleSexChange(e,option)}}>
            <div className="radio">
                <label>
                    <input name="sexChoice" type="radio" value="Male" onChange={(e)=>{option = e.target.value}}></input>
                    Male
                </label>
                <br></br>
                <label>
                    <input name="sexChoice" type="radio" value="Female" onChange={(e)=>{option = e.target.value}}></input>
                    Female
                </label>
            </div>

                <button>Submit</button>
            </form>
        </div>
    )
}

const question2 = (props)=>{
    let handle;
    return(
        <div>
            <h1>Enter a Social media handle</h1>
            <h2>Enter your handle with an @. If not using Instagram specify in brackets</h2>
            <h3>Note: You can enter a handle to any social media you'd like. But we reccomend Instagram</h3>
            <h3>Examples: @BoobasTea, [SNAPCHAT]@TimmyWildin, [ONLYFANS]@Maddie</h3>
            <p>Remember to change your privacy settings so people can see you! Unless you want them to have to follow first</p>

            <form onSubmit={(e)=>{props.handleChange(e,handle)}}>
                <input onChange = {(e)=>{handle=e.target.value}}></input>
                <button>Submit</button>
            </form>
        </div>
    )
}

const finalButton = (props)=>{
    let sex = true;
    if(props.sex ==="Female"){
        sex = false;
    }
    return(
    <div>
        <h1>Well then...</h1>
        <h2>{props.name}</h2>
        <h2>The {props.sex}.</h2>
        <h2>your handle is: {props.handle}</h2>
        <h3>If you're ready to join the exciting world of crypto dating hit the button bellow</h3>
        <form onSubmit={(e)=>{props.signUp(e,sex,props.handle)}}>
            <button>Let's Go!</button>
        </form>
    </div>
    );
}



class SignUp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: "user",
            page: 0,
            sex: "",
            handle: "@"
        };
    }

    getName = ()=>{
        return (this.state.page);
    }
    changePage = ()=>{
        let page = this.state.page;
        this.setState({page:page+1});
    }

    handleNameChange = (e,changeWith)=>{
        e.preventDefault();
        this.setState({name:changeWith});
        this.changePage();
    }

    handleSexChange = (e,changeWith)=>{
        e.preventDefault();
        this.setState({sex:changeWith});
        this.changePage();
        console.log(this.state.sex);
    }

    handleChange=(e,changeWith)=>{
        e.preventDefault();
        this.setState({handle:changeWith});
        this.changePage();
    }

    render(){
        let pages= [
            welcome({handleSubmit: this.handleNameChange}),
            question1({name:this.state.name,handleSexChange: this.handleSexChange}),
            question2({handleChange:this.handleChange}),
            finalButton({name:this.state.name,sex:this.state.sex,handle:this.state.handle,signUp:this.props.signUp})
        ]
        
        let i = 0;
        return(
            <div>
            {pages[this.state.page]}
            </div>
        )
    }
}

export default SignUp;