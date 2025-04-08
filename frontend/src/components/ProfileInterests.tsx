import { X } from "lucide-react";
import React, { useState } from "react";

export interface ResearchInterestProps {
  fieldOfInterest: string;
  isEditing: boolean;
  onSubmit: (newInterests: string) => void;
}
export const ProfileInterests = (props: ResearchInterestProps) => {
  const [tempInterests, setTempInterests] = useState(
    props.fieldOfInterest || "",
  );
  const [interestsInput, setInterestsInput] = useState("");

  // Handle interests input change
  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsInput(e.target.value);
  };

  // Handle interests submission
  const handleInterestsSubmit = () => {
    if (interestsInput.trim()) {
      const cleanInterestInput = (input: string) => [
        ...new Set(
          input
            .split(",")
            .map((i) => i.trim().replace(",", ""))
            .filter((i) => i !== ""),
        ),
      ];
      let newInterests = "";
      // Parse comma-separated values, trim whitespace, and filter out empty strings
      if (tempInterests.length > 0) {
        newInterests = cleanInterestInput(
          tempInterests + "," + interestsInput,
        ).join(",");
      } else {
        newInterests = cleanInterestInput(interestsInput).join(",");
      }

      setTempInterests(newInterests);
      props.onSubmit(newInterests);
      setInterestsInput("");
    }
  };

  // Remove an interest tag
  const removeInterest = (index: number) => {
    const updatedInterests = [...tempInterests.split(",")];
    updatedInterests.splice(index, 1);
    setTempInterests(updatedInterests.join(","));
  };

  // Update tempInterests when researcher data changes or edit mode is entered
  React.useEffect(() => {
    setTempInterests(props.fieldOfInterest || "");
  }, [props.fieldOfInterest, props.isEditing]);

  return (
    <>
      <div className="mt-4 mb-2">
        {props.isEditing ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Research Interests
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tempInterests.split(",").map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(index)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={interestsInput}
                onChange={handleInterestsChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleInterestsSubmit();
                  }
                }}
                placeholder="Add interests (comma-separated)"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleInterestsSubmit}
                className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Enter keywords separated by commas to add multiple interests at
              once.
            </p>
          </div>
        ) : (
          <div className="mt-3 mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Research Interests
            </h4>
            <div className="flex flex-wrap gap-1">
              {props.fieldOfInterest && props.fieldOfInterest.length > 0 ? (
                props.fieldOfInterest.split(",").map((interest, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 italic">
                  No research interests specified.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
