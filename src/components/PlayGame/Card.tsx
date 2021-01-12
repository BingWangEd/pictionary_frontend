import React, { FunctionComponent, memo, useCallback, useEffect, useRef } from 'react';
import { ActionType, ICardAction } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';
import styled, { keyframes } from 'styled-components';

interface IProps {
  word: string;
  position: number;
  isOpen: boolean;
  isActive: boolean;
  sendAction: (action: ICardAction) => void;
  setwaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
}

const Card: FunctionComponent<IProps> = memo<IProps>(
  ({ word, position, isActive, isOpen, sendAction, setwaitingForResponse }: IProps) => {
    const { playerName, roomCode } = useRoomState();
    const isPrevActive = useRef<boolean>();
    const isPrevOpen = useRef<boolean>();
    const renderAnimation =
      isActive === false && isPrevActive.current === true
        ? '🙆🏻‍♀️'
        : isOpen === false && isPrevOpen.current === true
        ? '🙅🏻‍♀️'
        : null;

    useEffect(() => {
      isPrevActive.current = isActive;
      isPrevOpen.current = isOpen;
    });

    const style = {
      card: {
        width: '150px',
        height: '150px',
        borderRadius: '15px',
        margin: '15px',
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative' as const,
      },
      flipContainer: {
        perspective: '1000px',
      },
      cardContent: {
        transform: 'rotateY(0deg)',
        transition: '0.6s',
        zIndex: 2,
        transformStyle: 'preserve-3d' as const,
        position: 'relative' as const,
        border: '2px solid #ccc',
      },
      cardCover: {
        transform: 'rotateY(180deg)',
        transition: '0.6s',
        transformStyle: 'preserve-3d' as const,
        position: 'relative' as const,
        border: '2px solid #ccc',
      },
      hideBack: {
        backfaceVisibility: 'hidden' as const,
        position: 'absolute' as const,
        top: '0',
        left: '0',
      },
      text: {
        alignSelf: 'center',
        textAlign: 'center' as const,
      },
      result: {
        position: 'absolute' as const,
        fontSize: '2em',
        bottom: '-10px',
        left: '67px',
        zIndex: 2,
        width: '50px',
        opacity: 0,
      },
    };

    useEffect(() => {
      console.log(`card ${word} mounted`);
      return () => console.log(`card ${word} unmounted`);
    });

    const handleClick = useCallback(() => {
      if (isOpen) return;
      setwaitingForResponse(true);
      sendAction({
        type: ActionType.Open,
        position,
        player: playerName || '',
        roomCode: roomCode || '',
      });
    }, [isOpen, playerName, position, roomCode, sendAction, setwaitingForResponse]);

    const AnimatedComponent = styled.div`
      animation: 2s
        ${keyframes({
          '0%': { opacity: '0' },
          '25%': { opacity: '1' },
          '75%': { opacity: '1' },
          '100%': { opacity: '0' },
        })}
        ease-in;
    `;

    const animation = (
      <AnimatedComponent style={style.result}>
        <span>{renderAnimation}</span>
      </AnimatedComponent>
    );

    return (
      <div style={{ ...style.flipContainer, ...style.card }}>
        {animation}
        <div
          style={{
            ...style.card,
            ...style.cardContent,
            ...style.hideBack,
            transform: isOpen ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        >
          <h2 style={style.text}>{word}</h2>
        </div>
        <div
          style={{
            ...style.card,
            ...style.cardCover,
            ...style.hideBack,
            transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
          }}
          onClick={handleClick}
        >
          <h2 style={style.text}>♤</h2>
        </div>
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
