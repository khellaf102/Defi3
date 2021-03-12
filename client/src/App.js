
//stepper pour gerer les transitions 
import Stepper from 'react-stepper-horizontal';
import React, { Component } from "react";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import RegisteringVoters from "./RegisteringVoters.js";
import ProposalsRegistrationStarted from  "./ProposalsRegistrationStarted.js";
import ProposalsRegistrationEnd from  "./ProposalsRegistrationEnd.js"
import VotingSessionStart from "./VotingSessionStart.js";
import VotingSessionEnded  from "./VotingSessionEnded.js";
import CompteVotes from "./CompteVotes.js";


import "./App.css";
//liste des composants a afficher 
const composantAffiche = [
  {

    component: RegisteringVoters,
  },
  {
    component: ProposalsRegistrationStarted,
  },
  {
    component: ProposalsRegistrationEnd,
  },
  {
    component: VotingSessionStart,
  },
  {
    component: VotingSessionEnded,
  },
  {
    component: CompteVotes,
  }];



class App extends Component {
  state = {
       web3: null, 
       accounts: null, 
       contract: null,
       status:null,
       isOwner:false,
       proposal:null,
       winner :null,
       totalProposals :0,
       error:null,
      };

  componentWillMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];

      const instance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance }, this.runInit);

      window.ethereum.on("accountsChanged", (newAccounts) => {
        this.setState({ accounts: newAccounts }, this.runInit);
      });
    } catch (error) {
      alert(
        `Non-Ethereum browser detected. Can you please try to install MetaMask before starting.`
      );
      console.error(error);
    }
  };



  aRegisterVoter = async (address) => {
    const { contract, accounts } = this.state;
    try {
      await contract.methods.aARegisterVoter(address).send({ from: accounts[0] });
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };

  proposalsRegistrationStartedSession = async () => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods.bProposalsRegistrationStartedSession().send({ from: accounts[0] });
      await this.runInit();
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };


  addProposals = async (proposal) => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods
        .cAddProposal(proposal)
        .send({ from: accounts[0] });
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };
  proposalsRegistrationEnd = async () => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods
        .dProposalsRegistrationEnd()
        .send({ from: accounts[0] });

      await this.runInit();
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };

  votingSessionStart = async () => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods.eVotingSessionStart().send({ from: accounts[0] });

      await this.runInit();
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };
  getProposal = async (id) => {
    const { contract } = this.state;

    try {
      const proposal = await contract.methods.getProposalDescription(id).call();

      return proposal;
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };

  vote = async (id) => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods.fvote(id).send({ from: accounts[0] });
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };

  votingSessionEnded = async () => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods.gVotingSessionEndeded().send({ from: accounts[0] });

      await this.runInit();
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };

  compteVotes = async () => {
    const { contract, accounts } = this.state;

    try {
      await contract.methods.hcompteVotes().send({ from: accounts[0] });

      await this.runInit();
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };

  getWinningProposal = async () => {
    try {
      const { contract } = this.state;

      const winner = await contract.methods.getWinningProposal().call();

      this.setState({ winner });
    } catch (e) {
      this.setState({ error: "An error occured" });
    }
  };


  runInit = async () => {
    const { contract } = this.state;

    const status = await contract.methods.getWorkflowStatus().call();
    console.log(status)
    const ownerContract = await contract.methods.owner().call();
    const totalProposals = await contract.methods.getProposalsNumbers().call();

    const currentContract = this.state.accounts[0];
    this.setState({
      error: null,
      status,
      totalProposals,
      isOwner: currentContract.toLowerCase() === ownerContract.toLowerCase(),
    });
  };


  getStepperComposant() {
    const { status, winner, isOwner, totalProposals } = this.state;

    if (status >= 0 && status < composantAffiche.length) {
      const RenderAffiche = composantAffiche[status].component;

      return (
        <RenderAffiche
          totalProposals={totalProposals}
          winner={winner}
          etapes={{
            aRegisterVoter: this.aRegisterVoter,
            proposalsRegistrationStartedSession: this.proposalsRegistrationStartedSession,
            addProposals: this.addProposals,
            proposalsRegistrationEnd: this.proposalsRegistrationEnd,
            votingSessionStart: this.votingSessionStart,
            getProposal: this.getProposal,
            vote: this.vote,
            votingSessionEnded: this.votingSessionEnded,
            compteVotes: this.compteVotes,
            getWinningProposal: this.getWinningProposal,
          }}
          isOwner={isOwner}
        />
      );
    }

    return null;
  }


  



  render() {
  const { status, error } = this.state;
  if (!this.state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  const activeStep = parseInt(status);

  return (
    <div className="App">
       <h2 className="text-center">Systeme de vote</h2>

      <div>
        <Stepper 
            steps={ 
              [{title: 'Enregistrement des electeurs'}, 
              {title: "Debut d'enregistrement des propositions"}, 
              {title: "Fin enregistrement des propositions"}, 
              {title: "Debut de la session de vote "},
              {title: " Fin de la session de vote "},
              {title: "Compte des votes "}
            ] 



            }
             
            activeStep={ activeStep}
            circleTop={0}
            activeTitleColor={'#d31017'}
            activeColor={'#E0E0E0'}
            defaultTitleColor={'#E0E0E0'}
            completeTitleColor={'#E0E0E0'}
            barStyle={'dashed'}
            size={45}
            circleFontSize={20}

        
        
        />

        
      </div>
      <hr />


      {status !== null && this.getStepperComposant()}
    </div>
  );
}
}

export default App;
