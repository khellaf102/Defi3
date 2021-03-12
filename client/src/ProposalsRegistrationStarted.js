import React, { useState } from "react";



const ProposalsRegistrationStarted = ({ etapes, isOwner }) => {
  const [proposal, setProposal] = useState("");

  return (
    <div>
      <h3>Ajouter une proposition</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await etapes.addProposals(proposal);
        }}
        noValidate
        autoComplete="off"
      >
          <input
            multiline={true}
            onInput={(e) => setProposal(e.target.value)}
            label="Write your proposal"

          />
          <button
            type="submit"
          >
            Ajouter
          </button>
      </form>

      <div>

        <button
          disabled={!isOwner}
          type="button"
          onClick={() => etapes.proposalsRegistrationEnd()}
        >
         Finir la session d'enregistrement
        </button>

      </div>
    </div>
  );
};

export default ProposalsRegistrationStarted;
