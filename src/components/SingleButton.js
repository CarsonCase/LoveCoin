
function SingleButton(props){
    return(
        <div >
        <h1>{props.title}</h1>
        <h2>{props.subtitle}</h2>
            <form onSubmit={(e)=>{props.foo(e,true,"@Hello_World")}}>
                <button>{props.btn}</button>
            </form>
        </div>
    )
}

export default SingleButton;