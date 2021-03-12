import React, { useState, useEffect } from "react";



const getProposals = async (totalProposals, etapes, setProposals) => {
  const results = [];

  for (let i = 0; i < totalProposals; i++) {
    const description = await etapes.getProposal(i);

    results.push(
      < div key={i}>
        {description}

          <button
            onClick={() => etapes.vote(i)}
          >
            Voter
          </button>
        
      </div>
    );
  }

  setProposals(results);
};

const ARegisterVoter= ({ totalProposals, etapes, isOwner }) => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    getProposals(totalProposals, etapes, setProposals);
  }, [totalProposals, etapes]);

  return (
    <div>
    <div>{proposals}</div>

    <div>
      <button
        disabled={!isOwner}
        type="button"
        onClick={() => etapes.votingSessionEnded()}
      >
         End vote session
      </button>
    </div>
  </div>
  );
};

export default ARegisterVoter;
