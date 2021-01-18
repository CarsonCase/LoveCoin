LoveCoin is the world's first dating cryptocurrency!
(Built with Ethereum smart contracts)

Here's how it works:

Users sign up by publishing the following information to the blockchain:
(associated with their browser wallet)
	-A social media handle (string)
	-Sex (a boolean {true -> male, false -> female}

On the LoveCoin frontend, male users are shown female users and for each are given the option to "like".
Liking calls the "like" function in the LoveCoin.sol contract
Back on the frontend, female users are shown a list of all their likes. And are given the option to accept. If accepting, the accept function in LoveCoin.sol is called.

If a woman accepts a man's like then a "match" is made. And LoveCoins (an ERC-20 token) are minted to both parties.
The quantity of tokens are calculated using "attractivness scores". Which are kept track in the smart contract. These scores are impacted differently for women and men:
Female: 
	Score goes up every time a man likes them. Equal to the man's score + 1.
Male:
	Score goes up every time a woman accepts them. Equal to the woman's score + 9
	
When a Match is made the coins minted for both parties are calculated with the following equation:
	(User's score)/(Sum of all score's for user's sex) * 1000
	

NOTE: LoveCoin does not attempt to be a "genuine" dating app. I mean. Would be cool if it was. But nobody would rather use a dating app that costs money in gas fees to use. Not to mention, is actually designed to be as heartlessly favorable to the super attractive. If ever launched, LoveCoin would be more of a dating themed crypto game or proof of concept for the power of smart contracts. There are other ideas. But time will tell if I take them seriously
