import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import KingImg from '../public/images/king.png'

// Remove a random item from an array and return the removed item (used for drawing a random card from the pile)
const popRandom = (array) => {
  let i = (Math.random() * array.length) | 0
  return array.splice(i, 1)[0]
}

const comparePowerCards = (powerCard1, powerCard2) => powerCard1?.spaces === powerCard2?.spaces && powerCard1?.directionX === powerCard2?.directionX && powerCard1?.directionY === powerCard2?.directionY

const Home = () => {
  // board fields with state for player tokens
  const [fields, setFields] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)))
  // king possition
  const [king, setKing] = useState([4, 4])
  // cards in the draw pool
  const [cards, setCards] = useState([
    { spaces: 1, directionX: 0, directionY: -1 }, { spaces: 1, directionX: 1, directionY: -1 }, { spaces: 1, directionX: 1, directionY: 0, }, { spaces: 1, directionX: 1, directionY: 1, }, { spaces: 1, directionX: 0, directionY: 1, }, { spaces: 1, directionX: -1, directionY: 1, }, { spaces: 1, directionX: -1, directionY: 0, }, { spaces: 1, directionX: -1, directionY: -1, },
    { spaces: 2, directionX: 0, directionY: -1 }, { spaces: 2, directionX: 1, directionY: -1 }, { spaces: 2, directionX: 1, directionY: 0, }, { spaces: 2, directionX: 1, directionY: 1, }, { spaces: 2, directionX: 0, directionY: 1, }, { spaces: 2, directionX: -1, directionY: 1, }, { spaces: 2, directionX: -1, directionY: 0, }, { spaces: 2, directionX: -1, directionY: -1, },
    { spaces: 3, directionX: 0, directionY: -1 }, { spaces: 3, directionX: 1, directionY: -1 }, { spaces: 3, directionX: 1, directionY: 0, }, { spaces: 3, directionX: 1, directionY: 1, }, { spaces: 3, directionX: 0, directionY: 1, }, { spaces: 3, directionX: -1, directionY: 1, }, { spaces: 3, directionX: -1, directionY: 0, }, { spaces: 3, directionX: -1, directionY: -1, },
  ])
  // discarded cards
  const [discardPile, setDiscardPile] = useState([])
  const [player1Cards, setPlayer1Cards] = useState([])
  const [player2Cards, setPlayer2Cards] = useState([])
  const [player1HeroCards, setPlayer1HeroCards] = useState(4)
  const [player2HeroCards, setPlayer2HeroCards] = useState(4)
  // player on turn 1 is white 2 is red
  const [playerTurn, setPlayerTurn] = useState(0)
  const [selectedPowerCard, setSelectedPowerCard] = useState()
  const [turnsUnableToPlay, setTurnsUnableToPlay] = useState(0)

  // start of game each player draws 5 cards
  useEffect(() => {
    let p1Cards = []
    let p2Cards = []
    for (let index = 0; index < 5; index++) {
      p1Cards = [...p1Cards, popRandom(cards)]
      p2Cards = [...p2Cards, popRandom(cards)]
    }
    setCards([...cards])
    setPlayer1Cards(p1Cards)
    setPlayer2Cards(p2Cards)
    setPlayerTurn(1)
  }, [])

  useEffect(() => {
    if (cards.length === 0) {
      setCards([...discardPile])
      setDiscardPile([])
    }
  }, [cards])

  // detect if a player should skip his turn because he has nothing to play
  useEffect(() => {
    if (turnsUnableToPlay < 2 && playerTurn !== 0) {
      let playerHasSomethingToPlay = false
      if (playerTurn === 1) {
        player1Cards.forEach((card) => {
          const expectedPlaceToGo = [king[0] + card.directionX * card.spaces, king[1] + card.directionY * card.spaces]
          if (expectedPlaceToGo[0] >= 0 && expectedPlaceToGo[0] <= 8 &&
            expectedPlaceToGo[1] >= 0 && expectedPlaceToGo[1] <= 8 &&
            (fields[expectedPlaceToGo[1]][expectedPlaceToGo[0]] === 0 ||
              (fields[expectedPlaceToGo[1]][expectedPlaceToGo[0]] === 2 && player1HeroCards > 0))) {
            playerHasSomethingToPlay = true
          }
        })
      } else {
        player2Cards.forEach((card) => {
          const expectedPlaceToGo = [king[0] + card.directionX * card.spaces, king[1] + card.directionY * card.spaces]
          if (expectedPlaceToGo[0] >= 0 && expectedPlaceToGo[0] <= 8 &&
            expectedPlaceToGo[1] >= 0 && expectedPlaceToGo[1] <= 8 &&
            (fields[expectedPlaceToGo[1]][expectedPlaceToGo[0]] === 0 ||
              (fields[expectedPlaceToGo[1]][expectedPlaceToGo[0]] === 1 && player2HeroCards > 0))) {
            playerHasSomethingToPlay = true
          }
        })
      }
      if (!playerHasSomethingToPlay && ((playerTurn === 1 && player1Cards.length === 5) || (playerTurn === 2 && player2Cards.length === 5))) {
        swapPlayerTurn()
        setTurnsUnableToPlay(turnsUnableToPlay + 1)
      }
    }
  }, [playerTurn])

  // end of game
  useEffect(() => {
    if (turnsUnableToPlay === 2) {
      setPlayerTurn(0)
    }
  }, [turnsUnableToPlay])

  const swapPlayerTurn = () => setPlayerTurn(playerTurn === 1 ? 2 : 1)

  return (
    <Wrapper>
      <GameWrapper>
        {/* shows when each player has nothing to play */}
        {turnsUnableToPlay === 2 && <div>Game ended</div>}
        Player 1 (white)
        {/* player 1 (white) cards */}
        <PlayerCardsWrapper>
          <PlayerCards>{player1Cards?.map((card, index) => (
            <PowerCard onClick={() => setSelectedPowerCard(card)} isSelected={comparePowerCards(selectedPowerCard, card)} isOnTurn={playerTurn === 1} key={index}>
              <PowerCardSpaces>
                {card?.spaces}
              </PowerCardSpaces>
              <PowerCardDirection>
                {card?.directionX + " " + card?.directionY}
              </PowerCardDirection>
            </PowerCard>
          ))}</PlayerCards>
          <HeroCards>{player1HeroCards}</HeroCards>
        </PlayerCardsWrapper>
        {/* board */}
        <BoardWrapper>
          <PowerCard isOnTurn={(playerTurn === 1 && player1Cards.length < 5) || (playerTurn === 2 && player2Cards.length < 5)} onClick={() => {
            // draw a card logic
            if (playerTurn === 1 && player1Cards.length < 5) {
              setPlayer1Cards([...player1Cards, popRandom(cards)])
            } else if (playerTurn === 2 && player2Cards.length < 5) {
              setPlayer2Cards([...player2Cards, popRandom(cards)])
            }
            setCards([...cards])
            swapPlayerTurn()
            setSelectedPowerCard(undefined)
            setTurnsUnableToPlay(0)
          }}>{cards.length}</PowerCard>
          <BoardInnerWrapper>
            {fields.map((row, rowI) => (
              <BoardRow key={rowI}>
                {row?.map((col, colI) => (
                  <BoardField key={colI}>
                    {king[0] === colI && king[1] === rowI &&
                      <King src={KingImg.src}></King>
                    }
                    {selectedPowerCard &&
                      king[0] + selectedPowerCard.directionX * selectedPowerCard.spaces === colI &&
                      king[1] + selectedPowerCard.directionY * selectedPowerCard.spaces === rowI &&
                      ((player1HeroCards !== 0 && playerTurn === 1) || (player2HeroCards !== 0 && playerTurn === 2)) &&
                      col !== playerTurn &&
                      <Token playerOnTurn={playerTurn} onClick={() => {
                        // logic for playing the turn
                        fields[rowI][colI] = playerTurn
                        setFields([...fields])
                        if (playerTurn === 1) {
                          player1Cards.forEach((card, index) => {
                            if (comparePowerCards(selectedPowerCard, card)) {
                              player1Cards.splice(index, 1);
                              setPlayer1Cards([...player1Cards])
                            }
                          })
                        } else {
                          player2Cards.forEach((card, index) => {
                            if (comparePowerCards(selectedPowerCard, card)) {
                              player2Cards.splice(index, 1);
                              setPlayer2Cards([...player2Cards])
                            }
                          })
                        }
                        if (col !== 0 && col !== playerTurn) {
                          if (playerTurn === 1) {
                            setPlayer1HeroCards(player1HeroCards - 1)
                          } else {
                            setPlayer2HeroCards(player2HeroCards - 1)
                          }
                        }
                        setDiscardPile([...discardPile, selectedPowerCard])
                        setSelectedPowerCard(undefined)
                        swapPlayerTurn()
                        setKing([colI, rowI])
                        setTurnsUnableToPlay(0)
                      }} />
                    }
                    {col !== 0 &&
                      <PlayedToken player={col} />
                    }
                  </BoardField>
                ))}
              </BoardRow>
            ))}
          </BoardInnerWrapper>
        </BoardWrapper>
        {/* player 2 (red) cards */}
        <PlayerCardsWrapper>
          <PlayerCards>{player2Cards?.map((card, index) => (
            <PowerCard onClick={() => setSelectedPowerCard(card)} isSelected={comparePowerCards(selectedPowerCard, card)} isOnTurn={playerTurn === 2} key={index}>
              <PowerCardSpaces>
                {card?.spaces}
              </PowerCardSpaces>
              <PowerCardDirection>
                {card?.directionX + " " + card?.directionY}
              </PowerCardDirection>
            </PowerCard>
          ))}</PlayerCards>
          <HeroCards>{player2HeroCards}</HeroCards>
        </PlayerCardsWrapper>
        Player 2 (red)
      </GameWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 80%;
  margin: 10px auto;
`

const GameWrapper = styled.div`
  width: 700px;
  margin: 0 auto;
`

const PlayerCards = styled.div`
  display: flex;
  width: 460px;
`

const PowerCard = styled.div`
  border-radius: 10px;
  border: ${({ isSelected }) => isSelected ? '1px solid blue' : '1px solid black'};
  background-color: ${({ isSelected }) => isSelected ? 'yellow' : 'green'};
  padding: 10px;
  width: 82px;
  height: 140px;
  margin-right: 10px;
  pointer-events: ${({ isOnTurn }) => !isOnTurn && 'none'};
  cursor: ${({ isOnTurn }) => isOnTurn && 'pointer'};

`

const PowerCardSpaces = styled.div``

const PowerCardDirection = styled.div``

const BoardWrapper = styled.div`
  display: flex;
`

const BoardInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const BoardRow = styled.div`
  display: flex;
`

const BoardField = styled.div`
  width: 50px;
  height: 50px;
  background-color: yellowgreen;
  border: 1px solid black;
`

const King = styled.img`
  width: 48px;
  height: 48px;
  position: absolute;
`

const Token = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-top: 14px;
  margin-left: 14px;
  background-color: blue;
  cursor: pointer;
  &:hover {
    background-color: ${({ playerOnTurn }) => playerOnTurn === 1 ? 'white' : 'red'};
  }
  position: absolute;
  z-index: 2;
`

const PlayerCardsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0 20px 92px;
`

const HeroCards = styled.div`
  border-radius: 10px;
  border: 1px solid black;
  background-color: purple;
  padding: 10px;
  width: 82px;
  height: 140px;
`

const PlayedToken = styled.div`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-top: 9px;
  margin-left: 9px;
  background-color: ${({ player }) => player === 1 ? 'white' : 'red'};
  position: absolute;
  z-index: 1;
`

export default Home