pragma solidity >=0.5.0 <0.8.0;

//import ERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*==========================================================
DATING APP CONTRACT
By: Carson Case
==========================================================*/
contract LoveCoin is ERC20{
    
    //mint some tokens to yours truly as a dev fee
    constructor(uint256 initialSupply) public ERC20("Love Coin", "LUV") {
        _mint(msg.sender, initialSupply);
    }

    //Global sum of algorithm score for each sex
    uint256 public male_score_sum = 0;
    uint256 public female_score_sum = 0;
    //Global length of user arrays
    uint256 public maleUserCount = 0;
    uint256 public femaleUserCount = 0;
    
    //Struct for the user
    struct user{
        bool isUser;
        bool male;
        string handle;
        uint256 score;
    }
    
    //Enum for relationship status
    enum state_types {unkown,like,accepted}
    
    /*==========================================================
    ***Data structures***

    Users Mapping keeps track of addresses that join app with:
        -what their sex is (bool true = male)
        -a string for social media handle
        -algorithm score

    States Mapping keeps track of relationships between:
        -Females addresses:
            -Men's addresses 
            -The relationship expressed as (unkown (default), liked, accepted)
    have_liked Mapping keeps track of each females:
        -Array of addresses that are like/accepts to be able to itterate
    User arrays by sex
        -Holds all users
    ==========================================================*/
    mapping(address => user) public users;
    mapping(address => mapping(address => state_types)) public states;
    mapping(address => address[]) public have_liked;
    address[] public femaleUsers;
    address[] public maleUsers;

    /*==========================================================
    ***Public Functions***

    Join:
        -Creates a new user
    like:
        -Callable by male to like a female
    accept:
        -Callable by female to accept a male
    numberOfLikes:
        -Returns the length of a female user's like list
    ==========================================================*/
    function join(bool _sex, string memory _handle) public{
        //Only add new user to respective array if they are truly new
        if(!users[msg.sender].isUser){ 
            if(_sex){
                maleUserCount++;
                maleUsers.push(msg.sender);
            }else{
                femaleUserCount++;
                femaleUsers.push(msg.sender);
            }
        }
       users[msg.sender] = user(true,_sex, _handle, 0);
    }
    function like(address _to_like) public{
        require(users[msg.sender].male == true);                        //Only males can like
        require(states[_to_like][msg.sender] == state_types.unkown);    //require status not already set
        require(_to_like != msg.sender);                                //require user to not like themself
        
        //Push address to females likes
        have_liked[_to_like].push(msg.sender);

        //Change status to like
        states[_to_like][msg.sender] = state_types.like;
        
        //Increase female's score
        users[_to_like].score += _female_score(msg.sender);
    
    }
    function accept(address _to_accept) public{
        require(users[msg.sender].male == false);                       //Only females can accept
        require(states[msg.sender][_to_accept] == state_types.like);    //Only can accept if already liked
        
        states[msg.sender][_to_accept] = state_types.accepted;

        //Update algorithm score for male
        users[_to_accept].score += _male_score(msg.sender); //NOTE. Only male benefits from this score wise
 
        //COINS! NOTE: coins are only distributed from acceptances. Women may not benefit from acceptances with points. But will get coins
        //Mint coins to each as share of total attractivness pool. 
        _mint(msg.sender,(users[msg.sender].score/female_score_sum) * 100000);
        _mint(_to_accept,(users[_to_accept].score/male_score_sum) * 100000);


    }
    function numberOfLikes(address _user) public returns(uint256){
        return have_liked[_user].length;
    }
    
    /*==========================================================
    ***Private Functions***

    _female_score:
        -Updates score for a female
        -Is called when she gets a like from a male
    _male_score:
        -Updates score for a male
        -Is called when a female accepts his like
    ==========================================================*/
    
    //Called every time a female gets a like from a male
    function _female_score(address _male) private returns(uint256){
        uint256 i = users[_male].score + 1;
        female_score_sum += i;
        return i;  //Smallest ammount a woman can score is 1 point
    }
    
    //Called every time a female accepts a male
    function _male_score(address _female) private returns(uint256){
        uint256 i = users[_female].score + 9;   
        male_score_sum += i;
        return i;           //Smallest ammount a man can score is 10 points (10 because all women who have a chance to accpet will have at least 1 one like, therefore 1 point)
    }
}