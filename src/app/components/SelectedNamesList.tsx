import React from 'react';

interface SelectedNamesListProps {
  selectedNames: string[];
}

const SelectedNamesList = ({ selectedNames }: SelectedNamesListProps) => {
  return (
    <div className="text-center">
      <div className="pt-[50px]">
        <h2>Selected Names:</h2>
        <ul>
          {selectedNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectedNamesList;