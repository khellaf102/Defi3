import React, { useEffect } from "react";

const CompteVotes = ({ winner, etapes }) => {
  useEffect(() => {
    etapes.getWinningProposal();
  }, [winner,etapes]);

  return (
    <div>
      <p>le proposition gagnante est </p>
      <h2>{winner}</h2>
      
    </div>
  );
};

export default CompteVotes;
