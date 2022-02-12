import React from "react";

interface CardProps {
  visible: boolean;
  amount: number;
  onSelection?: (amount: number) => void;
  selectedAmount: number;
  disabled?: boolean;
  answered?: boolean;
}

const Card: React.FC<CardProps> = ({
  visible = false,
  amount,
  onSelection,
  selectedAmount,
  disabled,
  answered,
}) => {
  return (
    <div
      className={`card ${visible ? "visible" : ""} ${
        selectedAmount === amount && selectedAmount !== undefined
          ? "selected"
          : ""
      } ${disabled ? "disabled" : ""} ${answered ? "answered" : ""}`}
      onClick={onSelection && !disabled ? () => onSelection(amount) : null}
    >
      <div className="card-content">{visible ? amount : null}</div>
    </div>
  );
};

export default Card;
