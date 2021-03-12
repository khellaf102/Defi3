import React from "react";



const VotingSessionEnded = ({ etapes, isOwner }) => {

  if (!isOwner) {
    return <div>attendez l'etape suivantes !</div>;
  }

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => etapes.compteVotes()}
        >
         Compter les  votes
        </button>
      </div>
    </div>
  );
};

export default VotingSessionEnded;
