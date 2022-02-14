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
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-transparent border-slate-400"
      } ${
        disabled
          ? "bg-slate-700 text-slate-400 cursor-not-allowed border-slate-700"
          : "bg-transparent text-slate-400"
      } ${
        answered
          ? "bg-blue-500 text-white"
          : "bg-transparent border-transparent"
      } h-20 w-14 m-4 rounded flex justify-center items-center border-2 cursor-pointer`}
      onClick={onSelection && !disabled ? () => onSelection(amount) : null}
    >
      <div className="card-content">{visible ? amount : null}</div>
    </div>
  );
};

export default Card;
