import classNames from "classnames";
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
  selectedAmount,
  disabled,
  answered,
  onSelection,
}) => {
  return (
    <div
      className={classNames(
        "h-20 w-14 m-4 rounded flex justify-center items-center border-2 cursor-pointer text-white",
        {
          "bg-blue-500 text-white border-blue-500":
            selectedAmount === amount && selectedAmount !== undefined,
          "bg-slate-700 text-slate-400 cursor-not-allowed border-slate-700":
            disabled,
          "bg-blue-500 text-white": answered,
        }
      )}
      onClick={onSelection && !disabled ? () => onSelection(amount) : null}
    >
      <div className="card-content">{visible ? amount : null}</div>
    </div>
  );
};

export default Card;
