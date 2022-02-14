import React from "react";
import { Fibonacci } from "../types";
import Card from "./Card";

interface CardOptionProps {
  onSelection: (amount: number) => void;
  selectedAmount: number;
  disabled?: boolean;
}

const CardOptions: React.FC<CardOptionProps> = ({
  onSelection,
  selectedAmount,
  disabled,
}) => {
  const options: Fibonacci[] = [0, 1, 2, 3, 5, 8, 13, 21];

  const handleSelection = (amount: number) => {
    onSelection(amount);
  };

  return (
    <div className="card-options flex my-6">
      {options.map((option) => (
        <Card
          amount={option}
          visible={true}
          onSelection={handleSelection}
          selectedAmount={selectedAmount}
          disabled={disabled}
          key={option}
        />
      ))}
    </div>
  );
};

export default CardOptions;
