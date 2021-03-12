


//
const { expect } = require("chai");
const Voting = artifacts.require("./Voting.sol");
//variabls utilisées au fur et à mesure 
contract("Voting", (accounts) => {
  const owner = accounts[0];
  const recipient = accounts[1];
  let VotingInstance = null;
   //permet de faire les test avec un environment (state) clean 
   //deployer de la part de l'owner 
  beforeEach(async function () {
    VotingInstance = await Voting.new({
      from: owner,
    });
  });

      //test de la fonction aRegisterVoter
      //fonction asynchrone 
      //await pour attendre 
     
      
     
       it("l'appellant est le propreitaire du contrat ", async () => {
      try {
        await VotingInstance.aRegisterVoter(recipient, {
          from: owner,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }

      
    });



      //fonction aRegisterVoter et verification de la whitelist et le state 
    it("que le proprietaire pour la fonction enregistrement des electeurs", async () => {
      await VotingInstance.aRegisterVoter(recipient, {
        from: owner,
      });
      const whitelist = await VotingInstance.whitelist(recipient);
      expect(whitelist).to.be.true;
    });

      // 
    it("verification du statut getWorkflowStatus", async () => {
      const state = await VotingInstance.getWorkflowStatus({
        from: owner,
      });
      expect(parseInt(state)).to.equal(0);
    });
  



    // test de la fonction bProposalsRegisterationStartedSession et verifier le state du contrat
    it("l'appellant est proprietaire pour commencer l'enregistrement des propostions", async () => {
      try {
        await VotingInstance.bProposalsRegistrationStartedSession({
          from: owner,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }
      const state = await VotingInstance.getWorkflowStatus({
        from: owner,
      });
      expect(parseInt(state)).to.equal(1);
    });

    it("changement de WorkflowStatus ", async () => {
      await VotingInstance.bProposalsRegistrationStartedSession();
      const state = await VotingInstance.getWorkflowStatus({
        from: owner,
      });
      expect(parseInt(state)).to.equal(1);
    });
  

  
  
    //test de la fonction aRegisterVoter
    

    it("should raise exception when voter is not registered", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      try {
        await VotingInstance.cAddProposal("proposal", {
          from: recipient,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }
    });

    it("test enregistrement proposition", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });

      const proposal = await VotingInstance.getProposalDescription(0);
      expect(proposal).to.equal("proposal");
    });
  

    // test de la fonction dProposalsRegistration
    it("fin enregistrement des propositons", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });

      try {
        await VotingInstance.dProposalsRegistrationEnd({
          from: owner,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }
    });

  

    it("changement de statut", async () => {   
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      const state = await VotingInstance.getWorkflowStatus({
        from: owner,
      });
      expect(parseInt(state)).to.equal(2);
    });
  

   //test de la fonction eVotingSessionStart
    it("debuter le vote par le proprietaire", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      try {
        await VotingInstance.eVotingSessionStart({
          from: owner ,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }
    });
    it("changement de workflowstatut", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      await VotingInstance.eVotingSessionStart({
        from: owner,
      });
      const state = await VotingInstance.getWorkflowStatus({
        from: owner,
      });
      expect(parseInt(state)).to.equal(3);
    });
 

  // test de la fonction aRegisterVoter
    it("l'electeur est bien inscrit", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      await VotingInstance.eVotingSessionStart({
        from: owner,
      });
      try {
        await VotingInstance.fvote(1, {
          from: recipient,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }
    });

    // test de vote 
    it("prise en compte de vote ", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      await VotingInstance.eVotingSessionStart({
        from: owner,
      });
      await VotingInstance.fvote(0, {
        from: owner,
      });

      const proposal = await VotingInstance.getProposalDescription(0);
      expect(proposal).to.equal("proposal");
    });
  

  //test fin de vote 
    it("fin de vote par le proprietaire", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      await VotingInstance.eVotingSessionStart({
        from: owner,
      });
      await VotingInstance.fvote(0, {
        from: owner,
      });
      try {
        await VotingInstance.gVotingSessionEndeded({
          from: owner,
        });
      } catch (e) {
        expect(e).not.to.be.undefined;
      }
    });

    it("changement de state", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      await VotingInstance.eVotingSessionStart({
        from: owner,
      });
      await VotingInstance.fvote(0, {
        from: owner,
      });
      await VotingInstance.gVotingSessionEndeded({
        from: owner,
      });
      const state = await VotingInstance.getWorkflowStatus({
        from: owner,
      });
      expect(parseInt(state)).to.equal(4);
    });
  
//test comptage 
  
    it("la proposition gagnante est la meme pour le owner et les votants ", async () => {
      await VotingInstance.aRegisterVoter(owner, {
        from: owner,
      });
      await VotingInstance.bProposalsRegistrationStartedSession({
        from: owner,
      });
      await VotingInstance.cAddProposal("proposal", {
        from: owner,
      });
      await VotingInstance.dProposalsRegistrationEnd({
        from: owner,
      });
      await VotingInstance.eVotingSessionStart({
        from: owner,
      });
      await VotingInstance.fvote(0, {
        from: owner,
      });
      await VotingInstance.gVotingSessionEndeded({
        from: owner,
      });
      await VotingInstance.hcompteVotes({
        from: owner,
      });

      const proposalowner = await VotingInstance.getWinningProposal({
        from: owner,
      });
      expect(proposalowner).to.equal("proposal");

      const proposalrecepient = await VotingInstance.getWinningProposal({
        from: recipient,
      });
      expect(proposalrecepient).to.equal("proposal");
    });
  
});
