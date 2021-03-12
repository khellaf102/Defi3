import React, { useState } from "react";

const ARegisterVoter = ({ etapes, isOwner }) => {

  const [address, setAddress] = useState(""); //reinitialisation de l'etat initial . les adresses

  if (!isOwner) {
    return (
      <div>
        Attendez la prochaine etape !
      </div>
    );
  }

  return (
    <div>
      <h3>Ajouter une adresse </h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await etapes.aRegisterVoter(address);
        }}
        noValidate
        autoComplete="off"
      >
        <form>
          <input
            onInput={(e) => setAddress(e.target.value)}
            label="Ajouter Adresse"
          />
          <button
            type="submit"
          >
            ajouter
          </button>
        </form>
      </form>
      <div>

        <button
          disabled={!isOwner}
          type="button"


          onClick={() => etapes.proposalsRegistrationStartedSession()}
        >
      enregistrement  des propositions
        </button>
      </div>
    </div>
  );
};

export default ARegisterVoter;
