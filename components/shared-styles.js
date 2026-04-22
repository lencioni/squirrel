import { css } from 'lit';

export const buttonBaseStyles = css`
  button {
    font: inherit;
    touch-action: manipulation;
    cursor: pointer;
    border: none;
  }
`;

export const cardStyles = css`
  .card {
    background: var(--cream);
    border-radius: 22px 22px 0 0;
    padding: 22px 16px 32px;
    min-height: calc(100svh - 120px);
  }
`;

export const sectionLabelStyles = css`
  .section-label {
    font-family: 'Fredoka One', cursive;
    font-size: 0.95rem;
    color: var(--red);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 0;
    margin-bottom: 10px;
  }
`;

