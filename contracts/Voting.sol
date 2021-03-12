
// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;
import "./libraries/Ownable.sol";
import "./libraries/Counters.sol";
   contract Voting is Ownable {
        //structur electeur deja donnée dans l'énoncé
        struct Voter 
        {
            bool isRegistered;
            bool hasVoted;
            uint votedProposalId;
        }
        // structure proposition
        struct Proposal {
            string description;
            uint voteCount;
            
        }
        //les etats de vote dejà donnés dans l'énoncé 
        enum WorkflowStatus {
                            RegisteringVoters,
                            ProposalsRegistrationStarted,
                            ProposalsRegistrationEnded,
                            VotingSessionStarted,
                            VotingSessionEnded,
                            VotesTallied
                        }
                        
        WorkflowStatus public workflowStatus =WorkflowStatus.RegisteringVoters;
        Proposal[] tabProposals;//tableau des proposition
        address public administrateur; //adresse de l'administrateur du vote 
        mapping(address =>Voter) public electeurs;//mapping des electeurs
        mapping(address=>bool) public whitelist; //la liste blanche des electeur
        uint private winningProposalId; //Id du gagnant (l'index de la proposition )
    
      //les evenements deja donnés dans l'ennoncé.
        event VoterRegistered(address voterAddress);
        event ProposalsRegistrationStarted();
        event ProposalsRegistrationEnded();
        event ProposalRegistered(uint proposalId);
        event VotingSessionStarted();
        event VotingSessionEnded();
        event Voted (address voter, uint proposalId);
        event VotesTallied();
        event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
            
       
    
        // liste des modifiers pour controler la synchronisation des etapes du deroulement 
        //du contrat 
        modifier votersRegistrationOpen() {
            require(workflowStatus==WorkflowStatus.RegisteringVoters);
            _;
        }
     
        modifier proposalsRegistrationOpen(){
            require(workflowStatus==WorkflowStatus.ProposalsRegistrationStarted);
    
            _;
        }
        modifier proposalsRegistrationEnded(){
            require(workflowStatus==WorkflowStatus.ProposalsRegistrationEnded);
            _;
        }
        modifier votingSessionOpen(){
            
            require(workflowStatus==WorkflowStatus.VotingSessionStarted);
            _;
        }
        
        
        modifier VotingSessionEnd(){
            require(workflowStatus==WorkflowStatus.VotingSessionEnded);
            _;
        }
        
        modifier voteTallied(){
            require(workflowStatus==WorkflowStatus.VotesTallied);
            _;
        }
         
          // constructeur pour l'ememeteur du contrat 
        constructor() public 
        {
            administrateur=msg.sender;
            workflowStatus=WorkflowStatus.RegisteringVoters;
         }
    
       // ------------------les fonctions du contrat -------------------------
    
            //j'ai ajouté a,b,c au debut des noms des fonctions pour avoir les etapes
            // rangées sur remix 
      
       //1-l'administrateur du vote commence par enregistrer les votants 
    
    function aRegisterVoter(address electeur)  public
            onlyOwner()  votersRegistrationOpen()
    {
        require(!electeurs[electeur].isRegistered,"l'electeur est deja enregistré");
        require(electeur!= address(0), "Addresse 0");
        electeurs[electeur].isRegistered=true;
        electeurs[electeur].hasVoted=false;
        electeurs[electeur].votedProposalId=0;
        whitelist[electeur]=true;
        emit VoterRegistered(electeur);
    }
    
        
        
        //2-L'administrateur du vote commence la session d'enregistrement de la proposition.    
    
    function  bProposalsRegistrationStartedSession() public
        onlyOwner()   votersRegistrationOpen() 
    {
         workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        emit  ProposalsRegistrationStarted();
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    
    
    //2-les electeurs inscrits enregistrent  les propositions 
    function cAddProposal(string memory _description) public 
    proposalsRegistrationOpen()
    
    {
        require(electeurs[msg.sender].isRegistered,"l'electeur n'est pas enregistré");
        Proposal  memory newProposal;  //NewProposal=new(_idProposal,_description,0);
        newProposal.description =_description;
        newProposal.voteCount=0;
        tabProposals.push(newProposal);
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        emit ProposalRegistered(tabProposals.length-1);
        emit ProposalsRegistrationEnded();
    }
    
    
    //3-l'administrateur mets fin à la session d'enregistrement de propositions 
   
    function dProposalsRegistrationEnd() public
        onlyOwner() proposalsRegistrationOpen() 
    { 
         workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;

        emit ProposalsRegistrationEnded();
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

//4-l'administrateur du votre demarre une session de vote 
    
     function eVotingSessionStart() public 
        onlyOwner()  proposalsRegistrationEnded()
    {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit VotingSessionStarted();
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    
    
    //4-les electeur inscrit peuvent voter . en choisissant l'id de la proposition /Poids du vote 1 
    function fvote(uint _idProposal) public  votingSessionOpen()
    {
        require(!electeurs[msg.sender].hasVoted, "A déjà voté");
        require(electeurs[msg.sender].isRegistered,"Vous n'etes pas inscris");
        electeurs[msg.sender].votedProposalId=_idProposal;
        tabProposals[_idProposal].voteCount +=1;
        emit Voted (msg.sender,_idProposal);
    }

//5_l'administrateur let fin a la session du vote 
   
    function gVotingSessionEndeded()public 
        onlyOwner() votingSessionOpen()
     {
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit VotingSessionEnded();
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);   
    }
    
    
    //6-l'administrateur compte les votes 
    
    function hcompteVotes() public onlyOwner  VotingSessionEnd() 
    {
        uint nbrvoix=0;
        uint winnigproposalIndex=0;
            for(uint p=0;p<tabProposals.length;p++)
            {
                if (tabProposals[p].voteCount > nbrvoix)
                {
                    nbrvoix=tabProposals[p].voteCount;
                    winnigproposalIndex=p;
                }
            }
            winningProposalId=winnigproposalIndex;//winnigproposalIndex deja declaré au debut du contrat
            workflowStatus=WorkflowStatus.VotesTallied;
            emit VotesTallied();
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied); 
    }
    
    //obtenir le nombre de proposition 
    function getProposalsNumbers() public view
         returns (uint) 
    {
         return tabProposals.length;
    }  
     
     //obtenir la description d'une propistion a partir de l'index 
    function getProposalDescription(uint index) public view 
         returns (string memory ) {
         return tabProposals[index].description;
     } 
     
     function getWinningProposal() external   view 
            voteTallied()
                returns (string memory)
    {
        return tabProposals[winningProposalId].description;
    }
    
    function getWorkflowStatus() public view
	    returns (WorkflowStatus) {
	    return workflowStatus;       
	}

    
     
    }
    