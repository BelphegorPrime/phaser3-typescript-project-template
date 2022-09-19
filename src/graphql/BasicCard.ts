const BasicCard = `
{
      id
      name
      number
      rarities
      cost
      regain
      attack
      cardType
      creatureSubtype
      creatureType
      description
      healthPoints
      effects {
        id
        text {
          html
        }
        creatureSpecialEffects
        spellSpecialEffect
        trapSpecialEffect
      }
      season {
        id
        number
      }
      picture {
        id
        url
      }
    }
`;

export default BasicCard;
